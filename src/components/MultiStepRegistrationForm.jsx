import { useState } from 'react';
import { getCourses } from '../services/courses';
import { isValidJalali, parseJalali } from '../services/dateUtils';

export default function MultiStepRegistrationForm({ onSubmit }) {
  const [form, setForm] = useState({
    requestDate: '',
    fullName: '',
    phone: '',
    courses: [],
    status: '',
    sendMethod: 'Telegram',
    automationCourseInfo: false,
    automationPreReg: false,
    automationComplete: false,
    notes: '',
    whatsapp: '',
    telegram: '',
    howKnown: '',
    lastStatus: '',
  });

  const courses = getCourses();

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    const dateParsed = form.requestDate ? parseJalali(form.requestDate) : null;
    const payload = {
      ...form,
      requestDateIso: dateParsed?.iso || null,
      triggeredMessages: [
        form.automationCourseInfo ? 'courseInfo' : null,
        form.automationPreReg ? 'preRegistration' : null,
        form.automationComplete ? 'registrationComplete' : null,
      ].filter(Boolean),
    };
    onSubmit?.(payload);
  };

  return (
    <form onSubmit={submit}>
      <div className="form-row">
        <div>
          <label className="form-label">تاریخ درخواست (شمسی)</label>
          <input
            className="form-control"
            placeholder="1403/09/01"
            value={form.requestDate}
            onChange={(e) => setField('requestDate', e.target.value)}
          />
          {!form.requestDate || isValidJalali(form.requestDate) ? null : (
            <div style={{ color: '#fca5a5', fontSize: '0.85rem' }}>
              قالب صحیح: YYYY/MM/DD
            </div>
          )}
        </div>
        <div>
          <label className="form-label">نام و نام خانوادگی</label>
          <input
            className="form-control"
            value={form.fullName}
            onChange={(e) => setField('fullName', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">شماره تماس</label>
          <input
            className="form-control"
            value={form.phone}
            onChange={(e) => setField('phone', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">دوره‌های مورد نظر</label>
          <select
            className="form-select"
            multiple
            value={form.courses}
            onChange={(e) => {
              const opts = Array.from(e.target.selectedOptions).map((o) => o.value);
              setField('courses', opts);
            }}
          >
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">آخرین وضعیت</label>
          <select
            className="form-select"
            value={form.lastStatus}
            onChange={(e) => setField('lastStatus', e.target.value)}
          >
            <option value="">انتخاب</option>
            <option value="waiting">در انتظار واریز</option>
            <option value="preReg">ارسال فرم پیش ثبت نام</option>
            <option value="info">ارسال اطلاعات اولیه</option>
            <option value="cancel">انصراف از این دوره</option>
            <option value="noContact">هیچوقت تماس نگیرید</option>
            <option value="nextCourses">دوره‌های بعدی اطلاع داده شود</option>
            <option value="waitingResponse">در انتظار پاسخگویی متقاضی</option>
            <option value="completed">تکمیل ثبت نام</option>
          </select>
        </div>
        <div>
          <label className="form-label">یادداشت</label>
          <textarea
            className="form-control"
            value={form.notes}
            onChange={(e) => setField('notes', e.target.value)}
          />
        </div>
      </div>
      <div className="card-footer" style={{ display: 'flex', gap: '0.5rem' }}>
        <button type="submit" className="btn btn-accent">
          ثبت
        </button>
      </div>
    </form>
  );
}