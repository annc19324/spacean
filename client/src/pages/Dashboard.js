import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Trash2, Edit3, Settings, ShieldCheck,
    User as UserIcon, LayoutGrid, Users, Link as LinkIcon,
    Lock, CheckCircle, XCircle, Ban
} from 'lucide-react';

const Dashboard = () => {
    const { user, token, login } = useAuth();
    const [apps, setApps] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [allApps, setAllApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('apps');

    // Modal & Form state for Apps
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAppId, setCurrentAppId] = useState(null);
    const [formData, setFormData] = useState({
        name: '', description: '', type: 'WEB', link: '', downloadUrl: '', imageUrl: ''
    });

    // Profile Settings state
    const [profileData, setProfileData] = useState({ username: user?.username || '', bio: user?.bio || '', avatar: user?.avatar || '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    // Admin Edit state
    const [showEditUserModal, setShowEditUserModal] = useState(false);
    const [editingUser, setEditingUser] = useState({ id: '', username: '', bio: '', role: '', status: '' });

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const appsRes = await axios.get('http://localhost:5000/api/apps/my-apps', config);
            setApps(appsRes.data);

            if (user.role === 'ADMIN') {
                const pendingRes = await axios.get('http://localhost:5000/api/admin/pending-users', config);
                setPendingUsers(pendingRes.data);

                const allUsersRes = await axios.get('http://localhost:5000/api/admin/users', config);
                setAllUsers(allUsersRes.data);

                const allAppsRes = await axios.get('http://localhost:5000/api/admin/apps', config);
                setAllApps(allAppsRes.data);
            }
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

    const handleAppDelete = async (id) => {
        confirmAction("Bạn có chắc chắn muốn xóa không gian này?", async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/apps/${id}`, config);
                toast.success("Đã xóa ứng dụng!");
                fetchData();
            } catch (err) {
                toast.error("Lỗi khi xóa");
            }
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

    // --- ADMIN ACTIONS ---
    const handleApprove = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/approve/${userId}`, {}, config);
            toast.success("Đã phê duyệt người dùng!");
            fetchData();
        } catch (err) {
            toast.error("Lỗi phê duyệt");
        }
    };

    const handleBanToggle = async (userToToggle) => {
        const newStatus = userToToggle.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${userToToggle.id}`, { status: newStatus }, config);
            toast.success(`Đã ${newStatus === 'BANNED' ? 'cấm' : 'mở cấm'} người dùng!`);
            fetchData();
        } catch (err) {
            toast.error("Lỗi thay đổi trạng thái");
        }
    };

    const handleAdminDeleteUser = async (userId) => {
        confirmAction("XÓA HOÀN TOÀN người dùng này và tất cả dữ liệu?", async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/admin/users/${userId}`, config);
                toast.success("Đã xóa người dùng!");
                fetchData();
            } catch (err) {
                toast.error("Lỗi khi xóa");
            }
        });
    };

    const handleAdminDeleteApp = async (appId) => {
        confirmAction("Xóa ứng dụng này khỏi hệ thống?", async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`http://localhost:5000/api/admin/apps/${appId}`, config);
                toast.success("Đã xóa ứng dụng!");
                fetchData();
            } catch (err) {
                toast.error("Lỗi khi xóa");
            }
        });
    };

    const handleAdminUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/users/${editingUser.id}`, editingUser, config);
            toast.success("Đã cập nhật người dùng!");
            setShowEditUserModal(false);
            fetchData();
        } catch (err) {
            toast.error("Lỗi cập nhật người dùng");
        }
    };

    const confirmAction = (message, onConfirm) => {
        toast((t) => (
            <span>
                {message}
                <button onClick={() => { toast.dismiss(t.id); onConfirm(); }} style={{ marginLeft: '10px', background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Xác nhận</button>
                <button onClick={() => toast.dismiss(t.id)} style={{ marginLeft: '5px', background: 'transparent', color: 'white', border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>Hủy</button>
            </span>
        ), { duration: 5000 });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang kết nối không gian...</div>;

    const navItems = [
        { id: 'apps', name: 'Ứng dụng', icon: LayoutGrid },
        { id: 'settings', name: 'Cài đặt', icon: Settings },
    ];
    if (user.role === 'ADMIN') navItems.push({ id: 'admin', name: 'Quản trị', icon: ShieldCheck });

    return (
        <div style={{ padding: '0 5%', display: 'flex', gap: '30px', flexWrap: 'wrap', marginTop: '40px' }}>
            {/* Sidebar Navigation */}
            <aside style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                            background: activeTab === item.id ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                            border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white',
                            cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '1rem',
                            boxShadow: activeTab === item.id ? '0 10px 20px rgba(109, 40, 217, 0.2)' : 'none'
                        }}
                    >
                        <item.icon size={20} />
                        {item.name}
                    </button>
                ))}
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, minWidth: '300px' }}>
                <AnimatePresence mode="wait">
                    {activeTab === 'apps' && (
                        <motion.div key="apps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                                <h1 style={{ fontSize: '2rem' }}>Ứng dụng của bạn</h1>
                                <button onClick={() => handleOpenModal()} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Plus size={18} /> Đăng ứng dụng mới
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                                {apps.length === 0 ? (
                                    <div className="glass-card" style={{ padding: '40px', textAlign: 'center', gridColumn: '1 / -1', color: '#64748b' }}>
                                        Bạn chưa đăng ứng dụng nào. Hãy bắt đầu ngay!
                                    </div>
                                ) : (
                                    apps.map(app => (
                                        <motion.div key={app.id} className="glass-card" style={{ padding: '20px' }}>
                                            <h3 style={{ marginBottom: '10px' }}>{app.name}</h3>
                                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                                <span>Views: {app.views}</span>
                                                <span>Likes: {app.likes}</span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleOpenModal(app)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                                    <Edit3 size={16} /> Sửa
                                                </button>
                                                <button onClick={() => handleAppDelete(app.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'settings' && (
                        <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Cài đặt tài khoản</h1>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                                {/* Profile Update */}
                                <section className="glass-card" style={{ padding: '30px' }}>
                                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <UserIcon size={20} color="#3b82f6" /> Thông tin cá nhân
                                    </h2>
                                    <form onSubmit={handleProfileUpdate}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tên đăng nhập</label>
                                            <input style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={profileData.username} onChange={e => setProfileData({ ...profileData, username: e.target.value })} />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tiểu sử (Bio)</label>
                                            <textarea style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', height: '80px' }} value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Lưu thông tin</button>
                                    </form>
                                </section>

                                {/* Password Change */}
                                <section className="glass-card" style={{ padding: '30px' }}>
                                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <Lock size={20} color="#6d28d9" /> Đổi mật khẩu
                                    </h2>
                                    <form onSubmit={handleChangePassword}>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mật khẩu cũ</label>
                                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mật khẩu mới</label>
                                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                                        </div>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Xác nhận mật khẩu mới</label>
                                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                                        </div>
                                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Cập nhật mật khẩu</button>
                                    </form>
                                </section>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'admin' && (
                        <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Quản trị hệ thống</h1>
                            <p style={{ color: '#94a3b8', marginBottom: '40px' }}>Quyền hạn tối cao - Quản lý người dùng và nội dung.</p>

                            {/* Pending Approvals */}
                            <section style={{ marginBottom: '50px' }}>
                                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <ShieldCheck /> Chờ phê duyệt ({pendingUsers.length})
                                </h2>
                                <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <th style={{ padding: '15px 20px' }}>Username</th>
                                                <th style={{ padding: '15px 20px' }}>Ngày</th>
                                                <th style={{ padding: '15px 20px' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pendingUsers.map(u => (
                                                <tr key={u.id}>
                                                    <td style={{ padding: '15px 20px' }}>{u.username}</td>
                                                    <td style={{ padding: '15px 20px' }}>{new Date(u.joinDate).toLocaleDateString()}</td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <button onClick={() => handleApprove(u.id)} style={{ background: '#22c55e', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer' }}>Phê duyệt</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* All Users Management */}
                            <section style={{ marginBottom: '50px' }}>
                                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#3b82f6', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Users /> Quản lý phi hành gia
                                </h2>
                                <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <th style={{ padding: '15px 20px' }}>Người dùng</th>
                                                <th style={{ padding: '15px 20px' }}>Vai trò</th>
                                                <th style={{ padding: '15px 20px' }}>Trạng thái</th>
                                                <th style={{ padding: '15px 20px' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allUsers.map(u => (
                                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <div style={{ fontWeight: 600 }}>{u.username}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.id}</div>
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>{u.role}</td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <span style={{
                                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                                                            background: u.status === 'BANNED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                                                            color: u.status === 'BANNED' ? '#ef4444' : '#22c55e'
                                                        }}>
                                                            {u.status}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button onClick={() => { setEditingUser(u); setShowEditUserModal(true); }} title="Chỉnh sửa" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                                <Edit3 size={16} color="#3b82f6" />
                                                            </button>
                                                            <button onClick={() => handleBanToggle(u)} title={u.status === 'BANNED' ? 'Mở cấm' : 'Cấm'} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                                <Ban size={16} color={u.status === 'BANNED' ? '#22c55e' : '#ef4444'} />
                                                            </button>
                                                            <button onClick={() => handleAdminDeleteUser(u.id)} title="Xóa vĩnh viễn" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>

                            {/* All Apps Management */}
                            <section>
                                <h2 style={{ fontSize: '1.3rem', marginBottom: '20px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <LayoutGrid /> Kho ứng dụng toàn hệ thống
                                </h2>
                                <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                                <th style={{ padding: '15px 20px' }}>Ứng dụng</th>
                                                <th style={{ padding: '15px 20px' }}>Chủ sở hữu</th>
                                                <th style={{ padding: '15px 20px' }}>Chỉ số</th>
                                                <th style={{ padding: '15px 20px' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {allApps.map(app => (
                                                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                                    <td style={{ padding: '15px 20px' }}>{app.name}</td>
                                                    <td style={{ padding: '15px 20px' }}>{app.user?.username}</td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>V: {app.views} | L: {app.likes}</div>
                                                    </td>
                                                    <td style={{ padding: '15px 20px' }}>
                                                        <button onClick={() => handleAdminDeleteApp(app.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '6px', borderRadius: '6px', cursor: 'pointer' }}>
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Application Modal (Sharing logic for adding apps) */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '25px' }}>{isEditing ? 'Cập nhật ứng dụng' : 'Đăng ứng dụng mới'}</h2>
                        <form onSubmit={handleAppSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tên ứng dụng *</label>
                                <input required style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mô tả ngắn</label>
                                <textarea style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', height: '80px' }} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Loại hình</label>
                                <select style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                    <option value="WEB" style={{ background: '#05070a' }}>Trang Web (Link)</option>
                                    <option value="APP" style={{ background: '#05070a' }}>Ứng dụng (Tải về)</option>
                                </select>
                            </div>
                            {formData.type === 'WEB' ? (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Đường dẫn Web (URL)</label>
                                    <input style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                </div>
                            ) : (
                                <div style={{ marginBottom: '15px' }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>File ứng dụng</label>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <input style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.downloadUrl} onChange={e => setFormData({ ...formData, downloadUrl: e.target.value })} placeholder="Dán link hoặc chọn file..." />
                                        <input type="file" id="appField" hidden onChange={e => handleFileUpload(e, 'downloadUrl')} />
                                        <label htmlFor="appField" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>Chọn File</label>
                                    </div>
                                </div>
                            )}
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Ảnh minh họa</label>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="Dán link ảnh hoặc chọn file..." />
                                    <input type="file" id="imageField" hidden accept="image/*" onChange={e => handleFileUpload(e, 'imageUrl')} />
                                    <label htmlFor="imageField" style={{ background: 'rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center' }}>Chọn Ảnh</label>
                                </div>
                                {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" style={{ marginTop: '10px', width: '100%', maxHeight: '100px', objectFit: 'cover', borderRadius: '8px' }} />}
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '10px', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Lưu thay đổi' : 'Đăng ngay'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
            {/* Admin Edit User Modal */}
            {showEditUserModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px' }}>
                        <h2 style={{ marginBottom: '25px' }}>Chỉnh sửa phi hành gia</h2>
                        <form onSubmit={handleAdminUpdateUser}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tên đăng nhập</label>
                                <input style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tiểu sử</label>
                                <textarea style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', height: '100px' }} value={editingUser.bio || ''} onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })} />
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Vai trò</label>
                                <select style={{ width: '100%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                                    <option value="USER" style={{ background: '#05070a' }}>USER</option>
                                    <option value="ADMIN" style={{ background: '#05070a' }}>ADMIN</option>
                                </select>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '30px' }}>
                                <button type="button" onClick={() => setShowEditUserModal(false)} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '10px', cursor: 'pointer' }}>Hủy</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Cập nhật</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
