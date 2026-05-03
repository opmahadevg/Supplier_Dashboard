import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'
import ErrorBoundary from './ErrorBoundary'

const mobileNavItems = [
  { path: '/home',           icon: 'home',          label: 'Home' },
  { path: '/matched-rfqs',   icon: 'request_quote', label: 'RFQs' },
  { path: '/my-bids',        icon: 'gavel',         label: 'Bids' },
  { path: '/messages',       icon: 'chat',          label: 'Chat' },
  { path: '/analytics',      icon: 'bar_chart',     label: 'Analytics' },
]

function MobileBottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#f0f0f0] flex items-center justify-around px-1 py-1 safe-area-inset-bottom">
      {mobileNavItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-0 flex-1 ${
              isActive ? 'text-[#0f00da]' : 'text-[#9e9e9e]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined text-[22px] ${isActive ? 'icon-fill' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

export default function Layout() {
  const location = useLocation()
  const isMessages = location.pathname === '/messages'

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 min-w-0 bg-white pb-16 md:pb-0 ${
          isMessages ? 'overflow-hidden h-screen' : 'overflow-y-auto'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <PageTransition key={location.pathname}>
            <ErrorBoundary key={location.pathname}>
              <Outlet />
            </ErrorBoundary>
          </PageTransition>
        </AnimatePresence>
      </main>
      <MobileBottomNav />
    </div>
  )
}
