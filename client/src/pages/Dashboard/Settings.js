import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const Settings = ({ profileData, setProfileData, handleProfileUpdate, passwordData, setPasswordData, handleChangePassword, token }) => {
    const [showOldPwd, setShowOldPwd] = useState(false);
    const [showNewPwd, setShowNewPwd] = useState(false);
    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const config = { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
            const res = await axios.post('http://localhost:5000/api/upload', formData, config);
            setProfileData({ ...profileData, avatar: res.data.url });
            toast.success("Đã tải ảnh đại diện lên!");
        } catch (err) {
            toast.error("Lỗi khi tải ảnh lên");
        } finally {
            setUploading(false);
        }
    };

    return (
        <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Cài đặt tài khoản</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                {/* Profile Update */}
                <section className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserIcon size={20} color="#3b82f6" /> Thông tin cá nhân
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '25px' }}>
                        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%',
                                background: 'var(--accent-gradient)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                overflow: 'hidden', border: '3px solid var(--glass-border)'
                            }}>
                                {profileData.avatar ? (
                                    <img src={profileData.avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <UserIcon size={50} color="white" />
                                )}
                            </div>
                            <label htmlFor="avatar-upload" style={{
                                position: 'absolute', bottom: '0', right: '0',
                                background: 'var(--nebula-purple)', padding: '6px',
                                borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid var(--deep-space)'
                            }}>
                                <Camera size={16} color="white" />
                            </label>
                            <input type="file" id="avatar-upload" hidden accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                        </div>
                        {uploading && <span style={{ fontSize: '0.8rem', marginTop: '5px', color: '#3b82f6' }}>Đang tải ảnh...</span>}
                    </div>

                    <form onSubmit={handleProfileUpdate}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Tên đăng nhập</label>
                            <input value={profileData.username} onChange={e => setProfileData({ ...profileData, username: e.target.value })} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Tiểu sử (Bio)</label>
                            <textarea value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} style={{ height: '80px' }} />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Lưu thông tin</button>
                    </form>
                </section>

                {/* Password Change */}
                <section className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Lock size={20} color="#6d28d9" /> Đổi mật khẩu
                    </h2>
                    <form onSubmit={handleChangePassword}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Mật khẩu cũ</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showOldPwd ? "text" : "password"} value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required style={{ paddingRight: '45px' }} />
                                <button type="button" onClick={() => setShowOldPwd(!showOldPwd)} className="btn-icon" style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent' }}>
                                    {showOldPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Mật khẩu mới</label>
                            <div style={{ position: 'relative' }}>
                                <input type={showNewPwd ? "text" : "password"} value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required style={{ paddingRight: '45px' }} />
                                <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="btn-icon" style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'transparent' }}>
                                    {showNewPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <small style={{ display: 'block', marginTop: '5px', fontSize: '0.75rem', color: '#64748b' }}>
                                Ít nhất 8 ký tự (chữ hoa, chữ thường, số, ký tự đặc biệt @$!%*?&)
                            </small>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Xác nhận mật khẩu mới</label>
                            <input type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Cập nhật mật khẩu</button>
                    </form>
                </section>
            </div>
        </motion.div>
    );
};

export default Settings;
