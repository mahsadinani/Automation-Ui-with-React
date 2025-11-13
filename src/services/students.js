// سرویس لیست شاگردان: ذخیره‌سازی در localStorage
import { getCourses } from './courses'
import { getClasses } from './classes'

const STORAGE_KEY = 'students'

export function getStudents() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : []
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
