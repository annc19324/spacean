import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getApiUrl } from '../config/api';
import { Facebook, Instagram, Twitter, Youtube, Linkedin, Github, Globe, Music } from 'lucide-react';

const ICON_MAP = {
    facebook: Facebook,
    instagram: Instagram,
    tiktok: Music,
    twitter: Twitter,
    youtube: Youtube,
    linkedin: Linkedin,
    github: Github,
    website: Globe
};

const COLOR_MAP = {
    facebook: '#1877F2',
    instagram: '#E4405F',
    tiktok: '#000000',
    twitter: '#1DA1F2',
    youtube: '#FF0000',
    linkedin: '#0A66C2',
    github: '#181717',
    website: '#10b981'
};

const Footer = () => {
    const [socialLinks, setSocialLinks] = useState([]);

    useEffect(() => {
        const fetchLinks = async () => {
            try {
                const res = await axios.get(getApiUrl('/api/social-links'));
                setSocialLinks(res.data);
            } catch (err) {
                console.error('Error loading social links:', err);
            }
        };
        fetchLinks();
    }, []);

    if (socialLinks.length === 0) return null;

    return (
        <footer style={{
            marginTop: '80px',
            padding: '40px 5%',
            borderTop: '1px solid var(--glass-border)',
            background: 'rgba(5, 7, 10, 0.8)',
            backdropFilter: 'blur(10px)'
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '20px',
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f8fafc' }}>Kết nối với chúng tôi</h3>

                <div style={{
                    display: 'flex',
                    gap: '15px',
                    flexWrap: 'wrap',
                    justifyContent: 'center'
                }}>
                    {socialLinks.map(link => {
                        const IconComponent = ICON_MAP[link.iconType];
                        const iconColor = COLOR_MAP[link.iconType] || '#64748b';

                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={link.name}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '50px',
                                    height: '50px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s ease',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.borderColor = iconColor;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                                }}
                            >
                                {link.iconType === 'custom' ? (
                                    <img
                                        src={link.iconUrl}
                                        alt={link.name}
                                        style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                                    />
                                ) : IconComponent ? (
                                    <IconComponent size={28} color={iconColor} />
                                ) : (
                                    <Globe size={28} color="#64748b" />
                                )}
                            </a>
                        );
                    })}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center' }}>
                    © {new Date().getFullYear()} SpaceAn. Tất cả quyền được bảo lưu.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
