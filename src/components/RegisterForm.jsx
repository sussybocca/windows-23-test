import { useState } from "react";

export default function RegisterForm({ onRegister }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(false);

  // Generate 10-character verification code in browser
  const generateCode = () => crypto.randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase();

  const handleRegister = async () => {
    if (!email || !username) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const codeValue = generateCode();
      setGeneratedCode(codeValue);

      if (twoStepEnabled) {
        // Call serverless function to send the email
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

      // You can save user to Neon DB here if needed (another serverless function)
      console.log(`Saving user: ${email}, ${username}, 2-Step: ${twoStepEnabled}`);

      setStep(2);
      setMessage("✅ Verification code generated! Enter it below.");
    } catch (err) {
      console.error(err);
      setMessage("❌ Error during registration.");
    } finally {
      setLoading(false);
    }
  };

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
      {step === 1 && (
        <div>
          <h2>Register</h2>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} disabled={loading} />
          <div style={{ marginTop: 10 }}>
            <label>
              <input type="checkbox" checked={twoStepEnabled} onChange={() => setTwoStepEnabled(s => !s)} disabled={loading} /> Enable 2-Step Verification (Optional)
            </label>
          </div>
          <button onClick={handleRegister} disabled={loading} style={{ marginTop: 10 }}>
            {loading ? "Generating..." : "Register / Generate Verification"}
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Enter Verification Code</h2>
          <input type="text" placeholder="Verification code" value={code} onChange={(e) => setCode(e.target.value)} disabled={loading} />
          <button onClick={handleVerify} disabled={loading} style={{ marginTop: 10 }}>
            {loading ? "Verifying..." : "Verify & Complete Registration"}
          </button>
          <button onClick={() => { setStep(1); setMessage(""); setCode(""); }} disabled={loading} style={{ marginLeft: 10 }}>
            Back
          </button>
        </div>
      )}

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}
