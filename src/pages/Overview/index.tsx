import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  HiOutlineUsers,
  HiOutlineTruck,
  HiOutlineClipboardDocumentList,
  HiOutlineArrowTrendingUp,
  HiOutlineWrenchScrewdriver,
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineWallet,
} from 'react-icons/hi2'

// ─── Types ────────────────────────────────────────────────────────────────────

type StatVariant = 'navy' | 'teal' | 'orange' | 'white'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  variant?: StatVariant
  icon: React.ReactNode
}

type AlertSeverity = 'warning' | 'info'

interface Alert {
  id: string
  message: string
  timestamp: string
  severity: AlertSeverity
}

type ServiceStatus = 'In-Progress' | 'Pending' | 'Completed'

interface ServiceRequest {
  id: string
  driver: string
  service: string
  provider: string
  status: ServiceStatus
  time: string
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const revenueData = [
  { month: 'Sep', commission: 1200000, service: 850000,  parts: 120000 },
  { month: 'Oct', commission: 1450000, service: 1050000, parts: 200000 },
  { month: 'Nov', commission: 1350000, service: 950000,  parts: 180000 },
  { month: 'Dec', commission: 1800000, service: 1400000, parts: 280000 },
  { month: 'Jan', commission: 1550000, service: 1250000, parts: 220000 },
  { month: 'Feb', commission: 1950000, service: 1500000, parts: 260000 },
  { month: 'Mar', commission: 900000,  service: 780000,  parts: 130000 },
]

const recentAlerts: Alert[] = [
  {
    id: '1',
    message: 'Failed payment: ₦15,000 for service request SR002',
    timestamp: '2026-03-07 10:20',
    severity: 'warning',
  },
  {
    id: '2',
    message: 'Service request SR002 pending for over 45 minutes without provider assignment',
    timestamp: '2026-03-07 11:00',
    severity: 'warning',
  },
  {
    id: '3',
    message: 'Provider PH Motors inactive for 14 days',
    timestamp: '2026-03-07 08:00',
    severity: 'warning',
  },
  {
    id: '4',
    message: 'Vendor Delta Auto World pending approval for 5 days',
    timestamp: '2026-03-07 07:00',
    severity: 'info',
  },
  // {
  //   id: '5',
  //   message: 'Daily report generated: 23 service requests, 12 orders processed',
  //   timestamp: '2026-03-07 00:00',
  //   severity: 'info',
  // },
]

const activeServiceRequests: ServiceRequest[] = [
  { id: 'SR001', driver: 'Chukwuemeka Obi',   service: 'Oil Change',   provider: 'AutoFix Lagos',      status: 'In-Progress', time: '2026-03-07 09:30' },
  { id: 'SR002', driver: 'Aisha Mohammed',     service: 'Tyre Change',  provider: 'Unassigned',         status: 'Pending',     time: '2026-03-07 10:15' },
  { id: 'SR003', driver: 'Oluwaseun Adeyemi',  service: 'AC Repair',    provider: 'Ibadan Express Fix', status: 'In-Progress', time: '2026-03-07 08:00' },
  { id: 'SR005', driver: 'Tunde Bakare',       service: 'Engine Check', provider: 'AutoFix Lagos',      status: 'In-Progress', time: '2026-03-07 11:00' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNairaAxis = (value: number) => {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000)     return `₦${(value / 1_000).toFixed(0)}K`
  return `₦${value}`
}

const formatNairaTooltip = (value: number) =>
  `₦${value.toLocaleString('en-NG')}`

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

interface TooltipPayloadItem {
  name: string
  value: number
  color: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}

const CustomBarTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-GREY-100 rounded-lg shadow-lg p-3 text-xs">
      <p className="font-semibold text-NEUTRAL-100 mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: entry.color }} />
          <span className="text-GREY-200">{entry.name}:</span>
          <span className="font-medium text-NEUTRAL-100">{formatNairaTooltip(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ label, value, subtext, variant = 'white', icon }: StatCardProps) => {
  const styles: Record<StatVariant, { card: string; iconBg: string; text: string; sub: string }> = {
    navy:   { card: 'bg-NEUTRAL-300 border-NEUTRAL-200', iconBg: 'bg-white/10', text: 'text-white',       sub: 'text-white/70' },
    teal:   { card: 'bg-TEAL-100 border-TEAL-200',       iconBg: 'bg-white/15', text: 'text-white',       sub: 'text-white/70' },
    orange: { card: 'bg-ORANGE-100 border-ORANGE-200',   iconBg: 'bg-white/20', text: 'text-white',       sub: 'text-white/80' },
    white:  { card: 'bg-white border-GREY-100',          iconBg: 'bg-GREY-300', text: 'text-NEUTRAL-100', sub: 'text-GREY-200'  },
  }
  const s = styles[variant]

  return (
    <div className={`rounded-xl p-5 border ${s.card}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className={`text-sm mb-2 ${s.sub}`}>{label}</p>
          <p className={`text-3xl font-bold ${s.text}`}>{value}</p>
          {subtext && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${s.sub}`}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {subtext}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>
          <span className={s.text}>{icon}</span>
        </div>
      </div>
    </div>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const statusStyles: Record<ServiceStatus, string> = {
  'In-Progress': 'bg-blue-100 text-BLUE-400',
  'Pending':     'bg-orange-100 text-orange-600',
  'Completed':   'bg-green-100 text-green-700',
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Overview = () => {
  return (
    <div className="font-sans space-y-6">

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value="8"
          subtext="+12% this month"
          variant="navy"
          icon={<HiOutlineUsers className="w-5 h-5" />}
        />
        <StatCard
          label="Vehicles"
          value="7"
          subtext="+8% this month"
          variant="teal"
          icon={<HiOutlineTruck className="w-5 h-5" />}
        />
        <StatCard
          label="Active Requests"
          value="4"
          variant="orange"
          icon={<HiOutlineClipboardDocumentList className="w-5 h-5" />}
        />
        <StatCard
          label="Revenue (MTD)"
          value="₦1815K"
          subtext="+15% vs last month"
          variant="white"
          icon={<HiOutlineArrowTrendingUp className="w-5 h-5 text-GREY-200" />}
        />
        <StatCard
          label="Service Providers"
          value="4"
          variant="white"
          icon={<HiOutlineWrenchScrewdriver className="w-5 h-5 text-GREY-200" />}
        />
        <StatCard
          label="Vendors"
          value="4"
          variant="white"
          icon={<HiOutlineShoppingBag className="w-5 h-5 text-GREY-200" />}
        />
        <StatCard
          label="Pending Orders"
          value="2"
          variant="white"
          icon={<HiOutlineShoppingCart className="w-5 h-5 text-GREY-200" />}
        />
        <StatCard
          label="Wallet Volume"
          value="₦3.2M"
          subtext="+22% this month"
          variant="white"
          icon={<HiOutlineWallet className="w-5 h-5 text-GREY-200" />}
        />
      </div>

      <div className='flex flex-col lg:flex-row gap-5'>
        {/* ── Revenue Overview Chart ── */}
        <div className="bg-white w-full rounded-xl border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={revenueData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              barCategoryGap="30%"
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F2F5" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#707D8F', fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatNairaAxis}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#707D8F', fontSize: 11 }}
                width={60}
              />
              <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(240,242,245,0.5)' }} />
              <Bar dataKey="commission" name="Commission"     fill="#202c3c" radius={[3, 3, 0, 0]} />
              <Bar dataKey="service"    name="Service Revenue" fill="#F57119" radius={[3, 3, 0, 0]} />
              <Bar dataKey="parts"      name="Parts Revenue"   fill="#2e9e95" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Recent Alerts ── */}
        <div className="bg-white w-full rounded-xl border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg px-4 py-3 bg-ORANGE-300 border border-orange-100"
              >
                <p className="text-sm text-NEUTRAL-100">{alert.message}</p>
                <p className="text-xs text-GREY-200 mt-1">{alert.timestamp}</p>
              </div>
            ))}
          </div>
        </div>

      </div>


      {/* ── Active Service Requests ── */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-GREY-100">
          <h2 className="text-base font-semibold text-NEUTRAL-100">Active Service Requests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-GREY-500 border-b border-GREY-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">ID</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">Driver</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">Service</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">Provider</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-GREY-200 uppercase tracking-wide">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-GREY-100">
              {activeServiceRequests.map((req) => (
                <tr key={req.id} className="hover:bg-GREY-500 transition-colors">
                  <td className="px-6 py-4 font-medium text-NEUTRAL-100">{req.id}</td>
                  <td className="px-6 py-4 text-NEUTRAL-100">{req.driver}</td>
                  <td className="px-6 py-4 text-NEUTRAL-100">{req.service}</td>
                  <td className="px-6 py-4">
                    {req.provider === 'Unassigned' ? (
                      <span className="text-GREY-200 italic">{req.provider}</span>
                    ) : (
                      <span className="text-NEUTRAL-100">{req.provider}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[req.status]}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-GREY-200">{req.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

export default Overview
