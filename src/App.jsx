import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";     // New login component
import Explorer from "./components/Explorer";       // View other users' servers
import PublicEditor from "./components/PublicEditor"; // Edit/publish OS systems
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null);           // registered/logged-in user
  const [explorerOpen, setExplorerOpen] = useState(false);
  const [editorOpen, setEditorOpen] = useState(false);

  // Called after registration or login
  const handleLoginOrRegister = (loggedUser) => {
    setUser(loggedUser);
    setBootFinished(true);
  };

  return (
    <>
      {/* Show either RegisterForm or LoginForm if no user */}
      {!user && (
        <div>
          <RegisterForm onRegister={handleLoginOrRegister} />
          <LoginForm onLogin={handleLoginOrRegister} />
        </div>
      )}

      {/* Boot screen after login/registration */}
      {user && !bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Main desktop after boot */}
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
