import { CalendarDays, Check, Clock3, Pill, Plus, Sparkles, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { medicines, appointments, memories } = useApp();
  const upcoming = appointments[0];

  return (
    <div className="dashboard-page">
      <div className="welcome-row">
        <div>
          <div className="eyebrow">MON, 9 SEP 2024</div>
          <h1>Good morning, John! 👋</h1>
          <p>Here's what's happening today.</p>
        </div>
        <Link to="/assistant" className="btn btn-primary"><Sparkles size={16} /> Talk to assistant</Link>
      </div>

      <div className="stats-grid">
        <StatCard icon={Pill} value={medicines.length} label="Medicines today" />
        <StatCard icon={CalendarDays} value={appointments.length} label="Appointments" />
        <StatCard icon={BookOpen} value={memories.length} label="Memories this week" />
        <StatCard icon={Users} value="1" label="Caregiver connected" />
      </div>

      <div className="dashboard-grid">
        <section className="panel schedule-panel">
          <div className="panel-header"><div><h2>Today's Schedule</h2><p>Your day at a glance</p></div><Clock3 size={18} /></div>
          <ScheduleRow time="08:00" title="Breakfast" icon="☕" />
          <ScheduleRow time="10:00" title="Take Blood Pressure Medicine" icon="💊" action={<button className="mini-btn">Mark as Taken</button>} />
          <ScheduleRow time="11:30" title={upcoming?.title || "Doctor Appointment"} icon="🩺" />
          <ScheduleRow time="17:00" title="Evening Walk" icon="🚶" />
          <ScheduleRow time="20:00" title="Take Vitamin D" icon="💊" action={<button className="mini-btn">Mark as Taken</button>} />
        </section>

        <section className="panel quick-panel">
          <div className="panel-header"><div><h2>Quick Actions</h2><p>Common tasks</p></div></div>
          <QuickAction to="/medicines" icon={Plus} label="Add Medicine" />
          <QuickAction to="/appointments" icon={Plus} label="Add Appointment" />
          <QuickAction to="/timeline" icon={Plus} label="Add Memory" />
          <div className="assistant-card">
            <div className="assistant-card-icon"><Sparkles size={18} /></div>
            <div>
              <strong>Talk to your assistant</strong>
              <p>Ask anything or click the mic.</p>
            </div>
            <Link to="/assistant" className="mini-round">→</Link>
          </div>
        </section>
      </div>

      <section className="panel memory-strip">
        <div className="panel-header"><div><h2>Recent Memories</h2><p>Things MemoMind remembers</p></div><Link to="/timeline" className="text-link">View timeline →</Link></div>
        <div className="memory-mini-grid">
          {memories.slice(0, 3).map((m) => (
            <div className="memory-mini" key={m.id}>
              <span className="memory-time">{m.time}</span>
              <strong>{m.title}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, value, label }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function ScheduleRow({ time, title, icon, action }) {
  return <div className="schedule-row"><span className="schedule-time">{time}</span><span className="schedule-icon">{icon}</span><strong>{title}</strong>{action}<span className="schedule-check"><Check size={14} /></span></div>;
}

function QuickAction({ to, icon: Icon, label }) {
  return <Link className="quick-action" to={to}><span><Icon size={15} /></span>{label}<b>+</b></Link>;
}
