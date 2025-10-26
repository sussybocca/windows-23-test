import React, { useState, useEffect } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Explorer from "./components/Explorer";
import PublicEditor from "./components/PublicEditor";
import SubscribePrompt from "./components/SubscribePrompt"; // 🆕 new component
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);
  const [activeForm, setActiveForm] = useState(null); // "register" | "login" | null
  const [showSubscribe, setShowSubscribe] = useState(false); // 🆕 subscribe prompt

  // 🟢 Keep Neon DB alive every 4 minutes
  useEffect(() => {
    const pingNeon = async () => {
      try {
        await fetch("/.netlify/functions/ping-neon");
        console.log("✅ Pinged Neon DB to keep it awake");
      } catch (err) {
        console.warn("⚠️ Failed to ping Neon DB:", err);
      }
    };

    pingNeon(); // Ping immediately when app starts
    const interval = setInterval(pingNeon, 4 * 60 * 1000); // every 4 min

    return () => clearInterval(interval);
  }, []);

  // Called after login or registration
  const handleLoginOrRegister = (loggedUser) => {
    setUser(loggedUser);
    if (activeForm === "register") {
      setShowSubscribe(true);
    } else {
      setBootFinished(true);
    }
  };

  // After user subscribes or skips
  const handleSubscribeDone = () => {
    setShowSubscribe(false);
    setBootFinished(true);
  };

  // Show selection buttons if user is not logged in and no form active
  if (!user && !activeForm) {
    return (
      <div
        className="auth-selection"
        style={{ textAlign: "center", marginTop: "50px" }}
      >
        <h2>Welcome to WebBro OS</h2>
        <p style={{ marginBottom: "20px" }}>
          Sign up or log in to access your personal desktop.
        </p>
        <button
          onClick={() => setActiveForm("register")}
          style={{
            marginRight: "20px",
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          Register
        </button>
        <button
          onClick={() => setActiveForm("login")}
          style={{ padding: "10px 20px", fontSize: "16px" }}
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Show registration or login */}
      {!user && activeForm === "register" && (
        <RegisterForm onRegister={handleLoginOrRegister} />
      )}
      {!user && activeForm === "login" && (
        <LoginForm onLogin={handleLoginOrRegister} />
      )}

      {/* Subscription prompt after registration */}
      {user && showSubscribe && (
        <SubscribePrompt user={user} onDone={handleSubscribeDone} />
      )}

      {/* Boot screen */}
      {user && !bootFinished && !showSubscribe && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Desktop */}
      {user && bootFinished && (
        <>
          <Desktop
            onOpenExplorer={() => setExplorerOpen(true)}
            onOpenEditor={() => setEditorOpen(true)}
          />
          <Cursor />
          {searchOpen && <Search />}
          {explorerOpen && (
            <Explorer user={user} onClose={() => setExplorerOpen(false)} />
          )}
          {editorOpen && (
            <PublicEditor user={user} onClose={() => setEditorOpen(false)} />
          )}
        </>
      )}
    </>
  );
}
