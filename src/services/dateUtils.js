import dayjs from 'dayjs'
import jalaliday from 'jalaliday'

dayjs.extend(jalaliday)

// تبدیل ارقام فارسی/عربی به لاتین
function normalizeDigits(str) {
  if (!str) return ''
  const fa = ''
  const ar = ''
  return String(str)
    .replace(/[\u06F0-\u06F9]/g, d => String(fa.indexOf(d)))
    .replace(/[\u0660-\u0669]/g, d => String(ar.indexOf(d)))
}

// الگوریتم ساده تبدیل جلالی به میلادی (بدون وابستگی خارجی)
// منبع: پیاده‌سازی شناخته‌شده‌ی jalaali-js (مختصر شده برای نیاز فعلی)
function jalaliToGregorian(jy, jm, jd) {
  jy = +jy; jm = +jm; jd = +jd
  const gy = jy + 621
  const breaks = [-61,9,38,199,426,686,756,818,1111,1181,1210,1635,2060,2097,2192,2262,2324,2394,2456,3178]
  let bl = breaks.length, jp = breaks[0], jump = 0
  for (let i = 1; i < bl; i += 1) {
    const jmpt = breaks[i]
    jump = jmpt - jp
    if (jy < jmpt) break
    jp = jmpt
  }
  let n = jy - jp
  let leapJ = -14, leapG = gy >> 2
  leapJ += ((n + 1) >> 2)
  if (jump % 33 === 4 && jump - n === 4) leapJ += 1
  let march = 20 + leapJ - leapG + ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0) ? 1 : 0)
  let gDayNo = 365 * gy + ((gy + 3) >> 2) - ((gy + 99) / 100 | 0) + ((gy + 399) / 400 | 0)
  gDayNo += march - 1
  gDayNo += jd + (jm <= 7 ? (jm - 1) * 31 : ((jm - 7) * 30 + 186))
  let gd = gDayNo
  let gy2 = (gd * 4 + 3) / 146097 | 0
  gd = gd - ((gy2 * 146097) / 4 | 0)
  let gy3 = (gd * 4 + 3) / 1461 | 0
  gd = gd - ((gy3 * 1461) / 4 | 0)
  let gd2 = (gd * 5 + 2) / 153 | 0
  const day = gd - ((gd2 * 153 + 2) / 5 | 0) + 1
  const month = gd2 + 3 - 12 * (gd2 / 10 | 0)
  const year = gy2 * 100 + gy3
  return { gy: year, gm: month, gd: day }
}

export function formatJalali(date) {
  if (!date) return ''
  return dayjs(date).calendar('jalali').locale('fa').format('YYYY/MM/DD')
}

export function parseJalali(input) {
  // ورودی: YYYY/MM/DD (ارقام فارسی/لاتین مجاز)
  try {
    const raw = normalizeDigits(input).trim()
    const m = raw.match(/^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/)
    if (!m) return null
    let [ , y, mo, da ] = m
    const jy = Number(y), jm = Number(mo), jd = Number(da)
    if (jm < 1 || jm > 12 || jd < 1 || jd > 31) return null
    const g = jalaliToGregorian(jy, jm, jd)
    // ساخت تاریخ میلادی معتبر برای ذخیره‌سازی/محاسبه
    const iso = new Date(Date.UTC(g.gy, g.gm - 1, g.gd, 12, 0, 0)).toISOString()
    const display = `${String(jy).padStart(4,'0')}/${String(jm).padStart(2,'0')}/${String(jd).padStart(2,'0')}`
    return { iso, display }
  } catch {
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
  const parsed = parseJalali(startJalali)
  if (!parsed?.iso) return []
  let d = dayjs(parsed.iso)
  const results = []
  const gregToPersian = { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 0 }
  while (results.length < count) {
    const dow = d.day() // 0=Sun..6=Sat
    const persianDow = gregToPersian[dow]
    if (weekdays.includes(persianDow)) {
      const display = dayjs(d.toISOString()).calendar('jalali').locale('fa').format('YYYY/MM/DD')
      results.push(display)
    }
    d = d.add(1, 'day')
    if (results.length < count && results.length > count + 365) break
  }
  return results
}
