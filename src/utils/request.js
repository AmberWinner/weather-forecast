import axios from 'axios';

const service = axios.create({
    timeout: 10000
});

// 请求拦截器：自动注入 API Key
service.interceptors.request.use(
    config => {
        const key = import.meta.env.VITE_WEATHER_KEY;
        if (config.params) {
            config.params['key'] = key;
        } else {
            config.params = { key };
        }
        return config;
    },
    error => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.code === '200') {
            return res;
        }
        console.error('API 业务错误:', res);
        return Promise.reject(new Error(`API Error: ${res.code}`));
    },
    error => {
        console.error('请求失败:', error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default service;
