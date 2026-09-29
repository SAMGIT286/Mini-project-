import { Bell, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

export default function Topbar() {
  const { user } = useAuth();
  const { notifications, setNotifications } = useApp();
  const unread = notifications.filter((n) => !n.read).length;

  const markRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="breadcrumb">Personal Memory & Care Assistant</div>
      </div>
      <div className="topbar-actions">
        <button className="icon-btn notification-btn" onClick={markRead} title="Notifications">
          <Bell size={19} />
          {unread > 0 && <span className="notification-dot">{unread}</span>}
        </button>
        <div className="user-mini">
          <div className="avatar avatar-sm">JD</div>
          <div className="user-mini-copy">
            <strong>{user?.name || "John Doe"}</strong>
            <span>Personal account</span>
          </div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
