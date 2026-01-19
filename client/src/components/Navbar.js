import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, LogOut, LayoutDashboard, LayoutGrid } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav style={{
            padding: '20px 5%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            background: 'rgba(5, 7, 10, 0.8)',
            backdropFilter: 'blur(10px)',
            flexWrap: 'wrap',
            gap: '15px'
        }}>
            <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'white' }}>
                <img src="/spacean.png" alt="SpaceAn" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>
                    Space<span style={{ color: '#6d28d9' }}>An</span>
                </span>
            </a>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {user ? (
                    <>
                        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white' }}>
                            <LayoutGrid size={18} /> Trang chủ
                        </a>
                        <a href={`/user/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white' }}>
                            <LayoutGrid size={18} /> Hồ sơ cá nhân
                        </a>
                        <a href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white' }}>
                            <LayoutDashboard size={18} /> Quản lý
                        </a>
                        <button
                            onClick={logout}
                            style={{
                                background: 'transparent',
                                border: '1px solid var(--glass-border)',
                                color: 'white',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}
                        >
                            <LogOut size={18} /> Thoát
                        </button>
                    </>
                ) : (
                    <>
                        <a href="/login" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px', textDecoration: 'none' }}>
                            <LogIn size={18} /> Đăng nhập
                        </a>
                        <a href="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                            <UserPlus size={18} /> Đăng ký
                        </a>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
