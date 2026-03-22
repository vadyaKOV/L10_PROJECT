import axios from 'axios';

// Создаем экземпляр с базовыми настройками
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Адрес нашего сервера
    withCredentials: true // РАЗРЕШАЕМ КУКИ (Самое важное!)
});

export default api;