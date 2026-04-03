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

// ─── Types ────────────────────────────────────────────────────────────────────

interface SummaryCardProps {
  label: string
  value: string
  subtext?: string
  variant?: 'dark-navy' | 'orange' | 'navy'
  icon?: React.ReactNode
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: 'Sep', commission: 1200000, service: 850000,  parts: 120000 },
  { month: 'Oct', commission: 1450000, service: 1050000, parts: 200000 },
  { month: 'Nov', commission: 1350000, service: 950000,  parts: 180000 },
  { month: 'Dec', commission: 1800000, service: 1400000, parts: 280000 },
  { month: 'Jan', commission: 1550000, service: 1250000, parts: 220000 },
  { month: 'Feb', commission: 1950000, service: 1500000, parts: 260000 },
  { month: 'Mar', commission: 900000,  service: 780000,  parts: 130000 },
]

const cityData = [
  { name: 'Lagos',         value: 44, color: '#202c3c', revenue: 8360000  },
  { name: 'Abuja',         value: 27, color: '#F57119', revenue: 5130000  },
  { name: 'Kano',          value: 12, color: '#2e9e95', revenue: 2280000  },
  { name: 'Port Harcourt', value: 10, color: '#4FABF7', revenue: 1900000  },
  { name: 'Ibadan',        value: 7,  color: '#7C3AED', revenue: 1330000  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNairaAxis = (value: number) => {
  if (value >= 1_000_000) return `₦${(value / 1_000_000).toFixed(0)}M`
  if (value >= 1_000)     return `₦${(value / 1_000).toFixed(0)}K`
  return `₦${value}`
}

const formatNairaTooltip = (value: number) =>
  `₦${value.toLocaleString('en-NG')}`

// ─── Summary Card ─────────────────────────────────────────────────────────────

const SummaryCard = ({ label, value, subtext, variant = 'dark-navy', icon }: SummaryCardProps) => {
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

// ─── Custom Pie Label ─────────────────────────────────────────────────────────

// interface PieLabelProps {
//   cx?: number
//   cy?: number
//   midAngle?: number
//   innerRadius?: number
//   outerRadius?: number
//   name?: string
//   percent?: number
// }

// const RADIAN = Math.PI / 180

// const renderCustomLabel = ({ cx = 0, cy = 0, midAngle = 0, outerRadius = 0, name = '', percent = 0 }: PieLabelProps) => {
//   const radius = outerRadius + 32
//   const x = cx + radius * Math.cos(-midAngle * RADIAN)
//   const y = cy + radius * Math.sin(-midAngle * RADIAN)
//   return (
//     <text
//       x={x}
//       y={y}
//       fill="#374151"
//       textAnchor={x > cx ? 'start' : 'end'}
//       dominantBaseline="central"
//       fontSize={12}
//       fontWeight={500}
//     >
//       {`${name} ${(percent * 100).toFixed(0)}%`}
//     </text>
//   )
// }

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
  return (
    <div className="font-sans space-y-6">

      {/* ── Summary Cards ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        <SummaryCard
          label="Total Commission"
          value="₦1.81M"
          subtext="+18% vs last period"
          variant="dark-navy"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
        />
        <SummaryCard
          label="Service Revenue"
          value="₦10.2M"
          variant="orange"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <SummaryCard
          label="Parts Revenue"
          value="₦8.0M"
          variant="navy"
          icon={
            <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className='flex items-start gap-10 justify-between'>

        {/* ── Monthly Revenue Breakdown ── */}
        <div className="bg-white rounded-xl border w-full border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Monthly Revenue Breakdown</h2>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart
              data={monthlyData}
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
              <Bar dataKey="service"    name="Service Revenue" fill="#F57119" radius={[3, 3, 0, 0]} />
              <Bar dataKey="parts"      name="Parts Revenue"   fill="#2e9e95" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Revenue by City ── */}
        <div className="bg-white rounded-xl w-full border border-GREY-100 p-6">
          <h2 className="text-base font-semibold text-NEUTRAL-100 mb-6">Revenue by City</h2>
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
                // label={renderCustomLabel}
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
        </div>

      </div>

    </div>
  )
}

export default Analytics
