import React, { useState } from 'react';
import DataTable from '../components/DataTable';
import MultiStepRegistrationForm from '../components/MultiStepRegistrationForm';
import { sendLeadToAutomation } from '../services/n8nClient';
import { getMessageByKey } from '../services/messages';
import { addStudent } from '../services/students';

const columns = [
  "تاریخ",
  "نام",
  "تماس",
  "دوره",
  "وضعیت",
  "روش ارسال",
  "نحوه آشنایی",
  "واتساپ",
  "تلگرام",
  "یادداشت",
  "اطلاعات دوره",
  "پیش‌ثبت‌نام",
  "تکمیل ثبت",
];

export default function Customers() {
  const [rows, setRows] = useState([
    ['1403/08/20', 'علی رضایی', '0912...', 'دوره مقدماتی', 'متقاضی', 'Telegram', 'معرفی دوستان', '0912...', '0935...', '—', 'بله', 'خیر', 'خیر'],
    ['1403/08/21', 'نگین مرادی', '0935...', 'پیشرفته', 'در انتظار خبر یا واریز', 'Telegram', 'اینستاگرام', '0935...', '—', '—', 'خیر', 'بله', 'خیر']
  ]);

  const [editIndex, setEditIndex] = useState(null);
  const [editNote, setEditNote] = useState('');

  const onSubmit = async (form) => {
    setRows((r) => [
      [
        form.requestDate,
        form.fullName,
        form.phone,
        Array.isArray(form.courses) ? form.courses.join(', ') : form.courses,
        form.status,
        form.sendMethod,
        form.howKnown,
        form.whatsapp,
        form.telegram,
        form.notes,
        form.automationCourseInfo ? 'بله' : 'خیر',
        form.automationPreReg ? 'بله' : 'خیر',
        form.automationComplete ? 'بله' : 'خیر'
      ],
      ...r
    ]);
    const messages = (form.triggeredMessages || []).map((k) => ({ key: k, text: getMessageByKey(k) }));
    const payload = { type: 'lead', source: 'react-ui', data: form, messages };
    const resp = await sendLeadToAutomation(payload);
    if (resp.ok) alert('به اتوماسیون ارسال شد');
    else alert('خطا در ارسال به اتوماسیون: ' + resp.error);
  };

  const handleTransferToStudents = (index) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      const selectedRow = updatedRows[index];
      selectedRow[4] = 'تکمیل ثبت نام'; // تغییر وضعیت به "تکمیل ثبت نام"

      addStudent({
        name: selectedRow[1],
        phone: selectedRow[2],
        email: selectedRow[2],
        courseId: selectedRow[5],
        courseName: selectedRow[3], // اصلاح مقدار نام دوره به ستون صحیح
        note: selectedRow[9],
      });

      return updatedRows;
    });
  };

  const handleEditNotes = (index) => {
    const selectedRow = rows[index];
    setEditIndex(index);
    setEditNote(selectedRow[9]);
  };

  const saveNote = () => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows[editIndex][9] = editNote;
      return updatedRows;
    });
    setEditIndex(null);
    setEditNote('');
  };

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
          <DataTable
            columns={columns}
            rows={rows}
            onTransfer={handleTransferToStudents}
            onEditNotes={handleEditNotes}
          />
        </div>
      </div>

      {editIndex !== null && (
        <div className="modal" style={{ display: 'block', background: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">ویرایش یادداشت</h5>
                <button type="button" className="btn-close" onClick={() => setEditIndex(null)}></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                ></textarea>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setEditIndex(null)}>
                  لغو
                </button>
                <button className="btn btn-primary" onClick={saveNote}>
                  ذخیره
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}