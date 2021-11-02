import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Configured as per https://github.com/vitejs/vite/issues/1149#issuecomment-857686209
export default defineConfig(({ mode }) => {
  // Get all env variables
  const env = loadEnv(mode, process.cwd())

  // expose .env as process.env instead of import.meta since jest does not import meta yet
  const envWithProcessPrefix = Object.entries(env).reduce(
    (prev, [key, val]) => {
      return {
        ...prev,
        ['process.env.' + key]: `"${val}"`,
      }
    },
    {},
  );

  // Final config returned
  return {
    plugins: [react()],
    define: envWithProcessPrefix
  }
})
