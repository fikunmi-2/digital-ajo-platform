import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const agents = [
  { id: 1, initials: 'CO', name: 'Chidi Okeke',    email: 'chidi@email.com', phone: '08011112222', customers: 42, collections: '₦520,000', status: 'Active',   bg: 'bg-green-100 text-green-700'  },
  { id: 2, initials: 'FA', name: 'Funmi Adesanya', email: 'funmi@email.com', phone: '08022223333', customers: 38, collections: '₦410,000', status: 'Active',   bg: 'bg-blue-100 text-blue-700'    },
  { id: 3, initials: 'EN', name: 'Emeka Nwosu',    email: 'emeka@email.com', phone: '08033334444', customers: 28, collections: '₦290,000', status: 'Active',   bg: 'bg-purple-100 text-purple-700'},
  { id: 4, initials: 'TA', name: 'Toyin Adeyemi',  email: 'toyin@email.com', phone: '08044445555', customers: 12, collections: '₦140,000', status: 'Inactive', bg: 'bg-yellow-100 text-yellow-700'},
]

const inputCls = `border border-border rounded-lg px-3 py-2 text-sm outline-none
  focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white w-full`

const AgentList = () => {
  const navigate = useNavigate()
  const [search, setSearch]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm]       = useState({ name: '', email: '', phone: '' })

  const filtered = agents.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) || a.phone.includes(search)
  )

  return (
    <div className="flex flex-col gap-4 md:gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-lg md:text-xl font-semibold">Agents</h1>
          <p className="text-sm text-textsecondary">{agents.length} agents · manage your field collectors</p>
        </div>
        <Button onClick={() => setShowAdd(true)} icon={Plus}>Add Agent</Button>
      </div>

      {/* Add Agent inline form */}
      {showAdd && (
        <div className="bg-white border border-primary/30 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">Add New Agent</h2>
            <button onClick={() => setShowAdd(false)} className="text-xs text-textsecondary hover:text-textprimary">✕ Cancel</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Full Name', name: 'name',  placeholder: 'Enter full name'      },
              { label: 'Email',     name: 'email', placeholder: 'Enter email address'  },
              { label: 'Phone',     name: 'phone', placeholder: 'e.g. 08012345678'     },
            ].map(field => (
              <div key={field.name} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-600">{field.label}</label>
                <input
                  name={field.name}
                  value={form[field.name]}
                  onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                  placeholder={field.placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button size="sm">Save Agent</Button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search agents by name or phone..."
          className="w-full border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white"
        />
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden">

        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs text-textsecondary border-b border-gray-100">
              <tr>
                {['Agent', 'Phone', 'Customers', 'Collections', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center ${row.bg}`}>
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
                  <td className="px-4 py-4 font-medium">{row.collections}</td>
                  <td className="px-4 py-4"><Badge status={row.status} /></td>
                  <td className="px-4 py-4">
                    {/* ✅ All 3 buttons now wired */}
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => navigate(`/agents/${row.id}`)}>View</Button>
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/agents/${row.id}/edit`)}>Edit</Button>
                      <Button size="sm" variant="danger-outline"
                        onClick={() => {
                          if (window.confirm(`Remove ${row.name}?`)) {
                            // TODO: remove from state/API
                            alert('Agent removed (wire to API later)')
                          }
                        }}>
                        Remove
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-gray-100">
          {filtered.map((row) => (
            <div key={row.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full text-xs font-semibold flex items-center justify-center ${row.bg}`}>
                  {row.initials}
                </div>
                <div>
                  <p className="font-medium text-sm">{row.name}</p>
                  <p className="text-xs text-textsecondary">{row.phone}</p>
                  <p className="text-xs text-textsecondary">{row.customers} customers · {row.collections}</p>
                  <div className="mt-1"><Badge status={row.status} /></div>
                </div>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <Button size="sm" onClick={() => navigate(`/agents/${row.id}`)}>View</Button>
                <Button size="sm" variant="danger-outline"
                  onClick={() => window.confirm(`Remove ${row.name}?`)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AgentList