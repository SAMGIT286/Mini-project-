import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const STORAGE_KEY = "memomind_user";

// Pre-seeded demo accounts for one-click testing of each role
export const DEMO_PROFILES = {
  elderly: {
    id: "user-elderly-john",
    name: "John Doe",
    email: "john@example.com",
    role: "elderly",
    userType: "elderly",
    photoUrl: "",
    dob: "1958-04-12",
    age: "66",
    gender: "Male",
    phone: "+91 98765 43210",
    language: "English",
    timezone: "(UTC+05:30) India Standard Time",
    location: "Mumbai, Maharashtra",
    caregiver: {
      name: "Priya Mehta",
      relationship: "Daughter-in-law",
      phone: "+91 98987 76655",
      email: "priya@example.com",
      permissions: { medicine: true, appointments: true, timeline: true, alerts: true },
    },
    emergencyContacts: [
      { name: "Anita Sharma", relationship: "Daughter", phone: "+91 98765 43210", email: "anita@example.com" },
      { name: "Rahul Sharma", relationship: "Son", phone: "+91 91234 56789", email: "rahul@example.com" },
    ],
    doctor: {
      name: "Dr. Sharma",
      specialization: "General Physician",
      hospital: "City Hospital",
      phone: "+91 98765 43210",
    },
    routine: {
      wake: "06:30",
      sleep: "22:00",
      breakfast: "08:00",
      lunch: "13:00",
      dinner: "20:00",
      exercise: "17:00",
    },
    preferences: {
      notifications: true,
      medicineReminders: true,
      appointmentReminders: true,
      dailySummary: true,
      voiceAssistant: true,
      voiceAutoSpeak: true,
      memoryTracking: true,
      emergencyAlerts: true,
      fontSize: "normal",
      theme: "light",
    },
    setupComplete: true,
  },
  young_professional: {
    id: "user-yp-alex",
    name: "Alex Chen",
    email: "alex@example.com",
    role: "young_professional",
    userType: "young_professional",
    photoUrl: "",
    dob: "1996-08-22",
    age: "28",
    gender: "Male",
    phone: "+91 98111 22334",
    language: "English",
    timezone: "(UTC+05:30) India Standard Time",
    location: "Bangalore, Karnataka",
    caregiver: null, // Caregiver is OPTIONAL for young professionals
    emergencyContacts: [
      { name: "Sarah Chen", relationship: "Sister", phone: "+91 98111 99887", email: "sarah@example.com" },
    ],
    doctor: {
      name: "Dr. Kapoor",
      specialization: "Physician & Wellness",
      hospital: "Apollo Clinic",
      phone: "+91 98111 55667",
    },
    routine: {
      wake: "06:00",
      sleep: "23:30",
      breakfast: "07:30",
      lunch: "12:30",
      dinner: "20:30",
      exercise: "06:45",
    },
    preferences: {
      notifications: true,
      medicineReminders: true,
      appointmentReminders: true,
      dailySummary: true,
      voiceAssistant: true,
      voiceAutoSpeak: false,
      memoryTracking: true,
      emergencyAlerts: false,
      fontSize: "normal",
      theme: "light",
    },
    setupComplete: true,
  },
  caregiver: {
    id: "user-cg-priya",
    name: "Priya Mehta",
    email: "priya@example.com",
    role: "caregiver",
    userType: "caregiver",
    photoUrl: "",
    dob: "1988-11-05",
    age: "36",
    gender: "Female",
    phone: "+91 98987 76655",
    language: "English",
    timezone: "(UTC+05:30) India Standard Time",
    location: "Mumbai, Maharashtra",
    associatedPatient: {
      id: "patient-john",
      name: "John Doe",
      relationship: "Father-in-law",
      age: "66",
      phone: "+91 98765 43210",
      address: "Bandra West, Mumbai",
      doctor: "Dr. Sharma (+91 98765 43210)",
      condition: "Hypertension & Diabetes management",
      emergencyContact: "Anita Sharma (+91 98765 43210)",
    },
    preferences: {
      notifications: true,
      medicineReminders: true,
      appointmentReminders: true,
      dailySummary: true,
      voiceAssistant: true,
      voiceAutoSpeak: false,
      memoryTracking: true,
      emergencyAlerts: true,
      fontSize: "normal",
      theme: "light",
    },
    setupComplete: true,
  },
  emergency_contact: {
    id: "user-ec-anita",
    name: "Anita Sharma",
    email: "anita@example.com",
    role: "emergency_contact",
    userType: "emergency_contact",
    photoUrl: "",
    dob: "1992-03-18",
    age: "32",
    gender: "Female",
    phone: "+91 98765 43210",
    language: "English",
    timezone: "(UTC+05:30) India Standard Time",
    location: "Pune, Maharashtra",
    associatedPatient: {
      id: "patient-john",
      name: "John Doe",
      relationship: "Father",
      age: "66",
      bloodGroup: "O+",
      allergies: "Penicillin",
      phone: "+91 98765 43210",
      address: "Bandra West, Mumbai",
      doctor: "Dr. Sharma - City Hospital (+91 98765 43210)",
      caregiver: "Priya Mehta (+91 98987 76655)",
      status: "Stable & Active",
    },
    preferences: {
      notifications: true,
      medicineReminders: false,
      appointmentReminders: true,
      dailySummary: true,
      voiceAssistant: false,
      voiceAutoSpeak: false,
      memoryTracking: false,
      emergencyAlerts: true,
      fontSize: "normal",
      theme: "light",
    },
    setupComplete: true,
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Normalize role and userType
        const role = parsed.role || parsed.userType || "elderly";
        return { ...parsed, role, userType: role };
      }
      return null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (email, password, role = "elderly") => {
    if (!email || !password) return false;
    const cleanEmail = email.toLowerCase().trim();

    // Check if this matches a demo account
    const demoMatch = Object.values(DEMO_PROFILES).find(
      (d) => d.email.toLowerCase() === cleanEmail
    );

    let existing = null;
    try {
      existing = JSON.parse(localStorage.getItem(`memomind_account_${cleanEmail}`) || "null");
    } catch {}

    const selectedRole = role || existing?.user?.role || existing?.user?.userType || demoMatch?.role || "elderly";

    let nextUser;
    if (existing?.user) {
      nextUser = {
        ...existing.user,
        role: selectedRole,
        userType: selectedRole,
      };
    } else if (demoMatch) {
      nextUser = {
        ...demoMatch,
        role: selectedRole,
        userType: selectedRole,
      };
    } else {
      // New user logging in
      const defaultProfile = DEMO_PROFILES[selectedRole] || DEMO_PROFILES.elderly;
      nextUser = {
        ...defaultProfile,
        id: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "-")}`,
        name: cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "MemoMind User",
        email: cleanEmail,
        role: selectedRole,
        userType: selectedRole,
        setupComplete: true,
      };
    }

    localStorage.setItem(
      `memomind_account_${cleanEmail}`,
      JSON.stringify({ user: nextUser, password })
    );
    setUser(nextUser);
    return true;
  };

  const loginAsDemo = (roleKey) => {
    const profile = DEMO_PROFILES[roleKey] || DEMO_PROFILES.elderly;
    const cleanEmail = profile.email.toLowerCase();
    
    // Check if user has saved modified version
    let existing = null;
    try {
      existing = JSON.parse(localStorage.getItem(`memomind_account_${cleanEmail}`) || "null");
    } catch {}

    const nextUser = existing?.user ? { ...existing.user, role: roleKey, userType: roleKey } : { ...profile };
    localStorage.setItem(`memomind_account_${cleanEmail}`, JSON.stringify({ user: nextUser, password: "password123" }));
    setUser(nextUser);
    return nextUser;
  };

  const register = (data) => {
    const role = data.role || data.userType || "elderly";
    const cleanEmail = (data.email || "").toLowerCase().trim();
    const defaultProfile = DEMO_PROFILES[role] || DEMO_PROFILES.elderly;

    const nextUser = {
      ...defaultProfile,
      id: `user-${Date.now()}`,
      name: data.name || "MemoMind User",
      email: cleanEmail,
      role,
      userType: role,
      setupComplete: false,
    };

    localStorage.setItem(
      `memomind_account_${cleanEmail}`,
      JSON.stringify({ user: nextUser, password: data.password })
    );
    setUser(nextUser);
    return true;
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextRole = patch.role || patch.userType || prev.role || prev.userType || "elderly";
      const next = {
        ...prev,
        ...patch,
        role: nextRole,
        userType: nextRole,
      };
      if (next.email) {
        localStorage.setItem(
          `memomind_account_${next.email.toLowerCase()}`,
          JSON.stringify({ user: next })
        );
      }
      return next;
    });
  };

  const logout = () => {
    setUser(null);
  };

  // Helper flags
  const role = user?.role || user?.userType || "elderly";
  const isElderly = role === "elderly";
  const isYoungProfessional = role === "young_professional";
  const isCaregiver = role === "caregiver";
  const isEmergencyContact = role === "emergency_contact";
  const isReadOnly = isEmergencyContact; // Emergency Contact has read-only access to timeline/records

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isElderly,
        isYoungProfessional,
        isCaregiver,
        isEmergencyContact,
        isReadOnly,
        login,
        loginAsDemo,
        register,
        updateUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
