import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('spacean_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('spacean_user');
        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, [token]);

    // Axios Interceptor để tự động logout khi token hết hạn
    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    // Nếu lỗi là 401 hoặc 403 (Unauthorized/Forbidden)
                    // Kiểm tra xem có phải đang ở trang login/register không để tránh loop
                    if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
                        logout();
                        toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                        // Optional: Redirect về login nếu cần thiết, nhưng logout() sẽ set user=null 
                        // và App.js sẽ tự redirect nếu đang ở route được bảo vệ.
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('spacean_token', userToken);
        localStorage.setItem('spacean_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('spacean_token');
        localStorage.removeItem('spacean_user');
        // Xóa header Authorization global nếu có set
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
