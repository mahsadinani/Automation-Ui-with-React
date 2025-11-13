import axios from 'axios'

const WEBHOOK_URL = 'https://33499-il9bs.irann8n.com/webhook/d6c0caeb-ad18-4f00-8872-c41d10ee7349'

export async function sendLeadToAutomation(payload) {
  try {
    const res = await axios.post(WEBHOOK_URL, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    return { ok: true, data: res.data }
  } catch (err) {
    return { ok: false, error: err.response?.data || err.message }
  }
}
