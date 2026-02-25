<template>
  <div class="login-wrapper">
    <div class="bg-layer">
      <img src="/src/image/login_img.avif" alt="background" />
      <div class="bg-overlay"></div>
    </div>

    <div class="content-container">
      <div class="brand-header">
        <span class="brand-name">WeatherHub</span>
      </div>

      <div class="glass-card">
        <h2 class="card-title">Sign in to your account</h2>

        <el-form :model="loginForm" label-position="top" class="login-form">
          <el-form-item label="Your email">
            <el-input
              v-model="loginForm.username"
              placeholder="name@company.com"
            />
          </el-form-item>

          <el-form-item label="Password">
            <el-input
              v-model="loginForm.password"
              type="password"
              show-password
              placeholder="••••••••"
            />
          </el-form-item>

          <div class="form-footer">
            <el-checkbox v-model="loginForm.remember" label="Remember me" />
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>

          <el-button
            type="primary"
            @click="handleLogin"
            :loading="loading"
            class="submit-btn"
          >
            Log in to your account
          </el-button>

          <p class="signup-prompt">
            Don't have an account?
            <a href="#">Create an account</a>
          </p>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Sunny } from "@element-plus/icons-vue";
import { useUserStore } from "../stores/user";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

const userStore = useUserStore();
const router = useRouter();
const loading = ref(false);
const loginForm = ref({ username: "", password: "", remember: false });

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning("请填写完整信息");
    return;
  }
  loading.value = true;
  try {
    await userStore.login(loginForm.value);
    ElMessage.success({ message: "欢迎回来", customClass: "glass-message" });
    router.push("/");
  } catch (error) {
    ElMessage.error("登录失败");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  overflow: hidden;
}

.bg-layer {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.bg-layer img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bg-overlay {
  position: absolute;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6); /* slate-900/60 */
  backdrop-filter: brightness(0.75);
}

.content-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 32rem;
}

.brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  margin-bottom: 3.5rem;
}

.brand-name {
  font-size: 2.25rem;
  font-weight: 700;
  color: white;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* 5. 磨砂玻璃卡片核心 */
.glass-card {
  backdrop-filter: blur(24px); /* blur-xl */
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
  padding: 2.5rem; /* p-10 */
}
@media (min-width: 768px) {
  .glass-card {
    padding: 3.5rem;
  } /* md:p-14 */
}

.card-title {
  font-size: 1.875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 3rem;
  text-align: center;
  letter-spacing: -0.025em;
}

/* 6. 深度修改 Element Plus 样式 */
.login-form :deep(.el-form-item__label) {
  color: rgba(255, 255, 255, 0.8) !important;
  font-weight: 400 !important;
  font-size: 1rem !important;
  padding-bottom: 0.5rem !important;
}

.login-form :deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.05) !important;
  border: 1px solid rgba(255, 255, 255, 0.1) !important;
  box-shadow: none !important;
  border-radius: 0.75rem !important;
  padding: 0.875rem 1.25rem !important;
}

.login-form :deep(.el-input__inner) {
  color: white !important;
  font-size: 1.125rem !important;
}

.login-form :deep(.el-input__inner::placeholder) {
  color: rgba(255, 255, 255, 0.3) !important;
}

.login-form :deep(.el-input__wrapper.is-focus) {
  border-color: rgba(59, 130, 246, 0.5) !important;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2) !important;
}

/* 7. 辅助功能区域 */
.form-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
}
.forgot-link {
  font-size: 1rem;
  font-weight: 500;
  color: #60a5fa;
  text-decoration: none;
  transition: color 0.2s;
}
.forgot-link:hover {
  color: #93c5fd;
}

.login-form :deep(.el-checkbox__label) {
  color: rgba(255, 255, 255, 0.6) !important;
  font-size: 1rem !important;
}

/* 8. 登录按钮 */
.submit-btn {
  width: 100% !important;
  height: 4rem !important;
  font-size: 1.125rem !important;
  font-weight: 700 !important;
  background-color: #2563eb !important;
  border: none !important;
  border-radius: 0.75rem !important;
  margin-top: 1rem !important;
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
  transition: all 0.2s !important;
}
.submit-btn:hover {
  background-color: #3b82f6 !important;
  transform: translateY(-1px);
}
.submit-btn:active {
  transform: scale(0.98);
}

/* 9. 底部提示 */
.signup-prompt {
  font-size: 1rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  margin-top: 2.5rem;
}
.signup-prompt a {
  color: #60a5fa;
  font-weight: 500;
  text-decoration: none;
}
.signup-prompt a:hover {
  text-decoration: underline;
}
</style>