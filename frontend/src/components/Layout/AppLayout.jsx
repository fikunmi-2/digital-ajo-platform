import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import BottomNav from './BottomNav'

const AppLayout = ({ role }) => {
  return (
    <div className="flex min-h-screen bg-pagebg">

      {/* Sidebar — desktop only, hidden on mobile */}
      {role !== "customer" && (
        <aside className="hidden lg:flex flex-col
                          w-60 min-h-screen
                          bg-primary fixed top-0 left-0
                          z-20">
          <Sidebar role={role} />
        </aside>
      )}

      {/* Main content area */}
      <main className={`
        flex-1 flex flex-col min-h-screen
        ${role !== "customer" ? "lg:ml-60" : ""}
      `}>

        {/* Top Navbar */}
        <Navbar role={role} />

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6
                        pb-20 lg:pb-6
                        overflow-x-hidden">
          <Outlet />
        </div>

        {/* Bottom Nav — mobile only */}
        {role === "runner" && <BottomNav />}

      </main>

    </div>
  )
}

export default AppLayout