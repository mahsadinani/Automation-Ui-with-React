// ساده: لیست اولیه دوره‌ها و بنرها (می‌توان از API بارگذاری کرد)
export const initialCourses = [
  // ساختار کامل رکورد دوره
  { id: 'react-basic', name: 'React مقدماتی', teacher: '', hours: '', sessions: '', totalFee: '', banner: '' },
]

export function getCourses() {
  const raw = localStorage.getItem('courses')
  return raw ? JSON.parse(raw) : initialCourses
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
