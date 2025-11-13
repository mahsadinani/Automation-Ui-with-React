import { useState } from 'react'

export default function ChatBot({ systemPrompt = 'You are an assistant for n8n automation tasks.' }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  const sendMessage = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input.trim() }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: systemPrompt }, ...messages, userMsg],
          temperature: 0.2,
        }),
      })
      const data = await resp.json()
      const content = data?.choices?.[0]?.message?.content || 'پاسخی دریافت نشد.'
      setMessages(m => [...m, { role: 'assistant', content }])
    } catch (e) {
      setMessages(m => [...m, { role: 'assistant', content: 'خطا در ارتباط با OpenAI: ' + e.message }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">چت‌بات اتوماسیون</div>
      <div className="card-body">
        <div className="chat-box">
          <div className="chat-messages">
            {messages.map((m, i) => (
              <div key={i} style={{ textAlign: m.role === 'assistant' ? 'left' : 'right' }}>
                <span style={{ fontWeight: 600 }}>{m.role === 'assistant' ? 'بات' : 'شما'}:</span> {m.content}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <input className="form-control" placeholder="پیام خود را وارد کنید" value={input} onChange={e => setInput(e.target.value)} />
            <button className="btn btn-accent" onClick={sendMessage} disabled={loading}>{loading ? 'در حال ارسال...' : 'ارسال'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
