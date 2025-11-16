// سرویس لیست مدرسین: ذخیره‌سازی در localStorage و مقداردهی اولیه از دوره‌ها/کلاس‌ها
import { getCourses } from './courses'
import { getClasses } from './classes'

const STORAGE_KEY = 'teachers'

export function getTeachers() {
  const raw = localStorage.getItem(STORAGE_KEY)
  const list = raw ? JSON.parse(raw) : []
  if (list.length) return list
  // مقداردهی اولیه از روی دوره‌ها و کلاس‌ها
  const names = new Set()
  const extract = (s='') => String(s)
    .split(/[،,&،،]|\band\b|\+|\//)
    .map(x => x.replace(/^(آقای|خانم|استاد|مدرس|گروه مدرسین)\s*/,'').trim())
    .filter(Boolean)
  getCourses().forEach(c => extract(c.teacher).forEach(n => names.add(n)))
  getClasses().forEach(cl => extract(cl.teacher).forEach(n => names.add(n)))
  const seeded = Array.from(names).slice(0, 50).map(n => ({ id: crypto.randomUUID?.() || String(Date.now())+Math.random(), name: n, phone: '' }))
  if (seeded.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
  return seeded
}

export function saveTeachers(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function addTeacher(t) {
  const list = getTeachers()
  const withId = { id: crypto.randomUUID?.() || String(Date.now()), name: t.name?.trim(), phone: t.phone?.trim() || '' }
  saveTeachers([withId, ...list])
  return withId
}

export function updateTeacher(id, patch) {
  const list = getTeachers().map(x => x.id === id ? { ...x, ...patch } : x)
  saveTeachers(list)
  return list.find(x => x.id === id)
}

export function removeTeacher(id) {
  const list = getTeachers().filter(x => x.id !== id)
  saveTeachers(list)
  return list
}

