import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, LayoutGrid, Clock } from 'lucide-react';
import PendingUsers from './PendingUsers';
import ManageUsers from './ManageUsers';
import ManageApps from './ManageApps';

const AdminLayout = ({ token }) => {
    const [subTab, setSubTab] = useState('pending');

    const tabs = [
        { id: 'pending', name: 'Chờ phê duyệt', icon: Clock, color: '#22c55e' },
        { id: 'users', name: 'Người dùng', icon: Users, color: '#3b82f6' },
        { id: 'apps', name: 'Kho ứng dụng', icon: LayoutGrid, color: '#a855f7' },
    ];

    return (
        <motion.div key="admin" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Quản trị hệ thống</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Toàn quyền điều khiển và quản lý dữ liệu.</p>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {tabs.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSubTab(t.id)}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px',
                            background: subTab === t.id ? t.color : 'rgba(255,255,255,0.05)',
                            border: '1px solid var(--glass-border)', borderRadius: '10px', color: 'white',
                            cursor: 'pointer', fontWeight: 600, transition: 'all 0.3s ease'
                        }}
                    >
                        <t.icon size={18} />
                        {t.name}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={subTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {subTab === 'pending' && <PendingUsers token={token} />}
                    {subTab === 'users' && <ManageUsers token={token} />}
                    {subTab === 'apps' && <ManageApps token={token} />}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

export default AdminLayout;
