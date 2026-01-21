import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Eye, Heart, ThumbsUp, ThumbsDown, Download, ExternalLink, Calendar, User, ArrowLeft } from 'lucide-react';
import { getApiUrl } from '../config/api';

const AppDetails = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [appData, setAppData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userInteraction, setUserInteraction] = useState(null);

    useEffect(() => {
        const fetchApp = async () => {
            try {
                const res = await axios.get(getApiUrl(`/api/apps/stats/${id}`));
                setAppData(res.data);

                // Increment view with 15-minute cooldown
                const viewedKey = `viewed_app_${id}`;
                const lastViewedTime = localStorage.getItem(viewedKey);
                const currentTime = Date.now();
                const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds

                // Only increment if never viewed or 15 minutes have passed
                if (!lastViewedTime || (currentTime - parseInt(lastViewedTime)) > fifteenMinutes) {
                    await axios.post(getApiUrl(`/api/apps/view/${id}`));
                    localStorage.setItem(viewedKey, currentTime.toString());
                }

                // Load user interaction if logged in
                if (token) {
                    try {
                        const config = { headers: { Authorization: `Bearer ${token}` } };
                        const interactionsRes = await axios.get(getApiUrl('/api/apps/my-interactions'), config);
                        setUserInteraction(interactionsRes.data[id] || null);
                    } catch (err) {
                        console.error("Error loading interaction:", err);
                    }
                }
            } catch (err) {
                setError('Không tìm thấy ứng dụng hoặc có lỗi xảy ra.');
            } finally {
                setLoading(false);
            }
        };
        fetchApp();
    }, [id, token]);

    const handleInteraction = async (type) => {
        if (['like', 'dislike', 'unlike', 'undislike'].includes(type) && !token) {
            toast.error("Bạn cần đăng nhập để thực hiện hành động này.");
            return;
        }
        try {
            const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
            await axios.post(getApiUrl(`/api/apps/${type}/${id}`), {}, config);

            // Re-fetch app data
            const res = await axios.get(getApiUrl(`/api/apps/stats/${id}`));
            setAppData(res.data);

            // Update local interaction state
            if (type === 'like') {
                setUserInteraction('LIKE');
                toast.success("Đã thích ứng dụng!");
            } else if (type === 'dislike') {
                setUserInteraction('DISLIKE');
                toast.success("Đã ghét ứng dụng!");
            } else if (type === 'unlike') {
                setUserInteraction(null);
                toast.success("Đã bỏ thích!");
            } else if (type === 'undislike') {
                setUserInteraction(null);
                toast.success("Đã bỏ ghét!");
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Lỗi tương tác");
        }
    };

    const handleDownload = async () => {
        if (!appData.downloadUrl) return;
        await axios.post(getApiUrl(`/api/apps/download/${id}`));
        window.open(appData.downloadUrl, '_blank');
        toast.success("Đang tải xuống...");

        // Refresh data to show updated download count
        const res = await axios.get(getApiUrl(`/api/apps/stats/${id}`));
        setAppData(res.data);
    };

    if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Đang tải chi tiết...</div>;
    if (error) return <div style={{ textAlign: 'center', marginTop: '100px', color: '#ef4444' }}>{error}</div>;

    return (
        <div style={{ padding: '40px 5%', maxWidth: '1200px', margin: '0 auto' }}>
            <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--glass-border)', color: 'white', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', marginBottom: '30px' }}>
                <ArrowLeft size={18} /> Quay lại
            </button>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ padding: '40px' }}
            >
                <div className="responsive-grid" style={{ marginBottom: '40px' }}>
                    {/* App Image */}
                    <div>
                        <div style={{
                            width: '100%',
                            aspectRatio: '1',
                            background: '#1e293b',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundImage: appData.imageUrl ? `url(${appData.imageUrl})` : 'none',
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            overflow: 'hidden'
                        }}>
                            {!appData.imageUrl && <span style={{ color: '#475569', fontSize: '1.2rem' }}>Chưa có ảnh</span>}
                        </div>
                    </div>

                    {/* App Info */}
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '15px' }}>{appData.name}</h1>
                        <Link to={`/user/${appData.user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#3b82f6', marginBottom: '20px' }}>
                            <User size={16} />
                            Bởi {appData.user.username}
                        </Link>

                        <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '30px' }}>
                            {appData.description || "Không có mô tả cho ứng dụng này."}
                        </p>

                        {/* Stats */}
                        <div className="stats-grid" style={{ marginBottom: '30px' }}>
                            <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                                <Eye size={20} color="#64748b" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appData.views}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Lượt xem</div>
                            </div>
                            <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                                <ThumbsUp size={20} color="#22c55e" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appData.likes}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Thích</div>
                            </div>
                            <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                                <ThumbsDown size={20} color="#ef4444" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appData.dislikes}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ghét</div>
                            </div>
                            <div className="glass-card" style={{ padding: '15px', textAlign: 'center' }}>
                                <Download size={20} color="#3b82f6" style={{ margin: '0 auto 8px' }} />
                                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{appData.downloads}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Tải về</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            <button
                                onClick={() => handleInteraction(userInteraction === 'LIKE' ? 'unlike' : 'like')}
                                style={{
                                    flex: 1,
                                    background: userInteraction === 'LIKE' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)',
                                    color: '#22c55e',
                                    border: userInteraction === 'LIKE' ? '2px solid #22c55e' : '1px solid rgba(34, 197, 94, 0.2)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: userInteraction === 'LIKE' ? '700' : '400',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <ThumbsUp size={18} /> {userInteraction === 'LIKE' ? 'Đã thích' : 'Thích'}
                            </button>
                            <button
                                onClick={() => handleInteraction(userInteraction === 'DISLIKE' ? 'undislike' : 'dislike')}
                                style={{
                                    flex: 1,
                                    background: userInteraction === 'DISLIKE' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                                    color: '#ef4444',
                                    border: userInteraction === 'DISLIKE' ? '2px solid #ef4444' : '1px solid rgba(239, 68, 68, 0.2)',
                                    padding: '12px',
                                    borderRadius: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontWeight: userInteraction === 'DISLIKE' ? '700' : '400',
                                    fontSize: '0.9rem'
                                }}
                            >
                                <ThumbsDown size={18} /> {userInteraction === 'DISLIKE' ? 'Đã ghét' : 'Ghét'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            {appData.link && (
                                <a
                                    href={appData.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary"
                                    style={{ flex: '1 1 200px', textAlign: 'center', padding: '15px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <ExternalLink size={20} /> Truy cập Web
                                </a>
                            )}
                            {appData.downloadUrl && (
                                <button
                                    onClick={handleDownload}
                                    className="btn-primary"
                                    style={{ flex: '1 1 200px', padding: '15px', fontSize: '1rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                >
                                    <Download size={20} /> Tải App
                                </button>
                            )}
                        </div>

                        <div style={{ marginTop: '20px', fontSize: '0.9rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Calendar size={16} />
                            Đăng ngày: {new Date(appData.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AppDetails;
