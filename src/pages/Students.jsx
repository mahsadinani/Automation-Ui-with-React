import DataTable from '../components/DataTable'
import { useEffect, useState } from 'react'
import { addStudent, getStudents, removeStudent, resolveCourseName, resolveClassEndDate } from '../services/students'
import { getCourses } from '../services/courses'
import { getClasses } from '../services/classes'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

export default function Students() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [form, setForm] = useState({
    faName: '', faLastName: '', enName: '', enLastName: '',
    dob: '', birthPlace: '', idNumber: '', studentCode: '',
    schoolCourseId: '', technicalCourseId: '', technicalHours: '',
    classId: '', classEndDate: '', certificateDate: '', finalGrade: ''
  })
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    setStudents(getStudents())
    setCourses(getCourses())
    setClasses(getClasses())
  }, [])

  // student code: derive from idNumber, strip leading '00'
  useEffect(() => {
    const raw = form.idNumber || ''
    const code = raw.startsWith('00') ? raw.replace(/^00+/, '') : raw
    setField('studentCode', code)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.idNumber])

  const onSelectClass = (id) => {
    setField('classId', id)
    const end = resolveClassEndDate(id)
    setField('classEndDate', end || '')
    if (end) {
      // certificateDate = end + 10 days (jalali display)
      try {
        const d = dayjs(end, { jalali: true }).calendar('jalali')
        const g = dayjs({ year: d.year(), month: d.month(), date: d.date() }).add(10, 'day')
        const cert = dayjs(g.toISOString()).calendar('jalali').locale('fa').format('YYYY/MM/DD')
        setField('certificateDate', cert)
      } catch {}
    }
  }

  const onSelectTechnicalCourse = (id) => {
    setField('technicalCourseId', id)
    const course = courses.find(c => c.id === id)
    setField('technicalHours', course?.hours || '')
  }

  const submit = (e) => {
    e.preventDefault()
    const payload = { ...form, technicalHours: Number(form.technicalHours || 0), finalGrade: Number(form.finalGrade || 0) }
    addStudent(payload)
    setStudents(getStudents())
    setForm({ faName: '', faLastName: '', enName: '', enLastName: '', dob: '', birthPlace: '', idNumber: '', studentCode: '', schoolCourseId: '', technicalCourseId: '', technicalHours: '', classId: '', classEndDate: '', certificateDate: '', finalGrade: '' })
  }

  const columns = ['نام فارسی', 'نام‌خانوادگی فارسی', 'نام انگلیسی', 'نام‌خانوادگی انگلیسی', 'کد دانشجویی', 'دوره آموزشگاهی', 'دوره فنی', 'ساعات فنی', 'پایان کلاس', 'ثبت مدرک', 'نمره']
  const rows = students.map(s => [
    s.faName, s.faLastName, s.enName, s.enLastName, s.studentCode,
    resolveCourseName(s.schoolCourseId), resolveCourseName(s.technicalCourseId), s.technicalHours,
    s.classEndDate, s.certificateDate, s.finalGrade
  ])

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>لیست شاگردان</h2>
      <div className="card">
        <div className="card-header">افزودن شاگرد جدید</div>
        <div className="card-body">
          <form onSubmit={submit} className="form-row">
            <div>
              <label className="form-label">نام (فارسی)</label>
              <input className="form-control" value={form.faName} onChange={e => setField('faName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">نام‌خانوادگی (فارسی)</label>
              <input className="form-control" value={form.faLastName} onChange={e => setField('faLastName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">نام (انگلیسی)</label>
              <input className="form-control" value={form.enName} onChange={e => setField('enName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">نام‌خانوادگی (انگلیسی)</label>
              <input className="form-control" value={form.enLastName} onChange={e => setField('enLastName', e.target.value)} />
            </div>
            <div>
              <label className="form-label">تاریخ تولد (شمسی)</label>
              <input className="form-control" placeholder="1403/01/01" value={form.dob} onChange={e => setField('dob', e.target.value)} />
            </div>
            <div>
              <label className="form-label">محل تولد</label>
              <input className="form-control" value={form.birthPlace} onChange={e => setField('birthPlace', e.target.value)} />
            </div>
            <div>
              <label className="form-label">شماره شناسنامه</label>
              <input className="form-control" value={form.idNumber} onChange={e => setField('idNumber', e.target.value)} />
            </div>
            <div>
              <label className="form-label">کد دانشجویی (اتوماتیک)</label>
              <input className="form-control" value={form.studentCode} readOnly />
            </div>
            <div>
              <label className="form-label">نام دوره آموزشگاهی</label>
              <select className="form-control" value={form.schoolCourseId} onChange={e => setField('schoolCourseId', e.target.value)}>
                <option value="">انتخاب دوره</option>
                {courses.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">نام دوره سازمان فنی</label>
              <select className="form-control" value={form.technicalCourseId} onChange={e => onSelectTechnicalCourse(e.target.value)}>
                <option value="">انتخاب دوره</option>
                {courses.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">تعداد ساعت‌های سازمان فنی</label>
              <input className="form-control" type="number" value={form.technicalHours} onChange={e => setField('technicalHours', e.target.value)} />
            </div>
            <div>
              <label className="form-label">کلاس مرتبط</label>
              <select className="form-control" value={form.classId} onChange={e => onSelectClass(e.target.value)}>
                <option value="">انتخاب کلاس</option>
                {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
              </select>
            </div>
            <div>
              <label className="form-label">تاریخ اتمام کلاس</label>
              <input className="form-control" value={form.classEndDate} readOnly />
            </div>
            <div>
              <label className="form-label">تاریخ ثبت مدرک</label>
              <input className="form-control" value={form.certificateDate} onChange={e => setField('certificateDate', e.target.value)} />
            </div>
            <div>
              <label className="form-label">نمره نهایی</label>
              <input className="form-control" type="number" value={form.finalGrade} onChange={e => setField('finalGrade', e.target.value)} />
            </div>
            <div style={{ gridColumn: '1/-1' }}>
              <button className="btn btn-accent" type="submit">ثبت شاگرد</button>
            </div>
          </form>
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">لیست شاگردان</div>
        <div className="card-body">
          <DataTable columns={columns} rows={rows} />
        </div>
      </div>
    </div>
  )
}
