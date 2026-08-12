// src/pages/runner/reports/Reports.jsx
import { useState } from 'react'
import { Download } from 'lucide-react'
import Button from '../../components/ui/Button'

const statCards = [
  { label: 'Total Savings Collected', value: '₦2,450,000', trend: '↑ 12% vs last month', trendUp: true },
  { label: 'Total Withdrawals',       value: '₦380,000',   trend: '↓ 3% vs last month',  trendUp: false },
  { label: 'Total Liabilities',       value: '₦2,070,000', sub: 'Customer balances owed', neutral: true },
  { label: 'Commissions Earned',      value: '₦24,000',    trend: '↑ 8% vs last month',  trendUp: true },
]

const packages = [
  { name: 'Daily Savings',  amount: '₦1,600,000', pct: 65, customers: 86,  color: 'bg-primary' },
  { name: 'Monthly Thrift', amount: '₦630,000',   pct: 26, customers: 42,  color: 'bg-blue-400' },
  { name: 'Flexible Plan',  amount: '₦220,000',   pct: 9,  customers: 20,  color: 'bg-yellow-400' },
]

const summary = [
  { label: 'Total Customers',    value: '148',  color: 'text-textprimary' },
  { label: 'Active Customers',   value: '140',  color: 'text-success' },
  { label: 'Inactive Customers', value: '8',    color: 'text-danger' },
  { label: 'New This Month',     value: '12',   color: 'text-blue-500' },
  { label: 'Total Agents',       value: '8',    color: 'text-textprimary' },
]

const Reports = () => {
  const [month, setMonth] = useState('March 2025')

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Reports</h1>
        <div className="flex gap-3">
          <select value={month} onChange={e => setMonth(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary bg-white">
            {['March 2025', 'February 2025', 'January 2025'].map(m => (
              <option key={m}>📅 {m}</option>
            ))}
          </select>
          <Button icon={Download}>Export Report</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white border border-border rounded-xl p-5">
            <p className="text-sm text-textsecondary">{card.label}</p>
            <p className="text-2xl font-semibold mt-1 mb-1">{card.value}</p>
            {card.trend && (
              <p className={`text-xs font-medium ${card.trendUp ? 'text-success' : 'text-danger'}`}>
                {card.trend}
              </p>
            )}
            {card.sub && <p className="text-xs text-textsecondary">{card.sub}</p>}
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-4">

        {/* Contributions by Package */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Contributions by Package</h2>
          <div className="border-t border-gray-100 pt-4 flex flex-col gap-4">
            {packages.map(pkg => (
              <div key={pkg.name} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{pkg.name}</span>
                  <span className="text-textsecondary">{pkg.amount}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className={`${pkg.color} h-2 rounded-full transition-all`}
                    style={{ width: `${pkg.pct}%` }} />
                </div>
                <p className="text-xs text-textsecondary">{pkg.pct}% · {pkg.customers} customers</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Summary */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Customer Summary</h2>
          <div className="border-t border-gray-100 pt-2 flex flex-col divide-y divide-gray-100">
            {summary.map(item => (
              <div key={item.label} className="flex justify-between items-center py-3">
                <span className="text-sm text-textsecondary">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Reports