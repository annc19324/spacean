import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, Download, ExternalLink, Calendar } from 'lucide-react';

const Home = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users');
                setUsers(res.data);
            } catch (err) {
                console.error("Lỗi lấy dữ liệu người dùng");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
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
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Duyệt qua các không gian cá nhân và khám phá những ứng dụng độc đáo.</p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center' }}>Đang tải không gian...</div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '30px'
                }}>
                    {users.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            className="glass-card"
                            style={{ padding: '30px', textAlign: 'center', cursor: 'pointer' }}
                        >
                            <Link to={`/user/${user.username}`}>
                                <div style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    background: 'var(--accent-gradient)',
                                    margin: '0 auto 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {user.avatar ? <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem', fontWeight: 800, color: 'white' }}>{user.username[0].toUpperCase()}</span>}
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{user.username}</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', color: '#64748b', fontSize: '0.85rem', marginBottom: '20px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Eye size={14} /> {user.views}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Heart size={14} /> {user.likes}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                                    {user._count.apps} Ứng dụng / Website
                                </div>
                                <div className="btn-primary" style={{ marginTop: '20px', width: '100%', display: 'inline-block' }}>
                                    Ghé thăm Space
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;
