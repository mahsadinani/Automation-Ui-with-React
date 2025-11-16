// تابع تست برای بارگذاری مستقیم فایل MD لیست قیمت واقعی
export async function loadLocalPriceList() {
  try {
    const response = await fetch('/هزینه دوره ها/لیست قیمت کلاس_های مجتمع فنی مهرکار (پاییز 1404)')
    if (!response.ok) throw new Error('فایل یافت نشد')
    const text = await response.text()
    return parseMarkdownText(text)
  } catch (err) {
    console.warn('بارگذاری فایل محلی ناموفق:', err.message)
    return []
  }
}

function parseMarkdownText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const courses = []
  const tableRows = lines.filter(l => l.includes('|') && /^\d+\s*\|/.test(l))
  for (const row of tableRows) {
    const parts = row.split('|').map(p => p.trim()).filter(Boolean)
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
  const map = {
    'ICDL': 'ICDL',
    'ورد': 'Word',
    'اکسل': 'Excel',
    'پاورپوینت': 'PowerPoint',
    'فتوشاپ': 'Photoshop',
    'ایلوستریتور': 'Illustrator',
    'افترافکت': 'AfterEffects',
    'کورل': 'Corel',
    'برنامه‌نویسی': 'Programming',
    'طراحی': 'Design',
    'آموزش': 'Training',
    'جامع': 'Complete',
    'مقدماتی': 'Beginner',
    'پیشرفته': 'Advanced',
    'شبکه': 'Network',
    'سایت': 'Website',
    'وردپرس': 'WordPress',
    'سئو': 'SEO',
    'UI-UX': 'UI-UX',
  }
  let en = faName
  for (const [fa, enWord] of Object.entries(map)) {
    en = en.replace(new RegExp(fa, 'g'), enWord)
  }
  return en || faName
}