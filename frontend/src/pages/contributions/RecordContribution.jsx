import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, XCircle } from 'lucide-react'
import Button from '../../components/ui/Button'

const inputCls      = `border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white w-full`
const inputErrorCls = `border border-red-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-red-100 transition bg-white w-full`
const cls = (error) => error ? inputErrorCls : inputCls

const Field = ({ label, required, hint, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
    {!error && hint && <p className="text-xs text-textsecondary">{hint}</p>}
  </div>
)

const customers = [
  { initials: 'AO', name: 'Adaeze Okonkwo', package: 'Daily Savings',  balance: '₦125,000' },
  { initials: 'KA', name: 'Kunle Adeyemi',  package: 'Monthly Thrift', balance: '₦340,000' },
  { initials: 'TB', name: 'Tunde Bello',    package: 'Flexible Plan',  balance: '₦45,000'  },
]

const RecordContribution = () => {
  const navigate = useNavigate()
  const [search, setSearch]   = useState('')
  const [selected, setSelected] = useState(null)
  const [errors, setErrors]   = useState({})
  const [form, setForm]       = useState({ amount: '', method: '', date: '', notes: '' })

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!selected)
      e.customer = 'Please select a customer'
    if (!form.amount.trim())
      e.amount = 'Amount is required'
    else if (isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount greater than 0'
    if (!form.method)
      e.method = 'Please select a payment method'
    if (!form.date)
      e.date = 'Contribution date is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('Contribution:', { customer: selected, ...form })
      navigate('/contributions')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border rounded-xl p-6 max-w-2xl mx-auto w-full">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold">Record Contribution</h2>
            <p className="text-sm text-textsecondary mt-0.5">Manually record a customer payment</p>
          </div>
          <button onClick={() => navigate('/contributions')}
            className="flex items-center gap-1.5 text-sm text-textsecondary hover:bg-gray-100 px-3 py-1.5 rounded-lg">
            <XCircle size={14} /> Cancel
          </button>
        </div>

        <div className="flex flex-col gap-5">

          {/* Customer Search */}
          <Field label="Select Customer" required error={errors.customer}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input value={search}
                onChange={e => { setSearch(e.target.value); setSelected(null); if (errors.customer) setErrors({ ...errors, customer: '' }) }}
                placeholder="Search customer by name or phone..."
                className={`${errors.customer && !selected ? inputErrorCls : inputCls} pl-8`} />
            </div>
          </Field>

          {search && !selected && (
            <div className="border border-border rounded-lg overflow-hidden -mt-2">
              {filtered.length > 0 ? filtered.map(c => (
                <button key={c.name} onClick={() => { setSelected(c); setSearch(''); setErrors({ ...errors, customer: '' }) }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                    {c.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-textsecondary">{c.package} · Balance: {c.balance}</p>
                  </div>
                </button>
              )) : (
                <p className="px-4 py-3 text-sm text-textsecondary">No customer found</p>
              )}
            </div>
          )}

          {selected && (
            <div className="border-2 border-primary bg-primary/5 rounded-lg flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center">
                  {selected.initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{selected.name}</p>
                  <p className="text-xs text-textsecondary">{selected.package} · Balance: {selected.balance}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                <XCircle size={15} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Amount" required error={errors.amount} hint="Package default: ₦500/day">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textsecondary">₦</span>
                <input name="amount" value={form.amount} onChange={handleChange}
                  placeholder="0" className={cls(errors.amount) + ' pl-7'} />
              </div>
            </Field>
            <Field label="Payment Method" required error={errors.method}>
              <select name="method" value={form.method} onChange={handleChange} className={cls(errors.method)}>
                <option value="" disabled>Select method</option>
                <option>Cash</option>
                <option>Transfer</option>
                <option>POS</option>
                <option>USSD</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Contribution Date" required error={errors.date}>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className={cls(errors.date)} />
            </Field>
            <Field label="Reference">
              <input value="REF-001235 (auto-generated)" readOnly
                className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'} />
            </Field>
          </div>

          <Field label="Notes">
            <textarea name="notes" value={form.notes} onChange={handleChange}
              placeholder="Optional notes about this contribution..."
              rows={3} className={inputCls + ' resize-none'} />
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={() => navigate('/contributions')}>Cancel</Button>
          <Button icon={Check} onClick={handleSubmit}>Record Contribution</Button>
        </div>
      </div>
    </div>
  )
}

export default RecordContribution