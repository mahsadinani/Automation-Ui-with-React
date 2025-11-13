// سرویس کلاس‌ها: ذخیره‌سازی در localStorage و ساختار زمان‌بندی جلسات
import { saveCourses, getCourses } from './courses'

const STORAGE_KEY = 'classes'

export const initialClasses = [
  // نمونه ساده اولیه، می‌توانید خالی بگذارید
  { id: 'cls-react-basic-1', name: 'React مقدماتی', teacher: 'امین', code: 'RB-140309', capacity: 25,
    courseId: 'react-basic', fee: 7500000, sessionsCount: 12,
    startDate: '', weekdays: [1, 3], // یکشنبه و سه‌شنبه
    sessionDates: [], cancellations: {} },
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

