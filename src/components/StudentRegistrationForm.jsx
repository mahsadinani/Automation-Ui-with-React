import React, { useState, useEffect } from 'react'
import './StudentRegistrationForm.css'

const StudentRegistrationForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  
  const [formData, setFormData] = useState({
    // اطلاعات پایه
    requestDate: new Date().toISOString().split('T')[0],
    firstName: '',
    lastName: '',
    phoneNumber: '',
    whatsappNumber: '',
    telegramId: '',
    sameAsPhone: false,
    
    // دوره و وضعیت
    courses: [],
    status: 'در حال بررسی',
    howDidYouKnow: '',
    description: '',
    isPrivate: false,
    isReserved: false,
    classCode: '',
    
    // اقدامات اتوماسیون
    sendCourseInfo: false,
    sendPreRegistrationForm: false,
    completeRegistration: false,
    
    // ثبت‌نام نهایی
    courseClassId: '',
    note: ''
  })

  const statusOptions = ['در حال بررسی', 'تایید شده', 'رد شده', 'در انتظار پرداخت']
  const howDidYouKnowOptions = ['اینستاگرام', 'تلگرام', 'گوگل', 'معرف', 'سایر']

  useEffect(() => {
    // بارگذاری دوره‌ها
    const mockCourses = [
      { id: 1, name: 'ریاضیات پایه', price: 500000 },
      { id: 2, name: 'فیزیک پیشرفته', price: 600000 },
      { id: 3, name: 'شیمی عمومی', price: 450000 },
      { id: 4, name: 'زبان انگلیسی', price: 400000 }
    ];
    
    // بارگذاری کلاس‌ها
    const mockClasses = [
      { id: 1, courseId: 1, name: 'کلاس ریاضی ۱' },
      { id: 2, courseId: 1, name: 'کلاس ریاضی ۲' },
      { id: 3, courseId: 2, name: 'کلاس فیزیک ۱' },
      { id: 4, courseId: 2, name: 'کلاس فیزیک ۲' },
      { id: 5, courseId: 3, name: 'کلاس شیمی ۱' },
      { id: 6, courseId: 4, name: 'کلاس زیست ۱' }
    ]
    
    setCourses(mockCourses)
    setClasses(mockClasses)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSameAsPhoneChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      sameAsPhone: checked,
      whatsappNumber: checked ? prev.phoneNumber : '',
      telegramId: checked ? prev.phoneNumber : ''
    }))
  }

  const handleCourseToggle = (courseId) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.includes(courseId)
        ? prev.courses.filter(id => id !== courseId)
        : [...prev.courses, courseId]
    }))
  }

  const validateForm = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.phoneNumber.trim() &&
           formData.courses.length > 0 &&
           formData.courseClassId.trim()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <div className="student-registration-form">
      <div className="form-header">
        <div className="form-title">
          <div className="form-icon">🎯</div>
          <h2>ثبت‌نام دانش‌آموز جدید</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="registration-form">
        <div className="single-form-container">
          {/* اطلاعات شخصی */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">👤</div>
              <h3>اطلاعات شخصی</h3>
              <p className="section-description">اطلاعات پایه دانش‌آموز را وارد کنید</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label required">تاریخ درخواست</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.requestDate}
                  onChange={(e) => handleInputChange('requestDate', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">نام</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: علی"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">نام خانوادگی</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: احمدی"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label required">شماره تماس</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="مثال: 09123456789"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">شماره واتساپ</label>
                <input
                  type="tel"
                  className="form-control"
                  placeholder="مثال: 09123456789"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                  disabled={formData.sameAsPhone}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">آیدی تلگرام</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="مثال: @username"
                  value={formData.telegramId}
                  onChange={(e) => handleInputChange('telegramId', e.target.value)}
                />
              </div>
              
              <div className="form-group full-width">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sameAsPhone}
                    onChange={(e) => handleSameAsPhoneChange(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  شماره واتساپ و تلگرام همانند شماره تماس است
                </label>
              </div>
            </div>
          </div>

          {/* دوره و وضعیت */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">📚</div>
              <h3>دوره و وضعیت</h3>
              <p className="section-description">دوره مورد نظر و وضعیت ثبت‌نام را انتخاب کنید</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">دوره‌های مورد نظر</label>
                <div className="course-selection">
                  {courses.map(course => (
                    <label key={course.id} className="modern-checkbox course-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.courses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                      />
                      <span className="checkmark"></span>
                      <div className="course-info">
                        <span className="course-name">{course.name}</span>
                        <span className="course-price">{course.price.toLocaleString()} تومان</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label required">وضعیت</label>
                <select
                  className="form-control"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">نحوه آشنایی</label>
                <select
                  className="form-control"
                  value={formData.howDidYouKnow}
                  onChange={(e) => handleInputChange('howDidYouKnow', e.target.value)}
                >
                  <option value="">انتخاب کنید...</option>
                  {howDidYouKnowOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.isPrivate}
                    onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  کلاس خصوصی
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.isReserved}
                    onChange={(e) => handleInputChange('isReserved', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  رزرو شده
                </label>
              </div>
              
              {!formData.isReserved && (
                <div className="form-group">
                  <label className="form-label">کدکلاس</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.classCode}
                    onChange={(e) => handleInputChange('classCode', e.target.value)}
                    placeholder="کد کلاس را وارد کنید"
                  />
                </div>
              )}
              
              <div className="form-group full-width">
                <label className="form-label">توضیحات</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="توضیحات اضافی را اینجا وارد کنید..."
                />
              </div>
            </div>
          </div>

          {/* اقدامات اتوماسیون */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">⚙️</div>
              <h3>اقدامات اتوماسیون</h3>
              <p className="section-description">اقدامات خودکار مورد نظر را انتخاب کنید</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group checkbox-group">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sendCourseInfo}
                    onChange={(e) => handleInputChange('sendCourseInfo', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  ارسال اطلاعات دوره
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.sendPreRegistrationForm}
                    onChange={(e) => handleInputChange('sendPreRegistrationForm', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  ارسال فرم پیش‌ثبت‌نام
                </label>
              </div>
              
              <div className="form-group checkbox-group">
                <label className="modern-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.completeRegistration}
                    onChange={(e) => handleInputChange('completeRegistration', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  تکمیل ثبت‌نام
                </label>
              </div>
              
              {(formData.sendCourseInfo || formData.sendPreRegistrationForm || formData.completeRegistration) && (
                <div className="info-box">
                  <div className="info-icon">💡</div>
                  <div className="info-content">
                    <p><strong>نکته:</strong> در صورت انتخاب موارد بالا، پیام‌های مربوطه از مخزن پیام‌های آماده ارسال خواهند شد.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ثبت‌نام نهایی */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">🎓</div>
              <h3>ثبت‌نام نهایی</h3>
              <p className="section-description">اطلاعات نهایی را وارد و ثبت‌نام را تکمیل کنید</p>
            </div>
            
            <div className="form-grid">
              <div className="form-group full-width">
                <label className="form-label required">دوره/کلاس</label>
                <select
                  className="form-control"
                  value={formData.courseClassId}
                  onChange={(e) => handleInputChange('courseClassId', e.target.value)}
                  required
                >
                  <option value="">انتخاب دوره/کلاس</option>
                  {courses.map(course => (
                    <optgroup key={course.id} label={course.name}>
                      {classes.filter(cls => cls.courseId === course.id).map(cls => (
                        <option key={cls.id} value={`${course.id}-${cls.id}`}>
                          {course.name} - {cls.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <div className="form-group full-width">
                <label className="form-label">یادداشت</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={formData.note}
                  onChange={(e) => handleInputChange('note', e.target.value)}
                  placeholder="یادداشت‌های مهم درباره دانش‌آموز..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={!validateForm()}>
            <span className="btn-icon">✓</span>
            ثبت نهایی
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>
            <span className="btn-icon">✕</span>
            انصراف
          </button>
        </div>
      </form>
    </div>
  )
}

export default StudentRegistrationForm