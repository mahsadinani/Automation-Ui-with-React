import { useMemo, useState } from 'react'
import DataTable from '../components/DataTable'
import { getCourses, addCourse, removeCourse, updateCourse } from '../services/courses'

export default function Courses() {
  // بارگذاری بنرها با Vite glob از پوشه «هزینه دوره ها/banners»
  const bannersMap = useMemo(() => {
    const files = import.meta.glob('/هزینه دوره ها/banners/*', { eager: true, query: '?url', import: 'default' })
    return Object.entries(files).map(([path, url]) => {
      const nameWithExt = path.split('/').pop()
      const name = nameWithExt?.replace(/\.(png|jpg|jpeg|webp)$/i, '') || ''
      return { name, url }
    })
  }, [])

  const [list, setList] = useState(getCourses())
  const [f, setF] = useState({ name: '', teacher: '', hours: '', sessions: '', totalFee: '', banner: '' })
  const [editingRow, setEditingRow] = useState(null)
  const [editData, setEditData] = useState({})
  const [errors, setErrors] = useState({})
  // واردسازی گروهی نام مدرسین
  const [bulkTeachers, setBulkTeachers] = useState('')
  const [bulkReport, setBulkReport] = useState(null)
  const setField = (k, v) => setF(x => ({ ...x, [k]: v }))

  // توابع اعتبارسنجی
  const validateCourse = (course) => {
    const newErrors = {}
    
    if (!course.name || course.name.trim().length < 2) {
      newErrors.name = 'نام دوره باید حداقل 2 کاراکتر باشد'
    }
    
    if (!course.teacher || course.teacher.trim().length < 2) {
      newErrors.teacher = 'نام مدرس باید حداقل 2 کاراکتر باشد'
    }
    
    const hours = Number(course.hours)
    if (isNaN(hours) || hours <= 0 || hours > 1000) {
      newErrors.hours = 'ساعت کل باید عددی بین 1 تا 1000 باشد'
    }
    
    const sessions = Number(course.sessions)
    if (isNaN(sessions) || sessions <= 0 || sessions > 100) {
      newErrors.sessions = 'تعداد جلسات باید عددی بین 1 تا 100 باشد'
    }
    
    const totalFee = Number(course.totalFee)
    if (isNaN(totalFee) || totalFee < 500 || totalFee > 500000000) {
      newErrors.totalFee = 'شهریه باید عددی بین 500 تا 500,000,000 تومان باشد'
    }
    
    return newErrors
  }

  const cols = ['ردیف', 'نام دوره', 'مدرس', 'ساعت کل', 'تعداد جلسات', 'شهریه کل', 'بنر']
  const rows = list.map((c, idx) => {
    const bannerUrl = c.banner || bannersMap.find(b => b.name === c.name)?.url || ''
    const feeTextFa = c.totalFeeFormattedFa || (typeof c.totalFee === 'number' && !Number.isNaN(c.totalFee) ? c.totalFee.toLocaleString('fa-IR') : (c.totalFee || ''))
    const toFa = (v) => {
      if (typeof v === 'number' && !Number.isNaN(v)) return v.toLocaleString('fa-IR')
      const s = String(v ?? '')
      const map = {'0':'۰','1':'۱','2':'۲','3':'۳','4':'۴','5':'۵','6':'۶','7':'۷','8':'۸','9':'۹'}
      return s.replace(/[0-9]/g, d => map[d] || d)
    }
    return [idx + 1, c.name, c.teacher || '—', toFa(c.hours), toFa(c.sessions), (feeTextFa ? `${feeTextFa} تومان` : ''), (
      bannerUrl ? <img src={bannerUrl} alt={c.name} style={{ height: 40 }} /> : '—'
    )]
  })

  const onAdd = (e) => {
    e.preventDefault()
    
    // اعتبارسنجی قبل از افزودن
    const validationErrors = validateCourse(f)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    
    const selectedBanner = f.banner || bannersMap.find(b => b.name === f.name)?.url || ''
    const rec = addCourse({ ...f, banner: selectedBanner })
    setList(l => [rec, ...l])
    setF({ name: '', teacher: '', hours: '', sessions: '', totalFee: '', banner: '' })
    setErrors({})
  }

  const onDelete = (idx) => {
    const id = list[idx]?.id
    if (!id) return
    const newList = removeCourse(id)
    setList(newList)
  }

  const onEdit = (idx) => {
    const course = list[idx]
    if (!course) return
    setEditingRow(idx)
    setEditData({ ...course })
    setErrors({})
  }

  const onEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }))
    // پاک کردن خطای مربوطه هنگام تغییر
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const onEditSave = (idx) => {
    const validationErrors = validateCourse(editData)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    const courseId = list[idx]?.id
    if (!courseId) return

    const updatedCourse = updateCourse(courseId, editData)
    if (updatedCourse) {
      const newList = [...list]
      newList[idx] = updatedCourse
      setList(newList)
      setEditingRow(null)
      setEditData({})
      setErrors({})
    }
  }

  const onEditCancel = () => {
    setEditingRow(null)
    setEditData({})
    setErrors({})
  }

  // نرمال‌سازی ساده برای تطبیق نام دوره‌ها
  const normalize = (s) => (String(s||'')
    .replace(/ي/g, 'ی')
    .replace(/ك/g, 'ک')
    .replace(/\u200c/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase())

  const applyBulkTeachers = () => {
    const lines = bulkTeachers.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
    if (!lines.length) { setBulkReport({ updated: 0, skipped: 0, notFound: [] }); return }
    const byNormName = new Map(list.map((c, i) => [normalize(c.name), { idx: i, course: c }]))
    let updated = 0, skipped = 0
    const notFound = []
    const newList = [...list]
    for (const line of lines) {
      // جداکننده‌ها: کاما، ویرگول فارسی، تب، خط تیره، دونقطه، پایپ
      const parts = line.split(/[\,،\t\-\:|]+/).map(p => p.trim()).filter(Boolean)
      if (parts.length < 2) { skipped++; continue }
      const courseName = parts[0]
      const teacherName = parts.slice(1).join(' ').trim()
      if (teacherName.length < 2) { skipped++; continue }
      const key = normalize(courseName)
      const hit = byNormName.get(key)
      if (!hit) { notFound.push(courseName); continue }
      const { idx, course } = hit
      if ((course.teacher || '').trim() === teacherName) { skipped++; continue }
      const updatedCourse = updateCourse(course.id, { teacher: teacherName })
      if (updatedCourse) {
        newList[idx] = updatedCourse
        updated++
      }
    }
    setList(newList)
    setBulkReport({ updated, skipped, notFound })
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>دوره‌های آموزشگاهی</h2>
      <div className="card">
        <div className="card-header">افزودن دوره جدید</div>
        <div className="card-body">
          <form onSubmit={onAdd} className="form-row">
            <div>
              <label className="form-label">نام دوره</label>
              <input className={`form-control ${errors.name ? 'is-invalid' : ''}`} value={f.name} onChange={e => setField('name', e.target.value)} />
              {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
            </div>
            <div>
              <label className="form-label">مدرس</label>
              <input className={`form-control ${errors.teacher ? 'is-invalid' : ''}`} value={f.teacher} onChange={e => setField('teacher', e.target.value)} />
              {errors.teacher && <div className="invalid-feedback d-block">{errors.teacher}</div>}
            </div>
            <div>
              <label className="form-label">ساعت کل کلاس</label>
              <input className={`form-control ${errors.hours ? 'is-invalid' : ''}`} type="number" value={f.hours} onChange={e => setField('hours', e.target.value)} />
              {errors.hours && <div className="invalid-feedback d-block">{errors.hours}</div>}
            </div>
            <div>
              <label className="form-label">تعداد جلسات</label>
              <input className={`form-control ${errors.sessions ? 'is-invalid' : ''}`} type="number" value={f.sessions} onChange={e => setField('sessions', e.target.value)} />
              {errors.sessions && <div className="invalid-feedback d-block">{errors.sessions}</div>}
            </div>
            <div>
              <label className="form-label">شهریه کل دوره</label>
              <input className={`form-control ${errors.totalFee ? 'is-invalid' : ''}`} type="number" value={f.totalFee} onChange={e => setField('totalFee', e.target.value)} />
              {errors.totalFee && <div className="invalid-feedback d-block">{errors.totalFee}</div>}
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
        <div className="card-header">واردسازی گروهی نام مدرسین</div>
        <div className="card-body">
          <p style={{ marginTop: 0, marginBottom: '0.5rem' }}>
            هر خط به صورت «نام دوره، نام مدرس» وارد شود. نمونه:
          </p>
          <pre style={{ background:'#f8f9fa', padding:'0.5rem', borderRadius:4, direction:'rtl' }}>
{`word, علی رضایی\nexcel, مریم محمدی\nبرنامه نویسی Python, سعید احمدی`}
          </pre>
          <textarea className="form-control" style={{ minHeight: 120 }}
            placeholder="نام دوره، نام مدرس\n..."
            value={bulkTeachers}
            onChange={e => setBulkTeachers(e.target.value)} />
          <div style={{ display:'flex', gap:8, marginTop:8 }}>
            <button type="button" className="btn btn-primary btn-sm" onClick={applyBulkTeachers}>اعمال مدرسین</button>
            <button type="button" className="btn btn-secondary btn-sm" onClick={() => { setBulkTeachers(''); setBulkReport(null) }}>پاک کردن</button>
          </div>
          {bulkReport && (
            <div style={{ marginTop: 8 }}>
              <div>به‌روزرسانی‌شده: {bulkReport.updated}</div>
              <div>رد شده: {bulkReport.skipped}</div>
              {bulkReport.notFound?.length ? (
                <div>
                  یافت نشد برای:
                  <ul>
                    {bulkReport.notFound.map((n, i) => <li key={i}>{n}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">دوره‌های فنی ({list.length})</div>
        <div className="card-body">
          <DataTable 
            columns={cols} 
            rows={rows} 
            onDelete={onDelete} 
            onEdit={onEdit}
            editingRow={editingRow}
            editData={editData}
            onEditChange={onEditChange}
            onEditSave={onEditSave}
            onEditCancel={onEditCancel}
            bannerOptions={bannersMap}
          />
        </div>
      </div>
    </div>
  )
}
