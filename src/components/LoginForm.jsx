import { useState, useEffect } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState(null);

  // Load Netlify secrets
  useEffect(() => {
    const loadEnv = async () => {
      try {
        const res = await fetch("/.netlify/functions/env");
        const data = await res.json();
        if (data.success) {
          setEnv(data.env);
        } else {
          setMessage("⚠️ Unable to load server environment.");
        }
      } catch (err) {
        console.error(err);
        setMessage("⚠️ Error loading server environment.");
      }
    };
    loadEnv();
  }, []);

  const handleLogin = async () => {
    if (!email) {
      setMessage("Please enter your email.");
      return;
    }
    if (!env) {
      setMessage("Server not ready. Please wait...");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Call a Netlify function that checks if the email exists in Neon DB
      const res = await fetch("/.netlify/functions/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok && data.exists) {
        setMessage(`✅ Welcome back, ${email}!`);
        onLogin({ email });
      } else {
        setMessage("❌ Email not registered.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      {!env && <p>Loading server environment...</p>}
      {env && (
        <>
          <h2>Login</h2>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {message && <p style={{ marginTop: 10 }}>{message}</p>}
        </>
      )}
    </div>
  );
}

