
import { useState } from 'react'
import { Download } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const pending = [
  { initials: 'AO', name: 'Adaeze Okonkwo', package: 'Daily Savings',  ref: 'REF-W00123', date: 'Mar 21', amount: '₦50,000'  },
  { initials: 'KA', name: 'Kunle Adeyemi',  package: 'Monthly Thrift', ref: 'REF-W00122', date: 'Mar 20', amount: '₦25,000'  },
  { initials: 'NE', name: 'Ngozi Eze',      package: 'Flexible Plan',  ref: 'REF-W00121', date: 'Mar 19', amount: '₦100,000' },
]

const processed = [
  { initials: 'BI', name: 'Bisi Ibrahim', amount: '₦30,000', requested: 'Mar 18', processedDate: 'Mar 18', status: 'Approved'  },
  { initials: 'TB', name: 'Tunde Bello',  amount: '₦15,000', requested: 'Mar 17', processedDate: 'Mar 17', status: 'Rejected' },
]

const tabs = ['Pending', 'Approved', 'Rejected', 'All']

const Withdrawals = () => {
  const [activeTab, setActiveTab] = useState('Pending')

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">Withdrawal Requests</h1>
          <p className="text-sm text-textsecondary">3 pending · 42 approved · 5 rejected this month</p>
        </div>
        <Button variant="ghost" icon={Download}>Export</Button>
      </div>

      <div className="bg-white border border-border rounded-xl p-6 flex flex-col gap-6">

        {/* Tabs */}
        <div className="flex gap-0 border-b border-gray-100">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-textsecondary hover:text-textprimary'}`}>
              {tab}
              {tab === 'Pending' && (
                <span className="bg-warning-light text-warning text-xs font-semibold px-1.5 py-0.5 rounded-full">3</span>
              )}
            </button>
          ))}
        </div>

        {/* Pending Cards */}
        {activeTab === 'Pending' && (
          <div className="flex flex-col gap-3">
            {pending.map((item) => (
              <div key={item.ref} className="border border-yellow-100 bg-yellow-50 rounded-xl px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold flex items-center justify-center">
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-textsecondary">{item.package} · {item.ref} · Requested {item.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold">₦{item.amount.replace('₦', '')}</p>
                    <Badge status="Pending" />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm">Approve</Button>
                    <Button size="sm" variant="danger-outline">Reject</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Recently Processed Table */}
        {activeTab === 'Pending' && (
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-500">Recently Processed</h3>
            <div className="border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs text-textsecondary">
                  <tr>
                    {['Customer', 'Amount', 'Requested', 'Processed', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processed.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                            {row.initials}
                          </div>
                          {row.name}
                        </div>
                      </td>
                      <td className="px-4 py-3">{row.amount}</td>
                      <td className="px-4 py-3 text-textsecondary">{row.requested}</td>
                      <td className="px-4 py-3 text-textsecondary">{row.processedDate}</td>
                      <td className="px-4 py-3"><Badge status={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state for other tabs */}
        {activeTab !== 'Pending' && (
          <div className="text-center py-12 text-textsecondary text-sm">
            No {activeTab.toLowerCase()} withdrawals to show.
          </div>
        )}
      </div>
    </div>
  )
}

export default Withdrawals