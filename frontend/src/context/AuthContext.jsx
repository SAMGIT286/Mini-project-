import { createContext, useContext, useEffect, useState } from "react";
import { getTranslation } from "../utils/translations";

const AuthContext = createContext(null);

const STORAGE_KEY = "memomind_user";
const LANG_STORAGE_KEY = "memomind_language";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const role = parsed.role || parsed.userType || "elderly";
        const language = parsed.language || parsed.preferences?.language || localStorage.getItem(LANG_STORAGE_KEY) || "English";
        return { ...parsed, role, userType: role, language };
      }
      return null;
    } catch {
      return null;
    }
  });

  const [language, setLanguageState] = useState(() => {
    return user?.language || localStorage.getItem(LANG_STORAGE_KEY) || "English";
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      if (user.language && user.language !== language) {
        setLanguageState(user.language);
        localStorage.setItem(LANG_STORAGE_KEY, user.language);
      }
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const setLanguage = (newLang) => {
    if (["English", "Hindi", "Marathi"].includes(newLang)) {
      setLanguageState(newLang);
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
      if (user) {
        updateUser({
          language: newLang,
          preferences: {
            ...(user.preferences || {}),
            language: newLang,
          },
        });
      }
    }
  };

  const login = (email, password, role = "elderly") => {
    if (!email || !password) {
      return { success: false, error: t?.errEnterBothCredentials || "Please enter both email and password." };
    }
    const cleanEmail = email.toLowerCase().trim();

    let accountRecord = null;
    try {
      const raw = localStorage.getItem(`memomind_account_${cleanEmail}`);
      if (raw) {
        accountRecord = JSON.parse(raw);
      }
    } catch {
      accountRecord = null;
    }

    if (!accountRecord || !accountRecord.user) {
      return {
        success: false,
        error: t?.errUserNotFound || "No account found with this email. Please register first.",
      };
    }

    if (accountRecord.password !== password) {
      return {
        success: false,
        error: t?.errInvalidPassword || "Incorrect password. Please try again.",
      };
    }

    // Authentication succeeded with original registered credentials!
    let authenticatedUser = accountRecord.user;
    if (role && role !== authenticatedUser.role) {
      authenticatedUser = { ...authenticatedUser, role, userType: role };
      localStorage.setItem(
        `memomind_account_${cleanEmail}`,
        JSON.stringify({ ...accountRecord, user: authenticatedUser })
      );
    }

    setUser(authenticatedUser);
    if (authenticatedUser.language) {
      setLanguageState(authenticatedUser.language);
      localStorage.setItem(LANG_STORAGE_KEY, authenticatedUser.language);
    }

    return { success: true, user: authenticatedUser };
  };

  const register = (data) => {
    const cleanEmail = (data.email || "").toLowerCase().trim();
    if (!cleanEmail || !data.password) {
      return { success: false, error: t?.errEnterBothCredentials || "Email and password are required." };
    }

    // Check if account already exists
    const existingRaw = localStorage.getItem(`memomind_account_${cleanEmail}`);
    if (existingRaw) {
      return { success: false, error: t?.errAccountExists || "An account with this email already exists." };
    }

    const role = data.role || data.userType || "elderly";
    const userLang = data.language || language || "English";

    // Clean initial user record - NO dummy data
    const nextUser = {
      id: `user-${cleanEmail.replace(/[^a-zA-Z0-9]/g, "-")}`,
      name: data.name ? data.name.trim() : "",
      email: cleanEmail,
      role,
      userType: role,
      photoUrl: "",
      phone: "",
      dob: "",
      age: "",
      gender: "Male",
      language: userLang,
      timezone: "(UTC+05:30) India Standard Time",
      location: "",
      caregiver: null,
      emergencyContacts: [],
      doctor: {
        name: "",
        specialization: "",
        hospital: "",
        phone: "",
      },
      routine: {
        wake: "",
        sleep: "",
        breakfast: "",
        lunch: "",
        dinner: "",
        exercise: "",
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
        language: userLang,
      },
      setupComplete: false,
    };

    localStorage.setItem(
      `memomind_account_${cleanEmail}`,
      JSON.stringify({ user: nextUser, password: data.password })
    );

    setUser(nextUser);
    setLanguageState(userLang);
    localStorage.setItem(LANG_STORAGE_KEY, userLang);
    return { success: true, user: nextUser };
  };

  const updateUser = (patch) => {
    setUser((prev) => {
      if (!prev) return null;
      const nextRole = patch.role || patch.userType || prev.role || prev.userType || "elderly";
      const nextLang = patch.language || prev.language || language || "English";

      const next = {
        ...prev,
        ...patch,
        role: nextRole,
        userType: nextRole,
        language: nextLang,
      };

      if (patch.language && patch.language !== language) {
        setLanguageState(patch.language);
        localStorage.setItem(LANG_STORAGE_KEY, patch.language);
      }

      if (next.email) {
        const cleanEmail = next.email.toLowerCase().trim();
        let existingAcc = {};
        try {
          existingAcc = JSON.parse(localStorage.getItem(`memomind_account_${cleanEmail}`) || "{}");
        } catch {}

        localStorage.setItem(
          `memomind_account_${cleanEmail}`,
          JSON.stringify({ ...existingAcc, user: next })
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
  const isReadOnly = isEmergencyContact;

  // Active translation dictionary
  const t = getTranslation(language);

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
        language,
        setLanguage,
        t,
        login,
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
