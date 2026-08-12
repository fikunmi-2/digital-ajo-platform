import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, XCircle, ChevronLeft, Eye, EyeOff, Clock, Check } from 'lucide-react'
import Button from '../../components/ui/Button'

const steps = [
  { id: 1, label: 'Personal Info',   sub: 'Name, contact, gender'  },
  { id: 2, label: 'Identity & Bank', sub: 'NIN, account details'   },
  { id: 3, label: 'Account Setup',   sub: 'Package, agent, channel'},
  { id: 4, label: 'Next of Kin',     sub: 'Emergency contact'      },
]

const NIGERIAN_BANKS = [
  'Access Bank','First Bank','GT Bank','UBA','Zenith Bank',
  'Fidelity Bank','FCMB','Sterling Bank','Wema Bank','Polaris Bank',
  'Kuda Bank','Opay','PalmPay','Moniepoint',
]
const PACKAGES = ['Daily Savings', 'Monthly Thrift', 'Flexible Plan']
const AGENTS   = ['Chidi Okeke', 'Funmi Adesanya', 'Emeka Nwosu']

// ── Stepper ───────────────────────────────────────────────
const Stepper = ({ currentStep }) => (
  <div className="flex items-center mb-8 overflow-x-auto pb-2">
    {steps.map((step, i) => {
      const done   = currentStep > step.id
      const active = currentStep === step.id
      return (
        <div key={step.id} className="flex items-center flex-1 last:flex-none min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0
              ${done ? 'bg-primary/20 text-primary border border-primary' :
                active ? 'bg-primary text-white' :
                'bg-gray-100 text-gray-400 border border-gray-200'}`}>
              {done ? <Check size={13} /> : step.id}
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-medium leading-tight ${done || active ? 'text-primary' : 'text-gray-400'}`}>
                {step.label}
              </span>
              <span className="text-[11px] text-gray-400">
                {done ? 'Completed' : step.sub}
              </span>
            </div>
          </div>
          {i < steps.length - 1 && (
            <div className={`flex-1 h-px mx-3 ${done ? 'bg-primary/40' : 'bg-gray-200'}`} />
          )}
        </div>
      )
    })}
  </div>
)

// ── Field with error support ──────────────────────────────
const Field = ({ label, required, error, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)

const inputCls      = `border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white`
const inputErrorCls = `border border-red-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition bg-white`

const cls = (error) => error ? inputErrorCls : inputCls

// ── Step 1 ────────────────────────────────────────────────
const Step1 = ({ form, onChange, photo, onPhoto, errors }) => (
  <div className="flex flex-col md:flex-row gap-8">
    {/* Photo */}
    <div className="flex flex-col items-center gap-3 min-w-[148px] pt-2">
      <label htmlFor="photo-upload" className="cursor-pointer">
        <div className="w-28 h-28 rounded-full border-2 border-dashed border-primary bg-primary/5 flex items-center justify-center text-primary hover:bg-primary/10 transition-colors overflow-hidden">
          {photo
            ? <img src={photo} alt="preview" className="w-full h-full object-cover" />
            : <User size={36} strokeWidth={1.2} className="opacity-60" />}
        </div>
      </label>
      <input id="photo-upload" type="file" accept="image/jpeg,image/png" className="hidden"
        onChange={e => { const f = e.target.files[0]; if (f) onPhoto(URL.createObjectURL(f)) }} />
      <p className="text-sm font-medium">Profile Photo</p>
      <p className="text-xs text-textsecondary text-center">JPG or PNG, max 2MB</p>
      <label htmlFor="photo-upload"
        className="text-xs border border-border bg-white px-4 py-1.5 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
        Upload Photo
      </label>
    </div>

    {/* Fields */}
    <div className="flex-1 flex flex-col gap-4">
      <h3 className="text-sm font-semibold pb-3 border-b border-gray-100">Step 1 — Personal Information</h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Surname" required error={errors.surname}>
          <input name="surname" value={form.surname} onChange={onChange}
            placeholder="Enter surname" className={cls(errors.surname)} />
        </Field>
        <Field label="First Name" required error={errors.firstName}>
          <input name="firstName" value={form.firstName} onChange={onChange}
            placeholder="Enter first name" className={cls(errors.firstName)} />
        </Field>
        <Field label="Middle Name">
          <input name="middleName" value={form.middleName} onChange={onChange}
            placeholder="Optional" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Phone Number" required error={errors.phone}>
          <input name="phone" value={form.phone} onChange={onChange}
            placeholder="e.g. 08012345678" className={cls(errors.phone)} />
        </Field>
        <Field label="Email Address">
          <input name="email" value={form.email} onChange={onChange}
            placeholder="Optional" className={inputCls} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Gender" required error={errors.gender}>
          <select name="gender" value={form.gender} onChange={onChange} className={cls(errors.gender)}>
            <option value="" disabled>Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </Field>
        <Field label="Date of Birth" required error={errors.dob}>
          <input type="date" name="dob" value={form.dob} onChange={onChange}
            className={cls(errors.dob)} />
        </Field>
      </div>

      <Field label="Home Address" required error={errors.address}>
        <input name="address" value={form.address} onChange={onChange}
          placeholder="Enter full home address" className={cls(errors.address)} />
      </Field>
    </div>
  </div>
)

// ── Step 2 ────────────────────────────────────────────────
const Step2 = ({ form, onChange, errors }) => (
  <div className="flex flex-col gap-5">
    <h3 className="text-sm font-semibold pb-3 border-b border-gray-100">Step 2 — Identity & Bank Details</h3>

    <Field label="National ID Number (NIN)" required error={errors.nin}>
      <input name="nin" value={form.nin} onChange={onChange}
        placeholder="Enter 11-digit NIN" maxLength={11} className={cls(errors.nin)} />
      <p className="text-xs text-textsecondary">Must be exactly 11 digits</p>
    </Field>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Field label="Bank Name" required error={errors.bankName}>
        <select name="bankName" value={form.bankName} onChange={onChange} className={cls(errors.bankName)}>
          <option value="" disabled>Select bank</option>
          {NIGERIAN_BANKS.map(b => <option key={b}>{b}</option>)}
        </select>
      </Field>
      <Field label="Account Number" required error={errors.accountNumber}>
        <input name="accountNumber" value={form.accountNumber} onChange={onChange}
          placeholder="Enter 10-digit number" maxLength={10} className={cls(errors.accountNumber)} />
      </Field>
      <Field label="Account Name" required>
        <input name="accountName" value={form.accountName} onChange={onChange}
          placeholder="Auto-filled after verification"
          className={`${inputCls} bg-gray-50 text-gray-400`} readOnly />
      </Field>
    </div>

    <div className="bg-primary/5 border border-primary/20 rounded-lg px-4 py-3 text-sm text-primary">
      Account name will be automatically verified and filled once you enter a valid account number and select a bank.
    </div>
  </div>
)

// ── Step 3 ────────────────────────────────────────────────
const Step3 = ({ form, onChange, showPass, setShowPass, showConfirm, setShowConfirm, errors }) => (
  <div className="flex flex-col gap-5">
    <h3 className="text-sm font-semibold pb-3 border-b border-gray-100">Step 3 — Account Setup</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Savings Package" required error={errors.package}>
        <select name="package" value={form.package} onChange={onChange} className={cls(errors.package)}>
          <option value="" disabled>Select package</option>
          {PACKAGES.map(p => <option key={p}>{p}</option>)}
        </select>
      </Field>
      <Field label="Assign to Agent">
        <select name="agent" value={form.agent} onChange={onChange} className={inputCls}>
          <option value="">Select agent (optional)</option>
          {AGENTS.map(a => <option key={a}>{a}</option>)}
        </select>
      </Field>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Start Date">
        <input type="date" name="startDate" value={form.startDate} onChange={onChange} className={inputCls} />
      </Field>
      <div className={`${inputCls} flex items-center gap-2 text-gray-400 mt-5`}>
        <Clock size={14} />
        <span className="text-xs">Defaults to today if left blank</span>
      </div>
    </div>

    <Field label="Set Login Password" required error={errors.password}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <input type={showPass ? 'text' : 'password'} name="password" value={form.password}
            onChange={onChange} placeholder="Set password"
            className={cls(errors.password) + ' w-full pr-10'} />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        <div className="relative">
          <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
            value={form.confirmPassword} onChange={onChange} placeholder="Confirm password"
            className={cls(errors.confirmPassword) + ' w-full pr-10'} />
          <button type="button" onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
      {errors.confirmPassword && (
        <p className="text-xs text-red-500">{errors.confirmPassword}</p>
      )}
      <p className="text-xs text-textsecondary">Min 8 characters</p>
    </Field>
  </div>
)

// ── Step 4 ────────────────────────────────────────────────
const Step4 = ({ form, onChange, errors }) => (
  <div className="flex flex-col gap-5">
    <h3 className="text-sm font-semibold pb-3 border-b border-gray-100">Step 4 — Next of Kin</h3>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Full Name" error={errors.kinName}>
        <input name="kinName" value={form.kinName} onChange={onChange}
          placeholder="Enter full name" className={cls(errors.kinName)} />
      </Field>
      <Field label="Relationship">
        <select name="kinRelationship" value={form.kinRelationship} onChange={onChange} className={inputCls}>
          <option value="" disabled>e.g. Spouse, Parent, Sibling</option>
          <option>Spouse</option>
          <option>Parent</option>
          <option>Sibling</option>
          <option>Child</option>
          <option>Friend</option>
          <option>Other</option>
        </select>
      </Field>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <Field label="Phone Number" error={errors.kinPhone}>
        <input name="kinPhone" value={form.kinPhone} onChange={onChange}
          placeholder="e.g. 08012345678" className={cls(errors.kinPhone)} />
      </Field>
      <Field label="Address">
        <input name="kinAddress" value={form.kinAddress} onChange={onChange}
          placeholder="Enter address" className={inputCls} />
      </Field>
    </div>
  </div>
)

// ── Main ──────────────────────────────────────────────────
const AddCustomer = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [photo, setPhoto]             = useState(null)
  const [showPass, setShowPass]       = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [errors, setErrors]           = useState({})

  const [form, setForm] = useState({
    surname: '', firstName: '', middleName: '',
    phone: '', email: '', gender: '', dob: '', address: '',
    nin: '', bankName: '', accountNumber: '', accountName: '',
    package: '', agent: '', startDate: '', password: '', confirmPassword: '',
    kinName: '', kinRelationship: '', kinPhone: '', kinAddress: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error on change
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  // ── Per-step validation ───────────────────────────────
  const validateStep = (step) => {
    const e = {}

    if (step === 1) {
      if (!form.surname.trim())    e.surname   = 'Surname is required'
      if (!form.firstName.trim())  e.firstName = 'First name is required'
      if (!form.phone.trim())      e.phone     = 'Phone number is required'
      else if (!/^0\d{10}$/.test(form.phone))
                                   e.phone     = 'Enter a valid 11-digit Nigerian number'
      if (!form.gender)            e.gender    = 'Please select a gender'
      if (!form.dob)               e.dob       = 'Date of birth is required'
      if (!form.address.trim())    e.address   = 'Home address is required'
    }

    if (step === 2) {
      if (!form.nin.trim())              e.nin           = 'NIN is required'
      else if (!/^\d{11}$/.test(form.nin))
                                         e.nin           = 'NIN must be exactly 11 digits'
      if (!form.bankName)                e.bankName      = 'Please select a bank'
      if (!form.accountNumber.trim())    e.accountNumber = 'Account number is required'
      else if (!/^\d{10}$/.test(form.accountNumber))
                                         e.accountNumber = 'Account number must be 10 digits'
    }

    if (step === 3) {
      if (!form.package)                 e.package        = 'Please select a savings package'
      if (!form.password)                e.password       = 'Password is required'
      else if (form.password.length < 8) e.password       = 'Password must be at least 8 characters'
      if (!form.confirmPassword)         e.confirmPassword = 'Please confirm the password'
      else if (form.password !== form.confirmPassword)
                                         e.confirmPassword = 'Passwords do not match'
    }

    if (step === 4) {
      if (!form.kinName.trim())  e.kinName  = 'Next of kin name is required'
      if (form.kinPhone && !/^0\d{10}$/.test(form.kinPhone))
                                 e.kinPhone = 'Enter a valid 11-digit Nigerian number'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(s => s + 1)
  }

  const handleBack = () => {
    setErrors({})
    setCurrentStep(s => s - 1)
  }

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log('Customer data:', form)
      navigate('/customers')
    }
  }

  const nextLabel = {
    1: 'Next — Identity & Bank →',
    2: 'Next — Account Setup →',
    3: 'Next — Next of Kin →',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 text-sm text-textsecondary">
        <span className="cursor-pointer hover:text-primary" onClick={() => navigate('/customers')}>Customers</span>
        <span>›</span>
        <span className="text-textprimary font-medium">Add Customer</span>
      </div>

      <div className="bg-white border border-border rounded-xl p-4 md:p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-base font-semibold">Add New Customer</h2>
            <p className="text-sm text-textsecondary mt-0.5">Fill in the details below to onboard a new customer</p>
          </div>
          <button onClick={() => navigate('/customers')}
            className="flex items-center gap-1.5 text-sm text-textsecondary hover:bg-gray-100 px-3 py-1.5 rounded-lg transition-colors">
            <XCircle size={14} /> Cancel
          </button>
        </div>

        <Stepper currentStep={currentStep} />

        {currentStep === 1 && <Step1 form={form} onChange={handleChange} photo={photo} onPhoto={setPhoto} errors={errors} />}
        {currentStep === 2 && <Step2 form={form} onChange={handleChange} errors={errors} />}
        {currentStep === 3 && <Step3 form={form} onChange={handleChange} errors={errors}
          showPass={showPass} setShowPass={setShowPass}
          showConfirm={showConfirm} setShowConfirm={setShowConfirm} />}
        {currentStep === 4 && <Step4 form={form} onChange={handleChange} errors={errors} />}

        <div className="flex justify-between items-center pt-5 mt-6 border-t border-gray-100">
          {currentStep > 1
            ? <button onClick={handleBack}
                className="flex items-center gap-1.5 text-sm border border-border px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronLeft size={14} /> Back
              </button>
            : <div />}
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/customers')}>Cancel</Button>
            {currentStep < 4
              ? <Button onClick={handleNext}>{nextLabel[currentStep]}</Button>
              : <Button onClick={handleSubmit} icon={Check}>Save Customer</Button>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCustomer