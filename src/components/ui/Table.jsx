// components/ui/Table.js
export const Table = ({ columns, children, className = "", selection }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`min-w-full divide-y divide-gray-200 ${className}`}>
          <thead className="bg-green-900">
            <tr>
              {selection && (
                <th className="px-6 py-3 w-4">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-[#B38025] focus:ring-[#B38025]"
                    checked={selection.isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = selection.isIndeterminate;
                    }}
                    onChange={selection.onSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {children}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const TableRow = ({ children, className = "", onClick }) => {
  return (
    <tr
      className={`hover:bg-gray-50 transition-colors ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = "" }) => {
  return (
    <td className={`px-6 py-4 ${className}`}>
      {children}
    </td>
  );
};