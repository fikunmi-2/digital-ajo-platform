import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Info, Clock } from 'lucide-react'
import Button from '../../components/ui/Button'

const Login = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading]           = useState(false)
  const [form, setForm]                 = useState({ identifier: '', password: '' })
  const [errors, setErrors]             = useState({})

  const validate = () => {
    const newErrors = {}
    if (!form.identifier.trim())
      newErrors.identifier = 'Email or phone number is required'
    if (!form.password.trim())
      newErrors.password = 'Password is required'
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const identifier = form.identifier.trim().toLowerCase()
    setTimeout(() => {
      setLoading(false)
      if (identifier === 'admin')         window.location.href = '/admin'
      else if (identifier === 'customer') window.location.href = '/portal'
      else                                window.location.href = '/dashboard'
    }, 1500)
  }

  const errorCls = 'border-red-400 focus:border-red-400 focus:ring-red-100'

  return (
    <div className="min-h-screen flex">

      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-primary flex-col justify-between p-10 relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-0 w-48 h-48 rounded-full bg-accent/10" />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Clock size={20} className="text-white" />
          </div>
          <p className="text-white font-medium text-lg">Digital Ajo Platform</p>
        </div>

        <div className="relative">
          <h1 className="text-white text-3xl font-medium leading-snug mb-4">
            Manage your savings<br />business digitally
          </h1>
          <p className="text-white/65 text-sm leading-relaxed mb-8">
            A secure, structured platform for ajo runners and their customers.
            Track contributions, manage withdrawals and grow your business.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {[
              { label: "Total Savings",    value: "₦24.5M", trend: "↑ 12% this month" },
              { label: "Active Customers", value: "1,248",  trend: "↑ 48 this week"   },
              { label: "Withdrawals",      value: "₦3.8M",  trend: "This month"        },
              { label: "Ajo Runners",      value: "36",     trend: "↑ 3 this month"    },
            ].map(item => (
              <div key={item.label} className="bg-white/10 border border-white/15 rounded-xl p-4">
                <p className="text-white/60 text-xs mb-2">{item.label}</p>
                <p className="text-white text-xl font-medium mb-1">{item.value}</p>
                <p className="text-accent text-xs">{item.trend}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {["Secure & encrypted", "Real-time tracking"].map(pill => (
              <div key={pill} className="flex items-center gap-1.5 bg-white/10 border border-white/15 rounded-full px-3 py-1.5">
                <div className="w-1.5 h-1.5 bg-success rounded-full" />
                <span className="text-white/80 text-xs">{pill}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-white/35 text-xs">© 2025 Digital Ajo Platform. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center bg-pagebg px-4 py-8">
        <div className="w-full max-w-sm">

          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary-light rounded-2xl mx-auto mb-4 flex items-center justify-center">
              <Lock size={26} className="text-primary" />
            </div>
            <h2 className="text-xl font-medium text-textprimary mb-1">Welcome back</h2>
            <p className="text-sm text-textsecondary">Sign in to your account to continue</p>
          </div>

          <div className="bg-white border border-border rounded-xl p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

              {/* Identifier */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textprimary">Email or Phone number</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary" />
                  <input
                    type="text"
                    placeholder="e.g. 08012345678 or email"
                    value={form.identifier}
                    onChange={e => {
                      setForm({ ...form, identifier: e.target.value })
                      if (errors.identifier) setErrors({ ...errors, identifier: '' })
                    }}
                    className={`w-full pl-9 pr-3 py-2.5 text-sm border rounded-lg outline-none bg-white transition-colors
                      ${errors.identifier ? errorCls : 'border-border focus:border-primary'}`}
                  />
                </div>
                {errors.identifier && (
                  <p className="text-xs text-red-500">{errors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-textprimary">Password</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-textsecondary" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={e => {
                      setForm({ ...form, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    className={`w-full pl-9 pr-10 py-2.5 text-sm border rounded-lg outline-none bg-white transition-colors
                      ${errors.password ? errorCls : 'border-border focus:border-primary'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textsecondary hover:text-textprimary">
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="text-right -mt-2">
                <button type="button" className="text-xs text-primary font-medium hover:underline">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" variant="primary" loading={loading} className="w-full justify-center py-2.5">
                Sign in
              </Button>

              <div className="flex items-start gap-2 bg-pagebg rounded-lg p-3">
                <Info size={14} className="text-textsecondary flex-shrink-0 mt-0.5" />
                <p className="text-xs text-textsecondary leading-relaxed">
                  Your credentials are provided by your ajo runner. Contact them if you need help accessing your account.
                </p>
              </div>
            </form>
          </div>

          <p className="text-center text-xs text-textsecondary mt-6">
            Powered by Digital Ajo Platform · © 2025
          </p>

          <div className="mt-4 bg-white border border-border rounded-lg p-3">
            <p className="text-xs text-textsecondary font-medium mb-1">Test credentials:</p>
            <p className="text-xs text-textsecondary">Type <span className="font-medium text-primary">admin</span> → Platform Admin</p>
            <p className="text-xs text-textsecondary">Type <span className="font-medium text-primary">customer</span> → Customer Portal</p>
            <p className="text-xs text-textsecondary">Type <span className="font-medium text-primary">anything else</span> → Ajo Runner Dashboard</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login