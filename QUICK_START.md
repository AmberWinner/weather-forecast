# 🚀 快速启动指南

## ✅ 项目已启动

您的开发服务器已经成功运行！

**访问地址：** http://localhost:5175/

---

## 📦 已实现的功能

### 1. CitySearch 组件

**位置：** `src/components/CitySearch.vue`

**功能特性：**
- 🔍 智能搜索：输入城市名称或拼音，实时显示匹配结果
- ⚡ 防抖优化：500ms 防抖，避免频繁请求 API
- 📍 热门城市：一键选择北京、上海、广州、深圳
- 📡 事件传递：选中城市后通过 `citySelected` 事件发送数据
- 🎨 精美 UI：基于 Element Plus，响应式设计

### 2. Home 页面示例

**位置：** `src/views/Home.vue`

**展示内容：**
- 集成 CitySearch 组件
- 显示选中城市的详细信息
- 调用天气 API 获取实时天气
- 美观的渐变背景和卡片布局

---

## 🎯 使用步骤

### 第一步：在浏览器中打开

访问：http://localhost:5175/

### 第二步：搜索城市

在搜索框中输入城市名称，例如：
- 中文：`北京`、`上海`、`杭州`
- 拼音：`beijing`、`shanghai`、`hangzhou`

### 第三步：选择城市

- 方式1：点击下拉列表中的搜索结果
- 方式2：点击热门城市按钮（北京/上海/广州/深圳）

### 第四步：查看天气

选中城市后，页面会自动显示：
- 城市信息（名称、LocationID、经纬度、行政区）
- 实时天气数据（温度、体感温度、天气状况、风向、湿度等）

---

## 🔑 热门城市 LocationID

| 城市 | LocationID | 说明 |
|------|------------|------|
| 北京 | 101010100 | 已预设，可直接使用 |
| 上海 | 101020100 | 已预设，可直接使用 |
| 广州 | 101280101 | 已预设，可直接使用 |
| 深圳 | 101280601 | 已预设，可直接使用 |

---

## 📋 项目依赖（已安装）

```json
{
  "vue": "^3.5.25",                    ✅ Vue 3 框架
  "vue-router": "^4.6.4",              ✅ 路由管理
  "pinia": "^3.0.4",                   ✅ 状态管理
  "element-plus": "^2.13.2",           ✅ UI 组件库
  "@element-plus/icons-vue": "^2.3.2", ✅ 图标库
  "axios": "^1.13.5"                   ✅ HTTP 请求
}
```

---

## 📂 项目结构

```
src/
├── api/
│   └── weather.js              # 天气 API 接口（getCityId, getNowWeather, get7DaysWeather）
├── components/
│   └── CitySearch.vue          # 城市搜索组件 ✨
├── router/
│   └── index.js                # 路由配置
├── views/
│   └── Home.vue                # 首页示例 ✨
├── utils/
│   └── request.js              # Axios 封装
├── App.vue                     # 根组件
└── main.js                     # 应用入口
```

---

## 🛠️ 开发命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

---

## 📝 组件使用示例

### 基础用法

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
  // city = {
  //   id: '101010100',
  //   name: '北京',
  //   lat: '39.90499',
  //   lon: '116.40529',
  //   adm1: '北京市',
  //   adm2: '北京',
  //   country: '中国'
  // }
};
</script>
```

### 获取天气数据

```vue
<script setup>
import { getNowWeather } from '@/api/weather';

const handleCitySelected = async (city) => {
  const response = await getNowWeather(city.id);
  if (response.code === '200') {
    const weather = response.now;
    console.log('温度：', weather.temp);
    console.log('天气：', weather.text);
  }
};
</script>
```

---

## 🔍 API 说明

### 1. getCityId(location)

**功能：** 搜索城市，返回 LocationID

**参数：**
- `location` (string): 城市名称或拼音

**返回示例：**
```json
{
  "code": "200",
  "location": [
    {
      "id": "101010100",
      "name": "北京",
      "lat": "39.90499",
      "lon": "116.40529",
      "adm1": "北京市",
      "adm2": "北京",
      "country": "中国"
    }
  ]
}
```

### 2. getNowWeather(locationId)

**功能：** 获取实时天气

**参数：**
- `locationId` (string): 城市的 LocationID

**返回示例：**
```json
{
  "code": "200",
  "now": {
    "temp": "12",
    "feelsLike": "10",
    "text": "晴",
    "windDir": "西北风",
    "humidity": "45",
    "precip": "0.0"
  }
}
```

### 3. get7DaysWeather(locationId)

**功能：** 获取 7 天天气预报

**参数：**
- `locationId` (string): 城市的 LocationID

**说明：** 此接口已在 `weather.js` 中定义，可用于扩展功能

---

## 💡 下一步开发建议

### 1. 保存搜索历史
使用 localStorage 保存用户的搜索记录

### 2. 添加地理定位
使用浏览器 Geolocation API 自动获取用户位置

### 3. 7 天天气预报
调用 `get7DaysWeather` API，展示未来一周天气

### 4. 使用 Pinia 管理状态
创建 `stores/weather.js`，全局管理天气数据

### 5. 添加图表展示
使用 ECharts 展示温度趋势图

---

## 📚 相关文档

- **详细实现说明：** `IMPLEMENTATION.md`
- **组件文档：** `src/components/CitySearch.README.md`
- **和风天气 API：** https://dev.qweather.com/docs/api/
- **Element Plus：** https://element-plus.org/
- **Vue 3：** https://cn.vuejs.org/

---

## ✅ 测试清单

在浏览器中测试以下功能：

- [ ] 打开 http://localhost:5175/
- [ ] 输入城市名称（如"北京"）进行搜索
- [ ] 输入拼音（如"beijing"）进行搜索
- [ ] 点击热门城市按钮
- [ ] 查看城市信息是否正确显示
- [ ] 点击"获取天气信息"按钮
- [ ] 查看实时天气数据是否正确显示
- [ ] 快速输入多次，测试防抖功能
- [ ] 清空搜索框

---

## 🎉 完成！

您的天气预报项目已经成功运行！现在可以开始使用城市搜索功能了。

如有任何问题，请参考：
- `IMPLEMENTATION.md` - 完整实现文档
- `src/components/CitySearch.README.md` - 组件使用说明

祝开发顺利！🌤️
