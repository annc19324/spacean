import axios from 'axios';

// Định nghĩa các URL
const PRIMARY_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const BACKUP_URL = process.env.REACT_APP_API_URL_CLONE || 'https://spacean-9b99.onrender.com';

// URL hiện tại đang sử dụng (mặc định là Primary)
let activeUrl = PRIMARY_URL;

/**
 * Kiểm tra kết nối tới Primary API.
 * Nếu thất bại (timeout/error), sẽ chuyển sang Backup API.
 */
export const initializeApi = async () => {
    // Nếu đang chạy nối localhost dev, ưu tiên giữ nguyên config
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        if (!process.env.REACT_APP_API_URL) return;
    }

    try {
        console.log(`Checking API health: ${PRIMARY_URL}`);
        // Timeout 3s để không đợi quá lâu
        await axios.get(`${PRIMARY_URL}/`, { timeout: 3000 });
        console.log('Primary API is healthy.');
        activeUrl = PRIMARY_URL;
    } catch (error) {
        console.warn('Primary API unreachable, switching to Backup API.', error.message);
        activeUrl = BACKUP_URL;
    }
};

export const getApiUrl = (endpoint) => {
    const baseUrl = activeUrl.endsWith('/') ? activeUrl.slice(0, -1) : activeUrl;
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${baseUrl}${path}`;
};

export default activeUrl;
