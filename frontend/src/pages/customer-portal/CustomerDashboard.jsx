
import { useState } from 'react'
import { DollarSign, ArrowUpRight } from 'lucide-react'
import Button from '../../components/ui/Button'

const transactions = [
  { type: 'Contribution', date: 'Mar 22', method: 'Cash',     amount: '+₦5,000', positive: true  },
  { type: 'Contribution', date: 'Mar 21', method: 'Transfer', amount: '+₦5,000', positive: true  },
  { type: 'Withdrawal',   date: 'Mar 15', method: 'Approved', amount: '-₦5,000', positive: false },
]

const CustomerDashboard = () => {
  const [amount, setAmount]   = useState('')
  const [reason, setReason]   = useState('')

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Nav */}
      <div className="bg-primary px-8 py-4 flex justify-between items-center">
        <span className="text-white font-semibold text-sm">Digital Ajo Platform</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 text-white text-xs font-semibold flex items-center justify-center">
            AO
          </div>
          <span className="text-white text-sm">Adaeze Okonkwo</span>
          <span className="text-white/50 text-xs">▾</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Greeting */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">Good morning, Adaeze! 👋</h1>
            <p className="text-sm text-textsecondary mt-0.5">Here's your savings overview · Daily Savings Plan</p>
          </div>
          <Button>
            <ArrowUpRight size={14} /> Request Withdrawal
          </Button>
        </div>

        {/* Balance Card */}
        <div className="bg-primary rounded-2xl p-6 flex justify-between items-center">
          <div>
            <p className="text-white/70 text-sm mb-1">Current Balance</p>
            <p className="text-4xl font-semibold text-white">₦125,000</p>
            <p className="text-white/60 text-sm mt-2">Daily Savings · Started Mar 1, 2025</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Total Contributed', value: '₦130,000' },
              { label: 'Total Withdrawn',   value: '₦5,000' },
            ].map(item => (
              <div key={item.label} className="bg-white/15 rounded-xl px-4 py-2.5 text-right min-w-[140px]">
                <p className="text-white/60 text-xs">{item.label}</p>
                <p className="text-white font-semibold text-sm mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-2 gap-4">

          {/* Recent Transactions */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold">Recent Transactions</h2>
              <button className="text-xs text-primary hover:underline">View all →</button>
            </div>
            <div className="flex flex-col divide-y divide-gray-100">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center gap-3 py-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${tx.positive ? 'bg-green-50 text-primary' : 'bg-red-50 text-danger'}`}>
                    <DollarSign size={14} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{tx.type}</p>
                    <p className="text-xs text-textsecondary">{tx.date} · {tx.method}</p>
                  </div>
                  <span className={`text-sm font-semibold ${tx.positive ? 'text-success' : 'text-danger'}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Withdrawal Request */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Withdrawal Request</h2>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Amount to Withdraw</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textsecondary">₦</span>
                <input value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full border border-border rounded-lg pl-7 pr-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition" />
              </div>
              <p className="text-xs text-textsecondary">Available balance: ₦125,000</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Reason (optional)</label>
              <textarea value={reason} onChange={e => setReason(e.target.value)}
                placeholder="Why do you need this withdrawal?"
                rows={3}
                className="w-full border border-border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition resize-none" />
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2.5 flex gap-2">
              <span className="text-yellow-500 shrink-0">⚠</span>
              <p className="text-xs text-yellow-700">
                Withdrawals are subject to approval by your ajo runner. Lock period: 30 days.
              </p>
            </div>

            <button className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-primary-hover transition-colors">
              Submit Withdrawal Request
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard