// Vercel serverless function: POST /api/chat
// Set GROQ_API_KEY (and optionally GROQ_MODEL) in the Vercel project's environment variables.
import { nodeHandler } from '../server/chat-core.js'

export default function handler(req, res) {
  return nodeHandler(req, res, process.env)
}
