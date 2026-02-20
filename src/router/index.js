import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '天气预报'
    }
  },
  // 可以添加更多路由
  // {
  //   path: '/forecast',
  //   name: 'Forecast',
  //   component: () => import('../views/Forecast.vue'),
  //   meta: {
  //     title: '天气预报详情'
  //   }
  // }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  next();
});

export default router;
