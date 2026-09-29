import { Activity, CalendarDays, CheckCircle2, Pill, ShieldCheck, UserRound } from "lucide-react";

export default function CaregiverDashboard() {
  return (
    <div className="page">
      <div className="page-heading-row">
        <div className="page-heading"><div className="eyebrow">AUTHORIZED CAREGIVER VIEW</div><h1>Caregiver Dashboard</h1><p>Monitor your loved one's wellbeing and daily activity.</p></div>
        <select className="patient-select"><option>John's View</option><option>Other connected user</option></select>
      </div>

      <div className="stats-grid">
        <CareStat icon={Pill} value="95%" label="Medicine Adherence" />
        <CareStat icon={CalendarDays} value="2" label="Upcoming Appointments" />
        <CareStat icon={Activity} value="Active" label="Recent Activity" />
      </div>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-header"><div><h2>Today's Summary</h2><p>Overview of today's activity</p></div><ShieldCheck size={18} /></div>
          <div className="summary-list">
            <Summary icon={CheckCircle2} text="All medicines taken" />
            <Summary icon={CheckCircle2} text="1 appointment completed" />
            <Summary icon={CheckCircle2} text="3 activities logged" />
            <Summary icon={CheckCircle2} text="Last active 2 hours ago" />
          </div>
        </section>
        <section className="panel">
          <div className="panel-header"><div><h2>Recent Alerts</h2><p>Things that need attention</p></div></div>
          <div className="alert-card good"><CheckCircle2 size={17} /><div><strong>No missed medicines</strong><span>Great job!</span></div></div>
          <div className="alert-card good"><CheckCircle2 size={17} /><div><strong>No upcoming issues</strong><span>Everything looks good.</span></div></div>
        </section>
      </div>

      <section className="panel caregiver-profile-strip">
        <div className="avatar avatar-md">JD</div>
        <div><strong>John Doe</strong><span>Primary user · Caregiver access active</span></div>
        <UserRound size={18} />
      </section>
    </div>
  );
}

function CareStat({ icon: Icon, value, label }) {
  return <div className="stat-card"><div className="stat-icon"><Icon size={18} /></div><div><strong>{value}</strong><span>{label}</span></div></div>;
}

function Summary({ icon: Icon, text }) {
  return <div className="summary-row"><Icon size={16} /><span>{text}</span></div>;
}
