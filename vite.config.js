import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Serves POST /api/chat during `npm run dev` and `npm run preview`.
// The Groq key comes from .env.local and stays on the server.
function chatApi(env) {
  const mount = (server) => {
    server.middlewares.use('/api/chat', async (req, res) => {
      const { nodeHandler } = await import('./server/chat-core.js')
      await nodeHandler(req, res, env)
    })
  }
  return { name: 'stepup-chat-api', configureServer: mount, configurePreviewServer: mount }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), chatApi(env)],
  }
})
