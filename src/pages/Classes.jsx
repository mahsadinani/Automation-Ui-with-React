import DataTable from '../components/DataTable'
import { useState } from 'react'
import { getMessages } from '../services/messages'

export default function Classes() {
  const [classes, setClasses] = useState([
    { name: 'React مقدماتی', teacher: 'امین', start: '1403/09/01', end: '1403/10/01', capacity: 25, code: 'RB-140309', fee: 7500000 },
    { name: 'Node.js پیشرفته', teacher: 'نرگس', start: '1403/09/15', end: '1403/10/20', capacity: 18, code: 'NA-140309', fee: 9500000 }
  ])
  const columns = ['نام کلاس', 'مدرس', 'شروع', 'پایان', 'ظرفیت', 'کد', 'شهریه']
  const rows = classes.map(c => [c.name, c.teacher, c.start, c.end, c.capacity, c.code, c.fee])

  const addClass = () => {
    const name = window.prompt('نام کلاس جدید را وارد کنید')
    if (!name) return
    setClasses(cs => [{ name, teacher: '', start: '', end: '', capacity: 0, code: '', fee: 0 }, ...cs])
  }
  const removeClass = (name) => {
    if (!window.confirm('حذف کلاس؟')) return
    setClasses(cs => cs.filter(c => c.name !== name))
  }
  const editClass = (name) => {
    const c = classes.find(x => x.name === name)
    if (!c) return
    const teacher = window.prompt('نام مدرس', c.teacher) ?? c.teacher
    const start = window.prompt('تاریخ شروع (شمسی)', c.start) ?? c.start
    const end = window.prompt('تاریخ پایان (شمسی)', c.end) ?? c.end
    const capacity = Number(window.prompt('ظرفیت', String(c.capacity)) ?? c.capacity)
    const code = window.prompt('کد کلاس', c.code) ?? c.code
    const fee = Number(window.prompt('شهریه کل دوره', String(c.fee)) ?? c.fee)
    setClasses(cs => cs.map(x => x.name === name ? { ...x, teacher, start, end, capacity, code, fee } : x))
  }
  const sendClassMessage = (name) => {
    const repo = getMessages()
    const keys = Object.keys(repo)
    const key = window.prompt('کلید پیام برای ارسال به حاضرین کلاس: ' + keys.join(', '), keys[0])
    if (!key) return
    window.alert(`پیام «${key}» برای حاضرین کلاس «${name}» ارسال شد.`)
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>کلاس‌ها</h2>
      <div className="card">
        <div className="card-header" style={{ display: 'flex', gap: '0.5rem' }}>
          <button className="btn btn-accent" onClick={addClass}>افزودن کلاس</button>
        </div>
        <div className="card-body">
          <DataTable columns={columns} rows={rows} />
          <div style={{ marginTop: '0.75rem' }}>
            {classes.map(c => (
              <div key={c.name} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span onDoubleClick={() => editClass(c.name)} style={{ cursor: 'pointer' }}>{c.name}</span>
                <button className="btn btn-secondary" onClick={() => editClass(c.name)}>ویرایش</button>
                <button className="btn btn-secondary" onClick={() => sendClassMessage(c.name)}>ارسال پیام</button>
                <button className="btn" onClick={() => removeClass(c.name)} style={{ background: '#ef4444', color: '#fff' }}>حذف</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
