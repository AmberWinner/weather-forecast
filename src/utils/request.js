import axios from 'axios';

const service = axios.create({
    timeout: 10000
});

// 请求拦截器：按和风天气规范注入 API Key（Header 优先）
service.interceptors.request.use(
    config => {
        const key = import.meta.env.VITE_WEATHER_KEY;
        if (!key) {
            throw new Error('VITE_WEATHER_KEY 未配置');
        }

        // QWeather 推荐：使用请求头传 Key
        config.headers = config.headers || {};
        config.headers['X-QW-Api-Key'] = key;

        // 兼容旧用法：如果后端仍支持 query key，则也补上（不影响 Header 认证）
        if (config.params) {
            config.params['key'] = config.params['key'] || key;
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

        // 和风天气成功返回：{ code: '200', ... }
        if (res?.code === '200') {
            return res;
        }

        // 和风天气新版错误返回：{ error: { status, title, detail, ... } }
        if (res?.error) {
            const { title, detail, status, type } = res.error;
            const msg = `${title || 'QWeather Error'}${status ? ` (${status})` : ''}${detail ? `: ${detail}` : ''}`;
            console.error('QWeather 错误:', { type, status, title, detail });
            return Promise.reject(new Error(msg));
        }

        // 兜底：把后端返回原样抛出，便于排查
        console.error('API 业务错误:', res);
        return Promise.reject(new Error(`API Error: ${res?.code || response.status}`));
    },
    error => {
        console.error('请求失败:', error.config?.url, error.message);
        return Promise.reject(error);
    }
);

export default service;
