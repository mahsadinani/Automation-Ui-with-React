import KpiCards from '../components/KpiCards'
import { getStudents } from '../services/students'
import { getClasses } from '../services/classes'
import { getFinanceRecords, countUnsettledPeople } from '../services/finance'

function sessionsRemaining(cls) {
  const total = Number(cls.sessionsCount || 0)
  const held = (cls.sessionDates || []).length
  const makeups = Number(cls.makeupsCount || 0)
  const executed = held + makeups
  return Math.max(0, total - executed)
}

export default function Dashboard() {
  const students = getStudents()
  const classes = getClasses()
  const finance = getFinanceRecords()

  const classRemainingMap = Object.fromEntries(classes.map(c => [c.id, sessionsRemaining(c)]))

  const studentsInTraining = students.filter(s => s.classId && classRemainingMap[s.classId] > 0).length
  const classesOngoing = classes.filter(c => sessionsRemaining(c) > 0).length
  const unsettled = countUnsettledPeople()
  const classesNearEnd = classes.filter(c => {
    const total = Number(c.sessionsCount || 0)
    const rem = sessionsRemaining(c)
    return total > 0 && rem > 0 && rem < total / 3
  }).length
  const teachersCount = Array.from(new Set(classes.map(c => (c.teacher || '').trim()).filter(Boolean))).length

  const kpis = [
    { label: 'شاگردان در حال آموزش', value: studentsInTraining },
    { label: 'کلاس‌های در حال برگزاری', value: classesOngoing },
    { label: 'افراد تسویه‌نشده', value: unsettled },
    { label: 'کلاس‌های رو به اتمام', value: classesNearEnd },
    { label: 'تعداد اساتید', value: teachersCount },
  ]
  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>داشبورد</h2>
      <KpiCards items={kpis} />
    </div>
  )
}
