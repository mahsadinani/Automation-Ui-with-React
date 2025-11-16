import DataTable from '../components/DataTable'
import { useEffect, useMemo, useState } from 'react'
import { getMessages } from '../services/messages'
import { getCourses, getCourseById } from '../services/courses'
import { getTeachers } from '../services/teachers'
import { addClass, getClasses, removeClass, updateClass } from '../services/classes'
import { generateSessionDates, isValidJalali } from '../services/dateUtils'
import { getStudents } from '../services/students'

const WEEKDAYS = [
  { id: 0, label: 'شنبه' },
  { id: 1, label: 'یکشنبه' },
  { id: 2, label: 'دوشنبه' },
  { id: 3, label: 'سه‌شنبه' },
  { id: 4, label: 'چهارشنبه' },
  { id: 5, label: 'پنجشنبه' },
  { id: 6, label: 'جمعه' },
]

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [editId, setEditId] = useState(null)
  const [msgForId, setMsgForId] = useState(null)
  const [detailsForId, setDetailsForId] = useState(null)
  const [studentsForId, setStudentsForId] = useState(null)
  const messagesRepo = useMemo(() => getMessages(), [])

  useEffect(() => {
    setClasses(getClasses())
    setCourses(getCourses())
    setTeachers(getTeachers())
  }, [])

  const columns = ['نام کلاس', 'مدرس', 'ظرفیت', 'کد', 'شهریه', 'تعداد جلسات']
  const rows = classes.map(c => [c.name, c.teacher || '—', c.capacity ?? '—', c.code || '—', c.fee ?? '—', c.sessionsCount ?? '—'])

  // فرم افزودن کلاس
  const [newCls, setNewCls] = useState({ name: '', teacher: '', capacity: '', code: '', courseId: '', fee: '', sessionsCount: '', startDate: '', weekdays: [], sessionDates: [] })
  const setField = (k, v) => setNewCls(x => ({ ...x, [k]: v }))
  const onSelectCourse = (id) => {
    setField('courseId', id)
    const course = getCourseById(id)
    if (course) {
      setNewCls(x => ({ ...x, fee: course.totalFee || '', sessionsCount: course.sessions || x.sessionsCount }))
    }
  }
  const toggleWeekday = (id) => {
    setNewCls(x => {
      const has = x.weekdays.includes(id)
      const weekdays = has ? x.weekdays.filter(w => w !== id) : [...x.weekdays, id]
      const sessionDates = generateSessionDates(x.startDate, weekdays, Number(x.sessionsCount || 0))
      return { ...x, weekdays, sessionDates }
    })
  }
  const setStartDate = (val) => {
    setNewCls(x => ({ ...x, startDate: val, sessionDates: generateSessionDates(val, x.weekdays, Number(x.sessionsCount || 0)) }))
  }
  const setSessionsCount = (val) => {
    const count = Number(val || 0)
    setNewCls(x => ({ ...x, sessionsCount: val, sessionDates: generateSessionDates(x.startDate, x.weekdays, count) }))
  }
  const submitNewClass = (e) => {
    e.preventDefault()
    if (!newCls.courseId) return alert('انتخاب دوره الزامی است')
    const selectedCourse = getCourseById(newCls.courseId)
    const finalName = (newCls.name?.trim && newCls.name.trim()) || (selectedCourse && selectedCourse.name) || ''
    if (!finalName) return alert('نام کلاس یا دوره مشخص نیست')
    if (!isValidJalali(newCls.startDate)) return alert('تاریخ شروع صحیح نیست (YYYY/MM/DD)')
    const created = addClass({ ...newCls, name: finalName, capacity: Number(newCls.capacity || 0), fee: Number(newCls.fee || 0), sessionsCount: Number(newCls.sessionsCount || 0) })
    setClasses(getClasses())
    setNewCls({ name: '', teacher: '', capacity: '', code: '', courseId: '', fee: '', sessionsCount: '', startDate: '', weekdays: [], sessionDates: [] })
    setEditId(created.id) // پس از افزودن، وارد حالت ویرایش می‌شویم
  }

  const removeById = (id) => {
    if (!window.confirm('حذف کلاس؟')) return
    removeClass(id)
    setClasses(getClasses())
    if (editId === id) setEditId(null)
  }

  const onSendMessage = (id) => {
    setMsgForId(prev => prev === id ? null : id)
  }
  const sendSelectedMessage = (id, key) => {
    if (!key) return
    alert(`پیام «${key}» برای حاضرین کلاس ارسال شد.`)
    setMsgForId(null)
  }

  // ویرایش زمان‌بندی جلسات
  const cls = classes.find(c => c.id === editId)
  const updateScheduleField = (patch) => {
    if (!cls) return
    const base = { weekdays: cls.weekdays || [], startDate: cls.startDate || '', sessionsCount: Number(cls.sessionsCount || 0) }
    const next = { ...base, ...patch }
    const sessionDates = generateSessionDates(next.startDate, next.weekdays, next.sessionsCount)
    const updated = updateClass(cls.id, { ...next, sessionDates })
    setClasses(getClasses())
  }
  const toggleEditWeekday = (id) => {
    if (!cls) return
    const has = (cls.weekdays || []).includes(id)
    const weekdays = has ? (cls.weekdays || []).filter(w => w !== id) : [ ...(cls.weekdays || []), id ]
    updateScheduleField({ weekdays })
  }
  const setEditStartDate = (v) => updateScheduleField({ startDate: v })
  const setEditSessionsCount = (v) => updateScheduleField({ sessionsCount: Number(v || 0) })
  const markCanceled = (index, canceled) => {
    if (!cls) return
    const cancellations = { ...(cls.cancellations || {}) }
    cancellations[index] = { canceled: !!canceled, makeupDate: cancellations[index]?.makeupDate }
    updateClass(cls.id, { cancellations })
    setClasses(getClasses())
  }
  const setMakeupDate = (index, date) => {
    if (!cls) return
    const cancellations = { ...(cls.cancellations || {}) }
    if (!cancellations[index]) cancellations[index] = { canceled: true, makeupDate: '' }
    cancellations[index].makeupDate = date
    updateClass(cls.id, { cancellations })
    setClasses(getClasses())
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>کلاس‌ها</h2>
      <div className="card">
        <div className="card-header">افزودن کلاس جدید</div>
        <div className="card-body">
          <form onSubmit={submitNewClass} className="form-row">
            <div>
              <label className="form-label">نام کلاس</label>
              <input className="form-control" value={newCls.name} onChange={e => setField('name', e.target.value)} />
            </div>
            <div>
              <label className="form-label">دوره مرتبط</label>
              <select className="form-control" value={newCls.courseId} onChange={e => onSelectCourse(e.target.value)}>
                <option value="">انتخاب دوره</option>
                {courses.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">مدرس</label>
              <select className="form-control" value={newCls.teacher} onChange={e => setField('teacher', e.target.value)}>
                <option value="">انتخاب مدرس</option>
                {teachers.map(t => (<option key={t.id} value={t.name}>{t.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">کد کلاس</label>
              <input className="form-control" value={newCls.code} onChange={e => setField('code', e.target.value)} />
            </div>
            <div>
              <label className="form-label">ظرفیت</label>
              <input className="form-control" type="number" value={newCls.capacity} onChange={e => setField('capacity', e.target.value)} />
            </div>
            <div>
              <label className="form-label">شهریه (از دوره)</label>
              <input className="form-control" type="number" value={newCls.fee} onChange={e => setField('fee', e.target.value)} />
            </div>
            <div>
              <label className="form-label">تعداد جلسات (از دوره)</label>
              <input className="form-control" type="number" value={newCls.sessionsCount} onChange={e => setSessionsCount(e.target.value)} />
            </div>
            <div>
              <label className="form-label">تاریخ شروع (شمسی)</label>
              <input className="form-control" placeholder="1403/09/01" value={newCls.startDate} onChange={e => setStartDate(e.target.value)} />
              {!newCls.startDate || isValidJalali(newCls.startDate) ? null : (<div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>قالب صحیح: YYYY/MM/DD</div>)}
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <label className="form-label">روزهای برگزاری</label>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {WEEKDAYS.map(d => (
                  <label key={d.id} style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                    <input type="checkbox" checked={newCls.weekdays.includes(d.id)} onChange={() => toggleWeekday(d.id)} /> {d.label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button className="btn btn-accent" type="submit">افزودن کلاس</button>
            </div>
          </form>
          {newCls.sessionDates?.length ? (
            <div style={{ marginTop: '0.75rem' }}>
              <strong>پیش‌نمایش تاریخ جلسات:</strong>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {newCls.sessionDates.map((d, i) => (<span key={i} className="badge">جلسه {i+1}: {d}</span>))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">لیست کلاس‌ها</div>
        <div className="card-body">
          <DataTable columns={columns} rows={rows} />
          <div style={{ marginTop: '0.75rem' }}>
            {classes.map(c => (
              <div key={c.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ cursor: 'pointer' }} onClick={() => setEditId(c.id)}>{c.name}</span>
                <button className="btn btn-secondary" onClick={() => setDetailsForId(prev => prev === c.id ? null : c.id)}>جزئیات</button>
                <button className="btn btn-secondary" onClick={() => setStudentsForId(prev => prev === c.id ? null : c.id)}>لیست شاگردان</button>
                <button className="btn btn-accent" onClick={() => setEditId(c.id)}>مدیریت جلسات</button>

                <button className="btn btn-secondary" onClick={() => onSendMessage(c.id)}>ارسال پیام</button>
                {msgForId === c.id ? (
                  <span style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
                    <select className="form-control" defaultValue="">
                      <option value="">انتخاب پیام</option>
                      {Object.keys(messagesRepo).map(k => (<option key={k} value={k}>{k}</option>))}
                    </select>
                    <button className="btn btn-accent" onClick={(e) => {
                      const sel = e.currentTarget.previousSibling.value
                      sendSelectedMessage(c.id, sel)
                    }}>ارسال</button>
                  </span>
                ) : null}
                <button className="btn" onClick={() => removeById(c.id)} style={{ background: '#ef4444', color: '#fff' }}>حذف</button>
              </div>
            ))}
            {classes.map(c => (
              studentsForId === c.id ? (
                <div key={'students-'+c.id} className="card" style={{ margin: '0.5rem 0', padding: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <strong>لیست شاگردان کلاس {c.name}:</strong>
                    <span className="badge">{getStudents().filter(s => s.classId === c.id).length} نفر</span>
                  </div>
                  {(() => {
                    const list = getStudents().filter(s => s.classId === c.id)
                    if (!list.length) return (<div style={{ color: '#6b7280', marginTop: '0.25rem' }}>شاگردی در این کلاس ثبت‌نام نشده است.</div>)
                    return (
                      <div className="table-responsive">
                        <table className="table table-striped">
                          <thead>
                            <tr>
                              <th>نام و نام‌خانوادگی</th>
                              <th>تلفن</th>
                              <th>ایمیل</th>
                              <th>مبلغ پرداخت‌شده</th>
                              <th>تاریخ ثبت‌نام</th>
                            </tr>
                          </thead>
                          <tbody>
                            {list.map(s => (
                              <tr key={s.id}>
                                <td>{s.name || '—'}</td>
                                <td>{s.phone || '—'}</td>
                                <td>{s.email || '—'}</td>
                                <td>{s.paid ? `${s.paid.toLocaleString()} تومان` : '—'}</td>
                                <td>{s.registerDate || '—'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )
                  })()}
                </div>
              ) : null
            ))}
            {classes.map(c => (
              detailsForId === c.id ? (
                <div key={'details-'+c.id} className="card" style={{ margin: '0.5rem 0', padding: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(c.sessionDates || []).length ? (
                      <>
                        <strong>جلسات:</strong>
                        {(c.sessionDates || []).map((d, i) => (<span key={i} className="badge">جلسه {i+1}: {d}</span>))}
                      </>
                    ) : (
                      <span style={{ color: '#6b7280' }}>جلسه‌ای برای این کلاس تعریف نشده است.</span>
                    )}
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
      </div>

      {cls && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">ویرایش کلاس: {cls.name}</div>
          <div className="card-body">
            <div className="form-row">
              <div>
                <label className="form-label">تاریخ شروع (شمسی)</label>
                <input className="form-control" placeholder="1403/09/01" value={cls.startDate || ''} onChange={e => setEditStartDate(e.target.value)} />
                {!cls.startDate || isValidJalali(cls.startDate) ? null : (<div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>قالب صحیح: YYYY/MM/DD</div>)}
              </div>
              <div>
                <label className="form-label">تعداد جلسات</label>
                <input className="form-control" type="number" value={cls.sessionsCount || ''} onChange={e => setEditSessionsCount(e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label className="form-label">روزهای برگزاری</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {WEEKDAYS.map(d => (
                    <label key={d.id} style={{ display: 'inline-flex', gap: '0.25rem', alignItems: 'center' }}>
                      <input type="checkbox" checked={(cls.weekdays || []).includes(d.id)} onChange={() => toggleEditWeekday(d.id)} /> {d.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {(cls.sessionDates || []).length ? (
              <div style={{ marginTop: '0.75rem' }}>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        {(cls.sessionDates || []).map((_, i) => (<th key={i}>جلسه {i+1}</th>))}
                        {Object.entries(cls.cancellations || {}).filter(([,v]) => v?.canceled).map(([k]) => (
                          <th key={'m'+k}>جبرانی جلسه {Number(k)+1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        {(cls.sessionDates || []).map((d, i) => (
                          <td key={i}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              <span>{d}</span>
                              <select className="form-control" value={(cls.cancellations?.[i]?.canceled ? 'yes' : 'no')} onChange={e => markCanceled(i, e.target.value === 'yes')}>
                                <option value="no">این جلسه کنسل نیست</option>
                                <option value="yes">این جلسه کنسل است</option>
                              </select>
                            </div>
                          </td>
                        ))}
                        {Object.entries(cls.cancellations || {}).filter(([,v]) => v?.canceled).map(([k, v]) => (
                          <td key={'m-cell'+k}>
                            <label className="form-label">تاریخ جبرانی</label>
                            <input className="form-control" placeholder="1403/09/20" value={v?.makeupDate || ''} onChange={e => setMakeupDate(Number(k), e.target.value)} />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div style={{ marginTop: '0.75rem', color: '#6b7280' }}>برای نمایش جلسات، تاریخ شروع، روزهای برگزاری و تعداد جلسات را تنظیم کنید.</div>
            )}

            <div style={{ marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setEditId(null)}>بستن ویرایش</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


