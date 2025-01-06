// export const GLOBAL_URL = 'http://localhost:8080';
export const GLOBAL_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const LOGIN_URL = import.meta.env.VITE_LOGIN_URL || 'localhost:5173';
