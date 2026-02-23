# 城市搜索功能实现说明

## 📋 完成内容

### 1. 创建了 CitySearch 组件 ✅

**文件路径：** `src/components/CitySearch.vue`

**核心功能：**
- ✅ 城市搜索输入框（支持中文名称和拼音）
- ✅ 实时搜索联想下拉列表
- ✅ 500ms 防抖优化，避免频繁请求
- ✅ 热门城市快速选择（北京、上海、广州、深圳）
- ✅ 选中城市后通过 `citySelected` 事件传递信息
- ✅ 加载动画和友好的交互体验
- ✅ 响应式设计

**组件 API：**

```vue
<CitySearch @citySelected="handleCitySelected" />
```

**返回数据格式：**
```javascript
{
  id: '101010100',        // LocationID（用于查询天气）
  name: '北京',           // 城市名称
  lat: '39.90499',        // 纬度
  lon: '116.40529',       // 经度
  adm1: '北京市',         // 一级行政区
  adm2: '北京',           // 二级行政区
  country: '中国'         // 国家
}
```

---

### 2. 创建了示例页面 ✅

**文件路径：** `src/views/Home.vue`

**功能展示：**
- ✅ 集成 CitySearch 组件
- ✅ 显示选中的城市信息
- ✅ 调用天气 API 获取实时天气
- ✅ 美观的 UI 设计（渐变背景、卡片布局）

---

### 3. 配置了路由系统 ✅

**文件路径：** `src/router/index.js`

**功能：**
- ✅ 设置 Home 为首页路由
- ✅ 配置页面标题
- ✅ 支持扩展更多路由

---

### 4. 更新了应用入口 ✅

**文件路径：** `src/main.js`

**集成内容：**
- ✅ Vue Router
- ✅ Pinia（状态管理）
- ✅ Element Plus（UI 组件库）
- ✅ Element Plus Icons（图标库）

**文件路径：** `src/App.vue`
- ✅ 使用 `<router-view />` 渲染路由组件
- ✅ 全局样式重置

---

### 5. 热门城市 LocationID ✅

| 城市 | LocationID | 坐标 |
|------|------------|------|
| 北京 | 101010100 | 39.90499°N, 116.40529°E |
| 上海 | 101020100 | 31.23171°N, 121.47264°E |
| 广州 | 101280101 | 23.12517°N, 113.28064°E |
| 深圳 | 101280601 | 22.54700°N, 114.08595°E |

---

## 🚀 如何运行

### 1. 确保环境变量配置正确

检查 `.env` 文件是否包含：

```env
VITE_WEATHER_KEY=你的和风天气API密钥
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问 `http://localhost:5173`（或终端显示的地址）

---

## 🎯 使用流程

1. **搜索城市：** 在搜索框输入城市名称或拼音
2. **等待联想：** 500ms 后自动显示匹配的城市列表
3. **选择城市：** 点击搜索结果或热门城市按钮
4. **获取天气：** 自动调用天气 API，显示实时天气信息

---

## 📁 项目结构（更新后）

```
src/
├── api/
│   └── weather.js              ✅ 天气 API 接口
├── components/
│   ├── CitySearch.vue          ✅ 城市搜索组件（新建）
│   ├── CitySearch.README.md    ✅ 组件使用文档（新建）
│   └── HelloWorld.vue          
├── router/
│   └── index.js                ✅ 路由配置（新建）
├── views/
│   └── Home.vue                ✅ 首页（新建）
├── utils/
│   └── request.js              ✅ Axios 封装
├── App.vue                     ✅ 根组件（已更新）
└── main.js                     ✅ 入口文件（已更新）
```

---

## 🔧 技术实现细节

### 防抖机制

```javascript
let debounceTimer = null;

const handleSearch = () => {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }
  
  debounceTimer = setTimeout(async () => {
    await fetchCities(searchQuery.value);
  }, 500); // 500ms 延迟
};
```

### API 调用

```javascript
// 使用 getCityId 接口
const response = await getCityId(query);

// 返回格式
{
  code: "200",
  location: [
    {
      id: "101010100",
      name: "北京",
      lat: "39.90499",
      lon: "116.40529",
      adm1: "北京市",
      adm2: "北京",
      country: "中国",
      ...
    }
  ]
}
```

### 事件传递

```javascript
// 子组件（CitySearch）
emit('citySelected', cityData);

// 父组件（Home）
const handleCitySelected = (city) => {
  selectedCity.value = city;
  fetchWeather(); // 获取天气
};
```

---

## 📚 相关文档

- **组件详细文档：** `src/components/CitySearch.README.md`
- **和风天气 GeoAPI：** https://dev.qweather.com/docs/api/geoapi/
- **和风天气实时天气 API：** https://dev.qweather.com/docs/api/weather/weather-now/
- **Element Plus：** https://element-plus.org/

---

## 💡 扩展建议

### 1. 搜索历史记录

```javascript
// 使用 localStorage 保存搜索历史
const saveSearchHistory = (city) => {
  const history = JSON.parse(localStorage.getItem('cityHistory') || '[]');
  history.unshift(city);
  localStorage.setItem('cityHistory', JSON.stringify(history.slice(0, 5)));
};
```

### 2. 地理定位

```javascript
// 获取用户当前位置
const getCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    // 使用坐标查询城市
  });
};
```

### 3. Pinia 状态管理

```javascript
// stores/weather.js
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentCity: null,
    weatherData: null
  }),
  actions: {
    setCity(city) {
      this.currentCity = city;
    }
  }
});
```

### 4. 7 天天气预报

```javascript
// 使用已有的 get7DaysWeather API
const forecast = await get7DaysWeather(city.id);
// 展示 7 天天气趋势图表
```

---

## ✅ 测试清单

- [ ] 搜索中文城市名称（如"北京"）
- [ ] 搜索拼音（如"beijing"）
- [ ] 搜索不存在的城市（应显示"未找到"）
- [ ] 点击热门城市按钮
- [ ] 快速输入多次（测试防抖）
- [ ] 清空搜索框
- [ ] 选中城市后获取天气数据
- [ ] 检查响应式布局（手机、平板、桌面）

---

## 🐛 可能的问题

**问题 1：搜索无结果**
- 检查 `.env` 文件中的 `VITE_WEATHER_KEY` 是否正确
- 检查 `VITE_GEO_BASE_URL` 是否为 `https://geoapi.qweather.com/v2`

**问题 2：热门城市 LocationID 不准确**
- 可以通过搜索功能验证热门城市的 LocationID
- 必要时更新 `hotCities` 数组中的数据

**问题 3：样式显示异常**
- 确保 Element Plus CSS 已正确导入
- 检查浏览器控制台是否有 CSS 加载错误

---

## 📝 总结

✅ **CitySearch 组件**已完成，包含搜索、防抖、热门城市等所有功能  
✅ **Home 示例页面**展示了完整的使用流程  
✅ **路由配置**和**应用入口**已更新  
✅ **详细文档**提供了使用说明和扩展建议

现在可以启动项目，测试城市搜索和天气查询功能了！🎉
