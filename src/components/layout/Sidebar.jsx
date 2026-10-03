import { NavLink } from "react-router-dom";
import {
  Activity,
  Bell,
  CalendarDays,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Pill,
  Settings,
  Sparkles,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {
  const { logout, role, isElderly, isYoungProfessional, isCaregiver, isEmergencyContact } = useAuth();

  const getLinks = () => {
    if (isCaregiver) {
      return [
        { to: "/caregiver", label: "Caregiver Portal", icon: HeartHandshake },
        { to: "/timeline", label: "Patient Timeline", icon: Activity },
        { to: "/medicines", label: "Patient Medicines", icon: Pill },
        { to: "/appointments", label: "Appointments", icon: CalendarDays },
        { to: "/assistant", label: "AI Assistant", icon: Sparkles },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Settings", icon: Settings },
      ];
    }

    if (isEmergencyContact) {
      return [
        { to: "/dashboard", label: "Emergency Overview", icon: ShieldAlert },
        { to: "/timeline", label: "Patient Timeline", icon: Activity },
        { to: "/medicines", label: "Medication Plan", icon: Pill },
        { to: "/appointments", label: "Doctor Schedule", icon: CalendarDays },
        { to: "/assistant", label: "AI Assistant", icon: Sparkles },
        { to: "/notifications", label: "Alerts & Notifs", icon: Bell },
        { to: "/settings", label: "Settings", icon: Settings },
      ];
    }

    if (isYoungProfessional) {
      return [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/assistant", label: "AI Assistant", icon: Sparkles },
        { to: "/medicines", label: "Supplements & Meds", icon: Pill },
        { to: "/appointments", label: "Appointments", icon: CalendarDays },
        { to: "/timeline", label: "Timeline & Logs", icon: Activity },
        { to: "/notifications", label: "Notifications", icon: Bell },
        { to: "/settings", label: "Settings", icon: Settings },
      ];
    }

    // Default: Elderly Person
    return [
      { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { to: "/assistant", label: "AI Assistant", icon: Sparkles },
      { to: "/medicines", label: "Medicines", icon: Pill },
      { to: "/appointments", label: "Appointments", icon: CalendarDays },
      { to: "/timeline", label: "Timeline", icon: Activity },
      { to: "/caregiver", label: "Caregiver", icon: HeartHandshake },
      { to: "/notifications", label: "Notifications", icon: Bell },
      { to: "/settings", label: "Settings", icon: Settings },
    ];
  };

  const links = getLinks();

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
          <span>Your memories and records are secure.</span>
        </div>
        <button type="button" className="logout-btn" onClick={logout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
