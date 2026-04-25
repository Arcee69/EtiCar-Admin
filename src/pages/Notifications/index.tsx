
import { HiOutlineBell, HiOutlineEnvelope, HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useEffect, useState, type ReactNode } from "react";
import { notificationApi } from "../../services/notification";
import type { NotificationData, NotificationStats } from "../../types/global";
import Pagination from "../../components/Pagination";

const Notifications = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch notification stats once on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const statsData = await notificationApi.getNotificationStats();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch notification stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Fetch notifications list when page or itemsPerPage changes
  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await notificationApi.getNotifications({
          page: currentPage,
          per_page: itemsPerPage,
        });
        setNotifications(response.data);
        setTotalItems(response.total);
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [currentPage, itemsPerPage]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      setStats((prev) => (prev ? { ...prev, unread: prev.unread - 1 } : null));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setStats((prev) => (prev ? { ...prev, unread: 0 } : null));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  type DisplayNotification = {
    id: string
    message: string
    timestamp: string
    is_read: boolean
    severity: 'medium' | 'high' | 'low'
  }

  // Transform notification data for display
  const displayNotifications: DisplayNotification[] = notifications.map((notification) => ({
    id: notification.id,
    message: notification.title ? `${notification.title}: ${notification.message}` : notification.message,
    timestamp: notification.created_at_human,
    is_read: notification.is_read,
    severity: notification.severity === 'high' ? 'high' : notification.severity === 'low' ? 'low' : 'medium',
  }))

  // ─── Skeleton Loader ────────────────────────────────────────────────────────────

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

  const SkeletonNotificationItem = () => (
    <div className="rounded-lg px-4 py-3 bg-ORANGE-300/50 border border-orange-100">
      <div className="space-y-2">
        <div className="h-3 w-full bg-NEUTRAL-200/50 rounded animate-pulse" />
        <div className="h-3 w-32 bg-NEUTRAL-200/50 rounded animate-pulse" />
      </div>
    </div>
  )

  // ─── Stat Card ────────────────────────────────────────────────────────────────

  type StatVariant = 'navy' | 'teal' | 'orange' | 'white'

  interface StatCardProps {
    label: string
    value: string
    variant?: StatVariant
    icon: ReactNode
  }

  const StatCard = ({ label, value, variant = 'white', icon }: StatCardProps) => {
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
          </div>
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.iconBg}`}>
            <span className={s.text}>{icon}</span>
          </div>
        </div>
      </div>
    )
  }

  // ─── Notification Stats Cards ─────────────────────────────────────────────────

  const notificationCards = stats
    ? [
        {
          label: 'Total Notifications',
          value: stats.total.toString(),
          variant: 'navy' as const,
          icon: <HiOutlineBell className="w-5 h-5" />,
        },
        {
          label: 'Unread',
          value: stats.unread.toString(),
          variant: 'orange' as const,
          icon: <HiOutlineEnvelope className="w-5 h-5" />,
        },
        {
          label: 'High Priority',
          value: stats.high_priority.toString(),
          variant: 'white' as const,
          icon: <HiOutlineExclamationTriangle className="w-5 h-5 text-GREY-200" />,
        },
      ]
    : []

  return (
    <div className="font-sans space-y-6">
      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading
          ? Array(3).fill(0).map((_, i) => <SkeletonStatCard key={i} />)
          : notificationCards.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))
        }
      </div>

      {/* ── Recent Alerts ── */}
      <div className="bg-white w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-NEUTRAL-100">Recent Alerts</h2>
          {stats && stats.unread > 0 && (
            <button
              type="button"
              onClick={handleMarkAllAsRead}
              className="text-sm text-BLUE-400 hover:text-BLUE-500 font-medium"
            >
              Mark all as read
            </button>
          )}
        </div>
        <div className="space-y-3">
          {loading
            ? Array(5).fill(0).map((_, i) => <SkeletonNotificationItem key={i} />)
            : displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-lg px-4 py-3 border transition-all cursor-pointer ${
                    notification.is_read
                      ? 'bg-GREY-50 border-GREY-100'
                      : 'bg-ORANGE-300 border-orange-100 group hover:bg-ORANGE-200'
                  }`}
                  onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className={`text-sm ${notification.is_read ? 'text-GREY-200' : 'text-NEUTRAL-100 group-hover:text-white'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-GREY-200 group-hover:text-white mt-1">{notification.timestamp}</p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-ORANGE-200 mt-2 shrink-0" />
                    )}
                  </div>
                </div>
              ))
          }
        </div>
      </div>

      {/* ── Pagination ── */}
      {!loading && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  )
}

export default Notifications