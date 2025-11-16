import { useEffect, useMemo, useState } from 'react'
import { addTeacher, getTeachers, removeTeacher, updateTeacher } from '../services/teachers'

export default function Teachers() {
  const [list, setList] = useState([])
  const [form, setForm] = useState({ name: '', phone: '' })
  const [editId, setEditId] = useState(null)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('name')
  const [sortDir, setSortDir] = useState('asc')

  useEffect(() => {
    setList(getTeachers())
  }, [])

  const filtered = useMemo(() => {
    let res = list
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      res = res.filter(t => t.name.toLowerCase().includes(q) || t.phone.includes(q))
    }
    res.sort((a, b) => {
      const A = String(a[sortKey] || '').toLowerCase()
      const B = String(b[sortKey] || '').toLowerCase()
      if (A < B) return sortDir === 'asc' ? -1 : 1
      if (A > B) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return res
  }, [list, search, sortKey, sortDir])

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const submit = (e) => {
    e.preventDefault()
    if (!form.name?.trim()) return alert('نام مدرس را وارد کنید')
    if (editId) {
      updateTeacher(editId, { name: form.name.trim(), phone: form.phone?.trim() || '' })
    } else {
      addTeacher({ name: form.name.trim(), phone: form.phone?.trim() || '' })
    }
    setList(getTeachers())
    setForm({ name: '', phone: '' })
    setEditId(null)
  }

  const onEdit = (id) => {
    setEditId(id)
    const t = list.find(x => x.id === id)
    if (t) setForm({ name: t.name || '', phone: t.phone || '' })
  }

  const onRemove = (id) => {
    if (!window.confirm('حذف مدرس؟')) return
    removeTeacher(id)
    setList(getTeachers())
  }

  const SortIcon = ({ colKey }) => sortKey === colKey && <span>{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>

  return (
    <div style={{ maxWidth: 800, margin: '2rem auto', padding: '0 1rem', fontFamily: 'Tahoma, Arial' }}>
      <h2 style={{ marginBottom: '1rem' }}>لیست مدرسین</h2>

      <form onSubmit={submit} style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem', flexWrap: 'wrap', background: '#f9f9f9', padding: '1rem', borderRadius: 8 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ display: 'block', marginBottom: '.25rem', fontSize: 14 }}>نام مدرس</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            style={{ width: '100%', padding: '.5rem' }}
            required
          />
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <label style={{ display: 'block', marginBottom: '.25rem', fontSize: 14 }}>شماره تماس</label>
          <input
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            style={{ width: '100%', padding: '.5rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '.5rem' }}>
          <button type="submit" style={{ padding: '.5rem 1rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: 4 }}>
            {editId ? 'ثبت ویرایش' : 'افزودن'}
          </button>
          {editId && (
            <button type="button" onClick={() => { setEditId(null); setForm({ name: '', phone: '' }) }} style={{ padding: '.5rem 1rem', background: '#6c757d', color: '#fff', border: 'none', borderRadius: 4 }}>
              انصراف
            </button>
          )}
        </div>
      </form>

      <input
        placeholder="جستجو بر اساس نام یا تلفن..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: 4 }}
      />

      <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #ddd', borderRadius: 8 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: '.75rem', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('name')}>
                نام مدرس <SortIcon colKey="name" />
              </th>
              <th style={{ padding: '.75rem', textAlign: 'right', cursor: 'pointer' }} onClick={() => handleSort('phone')}>
                تلفن <SortIcon colKey="phone" />
              </th>
              <th style={{ padding: '.75rem', textAlign: 'center' }}>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id} style={{ borderTop: '1px solid #eee' }}>
                <td style={{ padding: '.75rem' }}>{t.name}</td>
                <td style={{ padding: '.75rem' }}>{t.phone || '—'}</td>
                <td style={{ padding: '.75rem', textAlign: 'center' }}>
                  <button onClick={() => handleEdit(t)} style={{ marginLeft: '.25rem', padding: '.25rem .5rem', fontSize: 12 }}>ویرایش</button>
                  <button onClick={() => handleDelete(t.id)} style={{ padding: '.25rem .5rem', fontSize: 12, background: '#dc3545', color: '#fff', border: 'none', borderRadius: 3 }}>حذف</button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: '#888' }}>
                  مدرسی یافت نشد.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

