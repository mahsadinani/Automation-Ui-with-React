export default function DataTable({ columns = [], rows = [], onDelete, onEdit, onTransfer, onEditNotes, editingRow, editData, onEditChange, onEditSave, onEditCancel, bannerOptions = [] }) {
  const colToField = {
    'نام دوره': 'name',
    'مدرس': 'teacher',
    'ساعت کل': 'hours',
    'تعداد جلسات': 'sessions',
    'شهریه کل': 'totalFee',
  };

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {editingRow === i ? (
                // حالت ویرایش
                <>
                  {columns.map((col, j) => {
                    const fieldName = colToField[col];
                    return (
                      <td key={j}>
                        <input
                          type={fieldName === 'hours' || fieldName === 'sessions' ? 'number' : 'text'}
                          className="form-control form-control-sm"
                          value={editData[fieldName] || ''}
                          onChange={(e) => onEditChange(fieldName, e.target.value)}
                          style={{ minWidth: '100px' }}
                        />
                      </td>
                    );
                  })}
                  <td>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => onEditSave(i)}
                      style={{ marginInlineEnd: '0.25rem' }}
                    >
                      ذخیره
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onEditCancel()}
                    >
                      لغو
                    </button>
                  </td>
                </>
              ) : (
                // حالت نمایش عادی
                <>
                  {r.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ marginInlineEnd: '0.5rem' }}
                      onClick={() => onTransfer(i)}
                    >
                      انتقال به لیست شاگردان
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ marginInlineEnd: '0.5rem' }}
                      onClick={() => onEditNotes(i)}
                    >
                      ویرایش
                    </button>
                    {onDelete ? (
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => onDelete(i)}
                      >
                        حذف
                      </button>
                    ) : null}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


function handleTransferToStudents(index) {
  const selectedRow = rows[index];
  // Logic to update the status to "تکمیل ثبت نام" and transfer to student list
  console.log(`Transferring row ${index} to student list:`, selectedRow);
  // Add your API call or state update logic here
}

function handleEditNotes(index) {
  const selectedRow = rows[index];
  // Logic to edit notes for the selected row
  console.log(`Editing notes for row ${index}:`, selectedRow);
  // Add your API call or state update logic here
}