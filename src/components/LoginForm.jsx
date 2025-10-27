import { useState, useEffect } from "react";
import localforage from "localforage";

export default function LoginForm({ onLogin }) {
  const [identifier, setIdentifier] = useState(""); // email or username
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState({});

  // Load optional Netlify env vars
  useEffect(() => {
    const loadEnv = async () => {
      try {
        const res = await fetch("/.netlify/functions/env");
        const data = await res.json();
        if (data.success) {
          setEnv(data.env);
        }
      } catch (err) {
        console.warn("⚠️ Could not load environment variables.");
      }
    };
    loadEnv();
  }, []);

  const handleLogin = async () => {
    if (!identifier || !password) {
      setMessage("⚠️ Please enter both username/email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const users = (await localforage.getItem("users")) || [];

      const user = users.find(
        (u) =>
          (u.email.toLowerCase() === identifier.toLowerCase() ||
            u.username.toLowerCase() === identifier.toLowerCase()) &&
          u.password === password
      );

      if (user) {
        setMessage(`✅ Welcome back, ${user.username}!`);
        onLogin(user);
      } else {
        setMessage("❌ Invalid credentials. Try again.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-form"
      style={{
        textAlign: "center",
        marginTop: "60px",
        background: "rgba(0, 0, 0, 0.7)",
        color: "#fff",
        padding: "30px",
        borderRadius: "10px",
        width: "350px",
        marginLeft: "auto",
        marginRight: "auto",
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.2)",
      }}
    >
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

      <button
        onClick={handleLogin}
        disabled={loading}
        style={buttonStyle}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {message && (
        <p
          style={{
            marginTop: "15px",
            fontSize: "14px",
            color: message.startsWith("✅") ? "#0f0" : "#ff5555",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

// Shared styles
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
