import request from '../utils/request';

const WEATHER_URL = import.meta.env.VITE_WEATHER_BASE_URL;
const GEO_URL = import.meta.env.VITE_GEO_BASE_URL;

// 1. 搜索城市 (使用 GEO_URL)
export function getCityId(location) {
    return request({
        url: `${GEO_URL}/city/lookup`,
        method: 'get',
        params: { location }
    });
}

// 2. 获取实时天气 (使用 WEATHER_URL)
export function getNowWeather(locationId) {
    return request({
        url: `${WEATHER_URL}/weather/now`,
        method: 'get',
        params: { location: locationId }
    });
}

// 3. 获取7天天气预报
export function get7DaysWeather(locationId) {
    return request({
        url: `${WEATHER_URL}/weather/7d`,
        method: 'get',
        params: { location: locationId }
    });
}