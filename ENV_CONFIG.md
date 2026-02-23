# 环境变量配置说明

## 📝 重要：配置 .env 文件

项目需要配置和风天气 API 才能正常运行。请按以下步骤操作：

### 第一步：检查 .env 文件

在项目根目录下检查是否有 `.env` 文件，内容应该如下：

```env
# 和风天气 API Key
VITE_WEATHER_KEY=你的和风天气API密钥

# 和风天气 API 地址
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

### 第二步：获取免费 API Key

1. 访问和风天气开发平台：https://dev.qweather.com/
2. 注册账号（免费）
3. 登录后进入"控制台" → "应用管理" → "创建应用"
4. 选择 **Web API** 类型
5. 选择 **免费订阅**（每天 1000 次请求免费）
6. 复制生成的 **API Key**

### 第三步：配置 .env 文件

将获取到的 API Key 填入 `.env` 文件：

```env
VITE_WEATHER_KEY=你复制的32位API密钥
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

**示例：**
```env
VITE_WEATHER_KEY=abc123def456ghi789jkl012mno345pq
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

### 第四步：重启开发服务器

修改 `.env` 文件后，**必须重启开发服务器**才能生效：

```bash
# 按 Ctrl+C 停止当前服务器
# 然后重新启动
npm run dev
```

---

## 🔍 检查配置是否正确

### 方法 1：打开浏览器控制台

1. 打开页面 http://localhost:5175/
2. 按 `F12` 打开开发者工具
3. 切换到 **Console（控制台）** 标签
4. 输入以下命令检查环境变量：

```javascript
console.log('API Key:', import.meta.env.VITE_WEATHER_KEY);
console.log('Weather URL:', import.meta.env.VITE_WEATHER_BASE_URL);
console.log('Geo URL:', import.meta.env.VITE_GEO_BASE_URL);
```

如果显示 `undefined`，说明环境变量没有正确加载。

### 方法 2：查看网络请求

1. 在开发者工具中切换到 **Network（网络）** 标签
2. 输入城市名称搜索
3. 查看网络请求：
   - ✅ 如果请求成功，状态码应该是 `200`
   - ❌ 如果显示 `401` 或 `403`，说明 API Key 无效
   - ❌ 如果显示 `404`，说明 API URL 配置错误
   - ❌ 如果显示 `CORS error`，说明跨域问题（正常不应该出现）

---

## 🐛 常见错误排查

### 错误 1："网络请求失败，请检查网络"

**可能原因：**
- `.env` 文件不存在或配置错误
- `VITE_WEATHER_KEY` 没有配置或无效
- 修改 `.env` 后没有重启服务器

**解决方法：**
1. 检查 `.env` 文件是否存在于项目根目录
2. 检查 API Key 是否正确填写（32 位字符串）
3. 重启开发服务器（`Ctrl+C` 后重新 `npm run dev`）

### 错误 2："数据加载失败: 401"

**可能原因：**
- API Key 无效或过期
- API Key 未激活

**解决方法：**
1. 登录和风天气控制台，检查 API Key 状态
2. 确认 API Key 类型是 **Web API**
3. 如果 Key 过期，创建新的 Key

### 错误 3："数据加载失败: 403"

**可能原因：**
- 超出免费额度（每天 1000 次）
- IP 被限制

**解决方法：**
1. 检查今日请求次数
2. 等待第二天重置
3. 或升级到付费版本

### 错误 4："undefined/city/lookup"

**可能原因：**
- `VITE_GEO_BASE_URL` 没有配置

**解决方法：**
确保 `.env` 文件包含：
```env
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

---

## 📋 完整的 .env 文件模板

复制以下内容到项目根目录的 `.env` 文件：

```env
# ========================================
# 和风天气 API 配置
# ========================================

# API Key（必填）
# 从 https://dev.qweather.com/ 获取
VITE_WEATHER_KEY=

# 天气数据 API 地址（必填）
VITE_WEATHER_BASE_URL=https://devapi.qweather.com/v7

# 地理位置 API 地址（必填）
VITE_GEO_BASE_URL=https://geoapi.qweather.com/v2
```

---

## ✅ 验证配置成功

配置正确后，您应该能够：

1. 在搜索框输入城市名称（如"北京"）
2. 看到下拉列表显示匹配的城市
3. 点击城市后获取天气信息
4. 无错误提示

---

## 📞 仍有问题？

如果按照以上步骤操作后仍有问题，请：

1. 打开浏览器开发者工具（F12）
2. 切换到 Console 标签
3. 复制所有错误信息
4. 检查 Network 标签中失败的请求详情

这样可以更准确地定位问题。
