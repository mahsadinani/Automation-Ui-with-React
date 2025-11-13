import DataTable from '../components/DataTable'
import { useState } from 'react'
import FinanceForm from '../components/FinanceForm'

export default function Finance() {
  const cols = ['تاریخ', 'نام', 'نام کلاس', 'مدرس', 'کد کلاس', 'شهریه کل', 'تخفیف (مبلغ)', 'تخفیف (درصد)', 'پیش‌پرداخت', 'تاریخ پیش‌پرداخت', 'قسط‌ها', 'باقی‌مانده', 'وضعیت پرداخت']

  const [records, setRecords] = useState([
    {
      date: '1403/08/22', name: 'علی رضایی', className: 'React مقدماتی', teacher: 'امین', classCode: 'RB-140309',
      totalFee: 7500000, discountAmount: 500000, discountPercent: 0, prepayment: 1000000, prepaymentDate: '1403/08/22',
      installments: [{ date: '1403/09/01', amount: 1000000 }, { date: '1403/10/01', amount: 1000000 }, { date: '1403/11/01', amount: 1000000 }],
      remainderAmount: 4000000, paymentStatus: 'ثبت شد'
    }
  ])
  const [editIndex, setEditIndex] = useState(null)
  const [newIns, setNewIns] = useState({ date: '', amount: '' })

  const rows = records.map(r => [
    r.date, r.name, r.className, r.teacher, r.classCode, r.totalFee, r.discountAmount, r.discountPercent,
    r.prepayment, r.prepaymentDate, (r.installments && r.installments.length
      ? r.installments.map(i => `${i.date}: ${i.amount}`).join('، ')
      : '—'), r.remainderAmount, r.paymentStatus
  ])

  const onSubmit = (f) => {
    const rec = {
      ...f,
      totalFee: Number(f.totalFee || 0),
      discountAmount: Number(f.discountAmount || 0),
      discountPercent: Number(f.discountPercent || 0),
      prepayment: Number(f.prepayment || 0),
      installments: [],
      remainderAmount: Number(f.remainderAmount || 0),
    }
    setRecords(rs => [rec, ...rs])
  }

  const onDelete = (idx) => setRecords(rs => rs.filter((_, i) => i !== idx))
  const onEdit = (idx) => setEditIndex(idx)

  const addInstallment = (e) => {
    e.preventDefault()
    if (editIndex === null) return
    const amount = Number(newIns.amount || 0)
    if (!newIns.date || isNaN(amount) || amount <= 0) return alert('تاریخ و مبلغ قسط را درست وارد کنید')
    setRecords(rs => rs.map((r, i) => {
      if (i !== editIndex) return r
      const updatedInstallments = [...(r.installments || []), { date: newIns.date, amount }]
      const remainder = Math.max(0, Number(r.remainderAmount || 0) - amount)
      return { ...r, installments: updatedInstallments, remainderAmount: remainder }
    }))
    setNewIns({ date: '', amount: '' })
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>مالی</h2>
      <div className="card">
        <div className="card-header">ثبت رکورد جدید</div>
        <div className="card-body">
          <FinanceForm onSubmit={onSubmit} />
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">لیست مالی</div>
        <div className="card-body">
          <DataTable columns={cols} rows={rows} onDelete={onDelete} onEdit={onEdit} />
        </div>
      </div>
      {editIndex !== null && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="card-header">ویرایش رکورد</div>
          <div className="card-body">
            <form onSubmit={addInstallment} className="form-row">
              <div>
                <label className="form-label">اضافه کردن قسط جدید - تاریخ (شمسی)</label>
                <input className="form-control" placeholder="1403/10/01" value={newIns.date} onChange={e => setNewIns(x => ({ ...x, date: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">مبلغ قسط</label>
                <input className="form-control" type="number" value={newIns.amount} onChange={e => setNewIns(x => ({ ...x, amount: e.target.value }))} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <button className="btn btn-accent" type="submit">افزودن قسط جدید</button>
                <button type="button" className="btn btn-secondary" style={{ marginInlineStart: '0.5rem' }} onClick={() => setEditIndex(null)}>بستن ویرایش</button>
              </div>
            </form>
            <div style={{ marginTop: '0.5rem' }}>
              <strong>مبلغ باقی‌مانده: </strong>{records[editIndex]?.remainderAmount ?? '—'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
