import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FiSend, FiMic, FiImage } from "react-icons/fi";

// Glassmorphism container style
const glassStyle = {
  background: "rgba(255,255,255,0.12)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.20)",
  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.05)",
};

// Convert any message content to safe string
const toSafeString = (val) => {
  if (typeof val === "string") return val;
  if (val === null || val === undefined) return "";
  if (React.isValidElement(val)) return "[React element]";
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
};

// Chat bubble
const ChatBubble = ({ sender, text }) => (
  <div
    style={{
      ...glassStyle,
      alignSelf: sender === "user" ? "flex-end" : "flex-start",
      margin: "10px 0",
      padding: "14px 20px",
      borderRadius: "14px",
      maxWidth: "70%",
      color: sender === "user" ? "white" : "#1f2937", // dark gray text for bot
      background:
        sender === "user"
          ? "rgba(30, 58, 138, 0.85)" // navy blue for user
          : "rgba(243, 244, 246, 0.8)", // light gray for bot
      fontSize: "1rem",
      wordBreak: "break-word",
      whiteSpace: "pre-line",
      boxShadow:
        sender === "user" ? "0 4px 8px rgba(30,58,138,0.2)" : "none",
    }}
  >
    {sender === "bot" ? (
      <ReactMarkdown>{toSafeString(text)}</ReactMarkdown>
    ) : (
      toSafeString(text)
    )}
  </div>
);

// Loader spinner
const Loader = () => (
  <div
    style={{
      width: 28,
      height: 28,
      margin: "16px auto",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        border: "4px solid #eee",
        borderTop: "4px solid #2563eb", // blue
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`@keyframes spin {0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}
    </style>
  </div>
);

export default function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [voiceActive, setVoiceActive] = useState(false);

  const recognitionRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const rec = new window.webkitSpeechRecognition();
      rec.lang = "en-US";
      rec.continuous = false;
      rec.interimResults = false;
      rec.onstart = () => setVoiceActive(true);
      rec.onend = () => setVoiceActive(false);
      rec.onerror = () => setVoiceActive(false);
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        handleTextSend(transcript);
      };
      recognitionRef.current = rec;
    }
  }, []);

  const appendMessage = (sender, text) =>
    setMessages((prev) => [...prev, { sender, text: toSafeString(text) }]);

  const handleTextSend = async (overrideText) => {
    if (
      overrideText &&
      typeof overrideText === "object" &&
      !(overrideText instanceof String)
    )
      return;
    const msg = overrideText !== undefined ? overrideText : text;
    const msgStr = toSafeString(msg);
    if (!msgStr.trim()) return;

    appendMessage("user", msgStr);
    if (overrideText === undefined) setText("");

    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("text", msgStr);
      const res = await fetch("/chat/", { method: "POST", body: params });
      const data = await res.json();
      appendMessage("bot", data.reply || "No reply from server.");
    } catch {
      appendMessage("bot", "Error contacting server.");
    }
    setLoading(false);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(URL.createObjectURL(file));
    appendMessage("user", "[Sent an image]");

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("question", "");
      const res = await fetch("/vision/", { method: "POST", body: formData });
      const data = await res.json();
      appendMessage("bot", data.reply || "No response for image.");
    } catch {
      appendMessage("bot", "Image send failed.");
    }
    setLoading(false);
    e.target.value = null;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleTextSend();
    }
  };

  const handleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition not supported");
      return;
    }
    if (voiceActive) recognitionRef.current.stop();
    else recognitionRef.current.start();
  };

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        position: "fixed",
        top: 0,
        left: 0,
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          ...glassStyle,
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          borderRadius: 0, // full screen fill
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            color: "#1e40af", // dark blue
            fontSize: "2rem",
            fontWeight: 700,
            padding: "20px 0",
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          🩺 MedAssist: A Medical Chatbot
        </div>

        {/* Chat area */}
        <div
          ref={chatRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((m, i) => (
            <ChatBubble key={i} sender={m.sender} text={m.text} />
          ))}
          {loading && <Loader />}
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "15px",
            background: "rgba(255,255,255,0.15)",
            borderTop: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <textarea
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your medical question..."
            style={{
              flex: 1,
              borderRadius: 14,
              border: "none",
              padding: "12px 15px",
              fontSize: "1rem",
              background: "rgba(255,255,255,0.8)",
              outline: "none",
              resize: "none",
            }}
          />
          <button
            onClick={() => handleTextSend()}
            disabled={!text.trim()}
            style={{
              color: "#fff",
              background: text.trim() ? "#2563eb" : "#9ca3af",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: text.trim() ? "pointer" : "not-allowed",
            }}
          >
            <FiSend />
          </button>
          <button
            onClick={handleVoice}
            style={{
              color: "#fff",
              background: voiceActive ? "#b91c1c" : "#2563eb",
              border: "none",
              borderRadius: "50%",
              width: 44,
              height: 44,
              fontSize: 22,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiMic />
          </button>
          <label
            htmlFor="image-upload"
            style={{
              background: "#2563eb",
              borderRadius: "50%",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              cursor: "pointer",
            }}
          >
            <FiImage />
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
        </div>

        {image && (
          <div style={{ textAlign: "center", padding: "8px" }}>
            <img
              src={image}
              alt="Selected"
              style={{
                maxHeight: 100,
                borderRadius: 12,
                boxShadow: "0 0 6px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            color: "#6b7280",
            fontSize: 12,
            padding: "10px 0",
            userSelect: "none",
          }}
        >
          For informational purposes only. Not medical advice.
        </div>
      </div>
    </div>
  );
}
