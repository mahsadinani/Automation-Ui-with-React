import DataTable from '../components/DataTable'
import MultiStepRegistrationForm from '../components/MultiStepRegistrationForm'
import { useState } from 'react'
import { sendLeadToAutomation } from '../services/n8nClient'
import { getMessageByKey } from '../services/messages'

export default function Customers() {
  // اطمینان از هم‌ترازی ستون‌ها با داده‌ها؛ هر ردیف شامل همه فیلدهاست
  const [rows, setRows] = useState([
    ['1403/08/20', 'علی رضایی', '0912...', 'دوره مقدماتی', 'متقاضی', 'Telegram', 'معرفی دوستان', '0912...', '0935...', '—', 'بله', 'خیر', 'خیر'],
    ['1403/08/21', 'نگین مرادی', '0935...', 'پیشرفته', 'در انتظار خبر یا واریز', 'Telegram', 'اینستاگرام', '0935...', '—', '—', 'خیر', 'بله', 'خیر']
  ])

  const onSubmit = async (form) => {
    setRows(r => [[
      form.requestDate, form.fullName, form.phone,
      Array.isArray(form.courses) ? form.courses.join(', ') : form.courses,
      form.status, form.sendMethod, form.howKnown, form.whatsapp, form.telegram,
      form.notes,
      form.automationCourseInfo ? 'بله' : 'خیر',
      form.automationPreReg ? 'بله' : 'خیر',
      form.automationComplete ? 'بله' : 'خیر'
    ], ...r])
    const messages = (form.triggeredMessages || []).map(k => ({ key: k, text: getMessageByKey(k) }))
    const payload = { type: 'lead', source: 'react-ui', data: form, messages }
    const resp = await sendLeadToAutomation(payload)
    if (resp.ok) alert('به اتوماسیون ارسال شد')
    else alert('خطا در ارسال به اتوماسیون: ' + resp.error)
  }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>مشتریان</h2>
      <div className="card">
        <div className="card-header">فرم ثبت اطلاعات متقاضی</div>
        <div className="card-body">
          <MultiStepRegistrationForm onSubmit={onSubmit} />
        </div>
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="card-header">لیست متقاضیان</div>
        <div className="card-body">
          <DataTable columns={["تاریخ", "نام", "تماس", "دوره", "وضعیت", "روش ارسال", "نحوه آشنایی", "واتساپ", "تلگرام", "یادداشت", "اطلاعات دوره", "پیش‌ثبت‌نام", "تکمیل ثبت"]} rows={rows} />
        </div>
      </div>
    </div>
  )
}
