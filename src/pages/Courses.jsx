import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import { getCourses, addCourse, removeCourse } from '../services/courses'

export default function Courses() {
  // بارگذاری بنرها با Vite glob از پوشه «هزینه دوره ها/banners»
  const bannersMap = useMemo(() => {
    const files = import.meta.glob('/هزینه دوره ها/banners/*', { eager: true, as: 'url' })
    // به شکل [{name: 'فتوشاپ مقدماتی', url: '...'}]
    return Object.entries(files).map(([path, url]) => {
      const nameWithExt = path.split('/').pop()
      const name = nameWithExt?.replace(/\.(png|jpg|jpeg)$/i, '') || ''
      return { name, url }
    })
  }, [])

  const [list, setList] = useState(getCourses())
  const [f, setF] = useState({ name: '', teacher: '', hours: '', sessions: '', totalFee: '', banner: '' })
  const setField = (k, v) => setF(x => ({ ...x, [k]: v }))

  const cols = ['نام دوره', 'مدرس', 'ساعت کل', 'تعداد جلسات', 'شهریه کل', 'بنر']
  const rows = list.map(c => [c.name, c.teacher, c.hours, c.sessions, c.totalFee, (
    c.banner ? <img src={c.banner} alt={c.name} style={{ height: 40 }} /> : '—'
  )])

  const onAdd = (e) => {
    e.preventDefault()
    const selectedBanner = f.banner || bannersMap.find(b => b.name === f.name)?.url || ''
    const rec = addCourse({ ...f, banner: selectedBanner })
    setList(l => [rec, ...l])
    setF({ name: '', teacher: '', hours: '', sessions: '', totalFee: '', banner: '' })
  }

  const onDelete = (idx) => {
    const id = list[idx]?.id
    if (!id) return
    const newList = removeCourse(id)
    setList(newList)
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>لیست دوره‌ها</h2>
      <div className="card">
        <div className="card-header">افزودن دوره جدید</div>
        <div className="card-body">
          <form onSubmit={onAdd} className="form-row">
            <div>
              <label className="form-label">نام دوره</label>
              <input className="form-control" value={f.name} onChange={e => setField('name', e.target.value)} />
            </div>
            <div>
              <label className="form-label">مدرس</label>
              <input className="form-control" value={f.teacher} onChange={e => setField('teacher', e.target.value)} />
            </div>
            <div>
              <label className="form-label">ساعت کل کلاس</label>
              <input className="form-control" type="number" value={f.hours} onChange={e => setField('hours', e.target.value)} />
            </div>
            <div>
              <label className="form-label">تعداد جلسات</label>
              <input className="form-control" type="number" value={f.sessions} onChange={e => setField('sessions', e.target.value)} />
            </div>
            <div>
              <label className="form-label">شهریه کل دوره</label>
              <input className="form-control" type="number" value={f.totalFee} onChange={e => setField('totalFee', e.target.value)} />
            </div>
            <div>
              <label className="form-label">بنر دوره</label>
              <select className="form-select" value={f.banner} onChange={e => setField('banner', e.target.value)}>
                <option value="">— انتخاب خودکار بر اساس نام —</option>
                {bannersMap.map(b => (
                  <option key={b.url} value={b.url}>{b.name}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button className="btn btn-accent" type="submit">افزودن</button>
            </div>
          </form>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">دوره‌ها</div>
        <div className="card-body">
          <DataTable columns={cols} rows={rows} onDelete={onDelete} />
        </div>
      </div>
    </div>
  )
}
