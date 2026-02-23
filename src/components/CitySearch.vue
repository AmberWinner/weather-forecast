<template>
  <div class="city-search">
    <!-- 搜索输入框 -->
    <div class="search-box">
      <el-input
        v-model="searchQuery"
        placeholder="请输入城市名称或拼音"
        clearable
        @input="handleSearch"
        @clear="handleClear"
        :prefix-icon="Search"
        size="large"
      >
        <template #suffix>
          <el-icon v-if="loading" class="is-loading">
            <Loading />
          </el-icon>
        </template>
      </el-input>

      <!-- 搜索结果下拉列表 -->
      <div
        v-if="showResults && searchResults.length > 0"
        class="search-results"
      >
        <div
          v-for="city in searchResults"
          :key="city.id"
          class="result-item"
          @click="selectCity(city)"
        >
          <div class="city-info">
            <span class="city-name">{{ city.name }}</span>
            <span class="city-detail">
              {{ city.adm2 }} {{ city.adm1 }} {{ city.country }}
            </span>
          </div>
          <el-icon class="arrow-icon"><ArrowRight /></el-icon>
        </div>
      </div>

      <!-- 无搜索结果提示 -->
      <div
        v-if="
          showResults && searchQuery && searchResults.length === 0 && !loading
        "
        class="no-results"
      >
        <el-empty description="未找到相关城市" :image-size="60" />
      </div>
    </div>

    <!-- 热门城市 -->
    <div class="hot-cities">
      <div class="hot-cities-title">
        <el-icon><LocationFilled /></el-icon>
        <span>热门城市</span>
      </div>
      <div class="hot-cities-list">
        <el-button
          v-for="city in hotCities"
          :key="city.id"
          @click="selectHotCity(city)"
          plain
          round
        >
          {{ city.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from "vue";
import { getCityId } from "../api/weather";
import {
  Search,
  Loading,
  ArrowRight,
  LocationFilled,
} from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";

// 定义 emit 事件
const emit = defineEmits(["citySelected"]);

// 搜索相关状态
const searchQuery = ref("");
const searchResults = ref([]);
const showResults = ref(false);
const loading = ref(false);

// 防抖定时器
let debounceTimer = null;

// 热门城市列表（预设的LocationID）
const hotCities = ref([
  {
    id: "101010100",
    name: "北京",
    lat: "39.90499",
    lon: "116.40529",
    adm1: "北京市",
    adm2: "北京",
    country: "中国",
  },
  {
    id: "101020100",
    name: "上海",
    lat: "31.23171",
    lon: "121.47264",
    adm1: "上海市",
    adm2: "上海",
    country: "中国",
  },
  {
    id: "101280101",
    name: "广州",
    lat: "23.12517",
    lon: "113.28064",
    adm1: "广东省",
    adm2: "广州",
    country: "中国",
  },
  {
    id: "101280601",
    name: "深圳",
    lat: "22.54700",
    lon: "114.08595",
    adm1: "广东省",
    adm2: "深圳",
    country: "中国",
  },
]);

/**
 * 处理搜索输入（带防抖）
 */
const handleSearch = () => {
  // 清除之前的定时器
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // 如果输入为空，清空结果
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    showResults.value = false;
    return;
  }

  // 设置新的防抖定时器（500ms）
  debounceTimer = setTimeout(async () => {
    await fetchCities(searchQuery.value);
  }, 500);
};

/**
 * 调用 GeoAPI 搜索城市
 */
const fetchCities = async (query) => {
  if (!query.trim()) return;

  loading.value = true;
  try {
    const response = await getCityId(query);

    // 和风天气返回格式：{ code: '200', location: [...] }
    if (response.code === "200" && response.location) {
      searchResults.value = response.location.map((item) => ({
        id: item.id, // LocationID
        name: item.name, // 城市名称
        lat: item.lat, // 纬度
        lon: item.lon, // 经度
        adm1: item.adm1, // 一级行政区（省/州）
        adm2: item.adm2, // 二级行政区（市）
        country: item.country, // 国家
      }));
      showResults.value = true;
    } else {
      searchResults.value = [];
      showResults.value = false;
    }
  } catch (error) {
    console.error("城市搜索失败:", error);
    ElMessage.error("城市搜索失败，请稍后重试");
    searchResults.value = [];
    showResults.value = false;
  } finally {
    loading.value = false;
  }
};

/**
 * 选择搜索结果中的城市
 */
const selectCity = (city) => {
  // 发送选中的城市信息给父组件
  emit("citySelected", {
    id: city.id,
    name: city.name,
    lat: city.lat,
    lon: city.lon,
    adm1: city.adm1,
    adm2: city.adm2,
    country: city.country,
  });

  // 更新输入框显示
  searchQuery.value = `${city.name} ${city.adm2}`;

  // 隐藏下拉列表
  showResults.value = false;

  ElMessage.success(`已选择：${city.name}`);
};

/**
 * 选择热门城市
 */
const selectHotCity = (city) => {
  emit("citySelected", {
    id: city.id,
    name: city.name,
    lat: city.lat,
    lon: city.lon,
    adm1: city.adm1,
    adm2: city.adm2,
    country: city.country,
  });

  searchQuery.value = city.name;
  showResults.value = false;

  ElMessage.success(`已选择：${city.name}`);
};

/**
 * 清空搜索
 */
const handleClear = () => {
  searchResults.value = [];
  showResults.value = false;
};

// 点击组件外部关闭下拉列表
const closeResults = () => {
  showResults.value = false;
};

// 暴露方法给父组件（可选）
defineExpose({
  closeResults,
});
</script>

<style scoped>
.city-search {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.result-item:last-child {
  border-bottom: none;
}

.result-item:hover {
  background-color: #f5f7fa;
}

.city-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.city-name {
  font-size: 16px;
  font-weight: 500;
  color: #303133;
}

.city-detail {
  font-size: 13px;
  color: #909399;
}

.arrow-icon {
  color: #c0c4cc;
  font-size: 14px;
}

.no-results {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1000;
}

.is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 热门城市样式 */
.hot-cities {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 12px;
}

.hot-cities-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 15px;
  font-weight: 500;
  color: #606266;
}

.hot-cities-title .el-icon {
  color: #409eff;
  font-size: 18px;
}

.hot-cities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.hot-cities-list .el-button {
  min-width: 80px;
  font-size: 14px;
}

/* 滚动条样式 */
.search-results::-webkit-scrollbar {
  width: 6px;
}

.search-results::-webkit-scrollbar-thumb {
  background-color: #dcdfe6;
  border-radius: 3px;
}

.search-results::-webkit-scrollbar-thumb:hover {
  background-color: #c0c4cc;
}
</style>
