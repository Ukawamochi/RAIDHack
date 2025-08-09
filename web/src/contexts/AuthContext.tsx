import React, { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContextData';
import type { User } from './authTypes';

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = (userData: User) => {
        setUser(userData);
        // 実際の実装では、JWTトークンをlocalStorageに保存するなど
        localStorage.setItem('devUser', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        // 実際の実装では、localStorageからトークンを削除するなど
        localStorage.removeItem('devUser');
    };

    // 開発用：仮ログイン機能
    const devLogin = () => {
        const devUser: User = {
            id: 'dev-user-001',
            username: 'developer',
            email: 'dev@example.com',
            displayName: '開発者'
        };
        login(devUser);
    };

    // 初期化時にlocalStorageから復元
    useEffect(() => {
        const savedUser = localStorage.getItem('devUser');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (error) {
                console.error('Failed to parse saved user:', error);
                localStorage.removeItem('devUser');
            }
        }
    }, []);

    const value = {
        user,
        isAuthenticated: !!user,
        login,
        logout,
        devLogin // 開発用ログイン関数を追加
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
