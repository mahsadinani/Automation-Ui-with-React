import DataTable from '../components/DataTable'
import { useEffect, useState } from 'react'
import FinanceForm from '../components/FinanceForm'
import { addFinanceRecord, getFinanceRecords, removeFinanceRecordAt, updateFinanceRecordAt, calculateRemainder } from '../services/finance'

export default function Finance() {
  const cols = ['تاریخ', 'نام', 'نام کلاس', 'مدرس', 'کد کلاس', 'شهریه کل', 'تخفیف (مبلغ)', 'تخفیف (درصد)', 'پیش‌پرداخت', 'تاریخ پیش‌پرداخت', 'قسط‌ها', 'باقی‌مانده', 'وضعیت پرداخت']

  const [records, setRecords] = useState([])
  const [editIndex, setEditIndex] = useState(null)
  const [newIns, setNewIns] = useState({ date: '', amount: '' })

  useEffect(() => {
    setRecords(getFinanceRecords())
  }, [])

  const rows = records.map(r => [
    r.date, r.name, r.className, r.teacher, r.classCode, r.totalFee, r.discountAmount, r.discountPercent,
    r.prepayment, r.prepaymentDate, (r.installments && r.installments.length
      ? r.installments.map(i => `${i.date}: ${i.amount}`).join('، ')
      : '—'), r.remainderAmount, r.paymentStatus
  ])

  const onSubmit = (f) => {
    const base = {
      ...f,
      totalFee: Number(f.totalFee || 0),
      discountAmount: Number(f.discountAmount || 0),
      discountPercent: Number(f.discountPercent || 0),
      prepayment: Number(f.prepayment || 0),
      installments: [],
    }
    const rec = { ...base, remainderAmount: calculateRemainder(base) }
    addFinanceRecord(rec)
    setRecords(getFinanceRecords())
  }

  const onDelete = (idx) => { removeFinanceRecordAt(idx); setRecords(getFinanceRecords()) }
  const onEdit = (idx) => setEditIndex(idx)

  const addInstallment = (e) => {
    e.preventDefault()
    if (editIndex === null) return
    const amount = Number(newIns.amount || 0)
    if (!newIns.date || isNaN(amount) || amount <= 0) return alert('تاریخ و مبلغ قسط را درست وارد کنید')
    const r = records[editIndex]
    const updatedInstallments = [...(r.installments || []), { date: newIns.date, amount }]
    const updated = { ...r, installments: updatedInstallments }
    const remainder = calculateRemainder(updated)
    updateFinanceRecordAt(editIndex, { installments: updatedInstallments, remainderAmount: remainder })
    setRecords(getFinanceRecords())
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
