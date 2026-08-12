// import MetricCard from '../../components/ui/MetricCard'
// import Table from '../../components/shared/Table'
// import Button from '../../components/ui/Button'
// import Badge from '../../components/ui/Badge'

// import {
//   DollarSign,
//   Users,
//   Wallet,
//   BarChart3
// } from 'lucide-react'

// const Dashboard = () => {

//   // 🔥 Dummy data (replace later with API)
//   const metrics = [
//   {
//     title: "Total Savings",
//     value: "₦2,450,000",
//     trend: "↑ 12% this month",
//     icon: DollarSign
//   },
//   {
//     title: "Active Customers",
//     value: "148",
//     trend: "↑ 5 this week",
//     icon: Users
//   },
//   {
//     title: "Commissions Earned",
//     value: "₦24,000",
//     trend: "↑ 8% this month",
//     icon: BarChart3
//   },
//   {
//     title: "Total Withdrawals",
//     value: "₦380,000",
//     trend: "↓ 3% this month",
//     icon: Wallet
//   }
// ]

//   const contributions = [
//   {
//     name: "Adaeze Okonkwo",
//     amount: "₦5,000",
//     method: "Cash",
//     date: "Today"
//   },
//   {
//     name: "Kunle Adeyemi",
//     amount: "₦10,000",
//     method: "Transfer",
//     date: "Today"
//   },
//   {
//     name: "Tunde Bello",
//     amount: "₦2,500",
//     method: "POS",
//     date: "Yesterday"
//   },
// ]

// const withdrawals = [
//   {
//     name: "Adaeze Okonkwo",
//     amount: "₦20,000",
//     date: "Today"
//   },
//   {
//     name: "Kunle Adeyemi",
//     amount: "₦15,000",
//     date: "Yesterday"
//   }
// ]

//   const columns = [
//   {
//     header: "Customer",
//     accessor: "name"
//   },
//   {
//     header: "Amount",
//     accessor: "amount"
//   },
//   {
//     header: "Method",
//     render: (row) => <Badge>{row.method}</Badge>
//   },
//   {
//     header: "Date",
//     accessor: "date"
//   }
// ]
//   return (
//     <div className="flex flex-col gap-6">

//       {/* 🔹 Header */}
//       <div>
//         <h1 className="text-xl font-semibold text-textprimary">
//           Good morning, Pec Concepts
//         </h1>
//         <p className="text-sm text-textsecondary">
//           Sunday, 22 March 2026 · Here's what's happening today
//         </p>
//       </div>

//       {/* 🔹 Metrics */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
//         {metrics.map((item) => (
//           <MetricCard key={item.title} {...item} />
//         ))}
//       </div>

//       {/* 🔹 Main Content */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

//         {/* 📊 Recent Contributions */}
//         <div className="xl:col-span-2 bg-white border border-border rounded-xl p-4">

//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-sm font-medium text-textprimary">
//               Recent Contributions
//             </h2>
//             <Button size="sm">View All</Button>
//           </div>

//           <Table columns={columns} data={contributions} />

          
//         </div>

//         {/* 📌 Right Side */}
//         <div className="flex flex-col gap-6">

//           {/* 💸 Pending Withdrawals */}
//           <div className="bg-white border border-border rounded-xl p-4">
//             <h2 className="text-sm font-medium mb-3">
//               Pending Withdrawals
//             </h2>

//             <div className="flex flex-col gap-3">
//               {withdrawals.map((item, i) => (
//                 <div key={i}
//                   className="flex justify-between items-center
//                              border border-border rounded-lg p-3">

//                   <div>
//                     <p className="text-sm font-medium">
//                       {item.name}
//                     </p>
//                     <p className="text-xs text-textsecondary">
//                       {item.amount}
//                     </p>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button size="sm" variant="success">
//                       Approve
//                     </Button>
//                     <Button size="sm" variant="danger">
//                       Reject
//                     </Button>
//                   </div>

//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ⚡ Quick Actions */}
//           <div className="bg-white border border-border rounded-xl p-4">
//             <h2 className="text-sm font-medium mb-3">
//               Quick Actions
//             </h2>

//             <div className="flex flex-col gap-2">
//               <Button className="w-full">Add Customer</Button>
//               <Button variant="secondary" className="w-full">
//                 Record Contribution
//               </Button>
//               <Button variant="secondary" className="w-full">
//                 View Reports
//               </Button>
//             </div>
//           </div>

//         </div>

//       </div>

//     </div>
//   )
// }

// export default Dashboard

// src/pages/runner/Dashboard.jsx
import { useNavigate } from 'react-router-dom'
import { DollarSign, Users, TrendingDown, BarChart2 } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

const statCards = [
  { label: 'Total Savings',      value: '₦2,450,000', trend: '↑ 12% this month', trendUp: true,  icon: DollarSign,    iconBg: 'bg-green-50',  iconColor: 'text-primary' },
  { label: 'Active Customers',   value: '148',         trend: '↑ 5 new this week', trendUp: true, icon: Users,         iconBg: 'bg-blue-50',   iconColor: 'text-blue-500' },
  { label: 'Total Withdrawals',  value: '₦380,000',   trend: '↓ 3% this month',  trendUp: false,  icon: TrendingDown,  iconBg: 'bg-yellow-50', iconColor: 'text-yellow-500' },
  { label: 'Commissions Earned', value: '₦24,000',    trend: '↑ 8% this month',  trendUp: true,   icon: BarChart2,     iconBg: 'bg-red-50',    iconColor: 'text-red-400' },
]

const recentContributions = [
  { initials: 'AO', name: 'Adaeze Okonkwo', amount: '₦5,000',  method: 'Cash',     date: 'Today' },
  { initials: 'KA', name: 'Kunle Adeyemi',  amount: '₦10,000', method: 'Transfer', date: 'Today' },
  { initials: 'TB', name: 'Tunde Bello',    amount: '₦2,500',  method: 'POS',      date: 'Yesterday' },
  { initials: 'NE', name: 'Ngozi Eze',      amount: '₦7,500',  method: 'USSD',     date: 'Yesterday' },
  { initials: 'BI', name: 'Bisi Ibrahim',   amount: '₦15,000', method: 'Transfer', date: 'Mar 20' },
]

const pendingWithdrawals = [
  { initials: 'AO', name: 'Adaeze Okonkwo', ref: 'REF-W00123', date: 'Mar 21', amount: '₦50,000',  bg: 'bg-yellow-50 border-yellow-100' },
  { initials: 'KA', name: 'Kunle Adeyemi',  ref: 'REF-W00122', date: 'Mar 20', amount: '₦25,000',  bg: 'bg-yellow-50 border-yellow-100' },
  { initials: 'NE', name: 'Ngozi Eze',      ref: 'REF-W00121', date: 'Mar 19', amount: '₦100,000', bg: 'bg-yellow-50 border-yellow-100' },
]

const quickActions = [
  { label: 'Add Customer',        icon: '👤', path: '/customers/add' },
  { label: 'Record Contribution', icon: '💵', path: '/contributions/record' },
  { label: 'New Package',         icon: '📦', path: '/packages/create' },
  { label: 'View Reports',        icon: '📊', path: '/reports' },
]

const avatarColors = ['bg-green-100 text-green-700', 'bg-blue-100 text-blue-700', 'bg-yellow-100 text-yellow-700', 'bg-red-100 text-red-700', 'bg-purple-100 text-purple-700']

const Dashboard = () => {
  const navigate = useNavigate()
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold">Good morning, Pec Concepts</h1>
          <p className="text-sm text-textsecondary">{today} · Here's what's happening today</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate('/contributions/record')}>
            💵 Record Contribution
          </Button>
          <Button onClick={() => navigate('/customers/add')}>+ Add Customer</Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <p className="text-sm text-textsecondary">{card.label}</p>
              <div className={`w-9 h-9 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon size={16} className={card.iconColor} />
              </div>
            </div>
            <p className="text-2xl font-semibold">{card.value}</p>
            <p className={`text-xs font-medium ${card.trendUp ? 'text-success' : 'text-danger'}`}>
              {card.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-[1fr_380px] gap-4">

        {/* Recent Contributions */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">Recent Contributions</h2>
            <button onClick={() => navigate('/contributions')}
              className="text-xs text-primary hover:underline">View all →</button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-textsecondary border-b border-gray-100">
                <th className="text-left pb-2 font-medium">Customer</th>
                <th className="text-left pb-2 font-medium">Amount</th>
                <th className="text-left pb-2 font-medium">Method</th>
                <th className="text-left pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentContributions.map((row, i) => (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full text-xs font-semibold flex items-center justify-center ${avatarColors[i % avatarColors.length]}`}>
                        {row.initials}
                      </div>
                      <span className="font-medium">{row.name}</span>
                    </div>
                  </td>
                  <td className="py-3">{row.amount}</td>
                  <td className="py-3 text-textsecondary">{row.method}</td>
                  <td className="py-3 text-textsecondary">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">

          {/* Pending Withdrawals */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-semibold">Pending Withdrawals</h2>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                3 pending
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {pendingWithdrawals.map((w, i) => (
                <div key={i} className={`border ${w.bg} rounded-lg px-3 py-2.5 flex justify-between items-center`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-yellow-200 text-yellow-800 text-xs font-semibold flex items-center justify-center">
                      {w.initials}
                    </div>
                    <div>
                      <p className="text-xs font-medium">{w.name}</p>
                      <p className="text-[11px] text-textsecondary">Requested · {w.date}</p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <p className="text-xs font-semibold">{w.amount}</p>
                    <div className="flex gap-1">
                      <button className="text-[11px] bg-primary text-white px-2 py-0.5 rounded">Approve</button>
                      <button className="text-[11px] border border-danger text-danger px-2 py-0.5 rounded">Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => navigate('/withdrawals')}
              className="text-xs text-primary hover:underline text-center pt-1">
              View all withdrawals →
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-3">
            <h2 className="text-sm font-semibold">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(action => (
                <button key={action.label} onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-border rounded-lg py-3 text-xs font-medium transition-colors">
                  <span className="text-base">{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard