export interface User {
    id: string;
    username: string;
    email: string;
    displayName: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
    devLogin: () => void; // 開発用ログイン関数を追加
}