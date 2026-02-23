# CitySearch 组件使用说明

## 📝 组件简介

`CitySearch` 是一个功能完整的城市搜索组件，基于和风天气 GeoAPI 实现，支持城市名称和拼音的模糊搜索，提供热门城市快速选择功能。

## ✨ 主要功能

- 🔍 **智能搜索**：支持城市名称、拼音模糊搜索
- ⚡ **防抖优化**：500ms 防抖，避免频繁请求
- 📍 **热门城市**：预设北京、上海、广州、深圳快速选择
- 📤 **事件通知**：选中城市后通过 `emit` 传递给父组件
- 🎨 **美观 UI**：基于 Element Plus，响应式设计

## 🚀 快速开始

### 1. 基础用法

```vue
<template>
  <div>
    <CitySearch @citySelected="handleCitySelected" />
  </div>
</template>

<script setup>
import CitySearch from '@/components/CitySearch.vue';

const handleCitySelected = (city) => {
  console.log('选中的城市：', city);
  // city 对象结构：
  // {
  //   id: '101010100',        // LocationID
  //   name: '北京',           // 城市名称
  //   lat: '39.90499',        // 纬度
  //   lon: '116.40529',       // 经度
  //   adm1: '北京市',         // 一级行政区
  //   adm2: '北京',           // 二级行政区
  //   country: '中国'         // 国家
  // }
};
</script>
```

### 2. 完整示例（获取天气）

```vue
<template>
  <div>
    <CitySearch @citySelected="handleCitySelected" />
    
    <div v-if="weatherData">
      <h2>{{ selectedCity.name }} 的天气</h2>
      <p>温度：{{ weatherData.temp }}°C</p>
      <p>天气：{{ weatherData.text }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CitySearch from '@/components/CitySearch.vue';
import { getNowWeather } from '@/api/weather';

const selectedCity = ref(null);
const weatherData = ref(null);

const handleCitySelected = async (city) => {
  selectedCity.value = city;
  
  // 调用天气 API
  const response = await getNowWeather(city.id);
  if (response.code === '200') {
    weatherData.value = response.now;
  }
};
</script>
```

## 📡 事件

### citySelected

当用户选择城市时触发（包括搜索结果和热门城市）

**参数：**

```typescript
{
  id: string,       // LocationID，用于查询天气
  name: string,     // 城市名称
  lat: string,      // 纬度
  lon: string,      // 经度
  adm1: string,     // 一级行政区（省/直辖市）
  adm2: string,     // 二级行政区（市）
  country: string   // 国家
}
```

## 🏙️ 预设热门城市

| 城市 | LocationID | 经纬度 |
|------|------------|--------|
| 北京 | 101010100 | 39.90499, 116.40529 |
| 上海 | 101020100 | 31.23171, 121.47264 |
| 广州 | 101280101 | 23.12517, 113.28064 |
| 深圳 | 101280601 | 22.54700, 114.08595 |

## ⚙️ 技术实现

### 防抖机制

```javascript
// 500ms 防抖延迟
const handleSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(async () => {
    await fetchCities(searchQuery.value);
  }, 500);
};
```

### API 调用

使用 `getCityId` 接口进行城市搜索：

```javascript
// 调用 /geo/v2/city/lookup
const response = await getCityId(query);
// 返回格式：{ code: '200', location: [...] }
```

## 🎨 样式特点

- 响应式设计，最大宽度 600px
- 下拉列表支持滚动，最大高度 400px
- 悬停效果，提升用户体验
- 自定义滚动条样式
- 加载动画

## 📦 依赖

- Vue 3
- Element Plus
- @element-plus/icons-vue
- 项目中的 `api/weather.js`（getCityId 方法）

## 🔧 自定义配置

### 修改防抖延迟

在 `handleSearch` 方法中修改 `setTimeout` 的延迟时间（默认 500ms）

### 添加更多热门城市

修改 `hotCities` 数组：

```javascript
const hotCities = ref([
  { id: '101010100', name: '北京', lat: '39.90499', lon: '116.40529', ... },
  { id: '你的城市ID', name: '城市名', lat: '纬度', lon: '经度', ... },
  // 添加更多...
]);
```

### 修改搜索结果数量

GeoAPI 默认返回最相关的结果，如需限制可在 `fetchCities` 中处理：

```javascript
searchResults.value = response.location.slice(0, 10); // 只显示前 10 个
```

## 💡 使用建议

1. **自动获取天气**：在 `handleCitySelected` 中直接调用天气 API
2. **保存历史记录**：使用 localStorage 存储用户的搜索历史
3. **定位功能**：结合浏览器地理定位 API，自动获取用户当前城市
4. **Pinia 集成**：将选中的城市存储到 Pinia store 中，实现全局共享

## 📄 示例页面

完整示例见 `src/views/Home.vue`

## 🐛 常见问题

**Q: 搜索无结果？**  
A: 检查 API key 是否正确配置在 `.env` 文件中

**Q: 如何获取更多城市信息？**  
A: 和风天气 GeoAPI 返回的 `location` 对象包含更多字段，可根据需要扩展

**Q: 如何修改热门城市的 LocationID？**  
A: 可以通过搜索功能找到对应城市的 LocationID，或访问和风天气官方文档查询

## 📚 相关文档

- [和风天气 GeoAPI 文档](https://dev.qweather.com/docs/api/geoapi/)
- [Element Plus 文档](https://element-plus.org/)
- [Vue 3 文档](https://cn.vuejs.org/)
