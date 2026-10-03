import { ShieldAlert, Info } from "lucide-react";

export default function ReadOnlyBanner({ message, patientName }) {
  return (
    <div className="read-only-banner">
      <div className="read-only-icon">
        <ShieldAlert size={18} />
      </div>
      <div className="read-only-content">
        <strong>Emergency Contact — Read-Only Mode</strong>
        <p>
          {message ||
            `You have view-only access to ${patientName || "the patient"}'s activity timeline, medications, and emergency profile. You cannot modify or delete records.`}
        </p>
      </div>
    </div>
  );
}
