import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Users, Package, DollarSign,
  ArrowLeftRight, UserCheck, BarChart3,
  Settings, LogOut, Building2,
} from 'lucide-react'

const runnerNavItems = [
  { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
  { label: "Customers",        icon: Users,           path: "/customers" },
  { label: "Savings Packages", icon: Package,         path: "/packages" },
  { label: "Contributions",    icon: DollarSign,      path: "/contributions" },
  { label: "Withdrawals",      icon: ArrowLeftRight,  path: "/withdrawals" },
  { label: "Agents",           icon: UserCheck,       path: "/agents" },
  { label: "Reports",          icon: BarChart3,       path: "/reports" },
]

const adminNavItems = [
  { label: "Tenant Management", icon: Building2, path: "/admin" },
  { label: "Reports",           icon: BarChart3, path: "/admin/reports" },
]

const Sidebar = ({ role }) => {
  const navigate = useNavigate()
  const navItems = role === "admin" ? adminNavItems : runnerNavItems

  const handleLogout = () => {
    // Clear any auth state here when you add auth later
    // e.g. localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div className="flex flex-col h-full">

      {/* Brand */}
      <div className="px-4 py-4 border-b border-white/15">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
            PC
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Pec Concepts</p>
            <p className="text-white/55 text-xs">
              {role === "admin" ? "Platform Admin" : "Ajo Runner"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-2.5 px-3 py-2.5
              rounded-lg transition-colors duration-150 text-sm
              ${isActive
                ? "bg-white/18 text-white font-medium"
                : "text-white/55 hover:bg-white/10 hover:text-white/80"}
            `}
          >
            <item.icon size={15} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom: Settings + Logout */}
      <div className="px-3 py-3 border-t border-white/15 flex flex-col gap-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-2.5 px-3 py-2.5
            rounded-lg transition-colors duration-150 text-sm
            ${isActive
              ? "bg-white/18 text-white font-medium"
              : "text-white/55 hover:bg-white/10 hover:text-white/80"}
          `}
        >
          <Settings size={15} />
          Settings
        </NavLink>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5
                     rounded-lg transition-colors duration-150
                     text-sm text-white/55
                     hover:bg-white/10 hover:text-white/80
                     w-full text-left"
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </div>
  )
}

export default Sidebar