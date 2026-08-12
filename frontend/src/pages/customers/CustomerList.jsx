import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Search, Filter } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const allCustomers = [
  { id: 1, initials: 'AO', name: 'Adaeze Okonkwo', email: 'adaeze@email.com',  phone: '08012345678', package: 'Daily Savings',  balance: '₦125,000', status: 'Active'   },
  { id: 2, initials: 'KA', name: 'Kunle Adeyemi',  email: '08023456789',        phone: '08023456789', package: 'Monthly Thrift', balance: '₦340,000', status: 'Active'   },
  { id: 3, initials: 'TB', name: 'Tunde Bello',    email: 'tunde@email.com',    phone: '08034567890', package: 'Daily Savings',  balance: '₦45,000',  status: 'Inactive' },
  { id: 4, initials: 'NE', name: 'Ngozi Eze',      email: 'ngozi@email.com',    phone: '08045678901', package: 'Flexible Plan',  balance: '₦210,000', status: 'Active'   },
  { id: 5, initials: 'BI', name: 'Bisi Ibrahim',   email: 'bisi@email.com',     phone: '08056789012', package: 'Daily Savings',  balance: '₦78,500',  status: 'Active'   },
]

const avatarColors = [
  'bg-green-100 text-green-700',
  'bg-blue-100 text-blue-700',
  'bg-yellow-100 text-yellow-700',
  'bg-red-100 text-red-600',
  'bg-purple-100 text-purple-700',
]

const CustomerList = () => {
  const navigate = useNavigate()
  const [search, setSearch]         = useState('')
  const [statusFilter, setStatus]   = useState('All')
  const [packageFilter, setPackage] = useState('All')
  const [selected, setSelected]     = useState([])

  const filtered = allCustomers.filter(c => {
    const matchSearch  = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.phone.includes(search) ||
                         c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus  = statusFilter  === 'All' || c.status  === statusFilter
    const matchPackage = packageFilter === 'All' || c.package === packageFilter
    return matchSearch && matchStatus && matchPackage
  })

  const toggleSelect = (id) =>
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const toggleAll = () =>
    setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id))

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">All Customers</h1>
          <p className="text-sm text-textsecondary">
            {allCustomers.length} total · {allCustomers.filter(c => c.status === 'Active').length} active · {allCustomers.filter(c => c.status === 'Inactive').length} inactive
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={Download} size="sm">Export</Button>
          <Button onClick={() => navigate('/customers/add')} size="sm">+ Add Customer</Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or email..."
            className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white"
          />
        </div>
        <button className="flex items-center gap-2 border border-border bg-white rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors">
          <Filter size={13} /> Filter
        </button>
        <select value={statusFilter} onChange={e => setStatus(e.target.value)}
          className="border border-border bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary">
          {['All', 'Active', 'Inactive'].map(s => <option key={s} value={s}>Status: {s}</option>)}
        </select>
        <select value={packageFilter} onChange={e => setPackage(e.target.value)}
          className="border border-border bg-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-primary">
          {['All', 'Daily Savings', 'Monthly Thrift', 'Flexible Plan'].map(p => <option key={p} value={p}>Package: {p}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl overflow-hidden">

        {/* Desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-textsecondary border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 w-10">
                  <input type="checkbox" className="rounded"
                    checked={selected.length === filtered.length && filtered.length > 0}
                    onChange={toggleAll} />
                </th>
                {['Customer', 'Phone', 'Package', 'Balance', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input type="checkbox" className="rounded"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleSelect(row.id)} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                        {row.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{row.name}</p>
                        <p className="text-xs text-textsecondary">{row.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-textsecondary">{row.phone}</td>
                  <td className="px-4 py-4">{row.package}</td>
                  <td className="px-4 py-4 font-medium">{row.balance}</td>
                  <td className="px-4 py-4"><Badge status={row.status} /></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      {/* ✅ Both buttons now wired */}
                      <Button size="sm" onClick={() => navigate(`/customers/${row.id}`)}>View</Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/customers/${row.id}/edit`)}>Edit</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((row, i) => (
            <div key={row.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                  {row.initials}
                </div>
                <div>
                  <p className="font-medium text-sm">{row.name}</p>
                  <p className="text-xs text-textsecondary">{row.phone} · {row.package}</p>
                  <div className="mt-1"><Badge status={row.status} /></div>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <p className="text-sm font-semibold">{row.balance}</p>
                <div className="flex gap-1">
                  <Button size="sm" onClick={() => navigate(`/customers/${row.id}`)}>View</Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/customers/${row.id}/edit`)}>Edit</Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-textsecondary">
            Showing 1–{filtered.length} of {allCustomers.length} customers
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50 disabled:opacity-40" disabled>← Prev</button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">3</button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">Next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerList