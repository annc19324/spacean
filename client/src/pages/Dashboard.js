import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { useConfirm } from '../hooks/useConfirm';
import { getApiUrl } from '../config/api';

// Refactored Sub-components
import Sidebar from './Dashboard/Sidebar';
import MyApps from './Dashboard/MyApps';
import Settings from './Dashboard/Settings';
import AdminLayout from './Dashboard/Admin/AdminLayout';

const Dashboard = () => {
    const { user, token, login } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('apps');
    const { showConfirm, confirmAction, confirmConfig, confirm, close } = useConfirm();

    // Modal & Form state for Adding/Editing Apps (User personal apps)
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAppId, setCurrentAppId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', type: 'WEB', link: '', downloadUrl: '', imageUrl: ''
    });

    // Profile Settings state
    const [profileData, setProfileData] = useState({ username: user?.username || '', bio: user?.bio || '', avatar: user?.avatar || '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const appsRes = await axios.get(getApiUrl('/api/apps/my-apps'), config);
            setApps(appsRes.data);
        } catch (err) {
            console.error("Lỗi tải dữ liệu Dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchData();
            setProfileData({ username: user.username, bio: user.bio || '', avatar: user.avatar || '' });
        }
    }, [user, token]);

    // --- USER APP ACTIONS ---
    const handleOpenModal = (app = null) => {
        if (app) {
            setIsEditing(true);
            setCurrentAppId(app.id);
            setFormData({
                name: app.name,
                description: app.description || '',
                type: app.type,
                link: app.link || '',
                downloadUrl: app.downloadUrl || '',
                imageUrl: app.imageUrl || ''
            });
        } else {
            setIsEditing(false);
            setCurrentAppId(null);
            setFormData({ name: '', description: '', type: 'WEB', link: '', downloadUrl: '', imageUrl: '' });
        }
        setShowModal(true);
    };

    const handleFileUpload = async (e, field) => {
        const file = e.target.files[0];
        if (!file) return;
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post(getApiUrl('/api/upload'), formDataFile, config);
            setFormData({ ...formData, [field]: res.data.url });
            toast.success("Tải file lên thành công!");
        } catch (err) {
            console.error("Upload error:", err);
            toast.error(err.response?.data?.message || err.message || "Lỗi khi tải file lên");
        }
    };

    const handleAppSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(getApiUrl(`/api/apps/${currentAppId}`), formData, config);
            } else {
                await axios.post(getApiUrl('/api/apps'), formData, config);
            }
            setShowModal(false);
            toast.success(isEditing ? "Đã cập nhật ứng dụng!" : "Đã đăng ứng dụng mới!");
            fetchData();
        } catch (err) {
            toast.error("Lỗi khi lưu ứng dụng");
        }
    };

    const handleAppDelete = (id) => {
        confirm(async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(getApiUrl(`/api/apps/${id}`), config);
                toast.success("Đã xóa ứng dụng!");
                fetchData();
            } catch (err) {
                toast.error("Lỗi khi xóa");
            }
        }, {
            title: "Xác nhận xóa",
            message: "Bạn có chắc chắn muốn xóa ứng dụng này? Hành động này không thể hoàn tác.",
            confirmText: "Xóa",
            cancelText: "Hủy"
        });
    };

    // --- PROFILE ACTIONS ---
    const handleProfileUpdate = async (e) => {
        e.preventDefault();

        const usernameRegex = /^[a-zA-Z0-9.]{6,}$/;
        if (profileData.username && !usernameRegex.test(profileData.username)) {
            toast.error('Username phải ít nhất 6 ký tự, chỉ gồm chữ cái, số và dấu chấm. KHÔNG khoảng trắng.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put(getApiUrl('/api/users/profile'), profileData, config);
            // res.data structure: { message, user }
            // AuthContext expects (userData, token) where userData is the user object directly
            login(res.data.user, token);
            toast.success("Đã cập nhật hồ sơ!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi cập nhật");
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate password format
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(passwordData.newPassword)) {
            return toast.error('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt (@$!%*?&).');
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Mật khẩu mới không khớp!");
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(getApiUrl('/api/users/change-password'), passwordData, config);
            toast.success("Đổi mật khẩu thành công!");
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi đổi mật khẩu");
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang kết nối không gian cá nhân...</div>;

    return (
        <div style={{ padding: '0 5%', display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '40px', minHeight: '80vh' }}>
            {/* Sidebar Navigation */}
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={user.role === 'ADMIN'} />

            {/* Main Content Area */}
            <main style={{ flex: 1, minWidth: '300px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'apps' && (
                        <MyApps
                            apps={apps}
                            handleOpenModal={handleOpenModal}
                            handleAppDelete={handleAppDelete}
                        />
                    )}

                    {activeTab === 'settings' && (
                        <Settings
                            profileData={profileData}
                            setProfileData={setProfileData}
                            handleProfileUpdate={handleProfileUpdate}
                            passwordData={passwordData}
                            setPasswordData={setPasswordData}
                            handleChangePassword={handleChangePassword}
                            token={token}
                        />
                    )}

                    {activeTab === 'admin' && user.role === 'ADMIN' && (
                        <AdminLayout token={token} />
                    )}
                </AnimatePresence>
            </main>

            {/* Global App Modal (Only for user's personal apps) */}
            {showModal && (
                <div className="modal-overlay">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '25px' }}>{isEditing ? 'Cập nhật ứng dụng' : 'Đăng ứng dụng mới'}</h2>
                        <form onSubmit={handleAppSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Tên ứng dụng *</label>
                                <input required style={{ width: '100%' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Mô tả ngắn</label>
                                <textarea style={{ width: '100%' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Đường dẫn Web (Link truy cập)</label>
                                <input style={{ width: '100%' }} value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} placeholder="https://..." />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Link tải ứng dụng (Google Drive/Dropbox)</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input style={{ flex: 1 }} value={formData.downloadUrl} onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })} placeholder="Dán link Google Drive công khai vào đây..." />
                                </div>
                                <small style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '5px', display: 'block' }}>
                                    *Lưu ý: Hệ thống hiện tại chỉ hỗ trợ nhập link tải từ bên ngoài (Google Drive, Fshare, MediaFire...). Vui lòng không upload file trực tiếp.
                                </small>
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label>Ảnh minh họa</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input style={{ flex: 1 }} value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="Dán link ảnh hoặc chọn file..." />
                                    <input type="file" id="imageField" hidden accept="image/*" onChange={e => handleFileUpload(e, 'imageUrl')} />
                                    <label htmlFor="imageField" className="btn-secondary" style={{ padding: '8px 15px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Chọn Ảnh</label>
                                </div>
                                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ marginTop: '10px', width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '12px' }} />}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Hủy</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Lưu thay đổi' : 'Đăng ngay'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Confirm Modal */}
            <ConfirmModal
                isOpen={showConfirm}
                onClose={close}
                onConfirm={confirmAction}
                {...confirmConfig}
            />
        </div>
    );
};

export default Dashboard;
