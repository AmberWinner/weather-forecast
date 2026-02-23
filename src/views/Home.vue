<template>
  <div class="home-container">
    <div class="header">
      <h1 class="title">
        <el-icon><Sunny /></el-icon>
        天气预报
      </h1>
      <p class="subtitle">实时天气 · 精准预报</p>
    </div>

    <!-- 城市搜索组件 -->
    <div class="search-section">
      <CitySearch @citySelected="handleCitySelected" />
    </div>

    <!-- 当前选中城市信息 -->
    <div v-if="selectedCity" class="current-city">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Location /></el-icon>
            <span>当前城市</span>
          </div>
        </template>
        <div class="city-details">
          <div class="detail-item">
            <span class="label">城市名称：</span>
            <span class="value">{{ selectedCity.name }}</span>
          </div>
          <div class="detail-item">
            <span class="label">LocationID：</span>
            <span class="value">{{ selectedCity.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">经纬度：</span>
            <span class="value"
              >{{ selectedCity.lat }}, {{ selectedCity.lon }}</span
            >
          </div>
          <div class="detail-item">
            <span class="label">行政区：</span>
            <span class="value"
              >{{ selectedCity.adm1 }} / {{ selectedCity.adm2 }}</span
            >
          </div>
        </div>

        <!-- 获取天气按钮 -->
        <el-button
          type="primary"
          @click="fetchWeather"
          :loading="weatherLoading"
          style="width: 100%; margin-top: 16px"
        >
          获取天气信息
        </el-button>
      </el-card>
    </div>

    <!-- 天气信息展示区域 -->
    <div v-if="weatherData" class="weather-section">
      <el-card shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><Cloudy /></el-icon>
            <span>实时天气</span>
          </div>
        </template>
        <div class="weather-info">
          <div class="temp-display">
            <span class="temp">{{ weatherData.temp }}°C</span>
            <span class="weather-text">{{ weatherData.text }}</span>
          </div>
          <div class="weather-details">
            <div class="detail-row">
              <span>体感温度：{{ weatherData.feelsLike }}°C</span>
              <span>风向：{{ weatherData.windDir }}</span>
            </div>
            <div class="detail-row">
              <span>相对湿度：{{ weatherData.humidity }}%</span>
              <span>降水量：{{ weatherData.precip }}mm</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import CitySearch from "../components/CitySearch.vue";
import { getNowWeather } from "../api/weather";
import { Sunny, Location, Cloudy } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useWeatherStore } from "../stores/weather";

const weatherStore = useWeatherStore();

// 选中的城市信息（从 store 读取，便于全局共享）
const selectedCity = computed(() => weatherStore.currentCity);

// 天气数据
const weatherData = ref(null);
const weatherLoading = ref(false);

/**
 * 处理城市选择事件
 * @param {Object} city - 城市信息对象
 */
const handleCitySelected = (city) => {
  console.log("选中的城市：", city);
  weatherStore.setCity(city);

  // 自动获取天气（可选，也可以让用户手动点击按钮获取）
  fetchWeather();
};

/**
 * 获取天气信息
 */
const fetchWeather = async () => {
  if (!selectedCity.value) {
    ElMessage.warning("请先选择城市");
    return;
  }

  const cached = weatherStore.getNowWeather(selectedCity.value.id);
  if (cached) {
    weatherData.value = {
      temp: cached.temp,
      feelsLike: cached.feelsLike,
      text: cached.text,
      windDir: cached.windDir,
      humidity: cached.humidity,
      precip: cached.precip,
    };
    return;
  }

  weatherLoading.value = true;
  try {
    const response = await getNowWeather(selectedCity.value.id);

    if (response.code === "200" && response.now) {
      weatherStore.setNowWeather(selectedCity.value.id, response.now);
      weatherData.value = {
        temp: response.now.temp, // 温度
        feelsLike: response.now.feelsLike, // 体感温度
        text: response.now.text, // 天气状况
        windDir: response.now.windDir, // 风向
        humidity: response.now.humidity, // 相对湿度
        precip: response.now.precip, // 降水量
      };
      ElMessage.success("天气信息获取成功");
    } else {
      ElMessage.error("天气信息获取失败");
    }
  } catch (error) {
    console.error("获取天气失败：", error);
    ElMessage.error("获取天气失败，请稍后重试");
  } finally {
    weatherLoading.value = false;
  }
};
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  padding: 40px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
}

.title .el-icon {
  font-size: 52px;
}

.subtitle {
  font-size: 18px;
  opacity: 0.9;
  margin: 0;
}

.search-section {
  max-width: 600px;
  margin: 0 auto 32px;
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.current-city,
.weather-section {
  max-width: 600px;
  margin: 0 auto 24px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 16px;
}

.city-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #909399;
  font-size: 14px;
}

.value {
  color: #303133;
  font-weight: 500;
  font-size: 14px;
}

.weather-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.temp-display {
  text-align: center;
  padding: 20px 0;
  border-bottom: 2px solid #f0f0f0;
}

.temp {
  display: block;
  font-size: 56px;
  font-weight: 700;
  color: #409eff;
  line-height: 1;
  margin-bottom: 8px;
}

.weather-text {
  font-size: 20px;
  color: #606266;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-around;
  padding: 8px 0;
  font-size: 14px;
  color: #606266;
}
</style>
