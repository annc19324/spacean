import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit3, Ban, Trash2, Search, ChevronLeft, ChevronRight, Eye, ThumbsUp, Download, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { getApiUrl } from '../../../config/api';

const ManageUsers = ({ token }) => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(getApiUrl(`/api/admin/users?search=${search}&page=${page}`), config);
            setUsers(res.data.users);
            setTotalPages(res.data.pages);
        } catch (err) {
            toast.error("Lỗi tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, search]);

    const handleUpdate = async (e) => {
        e.preventDefault();

        const usernameRegex = /^[a-zA-Z0-9.]{6,}$/;
        if (editingUser.username && !usernameRegex.test(editingUser.username)) {
            toast.error('Username phải ít nhất 6 ký tự, chỉ gồm chữ cái, số và dấu chấm. KHÔNG khoảng trắng.');
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(getApiUrl(`/api/admin/users/${editingUser.id}`), editingUser, config);
            toast.success("Cập nhật thành công!");
            setShowEditModal(false);
            fetchUsers();
        } catch (err) {
            toast.error("Lỗi cập nhật");
        }
    };

    const handleBanToggle = async (u) => {
        const newStatus = u.status === 'BANNED' ? 'ACTIVE' : 'BANNED';
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(getApiUrl(`/api/admin/users/${u.id}`), { status: newStatus }, config);
            toast.success(`Đã ${newStatus === 'BANNED' ? 'cấm' : 'mở cấm'}!`);
            fetchUsers();
        } catch (err) {
            toast.error("Lỗi thao tác");
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("XÓA HOÀN TOÀN người dùng này?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(getApiUrl(`/api/admin/users/${userId}`), config);
            toast.success("Đã xóa!");
            fetchUsers();
        } catch (err) {
            toast.error("Lỗi khi xóa");
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo username hoặc ID..."
                        style={{ width: '100%', padding: '12px 12px 12px 40px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white' }}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                    />
                </div>
            </div>

            <div className="glass-card" style={{ padding: '0', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                            <th style={{ padding: '15px 20px' }}>Người dùng</th>
                            <th style={{ padding: '15px 20px' }}>Tương tác</th>
                            <th style={{ padding: '15px 20px' }}>Trạng thái</th>
                            <th style={{ padding: '15px 20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</td></tr>
                        ) : users.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không tìm thấy người dùng nào.</td></tr>
                        ) : (
                            users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontWeight: 600 }}>{u.username}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{u.role} | {u.id}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '10px' }}>
                                            <span title="Views"><Eye size={12} /> {u.views}</span>
                                            <span title="Likes"><ThumbsUp size={12} /> {u.likes}</span>
                                            <span title="Downloads"><Download size={12} /> {u.downloads}</span>
                                        </div>
                                    </td>
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
                                            <button onClick={() => { setEditingUser({ ...u, password: '' }); setShowEditModal(true); }} className="btn-icon" title="Sửa"><Edit3 size={16} color="#3b82f6" /></button>
                                            <button onClick={() => handleBanToggle(u)} className="btn-icon" title={u.status === 'BANNED' ? 'Mở cấm' : 'Cấm'}><Ban size={16} color={u.status === 'BANNED' ? '#22c55e' : '#ef4444'} /></button>
                                            <button onClick={() => handleDelete(u.id)} className="btn-icon" title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '30px' }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-icon"><ChevronLeft /></button>
                <span>Trang {page} / {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="btn-icon"><ChevronRight /></button>
            </div>

            {/* Edit User Modal */}
            {showEditModal && editingUser && (
                <div className="modal-overlay">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card modal-content" style={{ maxWidth: '600px', width: '90%' }}>
                        <h2>Chỉnh sửa người dùng</h2>
                        <form onSubmit={handleUpdate} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Tên đăng nhập</label>
                                <input value={editingUser.username} onChange={e => setEditingUser({ ...editingUser, username: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Tiểu sử</label>
                                <textarea value={editingUser.bio || ''} onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })} />
                            </div>
                            <div>
                                <label>Vai trò</label>
                                <select value={editingUser.role} onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}>
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>
                            <div>
                                <label>Trạng thái</label>
                                <select value={editingUser.status} onChange={e => setEditingUser({ ...editingUser, status: e.target.value })}>
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="BANNED">BANNED</option>
                                </select>
                            </div>
                            <div>
                                <label>Views</label>
                                <input type="number" value={editingUser.views} onChange={e => setEditingUser({ ...editingUser, views: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label>Likes</label>
                                <input type="number" value={editingUser.likes} onChange={e => setEditingUser({ ...editingUser, likes: parseInt(e.target.value) })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Lock size={14} /> Đổi mật khẩu mới (Bỏ trống nếu không đổi)</label>
                                <input type="password" placeholder="Nhập mật khẩu mới cho người dùng..." value={editingUser.password} onChange={e => setEditingUser({ ...editingUser, password: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setShowEditModal(false)} className="btn-secondary" style={{ flex: 1 }}>Hủy</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Cập nhật</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
