import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:4000',
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // Обновляем токены
                const refreshResponse = await axios.get('http://localhost:4000/api/auth/refresh', {
                    withCredentials: true,
                });

                const newAccessToken = refreshResponse.data.accessToken;

                // Сохраняем новый токен
                localStorage.setItem('accessToken', newAccessToken);

                // Повторяем оригинальный запрос
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return instance(originalRequest);
            } catch (refreshError) {
                console.error('Refresh token failed:', refreshError);
                window.location.href ="http://localhost:3000/login";
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
