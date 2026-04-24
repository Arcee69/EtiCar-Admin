interface SummaryCardProps {
  label: string
  value: string | number
  dark?: boolean
  icon?: React.ReactNode
}

export const SummaryCard = ({ label, value, dark, icon }: SummaryCardProps) => (
  <div
    className={`flex-1 min-w-45 rounded-xl p-5 flex items-center justify-between gap-4 border ${
      dark
        ? 'bg-NEUTRAL-300 border-NEUTRAL-200 text-white'
        : 'bg-white border-GREY-100 text-NEUTRAL-100'
    }`}
  >
    <div>
      <p className={`text-sm mb-1 ${dark ? 'text-white/70' : 'text-GREY-200'}`}>{label}</p>
      <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-NEUTRAL-100'}`}>{value}</p>
    </div>
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
        dark ? 'bg-white/10' : 'bg-GREY-300'
      }`}
    >
      {icon ?? null}
    </div>
  </div>
)