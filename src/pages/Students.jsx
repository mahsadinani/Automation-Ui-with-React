import { useEffect, useState, useMemo } from 'react'
import { addStudent, getStudents, removeStudent, resolveCourseName, resolveClassEndDate } from '../services/students'
import { getCourses } from '../services/courses'
import { getClasses } from '../services/classes'
import StudentRegistrationForm from '../components/StudentRegistrationForm'
import './Students.css'
import StatusBadge from '../components/StatusBadge'
import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

export default function Students() {
  const [students, setStudents] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [showAdvancedForm, setShowAdvancedForm] = useState(false)

  useEffect(() => {
    setStudents(getStudents())
    setCourses(getCourses())
    setClasses(getClasses())
  }, [])

  const handleAdvancedSubmit = (studentData) => {
    addStudent(studentData)
    setStudents(getStudents())
    setShowAdvancedForm(false)
  }

  // منطق فیلتر، جستجو و مرتب‌سازی
  const filtered = useMemo(() => {
    let list = [...students]
    // فیلتر بر اساس جستجو
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(s =>
        s.name?.toLowerCase().includes(q) ||
        s.phone?.includes(q) ||
        s.email?.toLowerCase().includes(q) ||
        (s.courseClassId ? (() => {
          const [courseId] = s.courseClassId.split('-')
          return resolveCourseName(courseId).toLowerCase().includes(q)
        })() : resolveCourseName(s.courseId).toLowerCase().includes(q)) ||
        s.note?.toLowerCase().includes(q)
      )
    }
    // مرتب‌سازی
    list.sort((a, b) => {
      let av, bv
      switch (sortKey) {
        case 'name':
          av = a.name || ''
          bv = b.name || ''
          break
        case 'course':
          // برای فیلد ادغام شده دوره/کلاس
          const courseA = resolveCourseName(a.courseClassId?.split('-')[0] || a.courseId)
          const classA = classes.find(c => c.id === (a.courseClassId?.split('-')[1] || a.classId))?.name || ''
          av = `${courseA} ${classA ? '- ' + classA : ''}`
          
          const courseB = resolveCourseName(b.courseClassId?.split('-')[0] || b.courseId)
          const classB = classes.find(c => c.id === (b.courseClassId?.split('-')[1] || b.classId))?.name || ''
          bv = `${courseB} ${classB ? '- ' + classB : ''}`
          break

        default:
          av = a[sortKey] || ''
          bv = b[sortKey] || ''
      }
      if (typeof av === 'string') av = av.toLowerCase()
      if (typeof bv === 'string') bv = bv.toLowerCase()
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [students, search, sortKey, sortDir, classes])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const columns = ['نام', 'تلفن', 'ایمیل', 'دوره/کلاس', 'تاریخ ثبت‌نام', 'یادداشت', 'عملیات']

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>لیست شاگردان</h2>
      
      <div className="registration-card">
        <div className="registration-header">
          <div className="registration-header-content">
            <div className="registration-header-info">
              <div className="registration-icon">🎯</div>
              <div>
                <h3 className="registration-title">ثبت‌نام دانش‌آموز جدید</h3>
                <p className="registration-subtitle">فرم جامع ثبت‌نام با قابلیت‌های پیشرفته</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn-add-student"
              onClick={() => setShowAdvancedForm(true)}
            >
              <span className="btn-icon">➕</span>
              افزودن دانش‌آموز جدید
            </button>
          </div>
        </div>
        <div className="registration-body">
          {showAdvancedForm ? (
            <StudentRegistrationForm 
              onSubmit={handleAdvancedSubmit}
              onCancel={() => setShowAdvancedForm(false)}
            />
          ) : (
            <div className="registration-welcome">
              <div className="welcome-icon-container">
                <div className="welcome-icon">📝</div>
              </div>
              <h4 className="welcome-title">آماده برای ثبت‌نام دانش‌آموز جدید؟</h4>
              <p className="welcome-description">
                با کلیک روی دکمه "افزودن دانش‌آموز جدید" فرم جامع ثبت‌نام را باز کنید و اطلاعات کامل دانش‌آموز را وارد کنید
              </p>
              <button 
                className="btn-start-registration"
                onClick={() => setShowAdvancedForm(true)}
              >
                <span className="btn-icon">🚀</span>
                شروع ثبت‌نام جدید
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>لیست شاگردان</span>
          <input
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '.5rem', border: '1px solid #ced4da', borderRadius: 4 }}
          />
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <table className="table table-striped table-hover" style={{ margin: 0 }}>
            <thead>
              <tr>
                {columns.map((col, idx) => {
                  const sortKeys = ['name','phone','email','course','registerDate','note']
                  const isSortable = idx < 6
                  return (
                    <th key={idx} style={{ cursor: isSortable ? 'pointer' : 'default', userSelect: 'none' }} onClick={() => isSortable && handleSort(sortKeys[idx])}>
                      {col}
                      {isSortable && sortKey === sortKeys[idx] && (
                        <span style={{ marginRight: '.25rem' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={columns.length} style={{ textAlign: 'center', padding: '2rem' }}>هیچ دانش‌آموزی یافت نشد</td></tr>
              ) : (
                filtered.map((s, idx) => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.phone}</td>
                    <td>{s.email}</td>
                    <td>{s.courseClassId ? (() => {
                      const [courseId, classId] = s.courseClassId.split('-')
                      const courseName = resolveCourseName(courseId)
                      const className = classes.find(c => c.id === classId)?.name || ''
                      return `${courseName} ${className ? '- ' + className : ''}`
                    })() : `${resolveCourseName(s.courseId)} ${classes.find(c => c.id === s.classId)?.name ? '- ' + classes.find(c => c.id === s.classId)?.name : ''}`}</td>
                    <td>{s.registerDate}</td>
                    <td>{s.note || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button style={{ padding: '.25rem .5rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4, fontSize: '12px' }}>ویرایش</button>
                        <button onClick={() => { removeStudent(s.id); setStudents(getStudents()) }} style={{ padding: '.25rem .5rem', background: '#dc3545', color: '#fff', border: 'none', borderRadius: 4, fontSize: '12px' }}>حذف</button>
                        <button style={{ padding: '.25rem .5rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: 4, fontSize: '12px' }}>اضافه به کلاس</button>
                        <button style={{ padding: '.25rem .5rem', background: '#ffc107', color: '#000', border: 'none', borderRadius: 4, fontSize: '12px' }}>صدور گواهینامه</button>
                        <button style={{ padding: '.25rem .5rem', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: 4, fontSize: '12px' }}>ساخت رکورد مشابه</button>
                        <button style={{ padding: '.25rem .5rem', background: '#6f42c1', color: '#fff', border: 'none', borderRadius: 4, fontSize: '12px' }}>پروفایل مالی</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
