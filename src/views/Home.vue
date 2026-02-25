<template>
  <div :class="['qweather-dashboard', { 'is-dark': isDarkMode }]">
    <header class="top-navbar q-card">
      <div class="nav-left">
        <div class="brand-logo">
          <el-icon class="logo-icon"><PartlyCloudy /></el-icon>
          <span class="brand-name">WeatherHub</span>
        </div>
      </div>

      <div class="nav-center">
        <el-input
          v-model="searchQuery"
          @keyup.enter="handleSearch"
          placeholder="搜索全球城市 / 景点 (按回车键查询)..."
          class="global-search"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
      </div>

      <div class="nav-right">
        <el-button text round class="action-btn lang-btn" @click="toggleLang">
          {{ currentLang === "zh" ? "中 / EN" : "EN / 中" }}
        </el-button>
        <el-button circle class="action-btn" @click="toggleTheme">
          <el-icon><Moon v-if="!isDarkMode" /><Sunny v-else /></el-icon>
        </el-button>
        <div class="nav-divider"></div>
        <el-button type="primary" round class="login-btn" @click="handleLogin">
          <el-icon class="btn-icon"><User /></el-icon>
          <span>登录账户</span>
        </el-button>
      </div>
    </header>

    <main class="main-content" v-loading="loading">
      <template v-if="geoData && weatherV7 && airV1">
        <header class="q-card geo-header">
          <div class="geo-main">
            <h1 class="city-name">{{ geoData.name }}</h1>
            <div class="geo-path">
              <span>{{ geoData.adm2 }}</span>
              <span class="divider">/</span>
              <span>{{ geoData.adm1 }}</span>
              <span class="divider">/</span>
              <span>{{ geoData.country }}</span>
            </div>
          </div>
          <div class="geo-meta">
            <div class="meta-tag">
              <el-icon><Location /></el-icon>
              <span>{{ geoData.lat }}, {{ geoData.lon }}</span>
            </div>
            <div class="meta-tag">
              <el-icon><Clock /></el-icon>
              <span>时区: {{ geoData.tz }}</span>
            </div>
          </div>
        </header>

        <div class="dashboard-grid">
          <section class="q-card weather-v7-card">
            <h2 class="card-title">实时天气</h2>
            <div class="weather-hero">
              <div class="hero-left">
                <span class="temp-value">{{ weatherV7.temp }}</span>
                <span class="temp-unit">°C</span>
              </div>
              <div class="hero-right">
                <div class="weather-icon-placeholder">
                  <img
                    :src="`/icons/${weatherV7.icon}.svg`"
                    alt="icon"
                    style="width: 64px; height: 64px"
                    @error="$event.target.style.display = 'none'"
                  />
                </div>
                <span class="weather-text">{{ weatherV7.text }}</span>
              </div>
            </div>

            <div class="data-grid">
              <div class="data-item">
                <span class="d-label">体感温度</span
                ><span class="d-value">{{ weatherV7.feelsLike }}°C</span>
              </div>
              <div class="data-item">
                <span class="d-label">相对湿度</span
                ><span class="d-value">{{ weatherV7.humidity }}%</span>
              </div>
              <div class="data-item">
                <span class="d-label">风向风力</span
                ><span class="d-value"
                  >{{ weatherV7.windDir }} {{ weatherV7.windScale }}级</span
                >
              </div>
              <div class="data-item">
                <span class="d-label">降水量(1h)</span
                ><span class="d-value">{{ weatherV7.precip }} mm</span>
              </div>
              <div class="data-item">
                <span class="d-label">大气压强</span
                ><span class="d-value">{{ weatherV7.pressure }} hPa</span>
              </div>
              <div class="data-item">
                <span class="d-label">能见度</span
                ><span class="d-value">{{ weatherV7.vis }} km</span>
              </div>
              <div class="data-item">
                <span class="d-label">云量</span
                ><span class="d-value">{{ weatherV7.cloud || "0" }}%</span>
              </div>
              <div class="data-item">
                <span class="d-label">露点温度</span
                ><span class="d-value">{{ weatherV7.dew || "--" }}°C</span>
              </div>
              <div class="data-item">
                <span class="d-label">风速</span
                ><span class="d-value">{{ weatherV7.windSpeed }} km/h</span>
              </div>
            </div>
          </section>

          <section class="q-card air-v1-card">
            <h2 class="card-title">高精度空气质量 (1x1km)</h2>
            <div class="air-hero">
              <div
                class="aqi-circle"
                :style="{ backgroundColor: getAqiColor(airV1.color) }"
              >
                <span
                  class="aqi-num"
                  :style="{ color: getAqiTextColor(airV1.color) }"
                  >{{ airV1.aqi }}</span
                >
                <span
                  class="aqi-level"
                  :style="{ color: getAqiTextColor(airV1.color) }"
                  >{{ airV1.category }}</span
                >
              </div>
              <div class="air-summary">
                <p class="primary-pollutant">
                  首要污染物:
                  <strong>{{ airV1.primaryPollutant?.name || "无" }}</strong>
                </p>
                <div class="health-advice">
                  <p class="advice-title">💡 健康指引</p>
                  <p class="advice-content">
                    {{ airV1.health?.advice?.generalPopulation || "暂无指引" }}
                  </p>
                </div>
              </div>
            </div>

            <div v-if="airV1.pollutants && airV1.pollutants.length > 0">
              <h3 class="sub-title">污染物详情</h3>
              <div class="pollutant-list">
                <div
                  v-for="item in airV1.pollutants"
                  :key="item.code"
                  class="pollutant-item"
                >
                  <span class="p-name">{{ item.name }}</span>
                  <span class="p-val"
                    >{{ item.concentration.value }}
                    <small>{{ item.concentration.unit }}</small></span
                  >
                </div>
              </div>
            </div>
          </section>
        </div>
      </template>

      <div v-else class="empty-state">
        <el-icon class="empty-icon"><LocationInformation /></el-icon>
        <p class="empty-text">正在同步气象卫星数据，或请在顶部搜索城市...</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import {
  Location,
  Clock,
  Search,
  Moon,
  Sunny,
  User,
  PartlyCloudy,
  LocationInformation,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 导入 API (请确保你刚才已经按要求保存了 src/api/weather.js)
import { searchCity, getNowWeather, getAirQualityV1 } from "../api/weather";

// --- 全局状态 ---
const searchQuery = ref("");
const isDarkMode = ref(false);
const currentLang = ref("zh");
const loading = ref(false);

// --- 响应式数据源 (初始必须为 null，配合 template 里的 v-if 阻断渲染报错) ---
const geoData = ref(null);
const weatherV7 = ref(null);
const airV1 = ref(null);

// --- 核心调度：获取全量真实天气数据 ---
const fetchRealWeather = async (cityInfo) => {
  loading.value = true;

  try {
    // 1. 设置地理位置
    geoData.value = {
      name: cityInfo.name,
      adm2: cityInfo.adm2,
      adm1: cityInfo.adm1,
      country: cityInfo.country,
      lat: cityInfo.lat,
      lon: cityInfo.lon,
      tz: cityInfo.tz,
    };

    // 2. 请求核心天气 (V7)
    const nowRes = await getNowWeather(cityInfo.id);
    if (nowRes.code === "200") {
      weatherV7.value = nowRes.now;
    }

    // 3. 请求高精度空气质量 (V1)
    try {
      const airRes = await getAirQualityV1(cityInfo.lat, cityInfo.lon);
      if (airRes.indexes && airRes.indexes.length > 0) {
        const primaryIndex = airRes.indexes[0];
        airV1.value = {
          aqi: primaryIndex.aqiDisplay,
          category: primaryIndex.category,
          color: primaryIndex.color,
          primaryPollutant: primaryIndex.primaryPollutant || { name: "无" },
          health: primaryIndex.health || {
            advice: { generalPopulation: "暂无健康建议" },
          },
          pollutants: airRes.pollutants || [],
        };
      }
    } catch (airErr) {
      console.warn("空气质量数据加载失败", airErr);
      // 优雅降级
      airV1.value = {
        aqi: "--",
        category: "未知",
        color: null,
        primaryPollutant: { name: "--" },
        health: { advice: { generalPopulation: "当前无高级空气数据权限。" } },
        pollutants: [],
      };
    }

    ElMessage.success(`${cityInfo.name} 天气数据已更新`);
  } catch (error) {
    console.error("数据获取失败:", error);
    ElMessage.error("天气数据获取失败，请检查网络");
  } finally {
    loading.value = false;
  }
};

// --- 搜索交互逻辑 ---
const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    ElMessage.warning("请输入要搜索的城市");
    return;
  }

  loading.value = true;
  try {
    const geoRes = await searchCity(searchQuery.value);

    if (
      geoRes.code === "200" &&
      geoRes.location &&
      geoRes.location.length > 0
    ) {
      const targetCity = geoRes.location[0];
      await fetchRealWeather(targetCity);
      searchQuery.value = ""; // 搜索成功后清空输入框
    } else {
      ElMessage.warning("未找到该城市，请尝试输入拼音或更准确的名字");
    }
  } catch (error) {
    ElMessage.error("搜索城市服务异常");
  } finally {
    loading.value = false;
  }
};

// --- 页面初始化：默认加载北京 ---
onMounted(() => {
  const defaultCity = {
    id: "101010100",
    name: "北京",
    adm2: "北京",
    adm1: "北京市",
    country: "中国",
    lat: "39.90",
    lon: "116.40",
    tz: "Asia/Shanghai",
  };
  fetchRealWeather(defaultCity);
});

// --- 颜色处理与杂项 ---
const getAqiColor = (colorObj) => {
  return colorObj
    ? `rgba(${colorObj.red}, ${colorObj.green}, ${colorObj.blue}, 0.15)`
    : "#f3f4f6";
};
const getAqiTextColor = (colorObj) => {
  // 简易的文本颜色加深处理，保证在浅色背景上能看清
  return colorObj
    ? `rgb(${Math.max(0, colorObj.red - 50)}, ${Math.max(
        0,
        colorObj.green - 50
      )}, ${Math.max(0, colorObj.blue - 50)})`
    : "#374151";
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  ElMessage.success(isDarkMode.value ? "已切换至夜间模式" : "已切换至白天模式");
};
const toggleLang = () => {
  currentLang.value = currentLang.value === "zh" ? "en" : "zh";
  ElMessage.info("语言切换功能已触发");
};
const handleLogin = () => {
  ElMessage.warning("即将跳转至登录页面...");
};
</script>

<style scoped>
/* ==========================================
   全局变量与基础样式
   ========================================== */
.qweather-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif;
  color: #1f2937;
  background-color: #f3f4f6;
  min-height: 100vh;
  transition: background-color 0.3s ease;
}

.main-content {
  min-height: 400px;
  position: relative;
}

/* 统一的卡片风格 */
.q-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.03);
  border: 1px solid #f3f4f6;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.q-card:hover {
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.06);
}

/* ==========================================
   1. 顶部导航栏
   ========================================== */
.top-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 32px;
  margin-bottom: 24px;
}
.nav-left {
  flex: 1;
  display: flex;
  align-items: center;
}
.brand-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
.logo-icon {
  font-size: 28px;
  color: #2563eb;
}
.brand-name {
  font-size: 20px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #111827;
}
.nav-center {
  flex: 2;
  display: flex;
  justify-content: center;
}
.global-search {
  max-width: 480px;
  width: 100%;
}
.global-search :deep(.el-input__wrapper) {
  border-radius: 20px;
  background-color: #f9fafb;
  box-shadow: none;
  border: 1px solid transparent;
  padding: 4px 16px;
}
.global-search :deep(.el-input__wrapper.is-focus) {
  background-color: #ffffff;
  border: 1px solid #bfdbfe;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
.nav-right {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}
.action-btn {
  color: #4b5563;
}
.action-btn:hover {
  background-color: #f3f4f6;
  color: #111827;
}
.lang-btn {
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
}
.nav-divider {
  width: 1px;
  height: 20px;
  background-color: #e5e7eb;
  margin: 0 8px;
}
.login-btn {
  font-weight: 600;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* ==========================================
   2. Geo 头部信息
   ========================================== */
.geo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px 32px;
}
.city-name {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 800;
}
.geo-path {
  font-size: 14px;
  color: #6b7280;
}
.divider {
  margin: 0 8px;
  color: #d1d5db;
}
.geo-meta {
  display: flex;
  gap: 20px;
}
.meta-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f9fafb;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #4b5563;
}

/* ==========================================
   3. 核心网格布局
   ========================================== */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}
@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1.2fr 1fr;
  }
}
.card-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin-top: 0;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f3f4f6;
}

/* 天气 V7 九宫格 */
.weather-hero {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 32px;
}
.hero-left {
  position: relative;
}
.temp-value {
  font-size: 80px;
  font-weight: 800;
  line-height: 1;
  color: #111827;
}
.temp-unit {
  font-size: 24px;
  font-weight: 600;
  color: #6b7280;
  position: absolute;
  top: 8px;
  right: -28px;
}
.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.weather-text {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-top: 8px;
}
.data-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.data-item {
  background: #f9fafb;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.d-label {
  font-size: 13px;
  color: #6b7280;
}
.d-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

/* 空气 V1 卡片 */
.air-hero {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}
.aqi-circle {
  flex-shrink: 0;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 4px solid #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.aqi-num {
  font-size: 36px;
  font-weight: 800;
  line-height: 1;
}
.aqi-level {
  font-size: 14px;
  font-weight: 600;
  margin-top: 4px;
}
.air-summary {
  flex: 1;
}
.primary-pollutant {
  font-size: 15px;
  color: #374151;
  margin: 0 0 12px 0;
}
.health-advice {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #f1f5f9;
}
.advice-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 700;
  color: #475569;
}
.advice-content {
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #475569;
}
.sub-title {
  font-size: 14px;
  font-weight: 600;
  color: #9ca3af;
  margin-bottom: 16px;
}
.pollutant-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pollutant-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #f3f4f6;
}
.p-name {
  font-weight: 600;
  color: #4b5563;
  font-size: 14px;
}
.p-val {
  font-weight: 700;
  color: #111827;
}
.p-val small {
  color: #9ca3af;
  font-weight: normal;
  margin-left: 4px;
}

/* ==========================================
   4. 空状态 (加载中或无数据)
   ========================================== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #9ca3af;
}
.empty-icon {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}
.empty-text {
  font-size: 16px;
  font-weight: 500;
}
</style>