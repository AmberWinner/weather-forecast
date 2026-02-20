import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  console.log('========== 代理配置 ==========')
  console.log('WEATHER 代理前缀:', env.VITE_WEATHER_BASE_URL)
  console.log('WEATHER 目标地址:', env.VITE_WEATHER_TARGET)
  console.log('GEO     代理前缀:', env.VITE_GEO_BASE_URL)
  console.log('GEO     目标地址:', env.VITE_GEO_TARGET)
  console.log('===============================')

  return {
    plugins: [vue()],
    server: {
      proxy: {
        [env.VITE_WEATHER_BASE_URL]: {
          target: env.VITE_WEATHER_TARGET,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(
              new RegExp(`^${env.VITE_WEATHER_BASE_URL}`), ''
            )
            console.log(`[Weather代理] ${path} → ${env.VITE_WEATHER_TARGET}${newPath}`)
            return newPath
          }
        },
        [env.VITE_GEO_BASE_URL]: {
          target: env.VITE_GEO_TARGET,
          changeOrigin: true,
          rewrite: (path) => {
            const newPath = path.replace(
              new RegExp(`^${env.VITE_GEO_BASE_URL}`), ''
            )
            console.log(`[Geo代理] ${path} → ${env.VITE_GEO_TARGET}${newPath}`)
            return newPath
          }
        }
      }
    }
  }
})
