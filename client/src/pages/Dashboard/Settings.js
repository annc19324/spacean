import React from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Lock } from 'lucide-react';

const Settings = ({ profileData, setProfileData, handleProfileUpdate, passwordData, setPasswordData, handleChangePassword }) => {
    return (
        <motion.div key="settings" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>Cài đặt tài khoản</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '30px' }}>
                {/* Profile Update */}
                <section className="glass-card" style={{ padding: '30px' }}>
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserIcon size={20} color="#3b82f6" /> Thông tin cá nhân
                    </h2>
                    <form onSubmit={handleProfileUpdate}>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tên đăng nhập</label>
                            <input style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={profileData.username} onChange={e => setProfileData({ ...profileData, username: e.target.value })} />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Tiểu sử (Bio)</label>
                            <textarea style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white', height: '80px' }} value={profileData.bio} onChange={e => setProfileData({ ...profileData, bio: e.target.value })} />
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
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mật khẩu cũ</label>
                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.oldPassword} onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Mật khẩu mới</label>
                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.newPassword} onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} required />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Xác nhận mật khẩu mới</label>
                            <input type="password" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', padding: '10px', borderRadius: '8px', color: 'white' }} value={passwordData.confirmPassword} onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} required />
                        </div>
                        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Cập nhật mật khẩu</button>
                    </form>
                </section>
            </div>
        </motion.div>
    );
};

export default Settings;
