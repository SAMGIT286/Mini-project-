import { Check, Trash2, Bell, Calendar, Pill, HeartHandshake, ShieldAlert, Sparkles, Info } from "lucide-react";

export default function NotificationItem({ notification, onMarkRead, onDelete }) {
  const { id, title, text, type, category, timestamp, read } = notification;

  const getCategoryDetails = (cat, t) => {
    const key = cat || t || "general";
    switch (key) {
      case "medicine":
        return {
          icon: Pill,
          iconClass: "notif-icon-medicine",
          pillClass: "badge-medicine",
          label: "Medicine",
          emoji: "💊",
        };
      case "appointment":
        return {
          icon: Calendar,
          iconClass: "notif-icon-appointment",
          pillClass: "badge-appointment",
          label: "Appointment",
          emoji: "📅",
        };
      case "caregiver":
        return {
          icon: HeartHandshake,
          iconClass: "notif-icon-caregiver",
          pillClass: "badge-caregiver",
          label: "Caregiver",
          emoji: "🤝",
        };
      case "emergency":
        return {
          icon: ShieldAlert,
          iconClass: "notif-icon-emergency",
          pillClass: "badge-emergency",
          label: "Emergency",
          emoji: "🚨",
        };
      case "assistant":
      case "system":
        return {
          icon: Sparkles,
          iconClass: "notif-icon-assistant",
          pillClass: "badge-system",
          label: "Assistant",
          emoji: "✦",
        };
      default:
        return {
          icon: Info,
          iconClass: "notif-icon-general",
          pillClass: "badge-general",
          label: "General",
          emoji: "ℹ️",
        };
    }
  };

  const details = getCategoryDetails(category, type);
  const Icon = details.icon;

  return (
    <div className={`notification-card ${read ? "is-read" : "is-unread"}`}>
      <div className={`notification-avatar ${details.iconClass}`}>
        <Icon size={18} />
      </div>

      <div className="notification-body">
        <div className="notification-title-row">
          <div className="notification-title-group">
            <span className={`notification-category-pill ${details.pillClass}`}>
              {details.label}
            </span>
            <h4 className="notification-heading">{title || "MemoMind Notification"}</h4>
            {!read && <span className="unread-dot" title="Unread" />}
          </div>
          <span className="notification-time">{timestamp || "Recently"}</span>
        </div>

        <p className="notification-text">{text}</p>

        <div className="notification-actions-row">
          {!read && (
            <button
              type="button"
              className="text-btn notif-action-btn"
              onClick={() => onMarkRead(id)}
              title="Mark as read"
            >
              <Check size={13} />
              <span>Mark as read</span>
            </button>
          )}
          <button
            type="button"
            className="text-btn notif-action-btn danger-text"
            onClick={() => onDelete(id)}
            title="Dismiss notification"
          >
            <Trash2 size={13} />
            <span>Dismiss</span>
          </button>
        </div>
      </div>
    </div>
  );
}
