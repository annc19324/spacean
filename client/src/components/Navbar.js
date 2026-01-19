import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Rocket, LogIn, UserPlus, LogOut, LayoutDashboard } from 'lucide-react';

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
            backdropFilter: 'blur(10px)'
        }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Rocket size={32} color="#3b82f6" />
                <span style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-1px' }}>
                    Space<span style={{ color: '#6d28d9' }}>An</span>
                </span>
            </Link>

            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <Link to={`/user/${user.username}`} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <Rocket size={18} /> My Space
                        </Link>
                        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LayoutDashboard size={18} /> Dashboard
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
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <LogIn size={18} /> Đăng nhập
                        </Link>
                        <Link to="/register" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <UserPlus size={18} /> Tham gia
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
