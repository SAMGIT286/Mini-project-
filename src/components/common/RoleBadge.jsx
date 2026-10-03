import { BriefcaseBusiness, HeartHandshake, ShieldAlert, UserRound } from "lucide-react";

export default function RoleBadge({ role = "elderly" }) {
  const configs = {
    elderly: {
      label: "Elderly Person",
      icon: UserRound,
      className: "role-badge role-elderly",
    },
    young_professional: {
      label: "Young Professional",
      icon: BriefcaseBusiness,
      className: "role-badge role-yp",
    },
    caregiver: {
      label: "Caregiver",
      icon: HeartHandshake,
      className: "role-badge role-caregiver",
    },
    emergency_contact: {
      label: "Emergency Contact",
      icon: ShieldAlert,
      className: "role-badge role-emergency",
    },
  };

  const config = configs[role] || configs.elderly;
  const Icon = config.icon;

  return (
    <span className={config.className}>
      <Icon size={12} />
      <span>{config.label}</span>
    </span>
  );
}
