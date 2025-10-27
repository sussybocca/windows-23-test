import { useState } from "react";
import { initSupabase } from "../lib/supabaseClient";

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setMessage("⚠️ Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const supabase = initSupabase();
      if (!supabase) throw new Error("Supabase client not initialized");

      // Call a serverless function that handles password verification
      const res = await fetch("/.netlify/functions/loginUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Login failed"}`);
        return;
      }

      setMessage(`✅ Welcome back, ${data.username}!`);
      onLogin(data);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: "20px" }}>Login to WebBro OS</h2>

      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        disabled={loading}
        style={inputStyle}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
        style={inputStyle}
      />

      <button onClick={handleLogin} disabled={loading} style={buttonStyle}>
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && <p style={messageStyle(message)}>{message}</p>}
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  marginTop: "60px",
  background: "rgba(0,0,0,0.7)",
  color: "#fff",
  padding: "30px",
  borderRadius: "10px",
  width: "350px",
  marginLeft: "auto",
  marginRight: "auto",
  boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
};

const inputStyle = {
  display: "block",
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#111",
  color: "#fff",
  outline: "none",
};

const buttonStyle = {
  padding: "10px 20px",
  background: "cyan",
  color: "#000",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const messageStyle = (msg) => ({
  marginTop: "15px",
  fontSize: "14px",
  color: msg.startsWith("✅") ? "#0f0" : "#ff5555",
});
