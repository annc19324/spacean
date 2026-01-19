import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Settings, ShieldCheck, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
    const { user, token } = useAuth();
    const [apps, setApps] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal & Form state
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentAppId, setCurrentAppId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: 'WEB',
        link: '',
        downloadUrl: '',
        imageUrl: ''
    });

    const fetchData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const appsRes = await axios.get('http://localhost:5000/api/apps/my-apps', config);
            setApps(appsRes.data);

            if (user.role === 'ADMIN') {
                const usersRes = await axios.get('http://localhost:5000/api/admin/pending-users', config);
                setPendingUsers(usersRes.data);
            }
        } catch (err) {
            console.error("Lỗi tải dữ liệu Dashboard");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) fetchData();
    }, [user, token]);

    const handleApprove = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/approve/${userId}`, {}, config);
            setPendingUsers(pendingUsers.filter(u => u.id !== userId));
            toast.success("Đã phê duyệt người dùng!");
        } catch (err) {
            toast.error("Lỗi phê duyệt");
        }
    };

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
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            };
            const res = await axios.post('http://localhost:5000/api/upload', formDataFile, config);
            setFormData({ ...formData, [field]: res.data.url });
            toast.success("Tải file lên thành công!");
        } catch (err) {
            toast.error("Lỗi khi tải file lên");
        }
    };

    const handleSubmit = async (e) => {
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

    const handleDelete = async (id) => {
        toast((t) => (
            <span>
                Bạn có chắc chắn muốn xóa không gian này?
                <button
                    onClick={async () => {
                        toast.dismiss(t.id);
                        try {
                            const config = { headers: { Authorization: `Bearer ${token}` } };
                            await axios.delete(`http://localhost:5000/api/apps/${id}`, config);
                            toast.success("Đã xóa ứng dụng!");
                            fetchData();
                        } catch (err) {
                            toast.error("Lỗi khi xóa");
                        }
                    }}
                    style={{ marginLeft: '10px', background: '#ef4444', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Xóa
                </button>
                <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{ marginLeft: '5px', background: 'transparent', color: 'white', border: '1px solid #ccc', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Hủy
                </button>
            </span>
        ), { duration: 5000 });
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang kết nối không gian...</div>;

    return (
        <div style={{ padding: '40px 5%' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Bảng điều khiển</h1>
                <p style={{ color: '#94a3b8' }}>Chào mừng {user.role === 'ADMIN' ? 'Hệ thống' : 'Phi hành gia'} <strong>{user.username}</strong></p>
            </header>

            {user.role === 'ADMIN' && (
                <section style={{ marginBottom: '60px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <ShieldCheck color="#22c55e" />
                        <h2 style={{ fontSize: '1.5rem' }}>Người dùng chờ phê duyệt ({pendingUsers.length})</h2>
                    </div>
                    <div className="glass-card" style={{ padding: '0' }}>
                        {pendingUsers.length === 0 ? (
                            <p style={{ padding: '30px', color: '#64748b', textAlign: 'center' }}>Không có người dùng nào đang chờ.</p>
                        ) : (
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '20px' }}>Username</th>
                                        <th style={{ padding: '20px' }}>Ngày tham gia</th>
                                        <th style={{ padding: '20px' }}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingUsers.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '20px' }}>{u.username}</td>
                                            <td style={{ padding: '20px' }}>{new Date(u.joinDate).toLocaleDateString('vi-VN')}</td>
                                            <td style={{ padding: '20px' }}>
                                                <button
                                                    onClick={() => handleApprove(u.id)}
                                                    style={{ background: '#22c55e', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
                                                >
                                                    Phê duyệt
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </section>
            )}

            <section>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Settings />
                        <h2 style={{ fontSize: '1.5rem' }}>Ứng dụng của bạn</h2>
                    </div>
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
                                    <button onClick={() => handleOpenModal(app)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', cursor: 'pointer' }}>
                                        <Edit3 size={16} /> Sửa
                                    </button>
                                    <button onClick={() => handleDelete(app.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>

            {/* Application Modal */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
                        <h2 style={{ marginBottom: '25px' }}>{isEditing ? 'Cập nhật ứng dụng' : 'Đăng ứng dụng mới'}</h2>
                        <form onSubmit={handleSubmit}>
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
        </div>
    );
};

export default Dashboard;
