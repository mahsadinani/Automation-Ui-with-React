const defaultMessages = {
  courseInfo: 'اطلاعات دوره برای شما ارسال شد.',
  preRegistration: 'فرم پیش‌ثبت‌نام برای شما ارسال شد.',
  registrationComplete: 'ثبت‌نام شما با موفقیت تکمیل شد.',
  reminderPayment: 'یادآوری پرداخت شهریه دوره.',
  classAnnouncement: 'اطلاع‌رسانی برای شرکت‌کنندگان کلاس.',
}

export function getMessages() {
  const raw = localStorage.getItem('messagesRepo')
  return raw ? JSON.parse(raw) : defaultMessages
}

export function saveMessages(map) {
  localStorage.setItem('messagesRepo', JSON.stringify(map))
}

export function getMessageByKey(key) {
  const repo = getMessages()
  return repo[key] || ''
}
