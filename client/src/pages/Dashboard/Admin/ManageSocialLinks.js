import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit3, Trash2, Upload, Facebook, Instagram, Twitter, Youtube, Linkedin, Github, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const PREDEFINED_ICONS = [
    { type: 'facebook', name: 'Facebook', Icon: Facebook, color: '#1877F2' },
    { type: 'instagram', name: 'Instagram', Icon: Instagram, color: '#E4405F' },
    { type: 'twitter', name: 'Twitter/X', Icon: Twitter, color: '#1DA1F2' },
    { type: 'youtube', name: 'YouTube', Icon: Youtube, color: '#FF0000' },
    { type: 'linkedin', name: 'LinkedIn', Icon: Linkedin, color: '#0A66C2' },
    { type: 'github', name: 'GitHub', Icon: Github, color: '#181717' },
    { type: 'website', name: 'Website', Icon: Globe, color: '#10b981' },
];

const ManageSocialLinks = ({ token }) => {
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        iconType: 'facebook',
        iconUrl: '',
        url: '',
        order: 0
    });

    const fetchLinks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/social-links');
            setLinks(res.data);
        } catch (err) {
            toast.error('Lỗi khi tải danh sách liên kết');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleOpenModal = (link = null) => {
        if (link) {
            setIsEditing(true);
            setCurrentId(link.id);
            setFormData({
                name: link.name,
                iconType: link.iconType,
                iconUrl: link.iconUrl || '',
                url: link.url,
                order: link.order
            });
        } else {
            setIsEditing(false);
            setCurrentId(null);
            setFormData({ name: '', iconType: 'facebook', iconUrl: '', url: '', order: 0 });
        }
        setShowModal(true);
    };

    const handleIconUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const formDataFile = new FormData();
        formDataFile.append('file', file);
        try {
            const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post('http://localhost:5000/api/upload', formDataFile, config);
            setFormData({ ...formData, iconUrl: res.data.url, iconType: 'custom' });
            toast.success('Đã tải icon lên!');
        } catch (err) {
            toast.error('Lỗi khi tải icon lên');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            if (isEditing) {
                await axios.put(`http://localhost:5000/api/social-links/${currentId}`, formData, config);
                toast.success('Đã cập nhật liên kết!');
            } else {
                await axios.post('http://localhost:5000/api/social-links', formData, config);
                toast.success('Đã thêm liên kết!');
            }
            setShowModal(false);
            fetchLinks();
        } catch (err) {
            toast.error('Lỗi khi lưu liên kết');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa liên kết này?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`http://localhost:5000/api/social-links/${id}`, config);
            toast.success('Đã xóa liên kết!');
            fetchLinks();
        } catch (err) {
            toast.error('Lỗi khi xóa liên kết');
        }
    };

    const getIconComponent = (iconType) => {
        const predefined = PREDEFINED_ICONS.find(i => i.type === iconType);
        return predefined || null;
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Đang tải...</div>;

    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Quản lý Footer & Liên hệ</h2>
                <button onClick={() => handleOpenModal()} className="btn-primary">
                    <Plus size={18} /> Thêm liên kết
                </button>
            </div>

            <div className="glass-card" style={{ padding: '30px' }}>
                {links.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>
                        Chưa có liên kết nào. Hãy thêm liên kết mới!
                    </div>
                ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <th style={{ textAlign: 'left', padding: '15px 10px', color: '#94a3b8' }}>Icon</th>
                                <th style={{ textAlign: 'left', padding: '15px 10px', color: '#94a3b8' }}>Tên</th>
                                <th style={{ textAlign: 'left', padding: '15px 10px', color: '#94a3b8' }}>Link</th>
                                <th style={{ textAlign: 'center', padding: '15px 10px', color: '#94a3b8' }}>Thứ tự</th>
                                <th style={{ textAlign: 'right', padding: '15px 10px', color: '#94a3b8' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map(link => {
                                const iconInfo = getIconComponent(link.iconType);
                                const IconComponent = iconInfo?.Icon;
                                return (
                                    <tr key={link.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                        <td style={{ padding: '15px 10px' }}>
                                            {link.iconType === 'custom' ? (
                                                <img src={link.iconUrl} alt={link.name} style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                            ) : IconComponent ? (
                                                <IconComponent size={24} color={iconInfo.color} />
                                            ) : (
                                                <Globe size={24} color="#64748b" />
                                            )}
                                        </td>
                                        <td style={{ padding: '15px 10px' }}>{link.name}</td>
                                        <td style={{ padding: '15px 10px' }}>
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontSize: '0.9rem' }}>
                                                {link.url.length > 40 ? link.url.substring(0, 40) + '...' : link.url}
                                            </a>
                                        </td>
                                        <td style={{ textAlign: 'center', padding: '15px 10px' }}>{link.order}</td>
                                        <td style={{ padding: '15px 10px', textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                                <button onClick={() => handleOpenModal(link)} className="btn-icon">
                                                    <Edit3 size={16} color="#3b82f6" />
                                                </button>
                                                <button onClick={() => handleDelete(link.id)} className="btn-icon" style={{ border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                                                    <Trash2 size={16} color="#ef4444" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card modal-content" style={{ maxWidth: '500px', width: '90%' }}>
                        <h2 style={{ marginBottom: '25px' }}>{isEditing ? 'Cập nhật liên kết' : 'Thêm liên kết mới'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '15px' }}>
                                <label>Tên hiển thị</label>
                                <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Ví dụ: Facebook của chúng tôi" />
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>Chọn icon</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '15px' }}>
                                    {PREDEFINED_ICONS.map(icon => (
                                        <button
                                            key={icon.type}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, iconType: icon.type, iconUrl: '' })}
                                            style={{
                                                padding: '15px',
                                                background: formData.iconType === icon.type ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                                border: formData.iconType === icon.type ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
                                                borderRadius: '12px',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}
                                        >
                                            <icon.Icon size={24} color={icon.color} />
                                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{icon.name}</span>
                                        </button>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => document.getElementById('customIconInput').click()}
                                        style={{
                                            padding: '15px',
                                            background: formData.iconType === 'custom' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                            border: formData.iconType === 'custom' ? '2px solid #3b82f6' : '1px solid var(--glass-border)',
                                            borderRadius: '12px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        {formData.iconType === 'custom' && formData.iconUrl ? (
                                            <img src={formData.iconUrl} alt="Custom" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                        ) : (
                                            <Upload size={24} color="#10b981" />
                                        )}
                                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Khác</span>
                                    </button>
                                    <input type="file" id="customIconInput" hidden accept="image/*" onChange={handleIconUpload} />
                                </div>
                            </div>

                            <div style={{ marginBottom: '15px' }}>
                                <label>URL liên kết</label>
                                <input required type="url" value={formData.url} onChange={e => setFormData({ ...formData, url: e.target.value })} placeholder="https://facebook.com/yourpage" />
                            </div>

                            <div style={{ marginBottom: '25px' }}>
                                <label>Thứ tự hiển thị</label>
                                <input type="number" value={formData.order} onChange={e => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Hủy</button>
                                <button type="submit" className="btn-primary" style={{ flex: 1 }}>{isEditing ? 'Lưu' : 'Thêm'}</button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ManageSocialLinks;
