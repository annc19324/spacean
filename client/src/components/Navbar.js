import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, LogOut, LayoutDashboard, LayoutGrid, Orbit } from 'lucide-react';

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
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Orbit size={32} color="#3b82f6" />
                <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>
                    Space<span style={{ color: '#6d28d9' }}>An</span>
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                {user ? (
                    <>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutGrid size={18} /> Trang chủ
                        </Link>
                        <Link to={`/user/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutGrid size={18} /> Hồ sơ cá nhân
                        </Link>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutDashboard size={18} /> Quản lý
                        </Link>
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
                        <Link to="/login" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 16px' }}>
                            <LogIn size={18} /> Đăng nhập
                        </Link>
                        <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <UserPlus size={18} /> Đăng ký
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
