import { geoRequest, weatherRequest, airRequest } from '../utils/request';

// 1. GeoAPI (地理位置)
export function searchCity(keyword, adm = '') {
    const params = { location: keyword, number: 20 };
    if (adm) params.adm = adm;
    return geoRequest({ url: '/city/lookup', method: 'get', params });
}

export function searchPoi(keyword, type = 'scenic', city = '') {
    const params = { location: keyword, type: type, number: 10 };
    if (city) params.city = city;
    return geoRequest({ url: '/poi/lookup', method: 'get', params });
}

// 2. Weather V7 (常规天气)
export function getNowWeather(locationId) {
    return weatherRequest({ url: '/weather/now', method: 'get', params: { location: locationId } });
}

export function get7DaysWeather(locationId) {
    return weatherRequest({ url: '/weather/7d', method: 'get', params: { location: locationId } });
}

export function getLifeIndices(locationId, type = '1,3,5,6') {
    return weatherRequest({ url: '/indices/1d', method: 'get', params: { location: locationId, type: type } });
}

// 3. AirQuality V1 (高级空气质量)
export function getAirQualityV1(lat, lon) {
    const latitude = Number(lat).toFixed(2);
    const longitude = Number(lon).toFixed(2);
    return airRequest({ url: `/current/${latitude}/${longitude}`, method: 'get' });
}

export function getAirQualityForecastV1(lat, lon) {
    const latitude = Number(lat).toFixed(2);
    const longitude = Number(lon).toFixed(2);
    return airRequest({ url: `/daily/${latitude}/${longitude}`, method: 'get', params: { localTime: true } });
}