import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext(null);

const initialMedicines = [
  {
    id: 1,
    name: "Blood Pressure Medicine",
    dosage: "1 tablet",
    frequency: "Once daily",
    time: "10:00 AM",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    reminderEnabled: true,
    notes: "Take after breakfast.",
    status: "taken",
    takenAt: "10:04 AM",
  },
  {
    id: 2,
    name: "Diabetes Medicine",
    dosage: "1 tablet",
    frequency: "Twice daily",
    time: "8:00 PM",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    reminderEnabled: true,
    notes: "",
    status: "upcoming",
  },
  {
    id: 3,
    name: "Vitamin D",
    dosage: "1 tablet",
    frequency: "Once daily",
    time: "8:00 PM",
    startDate: "2024-09-01",
    endDate: "2024-12-31",
    reminderEnabled: true,
    notes: "",
    status: "upcoming",
  },
];

const initialAppointments = [
  {
    id: 1,
    title: "Doctor Appointment",
    doctorName: "Dr. Sharma",
    specialization: "General Physician",
    hospital: "City Hospital",
    phone: "+91 98765 43210",
    date: "2024-09-09",
    time: "11:30 AM",
    location: "City Hospital",
    reminder: "30 minutes before",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Dentist Appointment",
    doctorName: "Dr. Mehta",
    specialization: "Dentist",
    hospital: "Smile Dental Clinic",
    phone: "+91 98765 00000",
    date: "2024-09-12",
    time: "10:00 AM",
    location: "Smile Dental Clinic",
    reminder: "1 hour before",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Eye Checkup",
    doctorName: "Dr. Patel",
    specialization: "Ophthalmologist",
    hospital: "Eye Care Centre",
    phone: "+91 98765 11111",
    date: "2024-09-18",
    time: "4:00 PM",
    location: "Eye Care Centre",
    reminder: "1 hour before",
    status: "upcoming",
  },
];

const initialMemories = [
  { id: 1, time: "08:00", title: "Breakfast at home", type: "routine", icon: "Coffee" },
  { id: 2, time: "10:04", title: "Medicine taken — Blood Pressure Medicine", type: "medicine", icon: "Pill" },
  { id: 3, time: "11:30", title: "Doctor appointment — Dr. Sharma", type: "appointment", icon: "CalendarDays" },
  { id: 4, time: "15:00", title: "Met Rahul", type: "person", icon: "Users" },
  { id: 5, time: "19:00", title: "Dinner with family", type: "memory", icon: "Utensils" },
];

const initialChat = [
  { id: 1, role: "user", text: "Did I take my medicine today?", time: "10:24 AM" },
  { id: 2, role: "assistant", text: "Yes, you took your Blood Pressure Medicine at 10:04 AM. Your next medicine is scheduled for 8:00 PM.", time: "10:24 AM" },
  { id: 3, role: "user", text: "What's my next appointment?", time: "10:25 AM" },
  { id: 4, role: "assistant", text: "You have a Doctor Appointment tomorrow at 11:30 AM with Dr. Sharma at City Hospital.", time: "10:25 AM" },
];

export function AppProvider({ children }) {
  const [medicines, setMedicines] = useState(initialMedicines);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [memories, setMemories] = useState(initialMemories);
  const [chat, setChat] = useState(initialChat);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your Diabetes Medicine is due at 8:00 PM.", type: "medicine", read: false },
    { id: 2, text: "Doctor appointment tomorrow at 11:30 AM.", type: "appointment", read: false },
  ]);

  const addMedicine = (medicine) => {
    setMedicines((prev) => [
      ...prev,
      { ...medicine, id: Date.now(), status: "upcoming" },
    ]);
  };

  const markMedicineTaken = (id) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: "taken", takenAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
          : m
      )
    );
  };

  const addAppointment = (appointment) => {
    setAppointments((prev) => [...prev, { ...appointment, id: Date.now(), status: "upcoming" }]);
  };

  const addMemory = (memory) => {
    setMemories((prev) => [...prev, { ...memory, id: Date.now(), type: "memory" }]);
  };

  const sendMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setChat((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text, time: now },
      {
        id: Date.now() + 1,
        role: "assistant",
        text: getDemoResponse(text, medicines, appointments),
        time: now,
      },
    ]);
  };

  const value = useMemo(
    () => ({
      medicines,
      appointments,
      memories,
      chat,
      notifications,
      addMedicine,
      markMedicineTaken,
      addAppointment,
      addMemory,
      sendMessage,
      setNotifications,
    }),
    [medicines, appointments, memories, chat, notifications]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function getDemoResponse(text, medicines, appointments) {
  const q = text.toLowerCase();
  if (q.includes("medicine") || q.includes("medication")) {
    const taken = medicines.find((m) => m.status === "taken");
    return taken
      ? `Yes. You took ${taken.name} at ${taken.takenAt}.`
      : "I don't have a medicine marked as taken today.";
  }
  if (q.includes("appointment") || q.includes("doctor")) {
    const next = appointments.find((a) => a.status === "upcoming");
    return next
      ? `Your next appointment is ${next.title} at ${next.time} with ${next.doctorName} at ${next.hospital}.`
      : "You don't have any upcoming appointments.";
  }
  return "I'm your MemoMind demo assistant. Later, this response will come from the FastAPI backend and LLM.";
}

export function useApp() {
  return useContext(AppContext);
}
