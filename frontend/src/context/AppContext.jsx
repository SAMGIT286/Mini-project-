import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";

const AppContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(`memomind_${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function getDefaultChatMessage(lang = "English") {
  if (lang === "Marathi") {
    return "नमस्कार! मी मेमोमाइंड, तुमचा वैयक्तिक स्मरण आणि काळजी सहाय्यक आहे. मी आज तुम्हाला कशी मदत करू शकतो?";
  }
  if (lang === "Hindi") {
    return "नमस्ते! मैं मेमोमाइंड हूँ, आपका व्यक्तिगत स्मरण और देखभाल सहायक। आज मैं आपकी क्या मदद कर सकता हूँ?";
  }
  return "Hello! I'm MemoMind, your personal memory and care assistant. How can I help you today?";
}

export function AppProvider({ children }) {
  const { user, isReadOnly, role, language } = useAuth();
  const prefix = user?.id || "guest";
  const activeLang = language || user?.language || localStorage.getItem("memomind_language") || "English";

  const [medicines, setMedicines] = useState(() => readStore(`${prefix}_medicines`, []));
  const [appointments, setAppointments] = useState(() => readStore(`${prefix}_appointments`, []));
  const [memories, setMemories] = useState(() => readStore(`${prefix}_memories`, []));
  const [chat, setChat] = useState(() =>
    readStore(`${prefix}_chat`, [
      {
        id: 1,
        role: "assistant",
        text: getDefaultChatMessage(activeLang),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ])
  );
  const [notifications, setNotifications] = useState(() => readStore(`${prefix}_notifications`, []));
  const [isSending, setIsSending] = useState(false);
  const [aiError, setAiError] = useState(null);

  // Sync state whenever active user prefix changes
  useEffect(() => {
    setMedicines(readStore(`${prefix}_medicines`, []));
    setAppointments(readStore(`${prefix}_appointments`, []));
    setMemories(readStore(`${prefix}_memories`, []));
    setChat(
      readStore(`${prefix}_chat`, [
        {
          id: 1,
          role: "assistant",
          text: getDefaultChatMessage(activeLang),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ])
    );
    setNotifications(readStore(`${prefix}_notifications`, []));
  }, [prefix]);

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
      text: `${medicine.name} (${medicine.dosage}) added to your schedule.`,
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
          message: `Here are the user's current application records. Treat them as the only source of truth for personal records:\n${records}\n\nUser Preferred Language: ${activeLang}.\nCRITICAL INSTRUCTION: You must respond fluently and naturally entirely in ${activeLang}.\n\nUser question:\n${clean}`,
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
