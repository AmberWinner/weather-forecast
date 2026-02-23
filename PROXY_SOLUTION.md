# 🔧 网络代理问题解决方案

## ✅ 已完成的修复

我已经配置了 Vite 开发服务器代理来解决网络请求问题。

### 修改的文件：

1. **vite.config.js** - 配置代理转发
2. **src/api/weather.js** - 自动使用代理（开发环境）
3. **src/utils/request.js** - 增加调试日志

---

## 🚀 立即生效步骤

### 1. 重启开发服务器（必须！）

**在终端中按 `Ctrl+C` 停止当前服务器，然后重新运行：**

```bash
npm run dev
```

### 2. 打开浏览器

访问：http://localhost:5173/

### 3. 打开开发者工具查看日志

按 `F12` 打开控制台，你会看到详细的调试信息：

```
🌐 API 配置:
  使用代理: true
  天气API: /api/weather
  地理API: /api/geo

📤 发起请求: { url: '/api/geo/city/lookup', ... }
✅ 收到响应: { status: 200, code: '200', ... }
```

---

## 🔍 工作原理

### 代理配置

**之前（直接访问，可能被代理拦截）：**
```
浏览器 → https://devapi.qweather.com/v7/weather/now
         ❌ 被代理/防火墙拦截
```

**现在（通过 Vite 代理）：**
```
浏览器 → http://localhost:5173/api/weather/weather/now
         → Vite Dev Server
         → https://devapi.qweather.com/v7/weather/now
         ✅ 成功
```

### 代理路径映射

| 前端请求路径 | 实际 API 地址 |
|------------|--------------|
| `/api/weather/weather/now` | `https://devapi.qweather.com/v7/weather/now` |
| `/api/geo/city/lookup` | `https://geoapi.qweather.com/v2/city/lookup` |

---

## 📝 检查清单

重启服务器后，请检查以下内容：

### ✅ 浏览器控制台（Console）

应该看到：
```
🌐 API 配置: { 使用代理: true, ... }
=== 环境变量配置检查 ===
API Key: xxxxxxxx...
========================
```

### ✅ 网络标签（Network）

1. 输入城市名称搜索
2. 在 Network 标签中查看请求
3. 应该看到：
   - URL: `http://localhost:5173/api/geo/city/lookup?location=北京&key=...`
   - Status: `200`
   - Response: 包含城市数据

---

## 🐛 仍然失败？检查以下内容

### 1. 确认已重启服务器

修改 `vite.config.js` 后**必须重启**才能生效！

```bash
# 停止（Ctrl+C）
# 然后重新启动
npm run dev
```

### 2. 确认 .env 文件配置

确保 `.env` 文件包含 API Key：

```env
VITE_WEATHER_KEY=你的32位API密钥
```

### 3. 检查浏览器控制台错误

按 `F12` → Console 标签，查看是否有红色错误信息。

常见错误：

**错误 1：`API Key: ❌ 未配置`**
- 解决：配置 `.env` 文件并重启服务器

**错误 2：`404 Not Found`**
- 解决：检查代理配置是否正确

**错误 3：`401 Unauthorized`**
- 解决：API Key 无效，需要重新获取

### 4. 检查网络标签详情

在 Network 标签中点击失败的请求，查看：
- **Request URL** - 应该是 `localhost` 开头
- **Status Code** - 记录状态码
- **Response** - 查看错误信息

---

## 🌐 其他解决方案

### 方案 A：使用国内镜像（如果有）

和风天气可能有国内加速节点，修改 `.env`：

```env
VITE_WEATHER_BASE_URL=https://api.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

### 方案 B：临时关闭代理软件

如果使用了代理软件（如 V2Ray、Clash），尝试临时关闭，看是否能直接访问。

### 方案 C：手动测试 API

使用浏览器或 Postman 测试 API 是否可访问：

```
https://geoapi.qweather.com/v2/city/lookup?location=北京&key=你的API密钥
```

如果无法访问，说明是网络问题，不是代码问题。

---

## 📊 配置文件说明

### vite.config.js

```javascript
export default defineConfig({
  server: {
    proxy: {
      // 拦截 /api/weather 开头的请求
      '/api/weather': {
        target: 'https://devapi.qweather.com',
        changeOrigin: true,  // 修改请求头 Origin
        secure: false,       // 忽略 SSL 证书
        rewrite: (path) => path.replace(/^\/api\/weather/, '/v7')
      },
      '/api/geo': {
        target: 'https://geoapi.qweather.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/geo/, '/v2')
      }
    }
  }
})
```

### weather.js

```javascript
// 开发环境自动使用代理
const USE_PROXY = import.meta.env.DEV;

// 根据环境选择 URL
const WEATHER_URL = USE_PROXY 
  ? '/api/weather'  // 开发环境：使用代理
  : 'https://devapi.qweather.com/v7';  // 生产环境：直接访问
```

---

## ✨ 成功标志

配置成功后，您应该能够：

1. ✅ 在搜索框输入城市名称
2. ✅ 看到下拉列表显示城市
3. ✅ 点击城市后获取天气数据
4. ✅ 控制台显示 `✅ 收到响应` 日志
5. ✅ 无红色错误信息

---

## 📞 需要帮助？

如果按照以上步骤操作后仍有问题，请提供以下信息：

1. 浏览器控制台的完整错误日志（Console 标签）
2. 失败请求的详情（Network 标签）
3. `.env` 文件是否配置（不要泄露真实 Key）
4. 是否使用了代理软件

我会根据这些信息提供进一步的解决方案。
