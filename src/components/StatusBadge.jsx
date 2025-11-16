import './StatusBadge.css'

const statusConfig = {
  'متقاضی': { color: '#2196F3', bgColor: '#e3f2fd', icon: '👤' },
  'منصرف شده': { color: '#f44336', bgColor: '#ffebee', icon: '❌' },
  'اطلاع‌رسانی دوره‌های بعدی': { color: '#FF9800', bgColor: '#fff3e0', icon: '📢' },
  'در انتظار خبر یا واریز': { color: '#9C27B0', bgColor: '#f3e5f5', icon: '⏳' },
  'مایل به ثبت‌نام': { color: '#4CAF50', bgColor: '#e8f5e8', icon: '✅' },
  'تکمیل ثبت‌نام': { color: '#2E7D32', bgColor: '#e8f5e8', icon: '🎉' },
  'پیش‌ثبت‌نام': { color: '#607D8B', bgColor: '#eceff1', icon: '📝' },
  'تماس اول': { color: '#795548', bgColor: '#efebe9', icon: '📞' },
  'ارسال اطلاعات': { color: '#3F51B5', bgColor: '#e8eaf6', icon: '📧' },
  'پیگیری': { color: '#E91E63', bgColor: '#fce4ec', icon: '🔄' }
}

export default function StatusBadge({ status = 'متقاضی', size = 'medium', showIcon = true }) {
  const config = statusConfig[status] || { color: '#666', bgColor: '#f5f5f5', icon: '❓' }
  
  return (
    <span 
      className={`status-badge status-${size}`}
      style={{ 
        color: config.color,
        backgroundColor: config.bgColor,
        borderColor: config.color
      }}
    >
      {showIcon && <span className="status-icon">{config.icon}</span>}
      <span className="status-text">{status}</span>
    </span>
  )
}