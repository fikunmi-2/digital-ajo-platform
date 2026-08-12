import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { XCircle, Check } from 'lucide-react'
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

const AddTenant = () => {
  const navigate = useNavigate()
  const [errors, setErrors] = useState({})
  const [form, setForm]     = useState({
    businessName: '', ownerName: '', email: '',
    phone: '', address: '', plan: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const e = {}
    if (!form.businessName.trim())
      e.businessName = 'Business name is required'
    if (!form.ownerName.trim())
      e.ownerName = "Owner's name is required"
    if (!form.email.trim())
      e.email = 'Email address is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address'
    if (!form.phone.trim())
      e.phone = 'Phone number is required'
    else if (!/^0\d{10}$/.test(form.phone))
      e.phone = 'Enter a valid 11-digit Nigerian number'
    if (!form.plan)
      e.plan = 'Please select a subscription plan'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      console.log('Tenant:', form)
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white border border-border rounded-xl p-6 w-full max-w-lg flex flex-col gap-5">

        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold">Add New Tenant</h2>
            <p className="text-sm text-textsecondary mt-0.5">Register a new ajo runner on the platform</p>
          </div>
          <button onClick={() => navigate('/admin')}
            className="text-textsecondary hover:bg-gray-100 p-1.5 rounded-lg">
            <XCircle size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Business Name" required error={errors.businessName}>
              <input name="businessName" value={form.businessName} onChange={handleChange}
                placeholder="e.g. Pec Concepts" className={cls(errors.businessName)} />
            </Field>
            <Field label="Owner's Full Name" required error={errors.ownerName}>
              <input name="ownerName" value={form.ownerName} onChange={handleChange}
                placeholder="Enter full name" className={cls(errors.ownerName)} />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email Address" required error={errors.email}>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="business@email.com" className={cls(errors.email)} />
            </Field>
            <Field label="Phone Number" required error={errors.phone}>
              <input name="phone" value={form.phone} onChange={handleChange}
                placeholder="e.g. 08012345678" className={cls(errors.phone)} />
            </Field>
          </div>

          <Field label="Business Address">
            <input name="address" value={form.address} onChange={handleChange}
              placeholder="Enter business address" className={inputCls} />
          </Field>

          <Field label="Subscription Plan" required error={errors.plan} hint="Determines feature access">
            <select name="plan" value={form.plan} onChange={handleChange} className={cls(errors.plan)}>
              <option value="" disabled>Select plan</option>
              <option value="starter">Starter — Free</option>
              <option value="basic">Basic — ₦5,000/mo</option>
              <option value="pro">Pro — ₦15,000/mo</option>
            </select>
          </Field>
        </div>

        <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
          <Button variant="ghost" onClick={() => navigate('/admin')}>Cancel</Button>
          <Button icon={Check} onClick={handleSubmit}>Create Tenant</Button>
        </div>
      </div>
    </div>
  )
}

export default AddTenant