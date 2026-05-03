import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

export default function CompanyProfile() {
  const { user } = useAuth()
  const { settings, updateSettings } = useSettings()

  const [editing, setEditing] = useState(false)

  const stored = settings.companyProfile
  const defaultCompanyName = stored.companyName || user?.company || 'Your Company'

  const [form, setForm] = useState({
    companyName: stored.companyName || user?.company || '',
    founded: stored.founded || '2015',
    employees: stored.employees || '50–200',
    website: stored.website || '',
    email: stored.email || user?.email || '',
    phone: stored.phone || user?.phone || '',
    address: stored.address || '',
    description: stored.description || 'Leading supplier in our industry. We serve major buyers with top-quality products and competitive pricing.',
    categories: stored.categories?.length ? stored.categories : ['Industrial Metals', 'Valves & Fittings', 'Hydraulics'],
    certifications: stored.certifications?.length ? stored.certifications : ['ISO 9001:2015', 'ISO 14001'],
    countries: stored.countries?.length ? stored.countries : ['UAE', 'Saudi Arabia', 'Kuwait'],
  })

  const [newCert, setNewCert] = useState('')
  const [showCertInput, setShowCertInput] = useState(false)

  const getInitial = () => (form.companyName || defaultCompanyName)[0]?.toUpperCase() || 'C'

  const completionFields = [
    form.companyName, form.founded, form.employees, form.website,
    form.email, form.phone, form.address, form.description,
    form.categories.length > 0, form.certifications.length > 0, form.countries.length > 0,
  ]
  const completionPct = Math.round((completionFields.filter(Boolean).length / completionFields.length) * 100)

  const handleSave = () => {
    updateSettings('companyProfile', form)
    setEditing(false)
  }

  const handleCancel = () => {
    setForm({
      companyName: stored.companyName || user?.company || '',
      founded: stored.founded || '2015',
      employees: stored.employees || '50–200',
      website: stored.website || '',
      email: stored.email || user?.email || '',
      phone: stored.phone || user?.phone || '',
      address: stored.address || '',
      description: stored.description || 'Leading supplier in our industry. We serve major buyers with top-quality products and competitive pricing.',
      categories: stored.categories?.length ? stored.categories : ['Industrial Metals', 'Valves & Fittings', 'Hydraulics'],
      certifications: stored.certifications?.length ? stored.certifications : ['ISO 9001:2015', 'ISO 14001'],
      countries: stored.countries?.length ? stored.countries : ['UAE', 'Saudi Arabia', 'Kuwait'],
    })
    setEditing(false)
  }

  const addCert = () => {
    if (newCert.trim()) {
      setForm(f => ({ ...f, certifications: [...f.certifications, newCert.trim()] }))
      setNewCert('')
      setShowCertInput(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
        <div>
          <h1 className="text-xl font-semibold text-[#111111]">Company Profile</h1>
          <p className="text-sm text-[#9e9e9e] mt-0.5">Manage your company information visible to buyers</p>
        </div>
        {editing ? (
          <div className="flex gap-2">
            <button onClick={handleCancel} className="border border-[#ebebeb] text-[#555555] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-[#0f00da] text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#2d2dff] transition-colors">
              <span className="material-symbols-outlined text-[18px]">save</span>
              Save Changes
            </button>
          </div>
        ) : (
          <button onClick={() => setEditing(true)} className="flex items-center gap-2 border border-[#ebebeb] text-[#555555] px-4 py-2.5 rounded-full text-sm font-medium hover:bg-[#f5f5f5] transition-colors">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Completion */}
      <div className="bg-[#e1e0ff] border border-[#bfc1ff] rounded-2xl p-4 flex items-center gap-4 mb-5">
        <div className="w-10 h-10 bg-[#0f00da] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[20px] text-white">business</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm font-semibold text-[#0f00da]">Profile Completion — {completionPct}%</p>
            {completionPct < 100 && <span className="text-xs text-[#555555]">Add missing details to reach 100%</span>}
            {completionPct === 100 && <span className="text-xs text-[#0f00da] font-medium">✓ Complete</span>}
          </div>
          <div className="h-2 bg-[#bfc1ff] rounded-full overflow-hidden">
            <div className="h-full bg-[#0f00da] rounded-full transition-all duration-500" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {/* Company Banner + Logo */}
      <div className="bg-white border border-[#ebebeb] rounded-2xl overflow-hidden mb-4">
        <div className="h-24 bg-gradient-to-r from-[#0f00da] to-[#2d2dff] relative">
          {editing && (
            <button className="absolute top-3 right-3 bg-white/20 text-white text-xs px-3 py-1.5 rounded-full hover:bg-white/30 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">camera_alt</span>
              Change Cover
            </button>
          )}
        </div>
        <div className="px-5 pb-5">
          <div className="flex items-end gap-4 -mt-8 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-white border-4 border-white shadow-md flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#0f00da]">{getInitial()}</span>
            </div>
            <div className="pb-2">
              {editing ? (
                <input
                  value={form.companyName}
                  onChange={e => setForm(f => ({ ...f, companyName: e.target.value }))}
                  className="text-lg font-semibold text-[#111111] border-b border-[#0f00da] outline-none bg-transparent w-64"
                  placeholder="Company name"
                />
              ) : (
                <h2 className="text-lg font-semibold text-[#111111]">{form.companyName || defaultCompanyName}</h2>
              )}
              <p className="text-sm text-[#9e9e9e]">Verified {user?.type || 'Supplier'} · {form.address || 'Location not set'}</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-[#9e9e9e] uppercase tracking-wide block mb-2">About</label>
            {editing ? (
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                className="w-full border border-[#ebebeb] rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#0f00da] resize-none transition-colors"
                placeholder="Describe your company..."
              />
            ) : (
              <p className="text-sm text-[#555555]">{form.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-[#111111] mb-4">Company Details</h3>
          <div className="space-y-3">
            {[
              { label: 'Founded', key: 'founded', icon: 'calendar_today' },
              { label: 'Employees', key: 'employees', icon: 'group' },
              { label: 'Website', key: 'website', icon: 'language' },
              { label: 'Email', key: 'email', icon: 'email' },
              { label: 'Phone', key: 'phone', icon: 'phone' },
              { label: 'Address', key: 'address', icon: 'location_on' },
            ].map(field => (
              <div key={field.key} className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[16px] text-[#9e9e9e] flex-shrink-0">{field.icon}</span>
                <div className="flex-1">
                  <p className="text-[10px] text-[#9e9e9e] uppercase tracking-wide">{field.label}</p>
                  {editing ? (
                    <input
                      value={form[field.key]}
                      onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="text-sm text-[#111111] border-b border-[#ebebeb] outline-none w-full focus:border-[#0f00da] transition-colors bg-transparent"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  ) : (
                    <p className="text-sm text-[#111111]">{form[field.key] || <span className="text-[#9e9e9e]">—</span>}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {/* Categories */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#111111] mb-3">Product Categories</h3>
            <div className="flex flex-wrap gap-2">
              {form.categories.map(cat => (
                <div key={cat} className="flex items-center gap-1 bg-[#e1e0ff] text-[#0f00da] text-xs px-2.5 py-1 rounded-full font-medium">
                  {cat}
                  {editing && (
                    <button onClick={() => setForm(f => ({ ...f, categories: f.categories.filter(c => c !== cat) }))} className="ml-0.5 hover:text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[12px]">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#111111] mb-3">Certifications</h3>
            <div className="space-y-2">
              {form.certifications.map(cert => (
                <div key={cert} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-[#0f00da] icon-fill">verified</span>
                  <span className="text-sm text-[#555555] flex-1">{cert}</span>
                  {editing && (
                    <button onClick={() => setForm(f => ({ ...f, certifications: f.certifications.filter(c => c !== cert) }))} className="text-[#9e9e9e] hover:text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
              ))}
              {editing && !showCertInput && (
                <button onClick={() => setShowCertInput(true)} className="flex items-center gap-1 text-xs text-[#0f00da] hover:underline mt-1">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Certification
                </button>
              )}
              {editing && showCertInput && (
                <div className="flex gap-2 mt-2">
                  <input
                    value={newCert}
                    onChange={e => setNewCert(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addCert()}
                    placeholder="e.g. API 6A"
                    className="flex-1 border border-[#ebebeb] rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-[#0f00da]"
                    autoFocus
                  />
                  <button onClick={addCert} className="bg-[#0f00da] text-white px-3 py-1.5 rounded-lg text-xs font-medium">Add</button>
                  <button onClick={() => setShowCertInput(false)} className="text-[#9e9e9e] text-xs">Cancel</button>
                </div>
              )}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-white border border-[#ebebeb] rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-[#111111] mb-3">Countries Served</h3>
            <div className="flex flex-wrap gap-2">
              {form.countries.map(c => (
                <div key={c} className="flex items-center gap-1 bg-[#f5f5f5] text-[#555555] text-xs px-2.5 py-1 rounded-full">
                  {c}
                  {editing && (
                    <button onClick={() => setForm(f => ({ ...f, countries: f.countries.filter(x => x !== c) }))} className="ml-0.5 hover:text-[#ba1a1a]">
                      <span className="material-symbols-outlined text-[11px]">close</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
