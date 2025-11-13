import { Routes, Route, Navigate } from 'react-router-dom'
import './styles/theme.css'
import Dashboard from './pages/Dashboard.jsx'
import Customers from './pages/Customers.jsx'
import Classes from './pages/Classes.jsx'
import Finance from './pages/Finance.jsx'
import Courses from './pages/Courses.jsx'
import Chat from './pages/Chat.jsx'
import Messages from './pages/Messages.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/finance" element={<Finance />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
