import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getBulkOrders } from '../lib/db'

const STATIC_BULK_ORDERS = [
  {
    id: 'BO-2024-001',
    product: 'Steel Pipes Grade A — 500 units',
    buyer: 'Sunrise Manufacturing LLC',
    buyerLogo: 'SM',
    orderValue: '$15,500',
    status: 'In Production',
    statusColor: 'bg-[#e1e0ff] text-[#0f00da]',
    placed: 'Nov 20, 2024',
    delivery: 'Dec 10, 2024',
    progress: 65,
    milestones: [
      { label: 'Order Confirmed', done: true },
      { label: 'Production Started', done: true },
      { label: 'Quality Inspection', done: false },
      { label: 'Shipped', done: false },
      { label: 'Delivered', done: false },
    ]
  },
  {
    id: 'BO-2024-002',
    product: 'Gate Valves DN80 — 150 units',
    buyer: 'ADNOC Distribution',
    buyerLogo: 'AD',
    orderValue: '$22,000',
    status: 'Delivered',
    statusColor: 'bg-[#e1e0ff] text-[#0f00da]',
    placed: 'Oct 15, 2024',
    delivery: 'Nov 10, 2024',
    progress: 100,
    milestones: [
      { label: 'Order Confirmed', done: true },
      { label: 'Production Started', done: true },
      { label: 'Quality Inspection', done: true },
      { label: 'Shipped', done: true },
      { label: 'Delivered', done: true },
    ]
  },
  {
    id: 'BO-2024-003',
    product: 'Hydraulic Fittings — 1,000 units',
    buyer: 'Al Futtaim Industries',
    buyerLogo: 'AF',
    orderValue: '$7,200',
    status: 'Pending Confirmation',
    statusColor: 'bg-[#e8e8e8] text-[#9e9e9e]',
    placed: 'Nov 28, 2024',
    delivery: 'Jan 5, 2025',
    progress: 10,
    milestones: [
      { label: 'Order Confirmed', done: false },
      { label: 'Production Started', done: false },
      { label: 'Quality Inspection', done: false },
      { label: 'Shipped', done: false },
      { label: 'Delivered', done: false },
    ]
  },
]

export default function BulkOrders() {
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [activeTab, setActiveTab] = useState('All')
  const [bulkOrders, setBulkOrders] = useState(STATIC_BULK_ORDERS)
  const navigate = useNavigate()

  useEffect(() => {
    getBulkOrders().then(data => { if (data) setBulkOrders(data) })
  }, [])

  const tabs = ['All', 'Pending Confirmation', 'In Production', 'Shipped', 'Delivered']
  const filtered = bulkOrders.filter(o => activeTab === 'All' || o.status === activeTab)

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Bulk Orders</h1>
          <p className="text-sm text-[#9e9e9e] mt-0.5">Track and manage your bulk production orders</p>
        </div>
        <button onClick={() => navigate('/matched-rfqs')} className="flex items-center gap-2 bg-[#0f00da] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d2dff] transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          View RFQs
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total Orders', value: '8', icon: 'local_shipping' },
          { label: 'Active', value: '3', icon: 'autorenew' },
          { label: 'Delivered', value: '4', icon: 'check_circle' },
          { label: 'Total Value', value: '$89K', icon: 'payments' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-[#ebebeb] rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-[18px] text-[#0f00da]">{s.icon}</span>
              <span className="text-xs text-[#9e9e9e]">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#111111]">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-full w-fit mb-5 overflow-x-auto no-scrollbar">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-white text-[#0f00da] shadow-sm' : 'text-[#9e9e9e] hover:text-[#555555]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.map(order => (
          <div key={order.id} className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden hover:border-[#c6c4da] transition-colors">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#e1e0ff] text-[#0f00da] text-sm font-bold flex items-center justify-center flex-shrink-0">{order.buyerLogo}</div>
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{order.product}</p>
                    <p className="text-xs text-[#9e9e9e] mt-0.5">{order.buyer} · {order.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order.statusColor}`}>{order.status}</span>
                  <span className="text-sm font-bold text-[#111111]">{order.orderValue}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#9e9e9e]">Order Progress</span>
                  <span className="text-xs font-semibold text-[#0f00da]">{order.progress}%</span>
                </div>
                <div className="h-2 bg-[#f5f5f5] rounded-full overflow-hidden">
                  <div className="h-full bg-[#0f00da] rounded-full transition-all" style={{ width: `${order.progress}%` }}></div>
                </div>
              </div>

              {/* Milestones */}
              <div className="flex items-center justify-between mb-4">
                {order.milestones.map((m, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${m.done ? 'bg-[#0f00da]' : 'bg-[#f5f5f5]'}`}>
                      {m.done ? <span className="material-symbols-outlined text-[12px] text-white">check</span> : <div className="w-2 h-2 rounded-full bg-[#c6c4da]"></div>}
                    </div>
                    {i < order.milestones.length - 1 && (
                      <div className="hidden"></div>
                    )}
                    <span className="text-[10px] text-[#9e9e9e] text-center leading-tight max-w-[60px]">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-4 text-xs text-[#9e9e9e]">
                  <span>Placed: {order.placed}</span>
                  <span>Expected: {order.delivery}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => navigate('/messages')} className="border border-[#ebebeb] text-[#555555] px-3 py-1.5 rounded-full text-xs font-medium hover:border-[#0f00da] hover:text-[#0f00da]">Message</button>
                  <button onClick={() => setSelectedOrder(order === selectedOrder ? null : order)} className="bg-[#0f00da] text-white px-3 py-1.5 rounded-full text-xs font-medium hover:bg-[#2d2dff]">View Details</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Side Panel */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50" onClick={() => setSelectedOrder(null)}>
          <div className="w-[380px] h-full bg-white overflow-y-auto shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#111111]">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px] text-[#9e9e9e]">close</span>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-[#9e9e9e] mb-1">Order ID</p>
                  <p className="text-sm font-semibold text-[#0f00da]">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs text-[#9e9e9e] mb-1">Product</p>
                  <p className="text-sm text-[#111111]">{selectedOrder.product}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-[#9e9e9e] mb-1">Buyer</p>
                    <p className="text-sm text-[#111111]">{selectedOrder.buyer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9e9e9e] mb-1">Order Value</p>
                    <p className="text-sm font-bold text-[#111111]">{selectedOrder.orderValue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9e9e9e] mb-1">Placed</p>
                    <p className="text-sm text-[#111111]">{selectedOrder.placed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#9e9e9e] mb-1">Expected Delivery</p>
                    <p className="text-sm text-[#111111]">{selectedOrder.delivery}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#9e9e9e] mb-2">Milestone Tracking</p>
                  <div className="space-y-3">
                    {selectedOrder.milestones.map((m, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${m.done ? 'bg-[#0f00da]' : 'bg-[#f5f5f5]'}`}>
                          {m.done ? <span className="material-symbols-outlined text-[14px] text-white">check</span> : <div className="w-2 h-2 rounded-full bg-[#c6c4da]"></div>}
                        </div>
                        <span className={`text-sm ${m.done ? 'text-[#111111] font-medium' : 'text-[#9e9e9e]'}`}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <button onClick={() => navigate('/messages')} className="flex-1 border border-[#0f00da] text-[#0f00da] py-2.5 rounded-full text-sm font-medium hover:bg-[#e1e0ff]">Message Buyer</button>
                  <button className="flex-1 bg-[#0f00da] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#2d2dff]">Update Status</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
