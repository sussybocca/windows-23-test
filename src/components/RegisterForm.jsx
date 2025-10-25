import { useState, useEffect } from "react";
import nodemailer from "nodemailer";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);
  const [env, setEnv] = useState(null);

  // ✅ Load Netlify secrets
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

  // 🔹 Send email via Nodemailer
  const sendVerificationEmail = async (toEmail, verificationCode) => {
    if (!env?.EMAIL_USER || !env?.EMAIL_PASS) return;

    try {
      const transporter = nodemailer.createTransport({
        service: "gmail", // or your email service
        auth: {
          user: env.EMAIL_USER,
          pass: env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: env.EMAIL_USER,
        to: toEmail,
        subject: "Your Verification Code",
        text: `Hello ${username},\n\nYour verification code is: ${verificationCode}\n\nThis code is valid for one-time use only.`,
      };

      await transporter.sendMail(mailOptions);
      console.log("✅ Verification email sent to", toEmail);
    } catch (err) {
      console.error("❌ Error sending email:", err);
    }
  };

  // 🔹 Handle user registration
  const handleRegister = async () => {
    if (!email || !username) {
      setMessage("Please fill in all fields.");
      return;
    }
    if (!env) {
      setMessage("Server not ready. Please wait...");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Generate random 10-character code
      const codeValue = crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();
      setGeneratedCode(codeValue);

      if (twoStepEnabled) {
        await sendVerificationEmail(email, codeValue);
      }

      // TODO: Save user to Neon DB using env.DATABASE_URL
      console.log(`Saving user: ${email}, ${username}, TwoStep: ${twoStepEnabled}`);

      setStep(2);
      setMessage("✅ Verification code generated! Enter it below.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during registration.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Handle verification
  const handleVerify = () => {
    if (!code) {
      setMessage("Please enter the verification code.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      if (code.toUpperCase() === generatedCode) {
        setMessage("✅ Verified! Welcome.");
        onRegister({ email, username, twoStepEnabled });
      } else {
        setMessage("❌ Verification failed. Check your code.");
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form">
      {!env && <p>Loading server environment...</p>}

      {step === 1 && env && (
        <div>
          <h2>Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
          />
          <div style={{ marginTop: 10 }}>
            <label>
              <input
                type="checkbox"
                checked={twoStepEnabled}
                onChange={() => setTwoStepEnabled((s) => !s)}
                disabled={loading}
              />{" "}
              Enable 2-Step Verification (Optional)
            </label>
          </div>
          <button
            onClick={handleRegister}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Generating..." : "Register / Generate Verification"}
          </button>
        </div>
      )}

      {step === 2 && env && (
        <div>
          <h2>Enter Verification Code</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="text"
            placeholder="Verification code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleVerify}
            disabled={loading}
            style={{ marginTop: 10 }}
          >
            {loading ? "Verifying..." : "Verify & Complete Registration"}
          </button>
          <button
            onClick={() => {
              setStep(1);
              setMessage("");
              setCode("");
            }}
            disabled={loading}
            style={{ marginLeft: 10 }}
          >
            Back
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
