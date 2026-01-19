import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Trash2 } from 'lucide-react';

const MyApps = ({ apps, handleOpenModal, handleAppDelete }) => {
    return (
        <motion.div key="apps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem' }}>Ứng dụng của bạn</h1>
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
                                <button onClick={() => handleOpenModal(app)} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                                    <Edit3 size={16} /> Sửa
                                </button>
                                <button onClick={() => handleAppDelete(app.id)} style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '6px', cursor: 'pointer' }}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </motion.div>
    );
};

export default MyApps;
