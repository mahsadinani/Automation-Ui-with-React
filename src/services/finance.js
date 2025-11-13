const STORAGE_KEY = 'finance'

export const initialFinance = [
  {
    date: '1403/08/22', name: 'علی رضایی', className: 'React مقدماتی', teacher: 'امین', classCode: 'RB-140309',
    totalFee: 7500000, discountAmount: 500000, discountPercent: 0, prepayment: 1000000, prepaymentDate: '1403/08/22',
    installments: [{ date: '1403/09/01', amount: 1000000 }, { date: '1403/10/01', amount: 1000000 }, { date: '1403/11/01', amount: 1000000 }],
    remainderAmount: 4000000, paymentStatus: 'ثبت شد'
  }
]

export function getFinanceRecords() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : initialFinance
}

export function saveFinanceRecords(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function addFinanceRecord(rec) {
  const list = getFinanceRecords()
  saveFinanceRecords([rec, ...list])
  return rec
}

export function removeFinanceRecordAt(index) {
  const list = getFinanceRecords().filter((_, i) => i !== index)
  saveFinanceRecords(list)
  return list
}

export function updateFinanceRecordAt(index, patch) {
  const list = getFinanceRecords().map((r, i) => i === index ? { ...r, ...patch } : r)
  saveFinanceRecords(list)
  return list[index]
}

export function calculateRemainder({ totalFee = 0, discountAmount = 0, discountPercent = 0, prepayment = 0, installments = [] }) {
  const total = Number(totalFee || 0)
  const discAmt = Number(discountAmount || 0)
  const discPct = Number(discountPercent || 0)
  const prepay = Number(prepayment || 0)
  const pctValue = isNaN(discPct) ? 0 : (total * discPct / 100)
  const discountValue = discAmt > 0 ? discAmt : pctValue
  const paidInstallments = (installments || []).reduce((sum, i) => sum + Number(i.amount || 0), 0)
  const remainder = Math.max(0, total - discountValue - prepay - paidInstallments)
  return remainder
}

export function countUnsettledPeople() {
  return getFinanceRecords().filter(r => Number(r.remainderAmount || 0) > 0).length
}
