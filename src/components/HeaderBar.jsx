import { Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

export default function HeaderBar() {
  const loc = useLocation()
  useEffect(() => {
    const body = document.body
    const saved = localStorage.getItem('theme') || 'light'
    body.classList.toggle('theme-dark', saved === 'dark')
    body.classList.toggle('theme-light', saved !== 'dark')
  }, [loc.pathname])

  const toggleTheme = () => {
    const body = document.body
    const isDark = body.classList.contains('theme-dark')
    body.classList.toggle('theme-dark', !isDark)
    body.classList.toggle('theme-light', isDark)
    localStorage.setItem('theme', !isDark ? 'dark' : 'light')
  }

  return (
    <header className="navbar">
      <div className="nav-links">
        <Link className="nav-link" to="/dashboard">داشبورد</Link>
        <Link className="nav-link" to="/customers">مشتریان</Link>
        <Link className="nav-link" to="/classes">کلاس‌ها</Link>
        <Link className="nav-link" to="/courses">لیست دوره‌ها</Link>
        <Link className="nav-link" to="/finance">مالی</Link>
        <Link className="nav-link" to="/students">لیست شاگردان</Link>
        <Link className="nav-link" to="/chat">چت‌بات</Link>
        <Link className="nav-link" to="/messages">پیام‌های آماده</Link>
      </div>
      <div className="nav-actions">
        <button className="btn btn-secondary" onClick={toggleTheme}>حالت تاریک</button>
        <span className="badge">اعلان‌ها</span>
      </div>
    </header>
  )
}
