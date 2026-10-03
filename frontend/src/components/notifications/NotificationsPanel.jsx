import { useState } from "react";
import {
  Bell,
  CheckCheck,
  Search,
  Trash2,
  Inbox,
} from "lucide-react";
import NotificationItem from "./NotificationItem";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

export default function NotificationsPanel() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearNotifications,
  } = useApp();
  const { user, role, t } = useAuth();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  const categories = [
    { id: "all", label: t?.catAll || "All", count: (notifications || []).length },
    { id: "unread", label: t?.catUnread || "Unread", count: unreadCount },
    {
      id: "medicine",
      label: t?.catMedicine || "Medicines",
      count: (notifications || []).filter((n) => n.category === "medicine" || n.type === "medicine").length,
    },
    {
      id: "appointment",
      label: t?.catAppointment || "Appointments",
      count: (notifications || []).filter((n) => n.category === "appointment" || n.type === "appointment").length,
    },
    {
      id: "caregiver",
      label: t?.catCaregiver || "Caregiver",
      count: (notifications || []).filter((n) => n.category === "caregiver" || n.type === "caregiver").length,
    },
    {
      id: "emergency",
      label: t?.catEmergency || "Emergency",
      count: (notifications || []).filter((n) => n.category === "emergency" || n.type === "emergency").length,
    },
    {
      id: "system",
      label: t?.catSystem || "System",
      count: (notifications || []).filter((n) => n.category === "system" || n.type === "assistant" || n.type === "system").length,
    },
  ];

  const filteredNotifications = (notifications || []).filter((item) => {
    // Category match
    if (filter === "unread" && item.read) return false;
    if (filter === "medicine" && item.category !== "medicine" && item.type !== "medicine") return false;
    if (filter === "appointment" && item.category !== "appointment" && item.type !== "appointment") return false;
    if (filter === "caregiver" && item.category !== "caregiver" && item.type !== "caregiver") return false;
    if (filter === "emergency" && item.category !== "emergency" && item.type !== "emergency") return false;
    if (filter === "system" && item.category !== "system" && item.type !== "system" && item.type !== "assistant") return false;

    // Search query match
    if (search.trim()) {
      const q = search.toLowerCase();
      const titleMatch = (item.title || "").toLowerCase().includes(q);
      const textMatch = (item.text || "").toLowerCase().includes(q);
      return titleMatch || textMatch;
    }
    return true;
  });

  return (
    <div className="notifications-container">
      <div className="notifications-toolbar">
        <div className="notifications-search-wrap">
          <Search size={15} />
          <input
            type="text"
            placeholder={t?.searchNotificationsPlaceholder || "Search notifications..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="notifications-actions-bar">
          {unreadCount > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={markAllNotificationsRead}
            >
              <CheckCheck size={14} />
              <span>{t?.markAllAsRead || "Mark all as read"}</span>
            </button>
          )}

          {(notifications || []).length > 0 && (
            <button
              type="button"
              className="btn btn-outline btn-sm danger-btn"
              onClick={clearNotifications}
            >
              <Trash2 size={14} />
              <span>{t?.clearAll || "Clear all"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="notifications-category-tabs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`notif-tab ${filter === cat.id ? "active" : ""}`}
            onClick={() => setFilter(cat.id)}
          >
            <span>{cat.label}</span>
            {cat.count > 0 && <span className="notif-tab-count">{cat.count}</span>}
          </button>
        ))}
      </div>

      <div className="notifications-list-wrapper">
        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : filteredNotifications.length > 0 ? (
          <div className="notifications-list">
            {filteredNotifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={markNotificationRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Inbox size={32} style={{ color: "var(--muted)", margin: "0 auto 8px" }} />
            <p>
              {search
                ? `No notifications found matching "${search}".`
                : filter === "unread"
                ? "You're all caught up! No unread notifications."
                : "No notifications in this category."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
