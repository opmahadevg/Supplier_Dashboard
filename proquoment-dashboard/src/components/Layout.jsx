import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar'
import PageTransition from './PageTransition'
import ErrorBoundary from './ErrorBoundary'

export default function Layout() {
  const location = useLocation()
  const isMessages = location.pathname === '/messages'

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <Sidebar />
      <main
        className={`flex-1 min-w-0 bg-white ${
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
    </div>
  )
}
