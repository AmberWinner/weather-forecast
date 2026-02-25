

🌦️ WeatherHub - 高级极简天气看板
WeatherHub 是一款基于 Vue 3 和 Element Plus 构建的现代化天气预报 Web 应用。它通过对接和风天气（QWeather）的多维度 API，为用户提供精准的全球天气、空气质量及生活指数查询服务。

✨ 核心功能
城市精准搜索：支持城市名称、拼音的模糊搜索，并提供北京、上海、广州等热门城市快捷入口。

全方位实时天气：涵盖温度、体感温度、风力风向、湿度、大气压强及能见度等 9 项核心指标。

7天天气预报：清晰展示未来一周的温度趋势与天气状况。

高精度空气质量 (V1)：利用经纬度获取 1x1km 级别的实时空气质量及专业健康建议。

生活指数建议：提供穿衣、运动、紫外线、洗车等实用生活指南。

用户体系与交互：支持游客模式与登录跳转，具备昼夜模式切换及响应式布局适配。

🛠️ 技术架构
1. 技术栈
框架: Vue 3 (Composition API)

状态管理: Pinia (用于存储城市信息与天气缓存)

路由: Vue Router (支持主页与登录页跳转)

UI 组件库: Element Plus

网络请求: Axios (定制多实例拦截器)

2. 多重身份认证体系
项目采用了 ApiKey 与 JWT (JSON Web Token) 混合认证模式，以适配不同级别的 API 接口：

Weather V7 / Geo API: 通过 weatherRequest 实例自动注入 ApiKey。

AirQuality V1: 通过 airRequest 实例在 Header 中注入 Authorization: Bearer <Token>。

📂 文件结构
Plaintext
src/
├── api/
│   └── weather.js      # 纯净 ES6 模块，封装所有气象请求函数
├── utils/
│   └── request.js      # Axios 拦截器配置，处理三种独立请求实例
├── views/
│   ├── Home.vue        # 主看板，处理数据聚合与 UI 渲染
│   └── Login.vue       # 用户登录界面
├── components/
│   └── CitySearch.vue  # 城市搜索组件，支持防抖查询
└── stores/
    └── weather.js      # 状态管理
⚙️ 环境配置
在项目根目录创建 .env.development 文件并配置以下变量：

代码段
# 常规天气与地理位置 API (ApiKey 认证)
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
VITE_WEATHER_KEY=你的_API_KEY

# 高级空气质量 API (JWT 认证)
VITE_AIR_V1_BASE_URL=https://你的专属域名/airquality/v1
VITE_AIR_JWT_TOKEN=你的_JWT_TOKEN
🚀 快速开始
安装依赖:

Bash
npm install
启动开发服务器:

Bash
npm run dev
构建生产版本:

Bash
npm run build
💡 开发者笔记
性能优化：项目在获取数据时使用了 Promise.all 并发请求，显著降低了首屏加载时间。

健壮性：针对高级接口 (V1) 做了 try...catch 优雅降级处理，确保即使高阶接口授权失效，基础天气功能仍可正常运行。