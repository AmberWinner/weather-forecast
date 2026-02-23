import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [vue(), tailwindcss(),],
    server: {
      proxy: {
        [env.VITE_WEATHER_BASE_URL]: {
          target: env.VITE_WEATHER_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(
            new RegExp(`^${env.VITE_WEATHER_BASE_URL}`), ''
          )
        },
        [env.VITE_GEO_BASE_URL]: {
          target: env.VITE_GEO_TARGET,
          changeOrigin: true,
          rewrite: (path) => path.replace(
            new RegExp(`^${env.VITE_GEO_BASE_URL}`), ''
          )
        }
      }
    }
  }
})
