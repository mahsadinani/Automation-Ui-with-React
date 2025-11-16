// سرویس پردازش فایل Markdown
export async function parseMarkdownFile(file) {
  if (!file || !file.name.toLowerCase().endsWith('.md')) {
    throw new Error('فقط فایل‌های Markdown (.md) پشتیبانی می‌شوند.')
  }
  const text = await file.text()
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const courses = []

  // پیدا کردن خطوط جدول (خطوطی که شامل | هستند و با عدد شروع می‌شوند)
  const tableRows = lines.filter(l => l.includes('|') && /^\d+\s*\|/.test(l))

  for (const row of tableRows) {
    const parts = row.split('|').map(p => p.trim()).filter(Boolean)
    // ساختار: ردیف | دوره | مدرس | ساعت | تعداد جلسات | قیمت
    if (parts.length >= 6) {
      const [, nameFa, teacher, hoursStr, sessionsStr, feeStr] = parts.slice(0, 6)
      const hours = Number(hoursStr.replace(/[^\d]/g, ''))
      const sessions = Number(sessionsStr.replace(/[^\d]/g, ''))
      const fee = Number(feeStr.replace(/[^\d]/g, ''))
      if (nameFa && !isNaN(hours) && !isNaN(sessions)) {
        courses.push({
          id: normalizeId(nameFa),
          nameFa,
          nameEn: guessLatinName(nameFa),
          teacher: teacher || '',
          hours,
          sessions,
          fee: !isNaN(fee) ? fee : 0,
        })
      }
    }
  }
  return courses
}

function normalizeId(name) {
  return name
    .replace(/[^\w\s\u0600-\u06FF]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .toUpperCase()
}

function guessLatinName(faName) {
  // تبدیل ساده برخی کلمات رایج
  const map = {
    'ICDL': 'ICDL',
    'ورد': 'Word',
    'اکسل': 'Excel',
    'پاورپوینت': 'PowerPoint',
    'فتوشاپ': 'Photoshop',
    'برنامه‌نویسی': 'Programming',
    'طراحی': 'Design',
    'آموزش': 'Training',
    'جامع': 'Complete',
    'مقدماتی': 'Beginner',
    'پیشرفته': 'Advanced',
  }
  let en = faName
  for (const [fa, enWord] of Object.entries(map)) {
    en = en.replace(new RegExp(fa, 'g'), enWord)
  }
  return en || faName
}