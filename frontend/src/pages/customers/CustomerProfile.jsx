

import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'

// Mock data — swap with real data/props later
const customer = {
  initials: 'AO',
  name: 'Adaeze Okonkwo',
  status: 'Active',
  package: 'Daily Savings',
  joined: 'Mar 1, 2025',
  agent: 'Chidi Okeke',
  personal: {
    surname: 'Okonkwo', firstName: 'Adaeze',
    phone: '08012345678', email: 'adaeze@email.com',
    gender: 'Female', dob: '15 Jan 1990',
    address: '12 Adeola Street, Surulere, Lagos',
    dateJoined: 'Mar 1, 2025',
  },
  identity: {
    nin: '123••••••••', bank: 'First Bank',
    accountNumber: '••••••7890', accountName: 'Adaeze Okonkwo',
  },
  kin: {
    name: 'Chukwu Okonkwo', relationship: 'Spouse',
    phone: '08098765432', address: '12 Adeola St, Lagos',
  },
  savings: {
    balance: '₦125,000', contributed: '₦130,000',
    withdrawn: '₦5,000', commission: '₦1,000',
  },
  transactions: [
    { type: 'Contribution', date: 'Mar 22', method: 'Cash',     amount: '+₦5,000', status: 'Confirmed' },
    { type: 'Contribution', date: 'Mar 21', method: 'Transfer', amount: '+₦5,000', status: 'Confirmed' },
    { type: 'Withdrawal',   date: 'Mar 15', method: 'Transfer', amount: '-₦5,000', status: 'Approved'  },
    { type: 'Contribution', date: 'Mar 14', method: 'POS',      amount: '+₦5,000', status: 'Confirmed' },
  ],
}

// Small reusable info row
const InfoRow = ({ label, value }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs text-textsecondary">{label}</span>
    <span className="text-sm font-medium text-textprimary">{value}</span>
  </div>
)

const CustomerProfile = () => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">

      {/* Back */}
      <button onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-sm text-textsecondary hover:text-textprimary w-fit transition-colors">
        <ArrowLeft size={14} /> Back to Customers
      </button>

      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
          {customer.initials}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{customer.name}</h1>
            <Badge status={customer.status} />
          </div>
          <p className="text-sm text-textsecondary mt-0.5">
            {customer.package} · Joined {customer.joined} · Agent: {customer.agent}
          </p>
        </div>
      </div>

      {/* Top Row: Personal Info + Identity & Bank */}
      <div className="grid grid-cols-2 gap-4">

        {/* Personal Info */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Personal Information</h2>
          <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
            <InfoRow label="Surname"     value={customer.personal.surname} />
            <InfoRow label="First Name"  value={customer.personal.firstName} />
            <InfoRow label="Phone"       value={customer.personal.phone} />
            <InfoRow label="Email"       value={customer.personal.email} />
            <InfoRow label="Gender"      value={customer.personal.gender} />
            <InfoRow label="Date of Birth" value={customer.personal.dob} />
            <div className="col-span-2">
              <InfoRow label="Address"   value={customer.personal.address} />
            </div>
            <InfoRow label="Date Joined" value={customer.personal.dateJoined} />
          </div>
        </div>

        {/* Identity + Next of Kin */}
        <div className="flex flex-col gap-4">

          {/* Identity & Bank */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Identity & Bank Details</h2>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <InfoRow label="NIN"            value={customer.identity.nin} />
              <InfoRow label="Bank"           value={customer.identity.bank} />
              <InfoRow label="Account Number" value={customer.identity.accountNumber} />
              <InfoRow label="Account Name"   value={customer.identity.accountName} />
            </div>
          </div>

          {/* Next of Kin */}
          <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
            <h2 className="text-sm font-semibold">Next of Kin</h2>
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
              <InfoRow label="Full Name"    value={customer.kin.name} />
              <InfoRow label="Relationship" value={customer.kin.relationship} />
              <InfoRow label="Phone"        value={customer.kin.phone} />
              <InfoRow label="Address"      value={customer.kin.address} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Savings Summary + Recent Contributions */}
      <div className="grid grid-cols-2 gap-4">

        {/* Savings Summary */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-semibold">Savings Summary</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Balance',    value: customer.savings.balance,     color: 'text-textprimary' },
              { label: 'Total Contributed', value: customer.savings.contributed, color: 'text-textprimary' },
              { label: 'Total Withdrawn',  value: customer.savings.withdrawn,   color: 'text-danger' },
              { label: 'Commission',       value: customer.savings.commission,  color: 'text-textprimary' },
            ].map(item => (
              <div key={item.label} className="bg-pagebg rounded-lg p-3 flex flex-col gap-1">
                <span className="text-xs text-textsecondary">{item.label}</span>
                <span className={`text-base font-semibold ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2 pt-2">
            <Button className="flex-1 justify-center">Record Contribution</Button>
            <Button variant="ghost" className="flex-1 justify-center">View All Transactions</Button>
          </div>
        </div>

        {/* Recent Contributions */}
        <div className="bg-white border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-semibold">Recent Contributions</h2>
            <button className="text-xs text-primary hover:underline">View all →</button>
          </div>
          <div className="flex flex-col divide-y divide-gray-100">
            {customer.transactions.map((tx, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium">{tx.type}</p>
                  <p className="text-xs text-textsecondary">{tx.date} · {tx.method}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold
                    ${tx.amount.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                    {tx.amount}
                  </span>
                  <Badge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default CustomerProfile