const Table = ({ columns = [], data = [] }) => {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left text-textsecondary text-xs border-b border-gray-100">
          {columns.map((col, index) => (
            <th key={index} className="pb-3 px-4 font-medium">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
            {columns.map((col, colIndex) => (
              <td key={colIndex} className="py-3 px-4 border-b border-gray-50">
                {col.render ? col.render(row, rowIndex) : row[col.accessor]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table