
import { useState } from 'react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const statCards = [
  { label: 'Total Tenants',    value: '36',   sub: '↑ 3 this month',    subColor: 'text-success' },
  { label: 'Active Tenants',   value: '32',   sub: 'Running smoothly',  subColor: 'text-success' },
  { label: 'Total Customers',  value: '1,248', sub: 'Across all tenants', subColor: 'text-success' },
  { label: 'Suspended',        value: '4',    sub: 'Needs attention',   subColor: 'text-danger' },
]

const tenants = [
  { initials: 'PC', name: 'Pec Concepts',    email: 'pec@concepts.com',       phone: '08012345678', customers: 148, dateAdded: 'Jan 15, 2025', status: 'Active',    bg: 'bg-green-100 text-green-700' },
  { initials: 'LT', name: 'Lagos Thrift Co.', email: 'info@lagosthrift.com',  phone: '08023456789', customers: 96,  dateAdded: 'Feb 3, 2025',  status: 'Active',    bg: 'bg-blue-100 text-blue-700' },
  { initials: 'AS', name: 'Abuja Savers',    email: 'hello@abujasavers.com',  phone: '08034567890', customers: 34,  dateAdded: 'Mar 1, 2025',  status: 'Suspended', bg: 'bg-red-100 text-red-600' },
]

const TenantManagement = () => {
  const [search, setSearch] = useState('')

  const filtered = tenants.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Top Nav */}
      <div className="bg-gray-900 px-8 py-4 flex justify-between items-center">
        <span className="text-white font-semibold text-sm">Digital Ajo — Admin Panel</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-600 text-white text-xs font-semibold flex items-center justify-center">
            SA
          </div>
          <span className="text-white text-sm">Super Admin</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="bg-white border border-border rounded-xl p-5">
              <p className="text-sm text-textsecondary">{card.label}</p>
              <p className="text-3xl font-semibold mt-1 mb-1">{card.value}</p>
              <p className={`text-xs font-medium ${card.subColor}`}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Tenants Table */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">All Tenants</h2>
            <div className="flex gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search tenants..."
                  className="border border-border rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-primary w-52" />
              </div>
              <Button>+ Add Tenant</Button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-textsecondary">
              <tr>
                {['Business', 'Phone', 'Customers', 'Date Added', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className={`border-t border-gray-100 hover:bg-gray-50 ${row.status === 'Suspended' ? 'opacity-70' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg text-xs font-semibold flex items-center justify-center ${row.bg}`}>
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-medium">{row.name}</p>
                        <p className="text-xs text-textsecondary">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-textsecondary">{row.phone}</td>
                  <td className="px-4 py-4">{row.customers}</td>
                  <td className="px-4 py-4 text-textsecondary">{row.dateAdded}</td>
                  <td className="px-4 py-4"><Badge status={row.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-3 text-xs font-medium">
                      <button className="text-primary hover:underline">View</button>
                      {row.status === 'Active'
                        ? <button className="text-danger hover:underline">Suspend</button>
                        : <button className="text-success hover:underline">Reactivate</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TenantManagement