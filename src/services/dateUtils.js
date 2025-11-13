import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

export function formatJalali(date) {
  if (!date) return ''
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD')
}

export function parseJalali(input) {
  // input: YYYY/MM/DD in Jalali calendar
  try {
    const d = dayjs(input, { jalali: true }).calendar('jalali')
    if (!d.isValid()) return null
    // return ISO string for storage if needed
    const g = dayjs({ year: d.year(), month: d.month(), date: d.date() })
    return { iso: g.toISOString(), display: input }
  } catch (e) {
    return null
  }
}

export function isValidJalali(input) {
  const p = parseJalali(input)
  return !!p
}

// تولید تاریخ جلسات بر اساس تاریخ شروع (جلالی)، روزهای هفته و تعداد جلسات
// weekdays: آرایه‌ای از شماره روزهای هفته به فارسی: شنبه=0 ... جمعه=6
export function generateSessionDates(startJalali, weekdays = [], count = 0) {
  if (!isValidJalali(startJalali) || !Array.isArray(weekdays) || weekdays.length === 0 || !count) return []
  // تبدیل تاریخ جلالی به gregorian برای محاسبه
  const parsed = parseJalali(startJalali)
  if (!parsed?.iso) return []
  let d = dayjs(parsed.iso)
  const results = []
  // محاسبه تا رسیدن به تعداد جلسات مورد نیاز
  while (results.length < count) {
    const dow = d.day() // 0=Sunday ... 6=Saturday در gregorian
    // نگاشت ساده: برای سازگاری با انتظار فارسی، فرض می‌کنیم شنبه=6، یکشنبه=0، دوشنبه=1، سه‌شنبه=2، چهارشنبه=3، پنجشنبه=4، جمعه=5
    const gregToPersian = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 }
    const persianDow = gregToPersian[dow]
    if (weekdays.includes(persianDow)) {
      // ذخیره به صورت جلالی با فرمت نمایش
      const display = dayjs(d.toISOString()).calendar('jalali').locale('fa').format('YYYY/MM/DD')
      results.push(display)
    }
    d = d.add(1, 'day')
    // توقف ایمنی
    if (results.length < count && results.length > count + 365) break
  }
  return results
}
