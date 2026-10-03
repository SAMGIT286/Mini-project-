import { Bell, ShieldCheck } from "lucide-react";
import NotificationsPanel from "../components/notifications/NotificationsPanel";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/common/RoleBadge";

export default function Notifications() {
  const { user, role } = useAuth();

  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">ALERTS & NOTIFICATIONS</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>Notifications</h1>
            <RoleBadge role={role} />
          </div>
          <p>Stay updated on medication reminders, appointments, caregiver check-ins and alerts.</p>
        </div>
      </div>

      <div className="panel" style={{ padding: "20px" }}>
        <NotificationsPanel showTestGenerator={true} />
      </div>
    </div>
  );
}
