import { useEffect, useMemo, useState } from 'react'
import { parseMarkdownFile } from '../services/mdParser.js'
import { saveCourses, getCourses } from '../services/courses.js'
import { loadLocalPriceList } from '../services/priceListLoader.js'
import { scanBanners, findBannerForCourse, getBannerUrl } from '../services/bannerScanner.js'

export default function CourseList() {
  const [courses, setCourses] = useState([])
  const [sortKey, setSortKey] = useState('nameFa')
  const [sortAsc, setSortAsc] = useState(true)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [banners] = useState(scanBanners())

  // نمونه داده‌ها (در ادامه از فایل MD بارگذاری می‌شود)
  const sampleCourses = [
    { id: 'ICDL', nameFa: 'ICDL کاربر', nameEn: 'ICDL', hours: 36, sessions: 12 },
    { id: 'WORD-EXCEL', nameFa: 'ویژه بازار کار (Word-Excel-PowerPoint)', nameEn: 'Office Bundle', hours: 24, sessions: 8 },
    { id: 'AI-BOOK', nameFa: 'طراحی کتاب با هوش مصنوعی', nameEn: 'AI Book Design', hours: 6, sessions: 3 },
  ]

  useEffect(() => {
    // بارگذاری خودکار فایل MD واقعی در اولین بار
    loadLocalPriceList().then(list => {
      if (list.length > 0) {
        const existing = getCourses()
        const merged = [...list, ...existing.filter(ex => !list.some(en => en.id === ex.id))]
        saveCourses(merged)
        setCourses(merged)
      } else {
        setCourses(sampleCourses)
      }
    }).catch(() => setCourses(sampleCourses))
  }, [])

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setMessage('')
    try {
      const parsed = await parseMarkdownFile(file)
      const enriched = parsed.map(c => ({ ...c, banner: c.banner || '' }))
      const existing = getCourses()
      const merged = [...enriched, ...existing.filter(ex => !enriched.some(en => en.id === ex.id))]
      saveCourses(merged)
      setCourses(merged)
      setMessage(`✅ ${parsed.length} دوره با موفقیت بارگذاری شد.`)
    } catch (err) {
      setMessage(`❌ خطا: ${err.message}`)
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  // مرتب‌سازی و فیلتر
  const displayed = useMemo(() => {
    let filtered = courses.filter(c =>
      c.nameFa.toLowerCase().includes(search.toLowerCase()) ||
      c.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    )
    return filtered.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortAsc ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal ?? '').toLowerCase()
      const bStr = String(bVal ?? '').toLowerCase()
      if (aStr < bStr) return sortAsc ? -1 : 1
      if (aStr > bStr) return sortAsc ? 1 : -1
      return 0
    })
  }, [courses, sortKey, sortAsc, search])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc)
    } else {
      setSortKey(key)
      setSortAsc(true)
    }
  }

  const SortIcon = ({ colKey }) => (
    <span className="sort-icons" style={{ marginInlineStart: 4 }}>
      {sortKey === colKey && sortAsc && '▲'}
      {sortKey === colKey && !sortAsc && '▼'}
    </span>
  )

  return (
    <div className="container">
      <h2>دوره‌های فنی</h2>
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="form-control"
              placeholder="جستجو..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 300 }}
            />
            <label className="btn btn-accent" style={{ cursor: 'pointer' }}>
              {loading ? 'در حال بارگذاری...' : 'بارگذاری فایل MD'}
              <input
                type="file"
                accept=".md"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                disabled={loading}
              />
            </label>
            {message && <span style={{ color: message.includes('✅') ? 'var(--accent-2)' : '#ef4444' }}>{message}</span>}
          </div>
        </div>
        <div className="card-body" style={{ overflowX: 'auto' }}>
          <table className="table table-striped responsive-table" style={{ minWidth: 600 }}>
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                  کد دوره <SortIcon colKey="id" />
                </th>
                <th>تصویر</th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nameFa')}>
                  نام دوره (فارسی) <SortIcon colKey="nameFa" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('nameEn')}>
                  نام دوره (لاتین) <SortIcon colKey="nameEn" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('hours')}>
                  تعداد ساعت <SortIcon colKey="hours" />
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => handleSort('sessions')}>
                  تعداد جلسات <SortIcon colKey="sessions" />
                </th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((c) => {
                const banner = findBannerForCourse(c.nameFa, banners)
                return (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>
                      {banner ? (
                        <img
                          src={getBannerUrl(banner)}
                          alt={c.nameFa}
                          style={{width:60,height:40,objectFit:'cover',borderRadius:4}}
                          onError={e => { e.target.style.display = 'none' }}
                        />
                      ) : (
                        <span style={{fontSize:12,color:'#888'}}>بدون تصویر</span>
                      )}
                    </td>
                    <td>{c.nameFa}</td>
                    <td>{c.nameEn}</td>
                    <td>{c.hours.toLocaleString('fa-IR')}</td>
                    <td>{c.sessions.toLocaleString('fa-IR')}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {displayed.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem' }}>دوره‌ای یافت نشد.</div>
          )}
        </div>
      </div>
    </div>
  )
}