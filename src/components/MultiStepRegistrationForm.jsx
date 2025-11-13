import { useState } from 'react'
import { getCourses } from '../services/courses'
import { isValidJalali, parseJalali } from '../services/dateUtils'

export default function MultiStepRegistrationForm({ onSubmit }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    requestDate: '', fullName: '', phone: '', courses: [], status: '', sendMethod: 'Telegram',
    automationCourseInfo: false, automationPreReg: false, automationComplete: false, notes: '',
    whatsapp: '', telegram: '', howKnown: '', lastStatus: []
  })
  const courses = getCourses()

  const next = () => setStep(s => Math.min(3, s + 1))
  const prev = () => setStep(s => Math.max(1, s - 1))
  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = (e) => {
    e.preventDefault()
    const dateParsed = form.requestDate ? parseJalali(form.requestDate) : null
    const payload = {
      ...form,
      requestDateIso: dateParsed?.iso || null,
      triggeredMessages: [
        form.automationCourseInfo ? 'courseInfo' : null,
        form.automationPreReg ? 'preRegistration' : null,
        form.automationComplete ? 'registrationComplete' : null,
      ].filter(Boolean)
    }
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={submit}>
      {step === 1 && (
        <div className="form-row">
          <div>
            <label className="form-label">تاریخ درخواست (شمسی)</label>
            <input className="form-control" placeholder="1403/09/01" value={form.requestDate} onChange={e => setField('requestDate', e.target.value)} />
            {!form.requestDate || isValidJalali(form.requestDate) ? null : (
              <div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>قالب صحیح: YYYY/MM/DD</div>
            )}
          </div>
          <div>
            <label className="form-label">نام و نام خانوادگی</label>
            <input className="form-control" value={form.fullName} onChange={e => setField('fullName', e.target.value)} />
          </div>
          <div>
            <label className="form-label">شماره تماس</label>
            <input className="form-control" value={form.phone} onChange={e => setField('phone', e.target.value)} />
          </div>
          <div>
            <label className="form-label">دوره‌های مورد نظر</label>
            <select className="form-select" multiple value={form.courses} onChange={e => {
              const opts = Array.from(e.target.selectedOptions).map(o => o.value)
              setField('courses', opts)
            }}>
              {courses.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="form-row">
          <div>
            <label className="form-label">وضعیت</label>
            <select className="form-select" value={form.status} onChange={e => setField('status', e.target.value)}>
              <option value="">انتخاب</option>
              <option>متقاضی</option>
              <option>منصرف شده</option>
              <option>اطلاع‌رسانی دوره‌های بعدی</option>
              <option>در انتظار خبر یا واریز</option>
            </select>
          </div>
          <div>
            <label className="form-label">ارسال اطلاعات دوره</label>
            <input type="checkbox" checked={form.automationCourseInfo} onChange={e => setField('automationCourseInfo', e.target.checked)} />
          </div>
          <div>
            <label className="form-label">ارسال فرم پیش ثبت نام</label>
            <input type="checkbox" checked={form.automationPreReg} onChange={e => setField('automationPreReg', e.target.checked)} />
          </div>
          <div>
            <label className="form-label">تکمیل ثبت نام</label>
            <input type="checkbox" checked={form.automationComplete} onChange={e => setField('automationComplete', e.target.checked)} />
          </div>
          <div>
            <label className="form-label">نحوه آشنایی</label>
            <input className="form-control" value={form.howKnown} onChange={e => setField('howKnown', e.target.value)} />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="form-row">
          <div>
            <label className="form-label">شماره واتساپ</label>
            <input className="form-control" value={form.whatsapp} onChange={e => setField('whatsapp', e.target.value)} />
          </div>
          <div>
            <label className="form-label">شماره تلگرام</label>
            <input className="form-control" value={form.telegram} onChange={e => setField('telegram', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <label className="form-label">یادداشت</label>
            <textarea className="form-control" value={form.notes} onChange={e => setField('notes', e.target.value)} />
          </div>
        </div>
      )}
      <div className="card-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        {step > 1 && <button type="button" className="btn btn-secondary" onClick={prev}>مرحله قبل</button>}
        {step < 3 && <button type="button" className="btn btn-accent" onClick={next}>مرحله بعد</button>}
        {step === 3 && <button type="submit" className="btn btn-accent">ثبت</button>}
      </div>
    </form>
  )
}
