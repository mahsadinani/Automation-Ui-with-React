import ChatBot from '../components/ChatBot'

export default function Chat() {
  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>چت‌بات</h2>
      <ChatBot systemPrompt="You help users trigger and manage tasks in our n8n automation based on user intent. Ask clarifying questions when needed and output concise steps." />
    </div>
  )
}
