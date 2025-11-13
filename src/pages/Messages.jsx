import { useEffect, useState } from 'react'
import { getMessages, saveMessages } from '../services/messages'

export default function Messages() {
  const [repo, setRepo] = useState(getMessages())
  useEffect(() => { setRepo(getMessages()) }, [])

  const setField = (k, v) => setRepo(r => ({ ...r, [k]: v }))
  const save = () => { saveMessages(repo); alert('پیام‌ها ذخیره شدند') }

  return (
    <div className="container">
      <h2 style={{ margin: '0 0 1rem' }}>پیام‌های آماده</h2>
      <div className="card">
        <div className="card-body">
          {Object.keys(repo).map(k => (
            <div key={k} style={{ marginBottom: '0.75rem' }}>
              <label className="form-label">{k}</label>
              <textarea className="form-control" value={repo[k]} onChange={e => setField(k, e.target.value)} />
            </div>
          ))}
          <button className="btn btn-accent" onClick={save}>ذخیره</button>
        </div>
      </div>
    </div>
  )
}
