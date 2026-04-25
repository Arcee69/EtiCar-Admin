import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { useEffect, useState, useCallback } from 'react'
import { analyticsApi } from '../../services/analytics'
import type { AnalyticsData } from '../../types/global'

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string
  value: string
  subtext?: string
  variant?: 'dark-navy' | 'orange' | 'navy'
  icon?: React.ReactNode
  isLoading?: boolean
}

// ─── Skeleton Loader Components ───────────────────────────────────────────────

const SkeletonCard = () => (
  <div className="flex-1 min-w-50 rounded-xl p-5 border border-GREY-100 bg-NEUTRAL-300/30">
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1 space-y-3">
        <div className="h-3 w-20 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-8 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-3 w-24 bg-NEUTRAL-200/50 rounded animate-pulse" />
      </div>
      <div className="w-10 h-10 rounded-lg bg-NEUTRAL-200/50 animate-pulse shrink-0" />
    </div>
  </div>
)

const SkeletonBarChart = () => (
  <div className="space-y-4">
    <div className="h-4 w-48 bg-NEUTRAL-200/50 rounded animate-pulse" />
    <div className="h-80 bg-NEUTRAL-200/30 rounded-xl animate-pulse" />
  </div>
)

const SkeletonPieChart = () => (
  <div className="space-y-4">
    <div className="h-4 w-36 bg-NEUTRAL-200/50 rounded animate-pulse" />
    <div className="h-80 bg-NEUTRAL-200/30 rounded-xl animate-pulse" />
  </div>
)

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNairaAxis = (value: number) => {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000)     return `₦${(value / 1_000).toFixed(0)}K`
  return `₦${value}`
}

const formatNairaTooltip = (value: number) =>
  `₦${value.toLocaleString('en-NG')}`

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, subtext, variant = 'dark-navy', icon, isLoading }: SummaryCardProps) => {
  if (isLoading) {
    return <SkeletonCard />
  }

  const bgMap = {
    'dark-navy': 'bg-NEUTRAL-300 border-NEUTRAL-200',
    'orange':    'bg-ORANGE-100 border-ORANGE-200',
    'navy':      'bg-NAVY-100 border-NAVY-200',
  }
  const iconBgMap = {
    'dark-navy': 'bg-white/10',
    'orange':    'bg-white/20',
    'navy':      'bg-white/10',
  }

  return (
    <div className={`flex-1 min-w-50 rounded-xl p-5 border text-white ${bgMap[variant]}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-sm text-white/70 mb-2">{label}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtext && (
            <p className="text-xs text-white/60 mt-2 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              {subtext}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${iconBgMap[variant]}`}>
          {icon}
        </div>
      </div>
    </div>
  )
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
          <span className="font-medium text-NEUTRAL-100">{formatNairaTooltip(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Custom Pie Tooltip ───────────────────────────────────────────────────────

interface PieTooltipPayload {
  name: string
  value: number
  payload: { name: string; value: number; color: string; revenue: number }
}

interface CustomPieTooltipProps {
  active?: boolean
  payload?: PieTooltipPayload[]
}

const CustomPieTooltip = ({ active, payload }: CustomPieTooltipProps) => {
  if (!active || !payload?.length) return null
  const entry = payload[0]
  return (
    <div className="bg-white border border-GREY-100 rounded-lg shadow-lg p-3 text-xs min-w-35">
      <div className="flex items-center gap-2 mb-2">
        <span
          className="w-2.5 h-2.5 rounded-sm inline-block shrink-0"
          style={{ background: entry.payload.color }}
        />
        <span className="font-semibold text-NEUTRAL-100">{entry.name}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-GREY-200">Share:</span>
        <span className="font-medium text-NEUTRAL-100">{entry.value}%</span>
      </div>
      <div className="flex justify-between gap-4 mt-1">
        <span className="text-GREY-200">Revenue:</span>
        <span className="font-medium text-NEUTRAL-100">{formatNairaTooltip(entry.payload.revenue)}</span>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [period, setPeriod] = useState('last_12_months')

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await analyticsApi.getAnalytics({ period })
      setAnalyticsData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
      setAnalyticsData(null)
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Transform API monthly breakdown data to chart format
  const transformedMonthlyData = analyticsData?.monthly_breakdown?.labels?.map((label, index) => {
    const monthData: any = { month: label }
    analyticsData.monthly_breakdown.datasets.forEach((dataset) => {
      monthData[dataset.label.toLowerCase().replace(' ', '_')] = dataset.data[index]
    })
    return monthData
  }) || []

  const cityData = analyticsData?.revenue_by_city?.labels?.map((label, index) => ({
    name: label,
    value: analyticsData.revenue_by_city.data[index],
    color: analyticsData.revenue_by_city.colors[index] || '#202c3c',
    revenue: analyticsData.revenue_by_city.data[index],
  })) || []

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-ORANGE-100 text-white rounded-lg hover:bg-ORANGE-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans space-y-6">

      <div className='flex justify-end'>
        <select
          className="px-3 py-2 border border-GREY-100 rounded-lg text-sm bg-white text-NEUTRAL-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
        >
          <option value="last_30_days">Last 30 Days</option>
          <option value="last_90_days">Last 90 Days</option>
          <option value="this_year">This Year</option>
          <option value="last_12_months">Last 12 Months</option>
        </select>
      </div>

      {/* ── Summary Cards ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SummaryCard
          label="Total Commission"
          value={analyticsData?.summary?.commission?.formatted || '₦0.00'}
          subtext={analyticsData?.summary?.commission?.trend_percent ? `${analyticsData.summary.commission.trend_percent}% vs last period` : undefined}
          variant="dark-navy"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          isLoading={loading}
        />
        <SummaryCard
          label="Service Revenue"
          value={analyticsData?.summary?.service_revenue?.formatted || '₦0.00'}
          subtext={analyticsData?.summary?.service_revenue?.trend_percent ? `${analyticsData.summary.service_revenue.trend_percent}% vs last period` : undefined}
          variant="orange"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isLoading={loading}
        />
        <SummaryCard
          label="Parts Revenue"
          value={analyticsData?.summary?.parts_revenue?.formatted || '₦0.00'}
          subtext={analyticsData?.summary?.parts_revenue?.trend_percent ? `${analyticsData.summary.parts_revenue.trend_percent}% vs last period` : undefined}
          variant="navy"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          isLoading={loading}
        />
      </div>

      <div className='flex items-start gap-10 justify-between'>

        {/* ── Monthly Revenue Breakdown ── */}
        <div className="bg-white rounded-xl border w-full border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Monthly Revenue Breakdown</h2>
          {loading ? (
            <SkeletonBarChart />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart
                data={transformedMonthlyData}
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
                <Bar dataKey="commission" name="Commission" fill="#202c3c" radius={[3, 3, 0, 0]} />
                <Bar dataKey="service_revenue" name="Service Revenue" fill="#F57119" radius={[3, 3, 0, 0]} />
                <Bar dataKey="parts_revenue" name="Parts Revenue" fill="#2e9e95" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Revenue by City ── */}
        <div className="bg-white rounded-xl w-full border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Revenue by City</h2>
          {loading ? (
            <SkeletonPieChart />
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart margin={{ top: -20, right: 80, bottom: 20, left: 80 }}>
                <Tooltip content={<CustomPieTooltip />} />
                <Pie
                  data={cityData}
                  cx="50%"
                  cy="48%"
                  outerRadius={110}
                  dataKey="value"
                  labelLine={false}
                >
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend
                  iconType="square"
                  iconSize={12}
                  formatter={(value) => (
                    <span style={{ color: '#374151', fontSize: 13 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

      </div>

      {/* ── Top Products & Services ── */}
      <div className='flex items-start gap-10 justify-between'>
        {/* Top Products */}
        <div className="bg-white rounded-xl border w-full border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-4">Top Products</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-GREY-500/10 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
                    <div className="h-3 w-24 bg-NEUTRAL-200/30 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-NEUTRAL-200/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData?.top_products?.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-GREY-500/10 rounded-lg hover:bg-GREY-500/20 transition-colors">
                  <div>
                    <p className="font-medium text-NEUTRAL-100">{product.name}</p>
                    <p className="text-sm text-GREY-200">SKU: {product.sku} • Qty: {product.quantity_sold}</p>
                  </div>
                  <p className="font-semibold text-NEUTRAL-100">{product.revenue_formatted}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-xl border w-full border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-4">Top Services</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-GREY-500/10 rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 w-28 bg-NEUTRAL-200/50 rounded animate-pulse" />
                    <div className="h-3 w-20 bg-NEUTRAL-200/30 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-NEUTRAL-200/50 rounded animate-pulse" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {analyticsData?.top_services?.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-GREY-500/10 rounded-lg hover:bg-GREY-500/20 transition-colors">
                  <div>
                    <p className="font-medium text-NEUTRAL-100">{service.name}</p>
                    <p className="text-sm text-GREY-200">{service.completed_count} completed</p>
                  </div>
                  <p className="font-semibold text-NEUTRAL-100">{service.revenue_formatted}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default Analytics
