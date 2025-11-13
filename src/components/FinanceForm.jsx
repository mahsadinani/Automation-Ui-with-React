import { useEffect, useState } from 'react'
import { isValidJalali } from '../services/dateUtils'
import { getClasses } from '../services/classes'

export default function FinanceForm({ onSubmit }) {
  const [f, setF] = useState({
    date: '', name: '', className: '', teacher: '', classCode: '',
    totalFee: '', discountAmount: '', discountPercent: '',
    prepayment: '', prepaymentDate: '',
    remainderAmount: '', paymentStatus: '',
  })
  const [classes, setClasses] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  useEffect(() => { setClasses(getClasses()) }, [])
  const setField = (k, v) => setF(x => ({ ...x, [k]: v }))
  const calcRemainder = () => {
    const total = Number(f.totalFee || 0)
    const discAmt = Number(f.discountAmount || 0)
    const discPct = Number(f.discountPercent || 0)
    const prepay = Number(f.prepayment || 0)
    const pctValue = isNaN(discPct) ? 0 : (total * discPct / 100)
    const discountValue = discAmt > 0 ? discAmt : pctValue
    const remainder = Math.max(0, total - discountValue - prepay)
    return remainder
  }
  const submit = (e) => { e.preventDefault(); onSubmit?.({ ...f, remainderAmount: calcRemainder() }) }
  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <div>
          <label className="form-label">تاریخ (شمسی)</label>
          <input className="form-control" placeholder="1403/09/01" value={f.date} onChange={e => setField('date', e.target.value)} />
          {!f.date || isValidJalali(f.date) ? null : (<div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>قالب صحیح: YYYY/MM/DD</div>)}
        </div>
        <div>
          <label className="form-label">نام</label>
          <input className="form-control" value={f.name} onChange={e => setField('name', e.target.value)} />
        </div>
        <div>
          <label className="form-label">نام کلاس</label>
          <select className="form-control" value={selectedClassId} onChange={e => {
            const id = e.target.value
            setSelectedClassId(id)
            const cls = classes.find(c => c.id === id)
            if (cls) {
              setF(x => ({
                ...x,
                className: cls.name || '',
                teacher: cls.teacher || '',
                classCode: cls.code || '',
                totalFee: String(cls.fee ?? ''),
              }))
            }
          }}>
            <option value="">انتخاب کلاس</option>
            {classes.map(c => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
        <div>
          <label className="form-label">مدرس</label>
          <input className="form-control" value={f.teacher} onChange={e => setField('teacher', e.target.value)} />
        </div>
        <div>
          <label className="form-label">کد کلاس</label>
          <input className="form-control" value={f.classCode} onChange={e => setField('classCode', e.target.value)} />
        </div>
        <div>
          <label className="form-label">شهریه کل دوره</label>
          <input className="form-control" type="number" value={f.totalFee} onChange={e => setField('totalFee', e.target.value)} />
        </div>
        <div>
          <label className="form-label">جلسات باقی‌مانده (از کلاس)</label>
          <input className="form-control" value={(classes.find(c => c.id === selectedClassId)?.sessionsCount ?? '')} readOnly />
        </div>
        <div>
          <label className="form-label">تخفیف (مبلغ)</label>
          <input className="form-control" type="number" value={f.discountAmount} onChange={e => setField('discountAmount', e.target.value)} />
        </div>
        <div>
          <label className="form-label">تخفیف (درصد)</label>
          <input className="form-control" type="number" value={f.discountPercent} onChange={e => setField('discountPercent', e.target.value)} />
        </div>
        <div>
          <label className="form-label">پیش‌پرداخت</label>
          <input className="form-control" type="number" value={f.prepayment} onChange={e => setField('prepayment', e.target.value)} />
        </div>
        <div>
          <label className="form-label">تاریخ پیش‌پرداخت (شمسی)</label>
          <input className="form-control" placeholder="1403/09/01" value={f.prepaymentDate} onChange={e => setField('prepaymentDate', e.target.value)} />
          {!f.prepaymentDate || isValidJalali(f.prepaymentDate) ? null : (<div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>قالب صحیح: YYYY/MM/DD</div>)}
        </div>
        
        <div>
          <label className="form-label">مبلغ باقی‌مانده</label>
          <input className="form-control" type="number" value={calcRemainder()} readOnly />
        </div>
        <div>
          <label className="form-label">وضعیت پرداخت</label>
          <input className="form-control" value={f.paymentStatus} onChange={e => setField('paymentStatus', e.target.value)} placeholder="مثال: ثبت شد / در انتظار" />
        </div>
      </div>
      <div className="card-footer" style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <button className="btn btn-accent" type="submit">ثبت رکورد جدید</button>
      </div>
    </form>
  )
}
