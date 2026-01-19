import { useState } from 'react';

export const useConfirm = () => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmConfig, setConfirmConfig] = useState({
        title: 'Xác nhận',
        message: 'Bạn có chắc chắn?',
        confirmText: 'Xác nhận',
        cancelText: 'Hủy'
    });

    const confirm = (action, config = {}) => {
        setConfirmAction(() => action);
        setConfirmConfig({ ...confirmConfig, ...config });
        setShowConfirm(true);
    };

    const close = () => {
        setShowConfirm(false);
    };

    return {
        showConfirm,
        confirmAction,
        confirmConfig,
        confirm,
        close
    };
};
