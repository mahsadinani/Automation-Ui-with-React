export default function DataTable({ columns = [], rows = [], onDelete, onEdit }) {
  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((c, i) => (<th key={i}>{c}</th>))}
            {(onDelete || onEdit) ? (<th>عملیات</th>) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (<td key={j}>{cell}</td>))}
              {(onDelete || onEdit) ? (
                <td>
                  {onEdit ? (<button className="btn btn-secondary" style={{ marginInlineEnd: '0.5rem' }} onClick={() => onEdit(i)}>ویرایش</button>) : null}
                  {onDelete ? (<button className="btn btn-error" onClick={() => onDelete(i)}>حذف</button>) : null}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
