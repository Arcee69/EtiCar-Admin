

const Notifications = () => {

  type AlertSeverity = 'warning' | 'info'
  interface Alert {
  id: string
  message: string
  timestamp: string
  severity: AlertSeverity
}

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
    {
      id: '5',
      message: 'Daily report generated: 23 service requests, 12 orders processed',
      timestamp: '2026-03-07 00:00',
      severity: 'info',
    },
  ]

  return (
    <div className="bg-white w-full  p-6">
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
  )
}

export default Notifications