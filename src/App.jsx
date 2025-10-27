import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Explorer from "./components/Explorer";
import PublicEditor from "./components/PublicEditor";
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  const [activeForm, setActiveForm] = useState(null); // "register" | "login" | null

  const handleLoginOrRegister = (loggedUser) => {
    setUser(loggedUser);
    setBootFinished(true);
  };

  // Show selection buttons if user is not logged in and no form is active
  if (!user && !activeForm) {
    return (
      <div className="auth-selection" style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Welcome to WebBro OS</h2>
        <div style={{ marginTop: "20px" }}>
          <button onClick={() => setActiveForm("register")} style={{ marginRight: "20px", padding: "10px 20px", fontSize: "16px" }}>
            Register
          </button>
          <button onClick={() => setActiveForm("login")} style={{ padding: "10px 20px", fontSize: "16px" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Show active form if user selected one */}
      {!user && activeForm === "register" && (
        <RegisterForm onRegister={handleLoginOrRegister} />
      )}
      {!user && activeForm === "login" && (
        <LoginForm onLogin={handleLoginOrRegister} />
      )}

      {/* Boot screen */}
      {user && !bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Main desktop */}
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
