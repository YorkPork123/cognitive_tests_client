import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';  // Указываем URL нашего Django-сервера

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const registerUser = async (userData) => {
    try {
        const response = await api.post('/api/register/', userData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при регистрации:', error);
        throw error;
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await api.post('/api/login/', userData);
        return response.data;
    } catch (error) {
        console.error('Ошибка при входе:', error);
        throw error;
    }
};