import { NavLink } from "react-router-dom";
import {
  Activity,
  CalendarDays,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Pill,
  Settings,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/timeline", label: "Timeline", icon: Activity },
  { to: "/caregiver", label: "Caregiver", icon: HeartHandshake },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="brand brand-sidebar">
        <div className="brand-mark">✦</div>
        <div>
          <div className="brand-name">MemoMind</div>
          <div className="brand-tagline">Remember Today. Live Better.</div>
        </div>
      </div>

      <nav className="side-nav">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          <MessageCircle size={15} />
          <span>Your memories are safe with you.</span>
        </div>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
