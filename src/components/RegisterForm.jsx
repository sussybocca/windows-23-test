import { useState } from "react";
import localforage from "localforage";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);

  // Generate a 10-character verification code
  const generateCode = () =>
    crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();

  const handleRegister = async () => {
    if (!email || !username || !password || !confirm) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }

    if (password !== confirm) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const users = (await localforage.getItem("users")) || [];

      const userExists = users.some(
        (u) => u.email === email || u.username === username
      );
      if (userExists) {
        setMessage("⚠️ That username or email is already registered.");
        setLoading(false);
        return;
      }

      const codeValue = generateCode();
      setGeneratedCode(codeValue);

      if (twoStepEnabled) {
        // Optional 2-Step: Email verification (Netlify function)
        const res = await fetch("/.netlify/functions/sendVerification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, username, code: codeValue }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          setMessage(`❌ Failed to send verification email: ${data.error}`);
          setLoading(false);
          return;
        }
      }

      setStep(2);
      setMessage("✅ Verification code generated! Enter it below.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code) {
      setMessage("⚠️ Please enter your verification code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (code.toUpperCase() === generatedCode) {
        const newUser = {
          email,
          username,
          password, // 🔒 You can hash later if needed
          twoStepEnabled,
        };

        const users = (await localforage.getItem("users")) || [];
        await localforage.setItem("users", [...users, newUser]);

        setMessage("✅ Verified & Registered! Welcome aboard 🚀");
        onRegister(newUser);
      } else {
        setMessage("❌ Incorrect verification code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-form"
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
      {step === 1 && (
        <div>
          <h2 style={{ marginBottom: "20px" }}>Register for WebBro OS</h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <div style={{ marginTop: 10, fontSize: "14px" }}>
            <label>
              <input
                type="checkbox"
                checked={twoStepEnabled}
                onChange={() => setTwoStepEnabled((s) => !s)}
                disabled={loading}
              />{" "}
              Enable 2-Step Email Verification
            </label>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Generating..." : "Generate Verification Code"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter Verification Code</h2>
          <p style={{ fontSize: "14px" }}>
            Check your email (if enabled) or enter the code displayed.
          </p>

          <input
            type="text"
            placeholder="Verification Code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
            style={inputStyle}
          />

          <div style={{ marginTop: "15px" }}>
            <button
              onClick={handleVerify}
              disabled={loading}
              style={buttonStyle}
            >
              {loading ? "Verifying..." : "Verify & Register"}
            </button>
            <button
              onClick={() => {
                setStep(1);
                setMessage("");
                setCode("");
              }}
              disabled={loading}
              style={{ ...buttonStyle, background: "#444", marginLeft: "10px" }}
            >
              Back
            </button>
          </div>
        </div>
      )}

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

// Reusable inline styles
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
