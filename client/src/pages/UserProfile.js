import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, Heart, Download, ExternalLink, Calendar, User, ThumbsUp, ThumbsDown } from 'lucide-react';

const UserProfile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = useAuth();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${username}`);
                setUserData(res.data);

                // Increment view only once per session per user profile
                const viewedKey = `viewed_${username}`;
                if (res.data.id && !sessionStorage.getItem(viewedKey)) {
                    await axios.post(`http://localhost:5000/api/users/view/${res.data.id}`);
                    sessionStorage.setItem(viewedKey, 'true');
                }
            } catch (err) {
                setError('Không tìm thấy người dùng hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [username]);

    const handleInteraction = async (appId, type) => {
        if (['like', 'dislike'].includes(type) && !token) {
            toast.error("Bạn cần đăng nhập để thực hiện hành động này.");
            return;
        }
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            await axios.post(`http://localhost:5000/api/apps/${type}/${appId}`, {}, config);

            // Re-fetch profile to get updated stats
            const res = await axios.get(`http://localhost:5000/api/users/${username}`);
            setUserData(res.data);
            if (type === 'like') toast.success("Đã thích ứng dụng!");
            if (type === 'dislike') toast.success("Đã không thích ứng dụng.");
        } catch (err) {
            if (type !== 'view') {
                toast.error(err.response?.data?.message || "Lỗi tương tác");
            }
        }
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải hồ sơ của {username}...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ padding: '40px 5%' }}>
            {/* User Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: '40px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '30px', flexWrap: 'wrap' }}
            >
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {userData.avatar ? <img src={userData.avatar} alt={userData.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <User size={60} color="white" />}
                </div>
                <div style={{ flex: '1 1 300px' }}>
                    <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', marginBottom: '10px' }}>{userData.username}</h1>
                    <p style={{ color: '#94a3b8', marginBottom: '15px' }}>{userData.bio || "Thành viên của SpaceAn."}</p>
                    <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> Tham gia: {new Date(userData.joinDate).toLocaleDateString('vi-VN')}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Eye size={16} /> {userData.views} lượt xem</span>
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                    <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{userData.likes}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LƯỢT THÍCH</div>
                    </div>
                    <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{userData.downloads}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>LƯỢT TẢI</div>
                    </div>
                </div>
            </motion.div>

            {/* Apps Header */}
            <h2 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Danh sách App & Web ({userData.apps.length})
            </h2>

            {/* Apps Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '30px'
            }}>
                {userData.apps.map((app, index) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-card"
                        style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}
                    >
                        <div style={{
                            height: '180px',
                            background: '#1e293b',
                            borderRadius: '12px',
                            marginBottom: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundImage: app.imageUrl ? `url(${app.imageUrl})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}>
                            {!app.imageUrl && <span style={{ color: '#475569' }}>Chưa có ảnh mô tả</span>}
                        </div>

                        <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{app.name}</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px', flex: 1 }}>
                            {app.description || "Không có mô tả cho ứng dụng này."}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {app.views}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsUp size={14} /> {app.likes}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ThumbsDown size={14} /> {app.dislikes}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14} /> {app.downloads}</span>
                            </div>
                            <span>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => handleInteraction(app.id, 'like')}
                                style={{ flex: 1, background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.2)', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                                <ThumbsUp size={16} /> Thích
                            </button>
                            <button
                                onClick={() => handleInteraction(app.id, 'dislike')}
                                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                            >
                                <ThumbsDown size={16} /> Ghét
                            </button>
                        </div>

                        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                            {app.link && (
                                <a
                                    href={app.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary"
                                    style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                    onClick={() => handleInteraction(app.id, 'view')} // Counting as view when clicked
                                >
                                    <ExternalLink size={16} /> Truy cập Web
                                </a>
                            )}
                            {app.downloadUrl && (
                                <a
                                    href={app.downloadUrl}
                                    className="btn-primary"
                                    style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}
                                    onClick={() => handleInteraction(app.id, 'download')}
                                >
                                    <Download size={16} /> Tải App
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {userData.apps.length === 0 && (
                <div style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
                    Người dùng này chưa đăng tải ứng dụng nào.
                </div>
            )}
        </div>
    );
};

export default UserProfile;
