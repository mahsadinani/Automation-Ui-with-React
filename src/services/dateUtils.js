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
