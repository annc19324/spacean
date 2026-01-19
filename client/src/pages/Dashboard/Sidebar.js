import React from 'react';
import { LayoutGrid, Settings, ShieldCheck } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isAdmin }) => {
    const navItems = [
        { id: 'apps', name: 'Ứng dụng', icon: LayoutGrid },
        { id: 'settings', name: 'Cài đặt', icon: Settings },
    ];
    if (isAdmin) navItems.push({ id: 'admin', name: 'Quản trị', icon: ShieldCheck });

    return (
        <aside style={{ flex: '0 0 250px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {navItems.map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '15px 20px',
                        background: activeTab === item.id ? 'var(--accent-gradient)' : 'var(--glass-bg)',
                        border: '1px solid var(--glass-border)', borderRadius: '12px', color: 'white',
                        cursor: 'pointer', textAlign: 'left', fontWeight: 600, fontSize: '1rem',
                        boxShadow: activeTab === item.id ? '0 10px 20px rgba(109, 40, 217, 0.2)' : 'none',
                        transition: 'all 0.3s ease'
                    }}
                >
                    <item.icon size={20} />
                    {item.name}
                </button>
            ))}
        </aside>
    );
};

export default Sidebar;
