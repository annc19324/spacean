import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { useConfirm } from '../hooks/useConfirm';

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
            const appsRes = await axios.get('http://localhost:5000/api/apps/my-apps', config);
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
            const res = await axios.post('http://localhost:5000/api/upload', formDataFile, config);
            setFormData({ ...formData, [field]: res.data.url });
            toast.success("Tải file lên thành công!");
        } catch (err) {
            toast.error("Lỗi khi tải file lên");
        }
    };

    const handleAppSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/apps/${currentAppId}`, formData, config);
            } else {
                await axios.post('http://localhost:5000/api/apps', formData, config);
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
                await axios.delete(`http://localhost:5000/api/apps/${id}`, config);
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
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.put('http://localhost:5000/api/users/profile', profileData, config);
            login(res.data.user, token); // Update context
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
            await axios.put('http://localhost:5000/api/users/change-password', passwordData, config);
            toast.success("Đã đổi mật khẩu!");
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
                                <label>Loại hình</label>
                                <select style={{ width: '100%' }} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="WEB" style={{ background: '#05070a' }}>Trang Web (Link)</option>
                                    <option value="APP" style={{ background: '#05070a' }}>Ứng dụng (Tải về)</option>
                                </select>
                            </div>
                            {formData.type === 'WEB' ? (
                                <div style={{ marginBottom: '15px' }}>
                                    <label>Đường dẫn Web (URL)</label>
                                    <input style={{ width: '100%' }} value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                </div>
                            ) : (
                                <div style={{ marginBottom: '15px' }}>
                                    <label>File ứng dụng</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input style={{ flex: 1 }} value={formData.downloadUrl} onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })} placeholder="Dán link hoặc chọn file..." />
                                        <input type="file" id="appField" hidden onChange={e => handleFileUpload(e, 'downloadUrl')} />
                                        <label htmlFor="appField" className="btn-secondary" style={{ padding: '8px 15px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Chọn File</label>
                                    </div>
                                </div>
                            )}
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
