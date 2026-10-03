import { Mic, Send, Sparkles, Volume2, Trash2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import RoleBadge from "../components/common/RoleBadge";

const roleSuggestions = {
  elderly: [
    "Did I take my blood pressure medicine today?",
    "When is my next doctor appointment?",
    "What did I do this morning?",
    "Who is my caregiver and how do I contact them?",
  ],
  young_professional: [
    "What are my scheduled wellness routines today?",
    "When is my next appointment?",
    "Summarize my recent memory logs",
    "Did I log my afternoon hydration & vitamins?",
  ],
  caregiver: [
    "Has the patient taken their morning medicine?",
    "What is the patient's next scheduled doctor appointment?",
    "Show a summary of today's logged activities",
    "Who are the registered emergency contacts?",
  ],
  emergency_contact: [
    "What is the patient's current emergency status?",
    "What medicines is the patient currently taking?",
    "Who is the primary doctor and hospital?",
    "What were the patient's latest logged activities?",
  ],
};

export default function Assistant() {
  const { chat = [], sendMessage, clearChat, isSending, apiUrl } = useApp();
  const { user, role, isReadOnly } = useAuth();
  const [message, setMessage] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const bottomRef = useRef(null);

  const activeRole = role || user?.role || "elderly";
  const suggestions = roleSuggestions[activeRole] || roleSuggestions.elderly;

  useEffect(() => {
    try {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch {
      // Fallback
    }
  }, [chat, isSending]);

  const submit = (e) => {
    e?.preventDefault();
    if (!isSending && message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  const startListening = () => {
    setVoiceError("");
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice speech recognition is not supported in this browser.");
      setTimeout(() => setVoiceError(""), 4000);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-IN";
      recognition.interimResults = false;
      recognition.onstart = () => setListening(true);
      recognition.onend = () => setListening(false);
      recognition.onerror = (err) => {
        setListening(false);
        setVoiceError(`Voice input error: ${err.error || "Permission denied or unavailable"}`);
        setTimeout(() => setVoiceError(""), 4000);
      };
      recognition.onresult = (e) => {
        const transcript = e.results?.[0]?.[0]?.transcript || "";
        if (transcript) {
          setMessage(transcript);
        }
      };
      recognition.start();
    } catch (err) {
      setListening(false);
      setVoiceError("Could not start microphone.");
    }
  };

  const speak = (text) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95; // slightly calmer rate for elderly
      window.speechSynthesis.speak(utterance);
    }
  };

  const safeChat = Array.isArray(chat) ? chat : [];

  return (
    <div className="assistant-page">
      <div className="page-heading-row">
        <div className="page-heading">
          <div className="eyebrow">AI COMPANION</div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
            <h1 style={{ margin: 0 }}>AI Assistant</h1>
            <RoleBadge role={activeRole} />
          </div>
          <p>Ask about your memories, medicines, appointments or daily routine in plain language.</p>
        </div>
      </div>

      {voiceError && (
        <div className="error-note" style={{ marginBottom: "15px" }}>
          <AlertCircle size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
          {voiceError}
        </div>
      )}

      <div className="assistant-layout">
        <div className="chat-panel">
          <div className="chat-header">
            <div className="assistant-avatar">
              <Sparkles size={19} />
            </div>
            <div>
              <strong>MemoMind Assistant</strong>
              <span>
                {isSending
                  ? "Thinking & analyzing records…"
                  : `Powered by FastAPI Backend (${apiUrl})`}
              </span>
            </div>
            <span className="online-dot" title="Service active" />
          </div>

          <div className="chat-messages">
            {safeChat.length === 0 && (
              <div className="empty-state">
                <Sparkles size={28} style={{ color: "var(--green-700)", margin: "0 auto 8px" }} />
                <p>
                  Start a conversation with MemoMind. Try clicking one of the suggested questions on the right.
                </p>
              </div>
            )}

            {safeChat.map((m) => (
              <div
                className={`message-row ${m.role === "user" ? "user" : "assistant"} ${m.isError ? "error-bubble" : ""}`}
                key={m.id || Math.random()}
              >
                <div className="message-avatar">
                  {m.role === "assistant" ? "✦" : (user?.name?.[0] || "ME").toUpperCase()}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {m.text}
                  </div>
                  <span className="message-time">{m.time || "Just now"}</span>
                  {m.role === "assistant" && (
                    <button
                      type="button"
                      className="message-speak"
                      onClick={() => speak(m.text)}
                      title="Read aloud"
                    >
                      <Volume2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="message-row assistant">
                <div className="message-avatar">✦</div>
                <div className="message-content">
                  <div className="message-bubble typing">
                    MemoMind is checking your records…
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form className="chat-input" onSubmit={submit}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask a question about medicines, appointments, or memories…"
              disabled={isSending}
            />
            <button
              type="button"
              className={`voice-input ${listening ? "listening" : ""}`}
              onClick={startListening}
              title={listening ? "Listening... click to stop" : "Voice input"}
            >
              <Mic size={18} />
            </button>
            <button
              type="submit"
              className="send-btn"
              disabled={isSending || !message.trim()}
              title="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>

        <aside className="assistant-side">
          <div className="side-section">
            <div className="side-title-row">
              <h3>Try asking</h3>
              {safeChat.length > 0 && !isReadOnly && (
                <button type="button" className="text-btn" onClick={clearChat}>
                  <Trash2 size={13} /> Clear
                </button>
              )}
            </div>
            {suggestions.map((q) => (
              <button
                key={q}
                type="button"
                className="suggestion"
                onClick={() => sendMessage(q)}
                disabled={isSending}
              >
                <span>{q}</span>
                <span>→</span>
              </button>
            ))}
          </div>

          <div className="voice-card">
            <div className="voice-icon">
              <Volume2 size={20} />
            </div>
            <strong>Voice Assistant</strong>
            <p>
              Speak naturally using your microphone. MemoMind converts your speech to text and can read answers aloud.
            </p>
            <button
              type="button"
              className="btn btn-primary btn-full"
              onClick={startListening}
            >
              <Mic size={16} /> {listening ? "Listening…" : "Start Speaking"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
