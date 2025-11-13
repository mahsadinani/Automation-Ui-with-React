import KpiCards from '../components/KpiCards'

export default function Dashboard() {
  const kpis = [
    { label: 'ثبت‌نام‌های امروز', value: 3 },
    { label: 'پیگیری‌های باز', value: 7 },
    { label: 'واریزی این هفته', value: '12,500,000 تومان' }
  ]
  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>داشبورد</h2>
      <KpiCards items={kpis} />
    </div>
  )
}
