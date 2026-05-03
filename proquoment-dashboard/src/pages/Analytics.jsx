import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettings, formatAmount } from '../context/SettingsContext'
import { getAnalyticsMonthly } from '../lib/db'

/* ── Static fallback data per period ───────────────────────── */
const PERIOD_DATA = {
  '1M': {
    months: ['W1', 'W2', 'W3', 'W4'],
    revenue: [9200, 11400, 8700, 13100],
    bids: [3, 5, 4, 6],
    bidsWon: [1, 2, 1, 2],
    topProducts: [
      { name: 'Steel Pipes Grade A', revenueUsd: 6200, orders: 4, pct: 90 },
      { name: 'Gate Valves DN80', revenueUsd: 4100, orders: 3, pct: 60 },
      { name: 'Hydraulic Fittings', revenueUsd: 3200, orders: 5, pct: 46 },
      { name: 'SS Flanges 316L', revenueUsd: 2400, orders: 2, pct: 34 },
    ],
    categories: [
      { name: 'Industrial Metals', pct: 47, color: '#0f00da' },
      { name: 'Valves & Fittings', pct: 26, color: '#2d2dff' },
      { name: 'Hydraulics', pct: 18, color: '#959afd' },
      { name: 'Others', pct: 9, color: '#e1e0ff' },
    ],
    changeLabels: { revenue: '+8%', bids: '+2 vs last month', winRate: '+3%', deal: '+6%' },
  },
  '3M': {
    months: ['Oct', 'Nov', 'Dec'],
    revenue: [32000, 28000, 48200],
    bids: [15, 11, 18],
    bidsWon: [5, 4, 7],
    topProducts: [
      { name: 'Steel Pipes Grade A', revenueUsd: 12800, orders: 8, pct: 88 },
      { name: 'Gate Valves DN80', revenueUsd: 8600, orders: 6, pct: 62 },
      { name: 'Hydraulic Fittings', revenueUsd: 6900, orders: 10, pct: 50 },
      { name: 'SS Flanges 316L', revenueUsd: 5300, orders: 4, pct: 36 },
    ],
    categories: [
      { name: 'Industrial Metals', pct: 46, color: '#0f00da' },
      { name: 'Valves & Fittings', pct: 27, color: '#2d2dff' },
      { name: 'Hydraulics', pct: 17, color: '#959afd' },
      { name: 'Others', pct: 10, color: '#e1e0ff' },
    ],
    changeLabels: { revenue: '+14%', bids: '+5 vs last quarter', winRate: '+4%', deal: '+9%' },
  },
  '6M': {
    months: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [18000, 24000, 21000, 32000, 28000, 48200],
    bids: [8, 12, 10, 15, 11, 18],
    bidsWon: [2, 4, 3, 5, 4, 7],
    topProducts: [
      { name: 'Steel Pipes Grade A', revenueUsd: 18500, orders: 12, pct: 85 },
      { name: 'Gate Valves DN80', revenueUsd: 12200, orders: 8, pct: 60 },
      { name: 'Hydraulic Fittings', revenueUsd: 9800, orders: 15, pct: 48 },
      { name: 'SS Flanges 316L', revenueUsd: 7700, orders: 5, pct: 38 },
    ],
    categories: [
      { name: 'Industrial Metals', pct: 45, color: '#0f00da' },
      { name: 'Valves & Fittings', pct: 28, color: '#2d2dff' },
      { name: 'Hydraulics', pct: 17, color: '#959afd' },
      { name: 'Others', pct: 10, color: '#e1e0ff' },
    ],
    changeLabels: { revenue: '+12%', bids: '+6 vs last period', winRate: '+5%', deal: '+8%' },
  },
  '1Y': {
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    revenue: [12000, 15500, 14200, 19000, 17800, 22000, 18000, 24000, 21000, 32000, 28000, 48200],
    bids: [5, 7, 6, 9, 8, 11, 8, 12, 10, 15, 11, 18],
    bidsWon: [1, 2, 2, 3, 3, 4, 2, 4, 3, 5, 4, 7],
    topProducts: [
      { name: 'Steel Pipes Grade A', revenueUsd: 72400, orders: 48, pct: 85 },
      { name: 'Gate Valves DN80', revenueUsd: 49800, orders: 32, pct: 60 },
      { name: 'Hydraulic Fittings', revenueUsd: 38200, orders: 58, pct: 48 },
      { name: 'SS Flanges 316L', revenueUsd: 31100, orders: 19, pct: 38 },
    ],
    categories: [
      { name: 'Industrial Metals', pct: 44, color: '#0f00da' },
      { name: 'Valves & Fittings', pct: 29, color: '#2d2dff' },
      { name: 'Hydraulics', pct: 18, color: '#959afd' },
      { name: 'Others', pct: 9, color: '#e1e0ff' },
    ],
    changeLabels: { revenue: '+31%', bids: '+24 vs last year', winRate: '+7%', deal: '+15%' },
  },
}

const PERIODS = ['1M', '3M', '6M', '1Y']

/* ── Animated counter hook ─────────────────────────────────── */
function useCountUp(target, duration = 900) {
  const [display, setDisplay] = useState(0)
  const ref = useRef({ start: 0, from: 0, to: target, raf: null })

  useEffect(() => {
    const entry = ref.current
    cancelAnimationFrame(entry.raf)
    entry.from = entry.to   // start from current displayed value on change
    entry.to   = target
    entry.start = performance.now()

    function tick(now) {
      const elapsed = now - entry.start
      const progress = Math.min(elapsed / duration, 1)
      // ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(entry.from + (entry.to - entry.from) * eased))
      if (progress < 1) entry.raf = requestAnimationFrame(tick)
    }
    entry.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(entry.raf)
  }, [target, duration])

  return display
}

/* ── KPI card with animated counter ───────────────────────── */
function KpiCard({ label, rawValue, formattedValue, change, icon, delay = 0 }) {
  // rawValue drives the counter; formattedValue is the label format
  const counted = useCountUp(rawValue, 800)

  // re-format counted number using the same format as formattedValue
  const prefix = formattedValue.match(/^[^\d]*/)?.[0] ?? ''
  const suffix = formattedValue.match(/[^\d.,]+$/)?.[0] ?? ''
  const displayStr = prefix
    ? `${prefix}${counted.toLocaleString()}${suffix}`
    : formattedValue.includes('%')
      ? `${counted}%`
      : counted.toLocaleString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="bg-white border border-[#ebebeb] rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="material-symbols-outlined text-[18px] text-[#0f00da]">{icon}</span>
        <span className="text-xs text-[#9e9e9e]">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#111111] tabular-nums">{displayStr}</p>
      <p className="text-xs text-[#0f00da] mt-1">{change}</p>
    </motion.div>
  )
}

export default function Analytics() {
  const { settings } = useSettings()
  const currency = settings?.preferences?.currency ?? 'USD'
  const [period, setPeriod] = useState('6M')
  const [monthlyData, setMonthlyData] = useState(null)

  useEffect(() => {
    getAnalyticsMonthly().then(data => { if (data) setMonthlyData(data) })
  }, [])

  /* ── Resolve data for selected period ── */
  const fallback = PERIOD_DATA[period]

  // If we have live Supabase data use it only for 6M (all months), otherwise use static
  const useSupabase = !!monthlyData && period === '6M'
  const displayMonths   = useSupabase ? monthlyData.map(d => d.month)            : fallback.months
  const displayRevenue  = useSupabase ? monthlyData.map(d => d.revenue)          : fallback.revenue
  const displayBids     = useSupabase ? monthlyData.map(d => d.bids_submitted)   : fallback.bids
  const totalWon        = useSupabase ? monthlyData.reduce((s, d) => s + d.bids_won, 0) : fallback.bidsWon.reduce((s, v) => s + v, 0)
  const displayMaxRev   = Math.max(...displayRevenue)
  const topProducts     = fallback.topProducts
  const categories      = fallback.categories
  const changeLabels    = fallback.changeLabels

  const totalRevenue    = displayRevenue.reduce((s, v) => s + v, 0)
  const totalBids       = displayBids.reduce((s, v) => s + v, 0)
  const computedWinRate = totalBids > 0 ? Math.round((totalWon / totalBids) * 100) : 33
  const avgDeal         = totalBids > 0 ? Math.round(totalRevenue / totalBids) : 9640

  const kpis = [
    { label: 'Total Revenue', rawValue: totalRevenue, formattedValue: formatAmount(totalRevenue, currency), change: changeLabels.revenue, icon: 'payments' },
    { label: 'Bids Submitted', rawValue: totalBids, formattedValue: String(totalBids), change: changeLabels.bids, icon: 'gavel' },
    { label: 'Win Rate', rawValue: computedWinRate, formattedValue: `${computedWinRate}%`, change: changeLabels.winRate, icon: 'emoji_events' },
    { label: 'Avg Deal Size', rawValue: avgDeal, formattedValue: formatAmount(avgDeal, currency), change: changeLabels.deal, icon: 'trending_up' },
  ]

  /* ── SVG line chart points ── */
  const points = displayRevenue.map((v, i) => {
    const x = displayRevenue.length === 1 ? 200 : (i / (displayRevenue.length - 1)) * 400
    const y = 180 - (v / displayMaxRev) * 160
    return { x, y, v }
  })
  const pathD   = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const areaD   = pathD + ` L 400 180 L 0 180 Z`

  /* ── Donut conic stop ── */
  let cumulative = 0
  const donutStops = categories.map(c => {
    const start = cumulative
    cumulative += c.pct
    return `${c.color} ${start}% ${cumulative}%`
  }).join(', ')

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
        <div className="flex gap-1.5 bg-[#f5f5f5] p-1 rounded-full">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`relative px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 ${
                p === period ? 'text-white' : 'text-[#555555] hover:text-[#111111]'
              }`}
            >
              {p === period && (
                <motion.span
                  layoutId="period-pill"
                  className="absolute inset-0 bg-[#0f00da] rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{p}</span>
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <AnimatePresence mode="wait">
        <motion.div
          key={period + '-kpis'}
          className="grid grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {kpis.map((k, i) => (
            <KpiCard key={k.label} {...k} delay={i * 0.05} />
          ))}
        </motion.div>
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Revenue Chart */}
        <div className="col-span-2 bg-white border border-[#ebebeb] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-[#111111]">Revenue Trend</h2>
            <span className="text-xs text-[#9e9e9e]">{currency}</span>
          </div>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-xs text-[#9e9e9e] w-14">
              {[displayMaxRev, displayMaxRev * 0.75, displayMaxRev * 0.5, displayMaxRev * 0.25, 0].map((v, i) => (
                <span key={i}>{formatAmount(Math.round(v), currency)}</span>
              ))}
            </div>
            <div className="ml-14">
              <AnimatePresence mode="wait">
                <motion.svg
                  key={period + '-chart'}
                  viewBox="0 0 400 180"
                  className="w-full"
                  preserveAspectRatio="none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {[0, 45, 90, 135, 180].map((y, i) => (
                    <line key={i} x1="0" y1={y} x2="400" y2={y} stroke="#f0f0f0" strokeWidth="1" />
                  ))}
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0f00da" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#0f00da" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <motion.path
                    fill="url(#revGrad)"
                    stroke="none"
                    d={areaD}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  />
                  <motion.path
                    fill="none"
                    stroke="#0f00da"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    d={pathD}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                  />
                  {points.map((p, i) => (
                    <motion.circle
                      key={i}
                      cx={p.x}
                      cy={p.y}
                      r="4"
                      fill="white"
                      stroke="#0f00da"
                      strokeWidth="2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.2 + i * 0.05 }}
                    />
                  ))}
                </motion.svg>
              </AnimatePresence>
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
            <motion.div
              key={period + '-donut'}
              className="w-32 h-32 rounded-full relative"
              style={{ background: `conic-gradient(${donutStops})` }}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full flex flex-col items-center justify-center">
                  <p className="text-base font-bold text-[#111111]">{categories[0].pct}%</p>
                  <p className="text-[9px] text-[#9e9e9e] text-center leading-tight">Top Cat.</p>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="space-y-2">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
              >
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-[#555555] flex-1 truncate">{cat.name}</span>
                <span className="text-xs font-semibold text-[#111111]">{cat.pct}%</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Top Products */}
        <div className="col-span-2 bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Top Products by Revenue</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={period + '-products'}
              className="space-y-4"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {topProducts.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: i * 0.06 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[#111111]">{p.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-[#9e9e9e]">{p.orders} orders</span>
                      <span className="text-sm font-semibold text-[#111111]">{formatAmount(p.revenueUsd, currency)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#0f00da] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${p.pct}%` }}
                      transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Win Rate Gauge */}
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-[#111111] mb-4">Bid Win Rate</h2>
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-16 overflow-hidden">
              <motion.div
                key={period + '-gauge'}
                className="w-32 h-32 rounded-full absolute top-0"
                style={{
                  background: `conic-gradient(from 180deg, #0f00da 0deg ${computedWinRate * 1.8}deg, #f0f0f0 ${computedWinRate * 1.8}deg 180deg, transparent 180deg 360deg)`,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
              />
              <div className="absolute inset-0 top-8 flex items-end justify-center">
                <p className="text-2xl font-bold text-[#111111] tabular-nums">{computedWinRate}%</p>
              </div>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {[
              { label: 'Bids Won',  value: String(totalWon),                           color: 'bg-[#0f00da]' },
              { label: 'Bids Lost', value: String(Math.max(0, totalBids - totalWon)),  color: 'bg-[#f0f0f0]' },
              { label: 'Pending',   value: String(totalBids),                          color: 'bg-[#bfc1ff]' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${s.color}`} />
                <span className="text-xs text-[#555555] flex-1">{s.label}</span>
                <span className="text-xs font-semibold text-[#111111] tabular-nums">{s.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
