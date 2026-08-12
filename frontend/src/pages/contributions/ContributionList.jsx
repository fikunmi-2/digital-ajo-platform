// src/pages/runner/contributions/ContributionList.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download } from 'lucide-react'
import Table from '../../components/shared/Table'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import SearchBar from '../../components/shared/SearchBar'

const contributions = [
  { initials: 'AO', name: 'Adaeze Okonkwo', ref: 'REF-001234', amount: '₦5,000',  method: 'Cash',     date: 'Mar 22, 2025', status: 'Confirmed' },
  { initials: 'KA', name: 'Kunle Adeyemi',  ref: 'REF-001233', amount: '₦10,000', method: 'Transfer', date: 'Mar 22, 2025', status: 'Pending' },
  { initials: 'TB', name: 'Tunde Bello',    ref: 'REF-001232', amount: '₦2,500',  method: 'POS',      date: 'Mar 21, 2025', status: 'Confirmed' },
  { initials: 'NE', name: 'Ngozi Eze',      ref: 'REF-001231', amount: '₦7,500',  method: 'USSD',     date: 'Mar 21, 2025', status: 'Cancelled' },
]

const ContributionList = () => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('All')
  const [methodFilter, setMethodFilter] = useState('All')

  const columns = [
    {
      header: 'Customer',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center shrink-0">
            {row.initials}
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-textsecondary">{row.ref}</p>
          </div>
        </div>
      )
    },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Method', accessor: 'method' },
    { header: 'Date',   accessor: 'date' },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'Action',
      render: (row) => (
        <div className="flex gap-2 text-sm">
          {row.status === 'Pending' ? (
            <>
              <button className="text-primary font-medium hover:underline">Confirm</button>
              <span className="text-gray-300">·</span>
              <button className="text-danger font-medium hover:underline">Cancel</button>
            </>
          ) : (
            <button className="text-primary font-medium hover:underline">View</button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">All Contributions</h1>
          <p className="text-sm text-textsecondary">248 total · ₦1,240,000 collected this month</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" icon={Download}>Export</Button>
          <Button onClick={() => navigate('/contributions/record')}>+ Record Contribution</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <SearchBar placeholder="Search by customer name or reference..." className="flex-1" />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white">
          {['All', 'Confirmed', 'Pending', 'Cancelled'].map(s => (
            <option key={s}>Status: {s}</option>
          ))}
        </select>
        <select value={methodFilter} onChange={e => setMethodFilter(e.target.value)}
          className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white">
          {['All', 'Cash', 'Transfer', 'POS', 'USSD'].map(m => (
            <option key={m}>Method: {m}</option>
          ))}
        </select>
        <button className="border border-border rounded-lg px-4 py-2 text-sm bg-white hover:bg-gray-50 flex items-center gap-2">
          📅 Date range
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-border rounded-xl p-4">
        <Table columns={columns} data={contributions} />
        <div className="flex justify-between items-center pt-4 mt-2 border-t border-gray-100">
          <p className="text-sm text-textsecondary">Showing 1–4 of 248 contributions</p>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">← Prev</button>
            <button className="px-3 py-1.5 text-sm bg-primary text-white rounded-lg">1</button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">2</button>
            <button className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-gray-50">Next →</button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ContributionList