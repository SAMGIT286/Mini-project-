import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const seedDataByRole = {
  elderly: {
    medicines: [
      { id: 1, name: "Blood Pressure Medicine", dosage: "1 tablet", frequency: "Once daily", time: "10:00 AM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take after breakfast.", status: "taken", takenAt: "10:04 AM" },
      { id: 2, name: "Diabetes Medicine", dosage: "1 tablet", frequency: "Twice daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take before dinner.", status: "upcoming" },
      { id: 3, name: "Vitamin D3", dosage: "1 capsule", frequency: "Once daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take with water.", status: "upcoming" },
    ],
    appointments: [
      { id: 1, title: "Dr. Sharma Checkup", doctorName: "Dr. Sharma", specialization: "General Physician", hospital: "City Hospital", phone: "+91 98765 43210", date: "2026-10-09", time: "11:30 AM", location: "City Hospital, Bandra", reminder: "30 minutes before", status: "upcoming" },
      { id: 2, title: "Dentist Routine Visit", doctorName: "Dr. Mehta", specialization: "Dentist", hospital: "Smile Dental Clinic", phone: "+91 98765 00000", date: "2026-10-15", time: "10:00 AM", location: "Smile Dental Clinic", reminder: "1 hour before", status: "upcoming" },
      { id: 3, title: "Eye Vision Checkup", doctorName: "Dr. Patel", specialization: "Ophthalmologist", hospital: "Eye Care Centre", phone: "+91 98765 11111", date: "2026-10-22", time: "04:00 PM", location: "Eye Care Centre", reminder: "1 hour before", status: "upcoming" },
    ],
    memories: [
      { id: 1, time: "08:00 AM", title: "Morning walk in the garden & breakfast at home", type: "routine" },
      { id: 2, time: "10:04 AM", title: "Medicine taken — Blood Pressure Medicine", type: "medicine" },
      { id: 3, time: "11:30 AM", title: "Dr. Sharma appointment review notes", type: "appointment" },
      { id: 4, time: "03:00 PM", title: "Met neighbor Rahul and discussed gardening", type: "person" },
      { id: 5, time: "07:00 PM", title: "Family dinner and tea with grandchildren", type: "memory" },
    ],
    chat: [
      { id: 1, role: "assistant", text: "Hello John! I'm MemoMind, your personal memory assistant. How can I help you today? You can ask me about your medicines, doctor appointments, or today's routine.", time: "09:00 AM" },
    ],
    notifications: [
      { id: 1, title: "Diabetes Medicine Due", text: "Your Diabetes Medicine is due tonight at 8:00 PM.", type: "medicine", category: "medicine", timestamp: "Today, 08:00 AM", read: false },
      { id: 2, title: "Doctor Appointment Soon", text: "Routine checkup with Dr. Sharma scheduled at City Hospital.", type: "appointment", category: "appointment", timestamp: "Yesterday, 04:30 PM", read: false },
      { id: 3, title: "Caregiver Check-in", text: "Priya Mehta checked in and verified your morning adherence.", type: "caregiver", category: "caregiver", timestamp: "Yesterday, 10:15 AM", read: true },
      { id: 4, title: "Assistant Ready", text: "MemoMind updated your daily memory timeline.", type: "assistant", category: "system", timestamp: "2 days ago", read: true },
    ],
  },
  young_professional: {
    medicines: [
      { id: 1, name: "Daily Multivitamin & Omega 3", dosage: "1 capsule", frequency: "Once daily", time: "08:30 AM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take with breakfast", status: "taken", takenAt: "08:35 AM" },
      { id: 2, name: "Hydration & Electrolytes", dosage: "500 ml", frequency: "Twice daily", time: "02:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Afternoon focus booster", status: "upcoming" },
    ],
    appointments: [
      { id: 1, title: "Annual Wellness Consultation", doctorName: "Dr. Kapoor", specialization: "Physician & Wellness", hospital: "Apollo Clinic", phone: "+91 98111 55667", date: "2026-10-12", time: "02:30 PM", location: "Apollo Clinic, Indiranagar", reminder: "1 hour before", status: "upcoming" },
      { id: 2, title: "Physiotherapy & Posture Session", doctorName: "Dr. R. Nair", specialization: "Physical Therapist", hospital: "ActiveLife Clinic", phone: "+91 98111 44332", date: "2026-10-20", time: "06:00 PM", location: "ActiveLife Clinic", reminder: "30 minutes before", status: "upcoming" },
    ],
    memories: [
      { id: 1, time: "06:45 AM", title: "Morning run & 20 min meditation", type: "routine" },
      { id: 2, time: "08:35 AM", title: "Took morning multivitamin supplement", type: "medicine" },
      { id: 3, time: "11:00 AM", title: "Key project milestone review with team", type: "memory" },
      { id: 4, time: "01:30 PM", title: "Healthy lunch & 15-minute screen break", type: "routine" },
    ],
    chat: [
      { id: 1, role: "assistant", text: "Hi Alex! MemoMind is ready to help you stay organized, on time, and healthy. What would you like to review today?", time: "08:00 AM" },
    ],
    notifications: [
      { id: 1, title: "Afternoon Hydration", text: "Time for your afternoon hydration break & electrolytes.", type: "medicine", category: "medicine", timestamp: "Today, 01:45 PM", read: false },
      { id: 2, title: "Wellness Consultation Upcoming", text: "Consultation with Dr. Kapoor on Oct 12 at 2:30 PM.", type: "appointment", category: "appointment", timestamp: "Yesterday, 09:00 AM", read: false },
      { id: 3, title: "Productivity Summary", text: "All morning tasks and wellness routines logged.", type: "assistant", category: "system", timestamp: "Yesterday, 08:00 PM", read: true },
    ],
  },
  caregiver: {
    medicines: [
      { id: 1, name: "Blood Pressure Medicine (Patient: John)", dosage: "1 tablet", frequency: "Once daily", time: "10:00 AM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Taken after breakfast.", status: "taken", takenAt: "10:04 AM" },
      { id: 2, name: "Diabetes Medicine (Patient: John)", dosage: "1 tablet", frequency: "Twice daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take before dinner.", status: "upcoming" },
      { id: 3, name: "Vitamin D3 (Patient: John)", dosage: "1 capsule", frequency: "Once daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take with water.", status: "upcoming" },
    ],
    appointments: [
      { id: 1, title: "John's Dr. Sharma Checkup", doctorName: "Dr. Sharma", specialization: "General Physician", hospital: "City Hospital", phone: "+91 98765 43210", date: "2026-10-09", time: "11:30 AM", location: "City Hospital, Bandra", reminder: "30 minutes before", status: "upcoming" },
      { id: 2, title: "John's Dentist Visit", doctorName: "Dr. Mehta", specialization: "Dentist", hospital: "Smile Dental Clinic", phone: "+91 98765 00000", date: "2026-10-15", time: "10:00 AM", location: "Smile Dental Clinic", reminder: "1 hour before", status: "upcoming" },
    ],
    memories: [
      { id: 1, time: "08:00 AM", title: "John completed morning walk & breakfast", type: "routine" },
      { id: 2, time: "10:04 AM", title: "John confirmed Blood Pressure Medicine taken", type: "medicine" },
      { id: 3, time: "03:00 PM", title: "John visited neighbor Rahul in building garden", type: "person" },
    ],
    chat: [
      { id: 1, role: "assistant", text: "Hello Priya! As John's authorized caregiver, you can monitor his medicine adherence, doctor appointments, and daily routines.", time: "08:30 AM" },
    ],
    notifications: [
      { id: 1, title: "Medicine Confirmed", text: "John took Blood Pressure Medicine on time at 10:04 AM.", type: "caregiver", category: "caregiver", timestamp: "Today, 10:05 AM", read: false },
      { id: 2, title: "Evening Medicine Reminder", text: "John's Diabetes Medicine is due at 8:00 PM.", type: "medicine", category: "medicine", timestamp: "Today, 06:00 PM", read: false },
      { id: 3, title: "Upcoming Doctor Visit", text: "John's appointment with Dr. Sharma is on Oct 9 at 11:30 AM.", type: "appointment", category: "appointment", timestamp: "Yesterday, 02:00 PM", read: true },
      { id: 4, title: "Caregiver Alert Check", text: "Weekly adherence report: 95% compliance rate.", type: "assistant", category: "system", timestamp: "2 days ago", read: true },
    ],
  },
  emergency_contact: {
    medicines: [
      { id: 1, name: "Blood Pressure Medicine (Patient: John)", dosage: "1 tablet", frequency: "Once daily", time: "10:00 AM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take after breakfast.", status: "taken", takenAt: "10:04 AM" },
      { id: 2, name: "Diabetes Medicine (Patient: John)", dosage: "1 tablet", frequency: "Twice daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take before dinner.", status: "upcoming" },
      { id: 3, name: "Vitamin D3 (Patient: John)", dosage: "1 capsule", frequency: "Once daily", time: "08:00 PM", startDate: "2024-09-01", endDate: "2024-12-31", reminderEnabled: true, notes: "Take with water.", status: "upcoming" },
    ],
    appointments: [
      { id: 1, title: "Dr. Sharma Routine Checkup", doctorName: "Dr. Sharma", specialization: "General Physician", hospital: "City Hospital", phone: "+91 98765 43210", date: "2026-10-09", time: "11:30 AM", location: "City Hospital, Bandra", reminder: "30 minutes before", status: "upcoming" },
    ],
    memories: [
      { id: 1, time: "08:00 AM", title: "Morning routine & breakfast completed", type: "routine" },
      { id: 2, time: "10:04 AM", title: "Blood Pressure Medicine taken on time", type: "medicine" },
      { id: 3, time: "03:00 PM", title: "Social interaction & garden walk", type: "routine" },
    ],
    chat: [
      { id: 1, role: "assistant", text: "Hello Anita. You have Emergency Contact read-only access to view John Doe's daily timeline, medications, and emergency status.", time: "09:00 AM" },
    ],
    notifications: [
      { id: 1, title: "Patient Status Normal", text: "John Doe is active and took morning medicine on time.", type: "emergency", category: "emergency", timestamp: "Today, 10:10 AM", read: false },
      { id: 2, title: "Upcoming Doctor Checkup", text: "Doctor appointment with Dr. Sharma on Oct 9.", type: "appointment", category: "appointment", timestamp: "Yesterday, 04:00 PM", read: true },
      { id: 3, title: "Emergency Link Verified", text: "Your number +91 98765 43210 is registered as Primary Emergency Contact.", type: "assistant", category: "system", timestamp: "3 days ago", read: true },
    ],
  },
};

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(`memomind_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }) {
  const { user, isReadOnly, role } = useAuth();
  const prefix = user?.id || "guest";
  const userRole = role || user?.role || "elderly";
  const roleSeed = seedDataByRole[userRole] || seedDataByRole.elderly;

  const [medicines, setMedicines] = useState(() => readStore(`${prefix}_medicines`, roleSeed.medicines));
  const [appointments, setAppointments] = useState(() => readStore(`${prefix}_appointments`, roleSeed.appointments));
  const [memories, setMemories] = useState(() => readStore(`${prefix}_memories`, roleSeed.memories));
  const [chat, setChat] = useState(() => readStore(`${prefix}_chat`, roleSeed.chat));
  const [notifications, setNotifications] = useState(() => readStore(`${prefix}_notifications`, roleSeed.notifications));
  const [isSending, setIsSending] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Sync state whenever active user prefix changes
  useEffect(() => {
    const activeSeed = seedDataByRole[userRole] || seedDataByRole.elderly;
    setMedicines(readStore(`${prefix}_medicines`, activeSeed.medicines));
    setAppointments(readStore(`${prefix}_appointments`, activeSeed.appointments));
    setMemories(readStore(`${prefix}_memories`, activeSeed.memories));
    setChat(readStore(`${prefix}_chat`, activeSeed.chat));
    setNotifications(readStore(`${prefix}_notifications`, activeSeed.notifications));
  }, [prefix, userRole]);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(`memomind_${prefix}_medicines`, JSON.stringify(medicines));
  }, [prefix, medicines]);

  useEffect(() => {
    localStorage.setItem(`memomind_${prefix}_appointments`, JSON.stringify(appointments));
  }, [prefix, appointments]);

  useEffect(() => {
    localStorage.setItem(`memomind_${prefix}_memories`, JSON.stringify(memories));
  }, [prefix, memories]);

  useEffect(() => {
    localStorage.setItem(`memomind_${prefix}_chat`, JSON.stringify(chat));
  }, [prefix, chat]);

  useEffect(() => {
    localStorage.setItem(`memomind_${prefix}_notifications`, JSON.stringify(notifications));
  }, [prefix, notifications]);

  // Medicine Actions
  const addMedicine = (medicine) => {
    if (isReadOnly) return;
    setMedicines((prev) => [...prev, { ...medicine, id: Date.now(), status: "upcoming" }]);
    addNotification({
      title: "New Medicine Added",
      text: `${medicine.name} (${medicine.dosage}) added to schedule.`,
      type: "medicine",
      category: "medicine",
    });
  };

  const updateMedicine = (id, patch) => {
    if (isReadOnly) return;
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
  };

  const deleteMedicine = (id) => {
    if (isReadOnly) return;
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const markMedicineTaken = (id) => {
    if (isReadOnly) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const target = medicines.find((m) => m.id === id);
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, status: "taken", takenAt: now } : m)));
    
    // Add memory event
    if (target) {
      addMemory({
        time: now,
        title: `Medicine taken — ${target.name}`,
        type: "medicine",
      });
      addNotification({
        title: "Medicine Taken",
        text: `You recorded taking ${target.name} at ${now}.`,
        type: "medicine",
        category: "medicine",
      });
    }
  };

  // Appointment Actions
  const addAppointment = (appointment) => {
    if (isReadOnly) return;
    setAppointments((prev) => [...prev, { ...appointment, id: Date.now(), status: "upcoming" }]);
    addNotification({
      title: "New Appointment Scheduled",
      text: `${appointment.title} on ${appointment.date} at ${appointment.time}.`,
      type: "appointment",
      category: "appointment",
    });
  };

  const updateAppointment = (id, patch) => {
    if (isReadOnly) return;
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  };

  const deleteAppointment = (id) => {
    if (isReadOnly) return;
    setAppointments((prev) => prev.filter((a) => a.id !== id));
  };

  // Memory Actions
  const addMemory = (memory) => {
    if (isReadOnly) return;
    setMemories((prev) => [...prev, { ...memory, id: Date.now(), type: memory.type || "memory" }]);
  };

  const deleteMemory = (id) => {
    if (isReadOnly) return;
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  // Notification Actions
  const addNotification = (item) => {
    const newNotif = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: item.title || "Notification",
      text: item.text || "",
      type: item.type || "general",
      category: item.category || item.type || "general",
      timestamp: "Just now",
      read: false,
      ...item,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Chat Actions
  const clearChat = () => {
    if (isReadOnly) return;
    setChat([]);
  };

  const sendMessage = async (text) => {
    const clean = text?.trim();
    if (!clean || isSending) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMessage = { id: Date.now(), role: "user", text: clean, time: now };
    const historyForApi = (chat || []).slice(-10).map((m) => ({ role: m.role, content: m.text }));
    
    setChat((prev) => [...(prev || []), userMessage]);
    setIsSending(true);
    setAiError(null);

    const records = [
      `User Role: ${user?.role || "elderly"}`,
      `User Name: ${user?.name || "User"}`,
      `Medicines: ${(medicines || []).map((m) => `${m.name} (${m.dosage}, ${m.frequency}, ${m.time}, status=${m.status}${m.takenAt ? `, takenAt=${m.takenAt}` : ""})`).join("; ") || "none"}`,
      `Appointments: ${(appointments || []).map((a) => `${a.title} with ${a.doctorName || "doctor"} on ${a.date} at ${a.time}, location=${a.location || a.hospital || "unspecified"}, status=${a.status}`).join("; ") || "none"}`,
      `Memories: ${(memories || []).map((m) => `${m.time} - ${m.title}`).join("; ") || "none"}`,
    ].join("\n");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Here are the user's current application records. Treat them as the only source of truth for personal records:\n${records}\n\nUser question:\n${clean}`,
          history: historyForApi,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.detail || "Unable to contact the AI service.");
      
      setChat((prev) => [
        ...(prev || []),
        {
          id: Date.now() + 1,
          role: "assistant",
          text: data.reply || "I'm here to help with your MemoMind records.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (error) {
      console.warn("MemoMind AI Backend status:", error);
      setAiError(error.message);
      setChat((prev) => [
        ...(prev || []),
        {
          id: Date.now() + 1,
          role: "assistant",
          text: `I couldn't reach the MemoMind AI backend (${error.message}). Please make sure the FastAPI server is running on ${API_URL}. In the meantime, you can manage your medicines, appointments, and timeline directly.`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const value = useMemo(
    () => ({
      medicines,
      appointments,
      memories,
      chat,
      notifications,
      isSending,
      aiError,
      isReadOnly,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      markMedicineTaken,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addMemory,
      deleteMemory,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      clearNotifications,
      setNotifications,
      clearChat,
      sendMessage,
      apiUrl: API_URL,
    }),
    [medicines, appointments, memories, chat, notifications, isSending, aiError, isReadOnly]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  return useContext(AppContext);
}
