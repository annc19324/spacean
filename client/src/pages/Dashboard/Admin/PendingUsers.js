import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../../../config/api';

const PendingUsers = ({ token }) => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPending = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(getApiUrl('/api/admin/pending-users'), config);
            setPendingUsers(res.data);
        } catch (err) {
            toast.error("Lỗi tải danh sách chờ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleApprove = async (userId) => {
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(getApiUrl(`/api/admin/approve/${userId}`), {}, config);
            toast.success("Đã phê duyệt!");
            fetchPending();
        } catch (err) {
            toast.error("Lỗi phê duyệt");
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Danh sách chờ phê duyệt ({pendingUsers.length})
            </h2>
            <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '15px 20px' }}>Username</th>
                            <th style={{ padding: '15px 20px' }}>Ngày đăng ký</th>
                            <th style={{ padding: '15px 20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</td></tr>
                        ) : pendingUsers.length === 0 ? (
                            <tr><td colSpan="3" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không có người dùng nào đang chờ.</td></tr>
                        ) : (
                            pendingUsers.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '15px 20px' }}>{u.username}</td>
                                    <td style={{ padding: '15px 20px' }}>{new Date(u.joinDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <button onClick={() => handleApprove(u.id)} className="btn-primary" style={{ padding: '6px 15px', fontSize: '0.85rem' }}>Phê duyệt</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingUsers;
