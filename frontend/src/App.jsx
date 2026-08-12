// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// // Layout
// import AppLayout from './components/layout/AppLayout'

// // Auth
// import Login from './pages/auth/Login'

// // Ajo Runner Pages
// import Dashboard from './pages/dashboard/Dashboard'
// import CustomerList from './pages/customers/CustomerList'
// import AddCustomer from './pages/customers/AddCustomer'
// import CustomerProfile from './pages/customers/CustomerProfile'
// import PackageList from './pages/packages/PackageList'
// import CreatePackage from './pages/packages/CreatePackage'
// import ContributionList from './pages/contributions/ContributionList'
// import RecordContribution from './pages/contributions/RecordContribution'
// import Withdrawals from './pages/withdrawals/Withdrawals'
// import AgentList from './pages/agents/AgentList'
// import Reports from './pages/reports/Reports'

// // Customer Portal
// import CustomerDashboard from './pages/customer-portal/CustomerDashboard'

// // Platform Admin
// import TenantManagement from './pages/admin/TenantManagement'

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>

//         {/* Default */}
//         <Route path="/" element={<Navigate to="/login" />} />

//         {/* Auth - no layout */}
//         <Route path="/login" element={<Login />} />

//         {/* Ajo Runner - with layout */}
//         <Route element={<AppLayout role="runner" />}>
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/customers" element={<CustomerList />} />
//           <Route path="/customers/add" element={<AddCustomer />} />
//           <Route path="/customers/:id" element={<CustomerProfile />} />
//           <Route path="/packages" element={<PackageList />} />
//           <Route path="/packages/create" element={<CreatePackage />} />
//           <Route path="/contributions" element={<ContributionList />} />
//           <Route path="/contributions/record" element={<RecordContribution />} />
//           <Route path="/withdrawals" element={<Withdrawals />} />
//           <Route path="/agents" element={<AgentList />} />
//           <Route path="/reports" element={<Reports />} />
//         </Route>

//         {/* Customer Portal */}
//         <Route element={<AppLayout role="customer" />}>
//           <Route path="/portal" element={<CustomerDashboard />} />
//         </Route>

//         {/* Platform Admin */}
//         <Route element={<AppLayout role="admin" />}>
//           <Route path="/admin" element={<TenantManagement />} />
//         </Route>

//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

// Layout
import AppLayout from './components/layout/AppLayout'

// Auth
import Login from './pages/auth/Login'

// Ajo Runner Pages
import Dashboard from './pages/dashboard/Dashboard'
import CustomerList from './pages/customers/CustomerList'
import AddCustomer from './pages/customers/AddCustomer'
import CustomerProfile from './pages/customers/CustomerProfile'
import PackageList from './pages/packages/PackageList'
import CreatePackage from './pages/packages/CreatePackage'
import ContributionList from './pages/contributions/ContributionList'
import RecordContribution from './pages/contributions/RecordContribution'
import Withdrawals from './pages/withdrawals/Withdrawals'
import AgentList from './pages/agents/AgentList'
import Reports from './pages/reports/Reports'
import Settings from './pages/settings/Settings'



// Customer Portal
import CustomerDashboard from './pages/customer-portal/CustomerDashboard'

// Platform Admin
import TenantManagement from './pages/admin/TenantManagement'
import AddTenant from './pages/admin/AddTenant'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth - no layout */}
        <Route path="/login" element={<Login />} />

        {/* Ajo Runner - with layout */}
        <Route element={<AppLayout role="runner" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/add" element={<AddCustomer />} />
          <Route path="/customers/:id" element={<CustomerProfile />} />
          <Route path="/packages" element={<PackageList />} />
          <Route path="/packages/create" element={<CreatePackage />} />
          <Route path="/contributions" element={<ContributionList />} />
          <Route path="/contributions/record"
            element={<RecordContribution />} />
          <Route path="/withdrawals" element={<Withdrawals />} />
          <Route path="/agents" element={<AgentList />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Customer Portal */}
        <Route element={<AppLayout role="customer" />}>
          <Route path="/portal" element={<CustomerDashboard />} />
        </Route>

        {/* Platform Admin */}
        <Route element={<AppLayout role="admin" />}>
          <Route path="/admin" element={<TenantManagement />} />
          <Route path="/admin/tenant" element={<AddTenant />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App