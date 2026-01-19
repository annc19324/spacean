import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Eye, Heart, Download, ExternalLink, Calendar } from 'lucide-react';

const Home = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/apps/public');
                setApps(res.data);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu app");
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    return (
        <div style={{ padding: '40px 5%' }}>
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '15px' }}
                >
                    Khám Phá <span style={{ background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Không Gian Của An</span>
                </motion.h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Nơi lưu trữ và chia sẻ những ứng dụng tuyệt vời nhất.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Đang tải không gian...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {apps.map((app, index) => (
                        <motion.div
                            key={app.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card"
                            style={{ padding: '20px', overflow: 'hidden' }}
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
                                backgroundSize: 'cover'
                            }}>
                                {!app.imageUrl && <span style={{ color: '#475569' }}>Chưa có ảnh mô tả</span>}
                            </div>

                            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{app.name}</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '15px', height: '40px', overflow: 'hidden' }}>
                                {app.description || "Không có mô tả cho ứng dụng này."}
                            </p>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                                <div style={{ display: 'flex', gap: '15px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {app.views}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={14} /> {app.likes}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Download size={14} /> {app.downloads}</span>
                                </div>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                {app.link && (
                                    <a href={app.link} target="_blank" rel="noreferrer" className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <ExternalLink size={16} /> Truy cập
                                    </a>
                                )}
                                {app.downloadUrl && (
                                    <a href={app.downloadUrl} className="btn-primary" style={{ flex: 1, textAlign: 'center', padding: '10px', fontSize: '0.9rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                        <Download size={16} /> Tải về
                                    </a>
                                )}
                            </div>

                            <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                                <span>Bởi: <strong>{app.user.username}</strong></span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Calendar size={12} /> {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
