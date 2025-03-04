import axios from 'axios';

const API_BASE_URL = 'https://yorkpork123.pythonanywhere.com';  // Указываем URL нашего Django-сервера

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

// Метод для отправки результатов теста на сервер
export const sendTestResult = async (result) => {
    try {
        const response = await api.post('/api/save_test_result/', result);
        return response.data;
    } catch (error) {
        console.error('Ошибка при отправке результата:', error);
        throw error;
    }
};
