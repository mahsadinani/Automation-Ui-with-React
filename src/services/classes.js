// سرویس کلاس‌ها: ذخیره‌سازی در localStorage و ساختار زمان‌بندی جلسات
import { saveCourses, getCourses } from './courses'

const STORAGE_KEY = 'classes'

export const initialClasses = [
  // کلاس نمونه ۱: React مقدماتی
  { id: 'cls-react-basic-1', name: 'React مقدماتی', teacher: 'امین', code: 'RB-140309', capacity: 25,
    courseId: 'react-basic', fee: 7500000, sessionsCount: 12,
    startDate: '1403/09/01', weekdays: [1, 3], // یکشنبه و سه‌شنبه
    sessionDates: ['1403/09/01','1403/09/03','1403/09/08','1403/09/10','1403/09/15','1403/09/17','1403/09/22','1403/09/24','1403/09/29','1403/10/01','1403/10/06','1403/10/08'], cancellations: {} },
  // کلاس نمونه ۲: Node.js پیشرفته
  { id: 'cls-node-adv-1', name: 'Node.js پیشرفته', teacher: 'سارا', code: 'NA-140310', capacity: 20,
    courseId: 'node-advanced', fee: 9500000, sessionsCount: 10,
    startDate: '1403/10/15', weekdays: [0, 2], // شنبه و دوشنبه
    sessionDates: ['1403/10/15','1403/10/17','1403/10/22','1403/10/24','1403/10/29','1403/10/31','1403/11/05','1403/11/07','1403/11/12','1403/11/14'], cancellations: {} },
  // کلاس نمونه ۳: Python علمی
  { id: 'cls-python-sci-1', name: 'Python علمی', teacher: 'رضا', code: 'PS-140311', capacity: 30,
    courseId: 'python-scientific', fee: 6500000, sessionsCount: 8,
    startDate: '1403/11/20', weekdays: [4], // فقط پنج‌شنبه‌ها
    sessionDates: ['1403/11/20','1403/11/27','1403/12/04','1403/12/11','1403/12/18','1403/12/25','1404/01/01','1404/01/08'], cancellations: {} },
]

export function getClasses() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : initialClasses
}

export function saveClasses(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function addClass(cls) {
  const list = getClasses()
  const withId = { id: crypto.randomUUID?.() || String(Date.now()), cancellations: {}, sessionDates: [], weekdays: [], ...cls }
  saveClasses([withId, ...list])
  return withId
}

export function removeClass(id) {
  const list = getClasses().filter(c => c.id !== id)
  saveClasses(list)
  return list
}

export function updateClass(id, patch) {
  const list = getClasses().map(c => c.id === id ? { ...c, ...patch } : c)
  saveClasses(list)
  return list.find(c => c.id === id)
}

export function getClassById(id) {
  return getClasses().find(c => c.id === id)
}

// اتصال خودکار به دوره‌ها: اگر courseId داده شود، از دوره‌ها اطلاعات را می‌خوانیم
export function autofillFromCourse(cls) {
  if (!cls?.courseId) return cls
  const course = getCourses().find(c => c.id === cls.courseId)
  if (!course) return cls
  // پرکردن ساعات/تعداد جلسات/شهریه در صورت موجود بودن
  const patch = {
    fee: cls.fee || course.totalFee || '',
    sessionsCount: cls.sessionsCount || course.sessions || '',
    hours: cls.hours || course.hours || '',
  }
  return { ...cls, ...patch }
}

