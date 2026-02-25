import axios from 'axios';

// ==========================================
// 1. 抽取共用的请求拦截逻辑 (ApiKey 注入)
// ==========================================
const injectApiKey = (config) => {
    const key = import.meta.env.VITE_WEATHER_KEY;
    if (!key) {
        throw new Error('VITE_WEATHER_KEY 未配置');
    }
    
    // QWeather 推荐：使用请求头传 Key
    config.headers = config.headers || {};
    config.headers['X-QW-Api-Key'] = key;

    // 兼容旧用法：确保 params 存在并补充 key
    if (config.params) {
        config.params['key'] = config.params['key'] || key;
    } else {
        config.params = { key };
    }
    return config;
};

// ==========================================
// 2. 抽取共用的响应拦截逻辑 (保留你优秀的报错处理)
// ==========================================
const handleResponse = (response) => {
    const res = response.data;

    // 兼容 V7接口 (带有 code: '200') 和 V1接口 (带有 metadata，无 code)
    if (res?.code === '200' || res?.metadata) {
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
};

const handleError = (error) => {
    console.error('请求失败:', error.config?.url, error.message);
    return Promise.reject(error);
};


// ==========================================
// 3. 实例化三个不同的 Axios 实例并命名导出
// ==========================================

// 实例 A：GeoAPI (地理位置服务)
export const geoRequest = axios.create({
    baseURL: import.meta.env.VITE_GEO_BASE_URL,
    timeout: 10000
});
geoRequest.interceptors.request.use(injectApiKey, error => Promise.reject(error));
geoRequest.interceptors.response.use(handleResponse, handleError);


// 实例 B：Weather V7 (常规天气服务)
export const weatherRequest = axios.create({
    baseURL: import.meta.env.VITE_WEATHER_BASE_URL,
    timeout: 10000
});
weatherRequest.interceptors.request.use(injectApiKey, error => Promise.reject(error));
weatherRequest.interceptors.response.use(handleResponse, handleError);


// 实例 C：AirQuality V1 (高级空气质量 - JWT 认证)
export const airRequest = axios.create({
    baseURL: import.meta.env.VITE_AIR_V1_BASE_URL,
    timeout: 10000
});
airRequest.interceptors.request.use(config => {
    const token = import.meta.env.VITE_AIR_JWT_TOKEN;
    if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`; // 注入 JWT
    } else {
        console.warn('VITE_AIR_JWT_TOKEN 未配置，空气质量接口可能返回 403');
    }
    return config;
}, error => Promise.reject(error));
airRequest.interceptors.response.use(handleResponse, handleError);