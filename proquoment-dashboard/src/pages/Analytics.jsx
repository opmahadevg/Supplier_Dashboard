import { useState, useEffect } from 'react'
import { useSettings, formatAmount } from '../context/SettingsContext'
import { getAnalyticsMonthly } from '../lib/db'

const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const revenueData = [18000, 24000, 21000, 32000, 28000, 48200]
const bidsData = [8, 12, 10, 15, 11, 18]
const maxRevenue = Math.max(...revenueData)

const topProductsRaw = [
  { name: 'Steel Pipes Grade A', revenueUsd: 18500, orders: 12, pct: 85 },
  { name: 'Gate Valves DN80', revenueUsd: 12200, orders: 8, pct: 60 },
  { name: 'Hydraulic Fittings', revenueUsd: 9800, orders: 15, pct: 48 },
  { name: 'SS Flanges 316L', revenueUsd: 7700, orders: 5, pct: 38 },
]

const categories = [
  { name: 'Industrial Metals', pct: 45, color: '#0f00da' },
  { name: 'Valves & Fittings', pct: 28, color: '#2d2dff' },
  { name: 'Hydraulics', pct: 17, color: '#959afd' },
  { name: 'Others', pct: 10, color: '#e1e0ff' },
]

const winRate = 33

const PERIODS = ['1M', '3M', '6M', '1Y']

export default function Analytics() {
  const { settings } = useSettings()
  const currency = settings.preferences.currency
  const [period, setPeriod] = useState('6M')
  const [monthlyData, setMonthlyData] = useState(null)

  useEffect(() => {
    getAnalyticsMonthly().then(data => { if (data) setMonthlyData(data) })
  }, [])

  const displayMonths = monthlyData ? monthlyData.map(d => d.month) : months
  const displayRevenue = monthlyData ? monthlyData.map(d => d.revenue) : revenueData
  const displayBids = monthlyData ? monthlyData.map(d => d.bids_submitted) : bidsData
  const displayMaxRevenue = Math.max(...displayRevenue)

  const totalRevenue = displayRevenue.reduce((s, v) => s + v, 0)
  const totalBids = displayBids.reduce((s, v) => s + v, 0)
  const totalWon = monthlyData ? monthlyData.reduce((s, d) => s + d.bids_won, 0) : 6
  const computedWinRate = totalBids > 0 ? Math.round((totalWon / totalBids) * 100) : winRate
  const avgDeal = totalBids > 0 ? Math.round(totalRevenue / totalBids) : 9640

  const kpis = [
    { label: 'Total Revenue', value: formatAmount(totalRevenue, currency), change: '+12%', icon: 'payments', positive: true },
    { label: 'Bids Submitted', value: String(totalBids), change: '+6 vs last period', icon: 'gavel', positive: true },
    { label: 'Win Rate', value: `${computedWinRate}%`, change: '+5%', icon: 'emoji_events', positive: true },
    { label: 'Avg Deal Size', value: formatAmount(avgDeal, currency), change: '+8%', icon: 'trending_up', positive: true },
  ]

  return (
    <div className="p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Analytics</h1>
          <p className="text-sm text-[#9e9e9e] mt-0.5">
            Performance overview · Amounts in {currency}
          </p>
        </div>
        <div className="flex gap-2">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${p === period ? 'bg-[#0f00da] text-white' : 'bg-[#f5f5f5] text-[#555555] hover:bg-[#ebebeb]'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className="bg-white border border-[#ebebeb] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#0f00da]">{k.icon}</span>
              <span className="text-xs text-[#9e9e9e]">{k.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#111111]">{k.value}</p>
            <p className="text-xs text-[#0f00da] mt-1">{k.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white border border-[#ebebeb] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#111111]">Revenue Trend</h2>
            <span className="text-xs text-[#9e9e9e]">{currency}</span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-[#9e9e9e] w-14">
              {[50000, 37500, 25000, 12500, 0].map(v => (
                <span key={v}>{formatAmount(v, currency).replace(/\d+$/, k => parseInt(k).toLocaleString())}</span>
              ))}
            </div>
            <div className="ml-14">
              <svg viewBox="0 0 400 180" className="w-full" preserveAspectRatio="none">
                {[0, 45, 90, 135, 180].map((y, i) => (
                  <line key={i} x1="0" y1={y} x2="400" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                ))}
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0f00da" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#0f00da" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  fill="url(#revGrad)"
                  points={displayRevenue.map((v, i) => {
                    const x = (i / (displayRevenue.length - 1)) * 400
                    const y = 180 - (v / displayMaxRevenue) * 180
                    return `${x},${y}`
                  }).join(' ') + ' 400,180 0,180'}
                />
                <polyline
                  fill="none"
                  stroke="#0f00da"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={displayRevenue.map((v, i) => {
                    const x = (i / (displayRevenue.length - 1)) * 400
                    const y = 180 - (v / displayMaxRevenue) * 180
                    return `${x},${y}`
                  }).join(' ')}
                />
                {displayRevenue.map((v, i) => {
                  const x = (i / (displayRevenue.length - 1)) * 400
                  const y = 180 - (v / displayMaxRevenue) * 180
                  return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#0f00da" strokeWidth="2" />
                })}
              </svg>
              <div className="flex justify-between mt-1">
                {displayMonths.map(m => (
                  <span key={m} className="text-xs text-[#9e9e9e]">{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Donut */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Revenue by Category</h2>
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-32 h-32 rounded-full relative"
              style={{ background: `conic-gradient(#0f00da 0% 45%, #2d2dff 45% 73%, #959afd 73% 90%, #e1e0ff 90% 100%)` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center">
                  <p className="text-base font-bold text-[#111111]">45%</p>
                  <p className="text-[9px] text-[#9e9e9e] text-center leading-tight">Top Category</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            {categories.map(cat => (
              <div key={cat.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-[#555555] flex-1 truncate">{cat.name}</span>
                <span className="text-xs font-semibold text-[#111111]">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="col-span-2 bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Top Products by Revenue</h2>
          <div className="space-y-4">
            {topProductsRaw.map(p => (
              <div key={p.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-[#111111]">{p.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#9e9e9e]">{p.orders} orders</span>
                    <span className="text-sm font-semibold text-[#111111]">{formatAmount(p.revenueUsd, currency)}</span>
                  </div>
                </div>
                <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0f00da] rounded-full transition-all" style={{ width: `${p.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Win Rate */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Bid Win Rate</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-16 overflow-hidden">
              <div
                className="w-32 h-32 rounded-full absolute top-0"
                style={{ background: `conic-gradient(from 180deg, #0f00da 0deg ${computedWinRate * 1.8}deg, #f0f0f0 ${computedWinRate * 1.8}deg 180deg, transparent 180deg 360deg)` }}
              />
              <div className="absolute inset-0 top-8 flex items-end justify-center">
                <p className="text-2xl font-bold text-[#111111]">{computedWinRate}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { label: 'Bids Won', value: String(totalWon), color: 'bg-[#0f00da]' },
              { label: 'Bids Lost', value: String(Math.max(0, totalBids - totalWon)), color: 'bg-[#f0f0f0]' },
              { label: 'Pending', value: String(totalBids), color: 'bg-[#bfc1ff]' },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-xs text-[#555555] flex-1">{s.label}</span>
                <span className="text-xs font-semibold text-[#111111]">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
