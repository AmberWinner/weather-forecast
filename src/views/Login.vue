<template>
  <div class="min-h-screen bg-slate-50">
    <div class="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
      <div class="mb-8 text-center">
        <div class="text-2xl font-semibold text-slate-900">天气预报</div>
        <div class="mt-2 text-sm text-slate-600">登录后可保存收藏城市与偏好设置</div>
      </div>

      <el-card shadow="never" class="rounded-2xl">
        <el-tabs v-model="activeTab" class="login-tabs">
          <el-tab-pane label="登录" name="login" />
          <el-tab-pane label="注册" name="register" />
        </el-tabs>

        <el-form
          :model="form"
          label-position="top"
          class="mt-4"
          @submit.prevent
        >
          <el-form-item label="账号">
            <el-input v-model="form.username" placeholder="请输入账号" autocomplete="username" />
          </el-form-item>

          <el-form-item label="密码">
            <el-input
              v-model="form.password"
              type="password"
              show-password
              placeholder="请输入密码"
              autocomplete="current-password"
            />
          </el-form-item>

          <el-form-item v-if="activeTab === 'register'" label="确认密码">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              show-password
              placeholder="请再次输入密码"
              autocomplete="new-password"
            />
          </el-form-item>

          <el-button
            class="w-full"
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
          >
            {{ activeTab === 'login' ? '登录' : '注册' }}
          </el-button>

          <div class="mt-4 text-center text-xs text-slate-500">
            这是骨架页面：先把路由与 Store 跑通，后续再接真实后端。
          </div>
        </el-form>
      </el-card>

      <div class="mt-6 text-center">
        <el-button text @click="goHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '../stores/user';

const router = useRouter();
const userStore = useUserStore();

const activeTab = ref('login');
const submitting = ref(false);

const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const goHome = () => router.push('/');

const handleSubmit = async () => {
  if (!form.username.trim() || !form.password) {
    ElMessage.warning('请填写账号和密码');
    return;
  }

  if (activeTab.value === 'register' && form.password !== form.confirmPassword) {
    ElMessage.warning('两次密码不一致');
    return;
  }

  submitting.value = true;
  try {
    // 骨架：模拟登录/注册成功
    await userStore.login({
      username: form.username.trim()
    });
    ElMessage.success(activeTab.value === 'login' ? '登录成功' : '注册成功');
    router.replace('/');
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.login-tabs :deep(.el-tabs__header) {
  margin: 0;
}
</style>
