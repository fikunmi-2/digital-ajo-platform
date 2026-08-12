import { useState } from 'react'
import { User, Lock, Bell, Building } from 'lucide-react'
import Button from '../../components/ui/Button'

const inputCls      = `border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition bg-white w-full`
const inputErrorCls = `border border-red-400 rounded-lg px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-red-100 transition bg-white w-full`
const cls = (error) => error ? inputErrorCls : inputCls

const tabs = [
  { id: 'profile',  label: 'Profile',       icon: User     },
  { id: 'security', label: 'Security',      icon: Lock     },
  { id: 'notif',    label: 'Notifications', icon: Bell     },
  { id: 'business', label: 'Business',      icon: Building },
]

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile')

  // Profile
  const [profile, setProfile]       = useState({ businessName: 'Pec Concepts', ownerName: 'Pec Admin', email: 'pec@concepts.com', phone: '08012345678' })
  const [profileErrors, setProfileErrors] = useState({})
  const [profileSaved, setProfileSaved]   = useState(false)

  // Security
  const [security, setSecurity]           = useState({ current: '', newPass: '', confirm: '' })
  const [securityErrors, setSecurityErrors] = useState({})
  const [securitySaved, setSecuritySaved]   = useState(false)

  // Business
  const [business, setBusiness]           = useState({ address: 'Lagos, Nigeria' })
  const [businessSaved, setBusinessSaved] = useState(false)

  const validateProfile = () => {
    const e = {}
    if (!profile.businessName.trim()) e.businessName = 'Business name is required'
    if (!profile.ownerName.trim())    e.ownerName    = 'Owner name is required'
    if (!profile.email.trim())        e.email        = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email))
                                      e.email        = 'Enter a valid email'
    if (!profile.phone.trim())        e.phone        = 'Phone is required'
    else if (!/^0\d{10}$/.test(profile.phone))
                                      e.phone        = 'Enter a valid 11-digit number'
    setProfileErrors(e)
    return Object.keys(e).length === 0
  }

  const validateSecurity = () => {
    const e = {}
    if (!security.current)              e.current = 'Current password is required'
    if (!security.newPass)              e.newPass = 'New password is required'
    else if (security.newPass.length < 8) e.newPass = 'Must be at least 8 characters'
    if (!security.confirm)              e.confirm = 'Please confirm your password'
    else if (security.newPass !== security.confirm)
                                        e.confirm = 'Passwords do not match'
    setSecurityErrors(e)
    return Object.keys(e).length === 0
  }

  const handleProfileSave = () => {
    if (validateProfile()) { setProfileSaved(true); setTimeout(() => setProfileSaved(false), 2000) }
  }

  const handleSecuritySave = () => {
    if (validateSecurity()) { setSecuritySaved(true); setSecurity({ current: '', newPass: '', confirm: '' }); setTimeout(() => setSecuritySaved(false), 2000) }
  }

  const handleBusinessSave = () => {
    setBusinessSaved(true)
    setTimeout(() => setBusinessSaved(false), 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg md:text-xl font-semibold">Settings</h1>
        <p className="text-sm text-textsecondary">Manage your account and business preferences</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Tabs */}
        <div className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible md:w-48 shrink-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'text-textsecondary hover:bg-gray-100'}`}>
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white border border-border rounded-xl p-5 md:p-6">

          {/* Profile */}
          {activeTab === 'profile' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold border-b border-gray-100 pb-3">Profile Information</h2>
              {profileSaved && (
                <div className="bg-success/10 border border-success/30 text-success text-xs rounded-lg px-3 py-2">
                  ✓ Profile saved successfully
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Business Name', key: 'businessName', error: profileErrors.businessName },
                  { label: 'Owner Name',    key: 'ownerName',    error: profileErrors.ownerName    },
                  { label: 'Email',         key: 'email',        error: profileErrors.email        },
                  { label: 'Phone',         key: 'phone',        error: profileErrors.phone        },
                ].map(field => (
                  <div key={field.key} className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-gray-600">{field.label}</label>
                    <input
                      value={profile[field.key]}
                      onChange={e => { setProfile({ ...profile, [field.key]: e.target.value }); if (profileErrors[field.key]) setProfileErrors({ ...profileErrors, [field.key]: '' }) }}
                      className={cls(field.error)}
                    />
                    {field.error && <p className="text-xs text-red-500">{field.error}</p>}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button onClick={handleProfileSave}>Save Changes</Button>
              </div>
            </div>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold border-b border-gray-100 pb-3">Change Password</h2>
              {securitySaved && (
                <div className="bg-success/10 border border-success/30 text-success text-xs rounded-lg px-3 py-2">
                  ✓ Password updated successfully
                </div>
              )}
              {[
                { label: 'Current Password',     key: 'current', error: securityErrors.current },
                { label: 'New Password',         key: 'newPass', error: securityErrors.newPass },
                { label: 'Confirm New Password', key: 'confirm', error: securityErrors.confirm },
              ].map(field => (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">{field.label}</label>
                  <input
                    type="password"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    value={security[field.key]}
                    onChange={e => { setSecurity({ ...security, [field.key]: e.target.value }); if (securityErrors[field.key]) setSecurityErrors({ ...securityErrors, [field.key]: '' }) }}
                    className={cls(field.error)}
                  />
                  {field.error && <p className="text-xs text-red-500">{field.error}</p>}
                </div>
              ))}
              <div className="flex justify-end">
                <Button onClick={handleSecuritySave}>Update Password</Button>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notif' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold border-b border-gray-100 pb-3">Notification Preferences</h2>
              {['New contribution recorded', 'Withdrawal request submitted', 'Customer account created', 'Daily summary report'].map(item => (
                <div key={item} className="flex justify-between items-center py-2 border-b border-gray-50">
                  <span className="text-sm">{item}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Business */}
          {activeTab === 'business' && (
            <div className="flex flex-col gap-5">
              <h2 className="text-sm font-semibold border-b border-gray-100 pb-3">Business Settings</h2>
              {businessSaved && (
                <div className="bg-success/10 border border-success/30 text-success text-xs rounded-lg px-3 py-2">
                  ✓ Settings saved successfully
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Business Address</label>
                  <input value={business.address}
                    onChange={e => setBusiness({ ...business, address: e.target.value })}
                    className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-gray-600">Currency</label>
                  <input value="NGN — Nigerian Naira" readOnly
                    className={inputCls + ' bg-gray-50 text-gray-400 cursor-not-allowed'} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={handleBusinessSave}>Save Settings</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Settings