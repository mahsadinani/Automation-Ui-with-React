// تولید لیست اولیه دورهها از روی بنرهای موجود در پوشه هزینه دوره ها/banners
import defaultCourses from '../data/defaultCourses.json'

function formatThousands(n) {
  if (n === '' || n === null || n === undefined) return ''
  try { return new Intl.NumberFormat('en-US').format(Number(n)) } catch { return '' }
}
function formatThousandsFa(n) {
  if (n === '' || n === null || n === undefined) return ''
  try { return new Intl.NumberFormat('fa-IR').format(Number(n)) } catch { return '' }
}
const bannerFiles = import.meta.glob('/هزینه دوره ها/banners/*', { eager: true, query: '?url', import: 'default' })

function toSlug(str) {
  return String(str || '')
    .trim()
    .replace(/[\s\-]+/g, '-')
    .replace(/[^\u0600-\u06FF\w\-]+/g, '')
    .toLowerCase()
}

const bannerMap = Object.fromEntries(Object.entries(bannerFiles).map(([p, url]) => {
  const nm = p.split('/').pop()?.replace(/\.(png|jpg|jpeg|webp)$/i, '') || ''
  return [nm, url]
}))

export const initialCourses = (defaultCourses.length ? defaultCourses.map(dc => ({
  id: toSlug(dc.name),
  name: dc.name,
  teacher: dc.teacher ?? '',
  hours: dc.hours ?? '',
  sessions: dc.sessions ?? '',
  totalFee: dc.totalFee ?? '',
  totalFeeFormatted: dc.totalFeeFormatted ?? (dc.totalFee !== '' ? formatThousands(dc.totalFee) : ''),
  totalFeeFormattedFa: dc.totalFeeFormattedFa ?? (dc.totalFee !== '' ? formatThousandsFa(dc.totalFee) : ''),
  // اگر در JSON مقدار بنر (نام فایل بدون پسوند) آمده بود، همان را استفاده کن
  banner: bannerMap[dc.banner || dc.name] || '',
})) : Object.entries(bannerFiles).map(([path, url]) => {
  const nameWithExt = path.split('/').pop()
  const name = nameWithExt?.replace(/\.(png|jpg|jpeg|webp)$/i, '') || ''
  return { id: toSlug(name), name, teacher: '', hours: '', sessions: '', totalFee: '', totalFeeFormatted: '', totalFeeFormattedFa: '', banner: url }
}))

export function getCourses() {
  const raw = localStorage.getItem('courses')
  let list
  try {
    list = raw ? JSON.parse(raw) : initialCourses
  } catch {
    list = initialCourses
  }
  // اگر آرایه موجود ولی خالی بود، با پیش‌فرض‌ها بازیابی و ذخیره شود
  if (Array.isArray(list) && list.length === 0) {
    saveCourses(initialCourses)
    return initialCourses
  }
  // مهاجرت داده: تصحیح نام مدرس «عابدی» به «عبیری»
  const migrated = list.map(c => ({ ...c, teacher: (c.teacher || '').replace(/عابدی/g, 'عبیری') }))
  // غنی‌سازی رکوردهای موجود از روی داده‌های پیش‌فرض (بنر/شهریه/سایر فیلدهای خالی)
  const defaultsByName = Object.fromEntries(initialCourses.map(c => [c.name, c]))
  const enriched = migrated.map(c => {
    const d = defaultsByName[c.name]
    if (!d) return c
    return {
      ...c,
      banner: c.banner || d.banner || '',
      totalFee: c.totalFee || d.totalFee || '',
      totalFeeFormatted: c.totalFeeFormatted || d.totalFeeFormatted || (c.totalFee ? formatThousands(c.totalFee) : ''),
      totalFeeFormattedFa: c.totalFeeFormattedFa || d.totalFeeFormattedFa || (c.totalFee ? formatThousandsFa(c.totalFee) : ''),
      hours: c.hours || d.hours || '',
      sessions: c.sessions || d.sessions || '',
      teacher: c.teacher || d.teacher || '',
    }
  })
  // اگر تغییری ایجاد شد ذخیره کنیم
  const changed = JSON.stringify(enriched) !== JSON.stringify(list)
  if (changed) saveCourses(enriched)
  return enriched
}

export function saveCourses(list) {
  localStorage.setItem('courses', JSON.stringify(list))
}

export function addCourse(course) {
  const list = getCourses()
  const withId = { id: crypto.randomUUID?.() || String(Date.now()), ...course }
  saveCourses([withId, ...list])
  return withId
}

export function removeCourse(id) {
  const list = getCourses().filter(c => c.id !== id)
  saveCourses(list)
  return list
}

export function updateCourse(id, patch) {
  const list = getCourses().map(c => c.id === id ? { ...c, ...patch } : c)
  saveCourses(list)
  return list.find(c => c.id === id)
}

export function getCourseById(id) {
  return getCourses().find(c => c.id === id)
}
