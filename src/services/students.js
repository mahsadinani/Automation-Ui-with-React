// سرویس لیست شاگردان: ذخیره‌سازی در localStorage
import { getCourses } from './courses'
import { getClasses } from './classes'

const STORAGE_KEY = 'students'

export const initialStudents = [
  // دانش‌آموزان کلاس React مقدماتی
  { id: 'st-1', name: 'علی احمدی', phone: '09123456789', courseId: 'react-basic', classId: 'cls-react-basic-1', email: 'ali@mail.com', registerDate: '1403/08/28', paid: 7500000, note: 'دانشجو' },
  { id: 'st-2', name: 'زهرا کاظمی', phone: '09129876543', courseId: 'react-basic', classId: 'cls-react-basic-1', email: 'zahra@mail.com', registerDate: '1403/08/29', paid: 7500000, note: 'کارمند' },
  { id: 'st-3', name: 'محمد رضایی', phone: '09121234567', courseId: 'react-basic', classId: 'cls-react-basic-1', email: 'mohammad@mail.com', registerDate: '1403/08/30', paid: 7000000, note: '500 هزار تومان باقی‌مانده' },
  
  // دانش‌آموزان کلاس Node.js پیشرفته
  { id: 'st-4', name: 'سارا موسوی', phone: '09122345678', courseId: 'node-advanced', classId: 'cls-node-adv-1', email: 'sara@mail.com', registerDate: '1403/10/10', paid: 9500000, note: 'برنامه‌نویس بک‌اند' },
  { id: 'st-5', name: 'حسین محمدی', phone: '09123456780', courseId: 'node-advanced', classId: 'cls-node-adv-1', email: 'hossein@mail.com', registerDate: '1403/10/11', paid: 9500000, note: 'تمکن مالی' },
  
  // دانش‌آموزان کلاس Python علمی
  { id: 'st-6', name: 'فاطمه کریمی', phone: '09124567890', courseId: 'python-scientific', classId: 'cls-python-sci-1', email: 'fatemeh@mail.com', registerDate: '1403/11/15', paid: 6500000, note: 'دانشجوی دکتری' },
  { id: 'st-7', name: 'رضا حسینی', phone: '09125678901', courseId: 'python-scientific', classId: 'cls-python-sci-1', email: 'reza@mail.com', registerDate: '1403/11/16', paid: 6000000, note: '500 هزار تومان باقی‌مانده' },
  { id: 'st-8', name: 'مریم علیزاده', phone: '09126789012', courseId: 'python-scientific', classId: 'cls-python-sci-1', email: 'maryam@mail.com', registerDate: '1403/11/17', paid: 6500000, note: 'مهندس' },
]

export function getStudents() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : initialStudents
}

export function saveStudents(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function addStudent(s) {
  const list = getStudents()
  const withId = { id: crypto.randomUUID?.() || String(Date.now()), ...s }
  saveStudents([withId, ...list])
  return withId
}

export function updateStudent(id, patch) {
  const list = getStudents().map(x => x.id === id ? { ...x, ...patch } : x)
  saveStudents(list)
  return list.find(x => x.id === id)
}

export function removeStudent(id) {
  const list = getStudents().filter(x => x.id !== id)
  saveStudents(list)
  return list
}

// کمکی: استخراج نام دوره از id
export function resolveCourseName(courseId) {
  const c = getCourses().find(x => x.id === courseId)
  return c?.name || ''
}

// کمکی: پایان کلاس از آخرین تاریخ جلسات
export function resolveClassEndDate(classId) {
  const cls = getClasses().find(x => x.id === classId)
  const last = (cls?.sessionDates || []).slice(-1)[0]
  return last || ''
}
