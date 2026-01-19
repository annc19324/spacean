import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Edit3, Trash2, Search, ChevronLeft, ChevronRight, Eye, ThumbsUp, ThumbsDown, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageApps = ({ token }) => {
    const [apps, setApps] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    // Edit Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingApp, setEditingApp] = useState(null);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.get(`http://localhost:5000/api/admin/apps?search=${search}&page=${page}`, config);
            setApps(res.data.apps);
            setTotalPages(res.data.pages);
        } catch (err) {
            toast.error("Lỗi tải danh sách ứng dụng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, [page, search]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.put(`http://localhost:5000/api/admin/apps/${editingApp.id}`, editingApp, config);
            toast.success("Cập nhật thành công!");
            setShowEditModal(false);
            fetchApps();
        } catch (err) {
            toast.error("Lỗi cập nhật");
        }
    };

    const handleDelete = async (appId) => {
        if (!window.confirm("Xóa ứng dụng này khỏi hệ thống?")) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/admin/apps/${appId}`, config);
            toast.success("Đã xóa!");
            fetchApps();
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
                        placeholder="Tìm kiếm ứng dụng hoặc mô tả..."
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
                            <th style={{ padding: '15px 20px' }}>Ứng dụng</th>
                            <th style={{ padding: '15px 20px' }}>Chủ sở hữu</th>
                            <th style={{ padding: '15px 20px' }}>Chỉ số</th>
                            <th style={{ padding: '15px 20px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center' }}>Đang tải...</td></tr>
                        ) : apps.length === 0 ? (
                            <tr><td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Không tìm thấy ứng dụng nào.</td></tr>
                        ) : (
                            apps.map(app => (
                                <tr key={app.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontWeight: 600 }}>{app.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{app.type}</div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>{app.user?.username}</td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', gap: '10px' }}>
                                            <span title="Views"><Eye size={12} /> {app.views}</span>
                                            <span title="Likes"><ThumbsUp size={12} /> {app.likes}</span>
                                            <span title="Downloads"><Download size={12} /> {app.downloads}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: '15px 20px' }}>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button onClick={() => { setEditingApp(app); setShowEditModal(true); }} className="btn-icon" title="Sửa"><Edit3 size={16} color="#3b82f6" /></button>
                                            <button onClick={() => handleDelete(app.id)} className="btn-icon" title="Xóa"><Trash2 size={16} color="#ef4444" /></button>
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

            {/* Edit App Modal */}
            {showEditModal && editingApp && (
                <div className="modal-overlay">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card modal-content" style={{ maxWidth: '600px', width: '90%' }}>
                        <h2>Chỉnh sửa ứng dụng</h2>
                        <form onSubmit={handleUpdate} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Tên ứng dụng</label>
                                <input value={editingApp.name} onChange={e => setEditingApp({ ...editingApp, name: e.target.value })} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Mô tả</label>
                                <textarea value={editingApp.description || ''} onChange={e => setEditingApp({ ...editingApp, description: e.target.value })} />
                            </div>
                            <div>
                                <label>Views</label>
                                <input type="number" value={editingApp.views} onChange={e => setEditingApp({ ...editingApp, views: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label>Likes</label>
                                <input type="number" value={editingApp.likes} onChange={e => setEditingApp({ ...editingApp, likes: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label>Dislikes</label>
                                <input type="number" value={editingApp.dislikes} onChange={e => setEditingApp({ ...editingApp, dislikes: parseInt(e.target.value) })} />
                            </div>
                            <div>
                                <label>Downloads</label>
                                <input type="number" value={editingApp.downloads} onChange={e => setEditingApp({ ...editingApp, downloads: parseInt(e.target.value) })} />
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

export default ManageApps;
