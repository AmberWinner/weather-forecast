import { defineStore } from 'pinia';

const STORAGE_KEY = 'wf_user';

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(state) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        token: state.token,
        profile: state.profile
      })
    );
  } catch {
    // ignore
  }
}

export const useUserStore = defineStore('user', {
  state: () => {
    const saved = loadPersisted();
    return {
      token: saved?.token || '',
      profile: saved?.profile || null
    };
  },
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async login(profile) {
      // 骨架：用一个假 token 表示已登录，后续替换为真实接口
      this.token = `demo_${Date.now()}`;
      this.profile = {
        username: profile?.username || 'user'
      };
      persist(this);
    },
    logout() {
      this.token = '';
      this.profile = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
  }
});

