import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Lock, User, CheckCircle, Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Frontend validation
        const usernameRegex = /^[a-zA-Z0-9.]{6,}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!usernameRegex.test(username)) {
            toast.error('Username phải ít nhất 6 kì tự, bao gồm chữ thường, chữ hoa, số và dấu chấm.');
            return;
        }

        if (!passwordRegex.test(password)) {
            toast.error('Password phải ít nhất 8 kí tự, bao gồm ít nhất 1 chữ thường, 1 chữ hoa, 1 số và 1 kí tự đặc biệt.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/auth/register', { username, password });
            setSuccess(true);
            toast.success("Đăng ký thành công! Hãy đợi Admin duyệt.");
            setTimeout(() => window.location.href = '/', 3000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Lỗi đăng ký');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: '400px', padding: '40px' }}
            >
                <h2 style={{ fontSize: '2rem', textAlign: 'center', marginBottom: '30px' }}>Gia nhập không gian</h2>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <CheckCircle size={60} color="#22c55e" style={{ marginBottom: '20px' }} />
                        <h3 style={{ marginBottom: '10px' }}>Đăng ký thành công!</h3>
                        <p style={{ color: '#94a3b8' }}>Tài khoản của bạn đang chờ Admin phê duyệt. Bạn sẽ được chuyển tới trang đăng nhập sau giây lát.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Tên đăng nhập mới</label>
                            <div style={{ position: 'relative' }}>
                                <User style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} size={18} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 12px 12px 40px', borderRadius: '10px', color: 'white' }}
                                    required
                                />
                            </div>
                            <small style={{ display: 'block', marginTop: '5px', fontSize: '0.75rem', color: '#64748b' }}>
                                Ít nhất 6 kí tự (a-z, A-Z, 0-9, .)
                            </small>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', color: '#94a3b8' }}>Mật khẩu</label>
                            <div style={{ position: 'relative' }}>
                                <Lock style={{ position: 'absolute', left: '12px', top: '12px', color: '#64748b' }} size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '12px 45px 12px 40px', borderRadius: '10px', color: 'white' }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    tabIndex="-1"
                                    style={{ position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0 }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <small style={{ display: 'block', marginTop: '5px', fontSize: '0.75rem', color: '#64748b' }}>
                                Ít nhất 8 kí tự (hoa, thường, số, đặc biệt)
                            </small>
                        </div>

                        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Tạo tài khoản</button>
                    </form>
                )}

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem', color: '#94a3b8' }}>
                    Đã có tài khoản? <Link to="/login" style={{ color: '#3b82f6' }}>Đăng nhập</Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Register;
