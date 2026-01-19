import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Xác nhận", cancelText = "Hủy" }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card modal-content"
                style={{ maxWidth: '450px', width: '90%' }}
                onClick={(e) => e.stopPropagation()}
            >
                <div style={{ textAlign: 'center', marginBottom: '25px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '2px solid rgba(239, 68, 68, 0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px'
                    }}>
                        <AlertTriangle size={32} color="#ef4444" />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{title}</h2>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>{message}</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={onClose}
                        className="btn-secondary"
                        style={{ flex: 1, padding: '12px' }}
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className="btn-primary"
                        style={{ flex: 1, padding: '12px', background: '#ef4444' }}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default ConfirmModal;
