import { Mic, Send, Sparkles, Volume2 } from "lucide-react";
import { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Assistant() {
  const { chat, sendMessage } = useApp();
  const [message, setMessage] = useState("");

  const submit = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className="assistant-page">
      <div className="page-heading">
        <div className="eyebrow">PERSONAL MEMORY COMPANION</div>
        <h1>AI Assistant</h1>
        <p>Ask about your memories, medicines, appointments or daily routine.</p>
      </div>

      <div className="assistant-layout">
        <div className="chat-panel">
          <div className="chat-header">
            <div className="assistant-avatar"><Sparkles size={19} /></div>
            <div><strong>MemoMind Assistant</strong><span>Ready to help</span></div>
            <span className="online-dot" />
          </div>

          <div className="chat-messages">
            {chat.map((m) => (
              <div className={`message-row ${m.role}`} key={m.id}>
                <div className="message-avatar">{m.role === "assistant" ? "✦" : "JD"}</div>
                <div className="message-content">
                  <div className="message-bubble">{m.text}</div>
                  <span className="message-time">{m.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form className="chat-input" onSubmit={submit}>
            <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message..." />
            <button type="button" className="voice-input"><Mic size={18} /></button>
            <button type="submit" className="send-btn"><Send size={17} /></button>
          </form>
        </div>

        <aside className="assistant-side">
          <h3>Try asking</h3>
          {["Did I take my medicine today?", "What's my next appointment?", "What happened yesterday?", "Who did I meet today?"].map((q) => (
            <button key={q} className="suggestion" onClick={() => sendMessage(q)}>{q}<span>→</span></button>
          ))}
          <div className="voice-card">
            <div className="voice-icon"><Volume2 size={20} /></div>
            <strong>Voice assistant</strong>
            <p>Ask your question using your voice.</p>
            <button className="btn btn-primary btn-full"><Mic size={16} /> Start listening</button>
          </div>
        </aside>
      </div>
    </div>
  );
}
