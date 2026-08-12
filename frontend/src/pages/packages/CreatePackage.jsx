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

const CreatePackage = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('active')
  const [errors, setErrors] = useState({})
  const [form, setForm]     = useState({
    name: '', contributionType: '', description: '',
    fixedAmount: '', targetAmount: '', lockPeriod: '',
    commissionType: '', commissionValue: '', startDate: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim())         e.name             = 'Package name is required'
    if (!form.contributionType)    e.contributionType = 'Please select a contribution type'
    if (!form.commissionType)      e.commissionType   = 'Please select a commission type'
    if (!form.commissionValue.trim())
                                   e.commissionValue  = 'Commission value is required'
    else if (isNaN(Number(form.commissionValue)) || Number(form.commissionValue) < 0)
                                   e.commissionValue  = 'Enter a valid number'
    if (form.lockPeriod && isNaN(Number(form.lockPeriod)))
                                   e.lockPeriod       = 'Lock period must be a number'
    if (form.fixedAmount && isNaN(Number(form.fixedAmount)))
                                   e.fixedAmount      = 'Enter a valid amount'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      console.log('Package:', { ...form, status })
      navigate('/packages')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white border border-border rounded-xl p-6 max-w-3xl mx-auto w-full">

        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold">Create New Package</h2>
            <p className="text-sm text-textsecondary mt-0.5">Define a new savings product for your customers</p>
          </div>
          <button onClick={() => navigate('/packages')}
            className="flex items-center gap-1.5 text-sm text-textsecondary hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
            <XCircle size={14} /> Cancel
          </button>
        </div>

        <div className="flex flex-col gap-5">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Package Name" required error={errors.name}>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="e.g. Daily Savings Plan" className={cls(errors.name)} />
            </Field>
            <Field label="Contribution Type" required error={errors.contributionType} hint="Daily, Monthly or Flexible">
              <select name="contributionType" value={form.contributionType} onChange={handleChange}
                className={cls(errors.contributionType)}>
                <option value="" disabled>Select type</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="flexible">Flexible</option>
              </select>
            </Field>
          </div>

          <Field label="Description">
            <textarea name="description" value={form.description} onChange={handleChange}
              placeholder="Describe what this savings package offers..."
              rows={4} className={inputCls + ' resize-none'} />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Fixed Amount" error={errors.fixedAmount} hint="Leave blank if flexible">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textsecondary">₦</span>
                <input name="fixedAmount" value={form.fixedAmount} onChange={handleChange}
                  placeholder="Enter amount" className={cls(errors.fixedAmount) + ' pl-7'} />
              </div>
            </Field>
            <Field label="Target Amount" hint="Savings goal (optional)">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textsecondary">₦</span>
                <input name="targetAmount" value={form.targetAmount} onChange={handleChange}
                  placeholder="Optional" className={inputCls + ' pl-7'} />
              </div>
            </Field>
            <Field label="Lock Period (days)" error={errors.lockPeriod} hint="0 = no lock period">
              <input name="lockPeriod" value={form.lockPeriod} onChange={handleChange}
                placeholder="e.g. 30" className={cls(errors.lockPeriod)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Commission Type" required error={errors.commissionType} hint="Fixed, First Contribution or Percentage">
              <select name="commissionType" value={form.commissionType} onChange={handleChange}
                className={cls(errors.commissionType)}>
                <option value="" disabled>Select type</option>
                <option value="fixed">Fixed</option>
                <option value="first">First Contribution</option>
                <option value="percentage">Percentage</option>
              </select>
            </Field>
            <Field label="Commission Value" required error={errors.commissionValue} hint="Amount or % based on type">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-textsecondary">₦/%</span>
                <input name="commissionValue" value={form.commissionValue} onChange={handleChange}
                  placeholder="Enter value" className={cls(errors.commissionValue) + ' pl-10'} />
              </div>
            </Field>
            <Field label="Currency" hint="Auto-set, cannot change">
              <input value="NGN — Nigerian Naira" readOnly
                className={inputCls + ' bg-gray-50 text-gray-500 cursor-not-allowed'} />
            </Field>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="w-full sm:w-72">
              <Field label="Start Date">
                <input type="date" name="startDate" value={form.startDate}
                  onChange={handleChange} className={inputCls} />
              </Field>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-600">Status</label>
              <div className="flex gap-2">
                {['active', 'inactive'].map(s => (
                  <button key={s} onClick={() => setStatus(s)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors capitalize
                      ${status === s
                        ? s === 'active'
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'bg-gray-100 border-gray-400 text-gray-600'
                        : 'bg-white border-border text-gray-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${status === s ? (s === 'active' ? 'bg-primary' : 'bg-gray-500') : 'bg-gray-300'}`} />
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          <Button variant="ghost" onClick={() => navigate('/packages')}>Cancel</Button>
          <Button icon={Check} onClick={handleSave}>Save Package</Button>
        </div>
      </div>
    </div>
  )
}

export default CreatePackage