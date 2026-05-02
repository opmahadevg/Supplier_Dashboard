import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import logo from '@assets/logo.png'

const navItems = [
  { path: '/home', icon: 'home', label: 'Home' },
  { path: '/matched-rfqs', icon: 'request_quote', label: 'Matched RFQs' },
  { path: '/my-bids', icon: 'gavel', label: 'My Bids' },
  { path: '/messages', icon: 'chat', label: 'Messages' },
  { path: '/analytics', icon: 'bar_chart', label: 'Analytics' },
  { path: '/product-catalogue', icon: 'inventory_2', label: 'Product Catalogue' },
  { path: '/sample-orders', icon: 'science', label: 'Sample Orders' },
  { path: '/bulk-orders', icon: 'local_shipping', label: 'Bulk Orders' },
]

const bottomItems = [
  { path: '/company-profile', icon: 'business', label: 'Company Profile' },
  { path: '/settings', icon: 'settings', label: 'Settings' },
]

function getInitials(name) {
  return (name || '').split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function NavTooltip({ label, collapsed }) {
  if (!collapsed) return null
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#111111] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111111]" />
    </div>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [showLogout, setShowLogout] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('proquoment_sidebar_collapsed') === 'true' } catch { return false }
  })

  const toggleCollapse = () => {
    setCollapsed(c => {
      const next = !c
      try { localStorage.setItem('proquoment_sidebar_collapsed', String(next)) } catch {}
      return next
    })
  }

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const navClass = (isActive) =>
    `relative group flex items-center rounded-xl transition-all duration-150 text-[13.5px] font-medium
     ${collapsed ? 'justify-center px-0 py-2.5 mx-1.5' : 'gap-3 px-3 py-2.5'}
     ${isActive ? 'bg-[#f0f1ff] text-[#0f00da]' : 'text-[#6b6b6b] hover:bg-[#f7f7f7] hover:text-[#111111]'}`

  return (
    <aside
      className={`
        ${collapsed ? 'w-[64px]' : 'w-60'}
        min-h-screen bg-white border-r border-[#f0f0f0] flex flex-col py-5
        flex-shrink-0 sticky top-0 h-screen overflow-visible no-scrollbar
        transition-[width] duration-200 ease-in-out
      `}
    >
      {/* Logo + Collapse Toggle */}
      <div className={`mb-7 flex items-center flex-shrink-0 ${collapsed ? 'flex-col gap-3 px-0' : 'px-4 justify-between'}`}>
        <div className={`flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}>
          <img
            src={logo}
            alt="Proquoment"
            className="w-7 h-7 rounded-lg flex-shrink-0 object-cover"
          />
          {!collapsed && (
            <span className="text-[#111111] font-semibold text-[15px] tracking-tight overflow-hidden whitespace-nowrap">
              Proquoment
            </span>
          )}
        </div>
        <button
          onClick={toggleCollapse}
          className={`
            flex items-center justify-center rounded-xl transition-colors
            text-[#9e9e9e] hover:text-[#111111] hover:bg-[#f5f5f5]
            ${collapsed ? 'w-8 h-8' : 'w-7 h-7 flex-shrink-0'}
          `}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <span className="material-symbols-outlined text-[18px]">
            {collapsed ? 'chevron_right' : 'chevron_left'}
          </span>
        </button>
      </div>

      {/* Main Nav */}
      <nav className={`flex-1 flex flex-col gap-0.5 ${collapsed ? 'px-0' : 'px-3'}`}>
        {navItems.map(item => (
          <div key={item.path} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) => navClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${isActive ? 'icon-fill' : ''}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
            <NavTooltip label={item.label} collapsed={collapsed} />
          </div>
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className={`flex flex-col gap-0.5 mt-4 pt-4 border-t border-[#f0f0f0] ${collapsed ? 'px-0' : 'px-3'}`}>
        {bottomItems.map(item => (
          <div key={item.path} className="relative group">
            <NavLink
              to={item.path}
              className={({ isActive }) => navClass(isActive)}
            >
              {({ isActive }) => (
                <>
                  <span className={`material-symbols-outlined text-[20px] flex-shrink-0 ${isActive ? 'icon-fill' : ''}`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
            <NavTooltip label={item.label} collapsed={collapsed} />
          </div>
        ))}

        {/* User Profile */}
        <div className="relative mt-3 group">
          <button
            onClick={() => setShowLogout(v => !v)}
            className={`
              w-full flex items-center rounded-xl hover:bg-[#f7f7f7] transition-colors text-left
              ${collapsed ? 'justify-center px-0 py-2 mx-1.5 w-auto' : 'gap-3 px-3 py-2.5'}
            `}
          >
            <div className="w-7 h-7 rounded-full bg-[#0f00da] flex items-center justify-center flex-shrink-0 text-white text-[11px] font-bold">
              {user ? getInitials(user.name) : 'U'}
            </div>
            {!collapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] text-[13px] font-medium truncate leading-tight">{user?.name || 'Supplier'}</p>
                  <p className="text-[#9e9e9e] text-[11px] truncate leading-tight mt-0.5">{user?.email || ''}</p>
                </div>
                <span className="material-symbols-outlined text-[15px] text-[#b0b0b0] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  more_horiz
                </span>
              </>
            )}
          </button>

          {/* Tooltip for collapsed user */}
          {collapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-[#111111] text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50 shadow-lg">
              <p className="font-semibold">{user?.name}</p>
              <p className="text-[10px] text-[#9e9e9e] mt-0.5">{user?.email}</p>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-[#111111]" />
            </div>
          )}

          {showLogout && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowLogout(false)} />
              <div className={`absolute bottom-full mb-2 bg-white border border-[#ebebeb] rounded-2xl shadow-lg overflow-hidden z-20 ${collapsed ? 'left-full ml-2 bottom-auto top-1/2 -translate-y-1/2 mb-0' : 'left-0 right-0'}`}>
                <div className="px-4 py-3 border-b border-[#f5f5f5] min-w-[200px]">
                  <p className="text-[13px] font-semibold text-[#111111]">{user?.name}</p>
                  <p className="text-[11px] text-[#9e9e9e] mt-0.5">{user?.company}</p>
                  <span className="inline-block mt-1.5 text-[10px] bg-[#f0f1ff] text-[#0f00da] px-2 py-0.5 rounded-full font-semibold">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-[#dc2626] hover:bg-[#fff5f5] transition-colors"
                >
                  <span className="material-symbols-outlined text-[17px]">logout</span>
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </aside>
  )
}
