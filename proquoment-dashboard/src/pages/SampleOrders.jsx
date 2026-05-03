import { useState, useEffect } from 'react'
import { getSampleOrders } from '../lib/db'

const STATIC_SAMPLE_ORDERS = [
  { id: 'SO-2024-001', product: 'Steel Pipes Grade A', buyer: 'Sunrise Manufacturing', buyerLogo: 'SM', quantity: '5 samples', status: 'Delivered', statusColor: 'bg-[#e1e0ff] text-[#0f00da]', requested: 'Nov 20, 2024', delivered: 'Nov 24, 2024', feedback: 4.5 },
  { id: 'SO-2024-002', product: 'Gate Valves DN50', buyer: 'Gulf Construction Co.', buyerLogo: 'GC', quantity: '2 samples', status: 'In Transit', statusColor: 'bg-[#ffdad6] text-[#ba1a1a]', requested: 'Nov 25, 2024', delivered: 'Expected Dec 1', feedback: null },
  { id: 'SO-2024-003', product: 'Hydraulic Fittings', buyer: 'Al Futtaim Industries', buyerLogo: 'AF', quantity: '10 samples', status: 'Pending', statusColor: 'bg-[#e8e8e8] text-[#9e9e9e]', requested: 'Nov 28, 2024', delivered: '—', feedback: null },
  { id: 'SO-2024-004', product: 'SS Flanges 316L', buyer: 'Emirates Steel', buyerLogo: 'ES', quantity: '3 samples', status: 'Delivered', statusColor: 'bg-[#e1e0ff] text-[#0f00da]', requested: 'Nov 10, 2024', delivered: 'Nov 15, 2024', feedback: 5 },
]

export default function SampleOrders() {
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [activeTab, setActiveTab] = useState('All')
  const [dragOver, setDragOver] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [sampleOrders, setSampleOrders] = useState(STATIC_SAMPLE_ORDERS)

  useEffect(() => {
    getSampleOrders().then(data => { if (data) setSampleOrders(data) })
  }, [])

  const tabs = ['All', 'Pending', 'In Transit', 'Delivered']

  const filtered = sampleOrders.filter(o =>
    activeTab === 'All' || o.status === activeTab
  )

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Sample Orders</h1>
          <p className="text-sm text-[#9e9e9e] mt-0.5">Manage sample requests from buyers</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-[#0f00da] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d2dff] transition-colors">
          <span className="material-symbols-outlined text-[18px]">upload</span>
          Upload Docs
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-5">
        {[
          { label: 'Total Requests', value: '12', icon: 'science' },
          { label: 'Pending', value: '3', icon: 'hourglass_empty' },
          { label: 'In Transit', value: '4', icon: 'local_shipping' },
          { label: 'Delivered', value: '5', icon: 'check_circle' },
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
      <div className="flex gap-1 bg-[#f5f5f5] p-1 rounded-full w-fit mb-5">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${activeTab === tab ? 'bg-white text-[#0f00da] shadow-sm' : 'text-[#9e9e9e] hover:text-[#555555]'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-[#f3f3f3] bg-white">
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Order ID</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Product</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Buyer</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Quantity</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Requested</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Delivered</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Feedback</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-[#9e9e9e]">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(order => (
              <tr key={order.id} className="border-t border-[#f3f3f3] hover:bg-white">
                <td className="px-5 py-4 text-sm font-medium text-[#0f00da]">{order.id}</td>
                <td className="px-5 py-4 text-sm text-[#111111]">{order.product}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#e1e0ff] text-[#0f00da] text-xs font-bold flex items-center justify-center">{order.buyerLogo}</div>
                    <span className="text-sm text-[#555555]">{order.buyer}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-[#555555]">{order.quantity}</td>
                <td className="px-5 py-4 text-sm text-[#9e9e9e]">{order.requested}</td>
                <td className="px-5 py-4 text-sm text-[#9e9e9e]">{order.delivered}</td>
                <td className="px-5 py-4">
                  {order.feedback ? (
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-yellow-400 icon-fill">star</span>
                      <span className="text-sm font-medium text-[#111111]">{order.feedback}</span>
                    </div>
                  ) : <span className="text-xs text-[#9e9e9e]">—</span>}
                </td>
                <td className="px-5 py-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${order.statusColor}`}>{order.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#ebebeb]">
              <h2 className="text-lg font-semibold text-[#111111]">Upload Documents</h2>
              <button onClick={() => setShowUploadModal(false)} className="w-8 h-8 rounded-full hover:bg-[#f5f5f5] flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-[#9e9e9e]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-[#555555] block mb-1.5">Related Order</label>
                <select className="w-full border border-[#ebebeb] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0f00da] bg-white">
                  {sampleOrders.map(o => <option key={o.id}>{o.id} — {o.product}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-[#555555] block mb-1.5">Document Type</label>
                <select className="w-full border border-[#ebebeb] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0f00da] bg-white">
                  <option>Certificate of Conformance</option>
                  <option>Test Report</option>
                  <option>Material Data Sheet</option>
                  <option>Shipping Documents</option>
                  <option>Other</option>
                </select>
              </div>
              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => {
                  e.preventDefault()
                  setDragOver(false)
                  const files = Array.from(e.dataTransfer.files)
                  setUploadedFiles(prev => [...prev, ...files.map(f => f.name)])
                }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${dragOver ? 'border-[#0f00da] bg-[#e1e0ff]' : 'border-[#c6c4da] hover:border-[#0f00da]'}`}
              >
                <span className="material-symbols-outlined text-[40px] text-[#9e9e9e] mb-2">cloud_upload</span>
                <p className="text-sm text-[#555555] font-medium">Drag & drop files here</p>
                <p className="text-xs text-[#9e9e9e] mt-1">or click to browse</p>
                <p className="text-xs text-[#9e9e9e] mt-1">PDF, PNG, JPG up to 10MB</p>
                <input type="file" multiple className="hidden" onChange={e => setUploadedFiles(prev => [...prev, ...Array.from(e.target.files).map(f => f.name)])} />
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 bg-[#f7f7f7] rounded-lg px-3 py-2">
                      <span className="material-symbols-outlined text-[18px] text-[#0f00da]">description</span>
                      <span className="text-sm text-[#555555] flex-1 truncate">{f}</span>
                      <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))}>
                        <span className="material-symbols-outlined text-[16px] text-[#9e9e9e]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setShowUploadModal(false)} className="flex-1 border border-[#ebebeb] text-[#555555] py-2.5 rounded-full text-sm font-medium hover:bg-[#f5f5f5]">Cancel</button>
                <button onClick={() => setShowUploadModal(false)} className="flex-1 bg-[#0f00da] text-white py-2.5 rounded-full text-sm font-medium hover:bg-[#2d2dff]">Upload</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
