import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useEffect, useState } from 'react'
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
import { dashboardApi } from '../../services/dashboard'
import type { DashboardData } from '../../types/global'
import { useNavigate } from 'react-router-dom'

// ─── Types ────────────────────────────────────────────────────────────────────

type StatVariant = 'navy' | 'teal' | 'orange' | 'white'

interface StatCardProps {
  label: string
  value: string
  subtext?: string
  variant?: StatVariant
  icon: React.ReactNode
}

type ServiceStatus = 'In-Progress' | 'Pending' | 'Accepted' | 'Completed' | 'Cancelled'

interface Alert {
  id: string
  message: string
  timestamp: string
  severity: 'warning' | 'info'
}

interface ServiceRequest {
  id: string
  driver: string
  service: string
  provider: string
  status: ServiceStatus
  time: string
}

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
          <span className="font-medium text-NEUTRAL-100">{`₦${entry.value.toLocaleString('en-NG')}`}</span>
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

const statusStyles: Record<string, string> = {
  'In-Progress': 'bg-blue-100 text-BLUE-400',
  'Pending':     'bg-orange-100 text-orange-600',
  'Accepted':    'bg-blue-100 text-BLUE-400',
  'Completed':   'bg-green-100 text-green-700',
  'Cancelled':   'bg-red-100 text-red-600',
}

// ─── Skeleton Loader Components ───────────────────────────────────────────────

const SkeletonStatCard = () => (
  <div className="flex-1 min-w-50 rounded-xl p-5 border border-GREY-100 bg-NEUTRAL-300/30">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-3">
        <div className="h-3 w-24 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-8 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-3 w-28 bg-NEUTRAL-200/50 rounded animate-pulse" />
      </div>
      <div className="w-10 h-10 rounded-lg bg-NEUTRAL-200/50 animate-pulse shrink-0" />
    </div>
  </div>
)

const SkeletonChart = () => (
  <div className="space-y-4">
    <div className="h-4 w-48 bg-NEUTRAL-200/50 rounded animate-pulse" />
    <div className="h-80 bg-NEUTRAL-200/30 rounded-xl animate-pulse" />
  </div>
)

const SkeletonAlert = () => (
  <div className="rounded-lg px-4 py-3 bg-ORANGE-300/50 border border-orange-100">
    <div className="space-y-2">
      <div className="h-3 w-full bg-NEUTRAL-200/50 rounded animate-pulse" />
      <div className="h-3 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
    </div>
  </div>
)

const SkeletonTableRow = () => (
  <tr className="hover:bg-GREY-500 transition-colors">
    <td className="px-6 py-4"><div className="h-4 w-20 bg-NEUTRAL-200/50 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-4 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-4 w-28 bg-NEUTRAL-200/50 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-4 w-36 bg-NEUTRAL-200/50 rounded animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-6 w-20 bg-NEUTRAL-200/50 rounded-full animate-pulse" /></td>
    <td className="px-6 py-4"><div className="h-4 w-24 bg-NEUTRAL-200/50 rounded animate-pulse" /></td>
  </tr>
)

const SkeletonTable = () => (
  <table className="w-full text-sm">
    <thead>
      <tr className="bg-GREY-500 border-b border-GREY-100">
        <th className="text-left px-6 py-3"><div className="h-3 w-12 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
        <th className="text-left px-6 py-3"><div className="h-3 w-16 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
        <th className="text-left px-6 py-3"><div className="h-3 w-20 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
        <th className="text-left px-6 py-3"><div className="h-3 w-24 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
        <th className="text-left px-6 py-3"><div className="h-3 w-16 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
        <th className="text-left px-6 py-3"><div className="h-3 w-14 bg-NEUTRAL-200/50 rounded animate-pulse" /></th>
      </tr>
    </thead>
    <tbody className="divide-y divide-GREY-100">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonTableRow key={i} />
      ))}
    </tbody>
  </table>
)

// ─── Data Transformation Helpers ────────────────────────────────────────────

const transformStatsForCard = (stats: DashboardData['stats']) => {
  return [
    {
      label: 'Total Users',
      value: stats.total_users.toString(),
      subtext: `${stats.total_users_trend}% ${stats.total_users_trend_direction === 'up' ? 'increase' : 'decrease'} this month`,
      variant: 'navy' as const,
      icon: <HiOutlineUsers className="w-5 h-5" />,
    },
    {
      label: 'Vehicles',
      value: stats.vehicles.toString(),
      subtext: `${stats.vehicles_trend}% ${stats.vehicles_trend_direction === 'up' ? 'increase' : 'decrease'} this month`,
      variant: 'teal' as const,
      icon: <HiOutlineTruck className="w-5 h-5" />,
    },
    {
      label: 'Active Requests',
      value: stats.active_requests.toString(),
      variant: 'orange' as const,
      icon: <HiOutlineClipboardDocumentList className="w-5 h-5" />,
    },
    {
      label: 'Revenue (MTD)',
      value: stats.revenue_mtd_formatted,
      subtext: `${stats.revenue_mtd_trend}% ${stats.revenue_mtd_trend_direction === 'up' ? 'increase' : 'decrease'} vs last month`,
      variant: 'white' as const,
      icon: <HiOutlineArrowTrendingUp className="w-5 h-5 text-GREY-200" />,
    },
    {
      label: 'Service Providers',
      value: stats.service_providers.toString(),
      variant: 'white' as const,
      icon: <HiOutlineWrenchScrewdriver className="w-5 h-5 text-GREY-200" />,
    },
    {
      label: 'Vendors',
      value: stats.vendors.toString(),
      variant: 'white' as const,
      icon: <HiOutlineShoppingBag className="w-5 h-5 text-GREY-200" />,
    },
    {
      label: 'Pending Orders',
      value: stats.pending_orders.toString(),
      variant: 'white' as const,
      icon: <HiOutlineShoppingCart className="w-5 h-5 text-GREY-200" />,
    },
    {
      label: 'Wallet Volume',
      value: stats.wallet_volume_formatted,
      subtext: `₦${stats.wallet_volume.toLocaleString()} total`,
      variant: 'white' as const,
      icon: <HiOutlineWallet className="w-5 h-5 text-GREY-200" />,
    },
  ]
}

const transformRevenueData = (revenueChart: DashboardData['revenue_chart']) => {
  return revenueChart.labels.map((label, index) => ({
    month: label,
    commission: revenueChart.datasets[0]?.data[index] || 0,
    service: revenueChart.datasets[1]?.data[index] || 0,
    parts: revenueChart.datasets[2]?.data[index] || 0,
  }))
}

const transformAlerts = (alerts: DashboardData['alerts']): Alert[] => {
  return alerts.slice(4).map((alert) => ({
    id: alert.id,
    message: alert.message,
    timestamp: alert.created_at_human,
    severity: alert.type as 'warning' | 'info',
  }))
}

const transformActiveRequests = (requests: DashboardData['active_requests']): ServiceRequest[] => {
  return requests.data.slice(0, 5).map((req) => ({
    id: req.id.slice(0, 8), // Shorten ID for display
    driver: req.driver,
    service: req.service,
    provider: req.provider,
    status: req.status_label as ServiceStatus,
    time: req.time_human,
  }))
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<DashboardData | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        const dashboardData = await dashboardApi.getDashboardData()
        setData(dashboardData)
      } catch (err: unknown) {
        console.error('Failed to fetch dashboard data:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const statsCards = data ? transformStatsForCard(data.stats) : []
  const revenueData = data ? transformRevenueData(data.revenue_chart) : []
  const alerts = data ? transformAlerts(data.alerts) : []
  const activeRequests = data ? transformActiveRequests(data.active_requests) : []

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading dashboard</p>
          <p className="text-sm text-GREY-200 mt-2">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans space-y-6">

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(8).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
          : statsCards.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))
        }
      </div>

      <div className='flex flex-col lg:flex-row gap-5'>
        {/* ── Revenue Overview Chart ── */}
        <div className="bg-white w-full rounded-xl border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Revenue Overview</h2>
          {loading ? (
            <SkeletonChart />
          ) : (
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
                  tickFormatter={(value) => {
                    if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`
                    if (value >= 1_000) return `₦${(value / 1_000).toFixed(0)}K`
                    return `₦${value}`
                  }}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#707D8F', fontSize: 11 }}
                  width={60}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(240,242,245,0.5)' }} />
                <Bar dataKey="commission" name="Commission" fill="#1e293b" radius={[3, 3, 0, 0]} />
                <Bar dataKey="service" name="Service Revenue" fill="#f97316" radius={[3, 3, 0, 0]} />
                <Bar dataKey="parts" name="Parts Revenue" fill="#14b8a6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Recent Alerts ── */}
        <div className="bg-white w-full rounded-xl border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-4">Recent Alerts</h2>
          <div className="space-y-3">
            {loading
              ? Array(3).fill(0).map((_, i) => <SkeletonAlert key={i} />)
              : alerts?.length > 0
                ? alerts?.map((alert) => (
                    <div
                      key={alert.id}
                      className={`rounded-lg px-4 py-3 border ${
                        alert.severity === 'warning'
                          ? 'bg-ORANGE-300 border-orange-100'
                          : 'bg-blue-50 border-blue-100'
                      } cursor-pointer`}
                      onClick={() => navigate("/notifications")}
                    >
                      <p className="text-sm text-NEUTRAL-100">{alert.message}</p>
                      <p className="text-xs text-GREY-200 mt-1">{alert.timestamp}</p>
                    </div>
                  ))
                : <p className="text-sm text-GREY-200 text-center py-4">No recent alerts</p>
            }
          </div>
        </div>

      </div>

      {/* ── Active Service Requests ── */}
      <div className="bg-white rounded-xl border border-GREY-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-GREY-100">
          <h2 className="text-base font-semibold text-NEUTRAL-100">Active Service Requests</h2>
        </div>
        {loading ? (
          <div className="overflow-x-auto">
            <SkeletonTable />
          </div>
        ) : (
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
                {activeRequests?.map((req) => {
                  const statusKey = req.status.replace(' ', '_') as keyof typeof statusStyles
                  return (
                    <tr key={req.id} className="hover:bg-GREY-500 transition-colors cursor-pointer" onClick={() => navigate(`/service-requests`)}>
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[statusKey] || 'bg-gray-100 text-gray-700'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-GREY-200">{req.time}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}

export default Dashboard
