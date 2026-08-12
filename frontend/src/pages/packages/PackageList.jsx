import { useNavigate } from 'react-router-dom'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Table from '../../components/shared/Table'

const packages = [
  { id: 1, name: 'Daily Savings',  type: 'Daily',    amount: '₦500/day',   customers: 86, lockPeriod: '30 days', commission: '₦500 fixed', status: 'Active'   },
  { id: 2, name: 'Monthly Thrift', type: 'Monthly',  amount: '₦5,000/mo',  customers: 42, lockPeriod: '60 days', commission: '5%',         status: 'Active'   },
  { id: 3, name: 'Flexible Plan',  type: 'Flexible', amount: 'Any amount', customers: 20, lockPeriod: 'None',    commission: '₦200 fixed', status: 'Active'   },
  { id: 4, name: 'Target Savers',  type: 'Daily',    amount: '₦1,000/day', customers: 0,  lockPeriod: '90 days', commission: '2%',         status: 'Inactive' },
]

const PackageList = () => {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Package Name',
      render: (row) => (
        <div>
          <p className="text-sm font-medium">{row.name}</p>
          <p className="text-xs text-textsecondary">{row.type}</p>
        </div>
      )
    },
    { header: 'Amount',      accessor: 'amount' },
    {
      header: 'Customers',
      render: (row) => (
        <span className={row.customers === 0 ? 'text-textsecondary' : ''}>
          {row.customers}
        </span>
      )
    },
    { header: 'Lock Period', accessor: 'lockPeriod' },
    { header: 'Commission',  accessor: 'commission'  },
    {
      header: 'Status',
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'Action',
      // ✅ now uses row.id instead of i — much more reliable
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" onClick={() => navigate(`/packages/${row.id}`)}>View</Button>
          <Button size="sm" variant="ghost" onClick={() => navigate(`/packages/${row.id}/edit`)}>Edit</Button>
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl font-semibold">Savings Packages</h1>
          <p className="text-sm text-textsecondary">
            {packages.length} packages · {packages.reduce((sum, p) => sum + p.customers, 0)} enrolled customers
          </p>
        </div>
        <Button onClick={() => navigate('/packages/create')}>+ New Package</Button>
      </div>

      <div className="bg-white border border-border rounded-xl p-4">
        <Table columns={columns} data={packages} />
      </div>
    </div>
  )
}

export default PackageList