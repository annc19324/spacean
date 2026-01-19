import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit3, Settings, ShieldCheck, User as UserIcon } from 'lucide-react';

const Dashboard = () => {
    const { user, token } = useAuth();
    const [apps, setApps] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${token}` } };

                // Fetch User's apps
                const appsRes = await axios.get('http://localhost:5000/api/apps/my-apps', config);
                setApps(appsRes.data);

                // If Admin, fetch pending users
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
        if (user) fetchData();
    }, [user, token]);

    const handleApprove = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/approve/${userId}`, {}, config);
            setPendingUsers(pendingUsers.filter(u => u.id !== userId));
            alert("Đã phê duyệt người dùng!");
        } catch (err) {
            alert("Lỗi phê duyệt");
        }
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
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                                    <button style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <Edit3 size={16} /> Sửa
                                    </button>
                                    <button style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px' }}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
};

export default Dashboard;
