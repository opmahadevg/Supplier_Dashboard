import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  const location = useLocation()
  const isMessages = location.pathname === '/messages'

  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      <Sidebar />
      <main className={`flex-1 min-w-0 bg-white transition-all duration-200 ${isMessages ? 'overflow-hidden h-screen' : 'overflow-y-auto'}`}>
        <Outlet />
      </main>
    </div>
  )
}
