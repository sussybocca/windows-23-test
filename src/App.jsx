import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm";
import Explorer from "./components/Explorer";         // New: view other users' servers
import PublicEditor from "./components/PublicEditor"; // New: edit/publish OS systems
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null); // registered/logged-in user
  const [explorerOpen, setExplorerOpen] = useState(false); // toggle Explorer
  const [editorOpen, setEditorOpen] = useState(false);     // toggle PublicEditor

  // Handler when registration is complete
  const handleRegister = (registeredUser) => {
    setUser(registeredUser); // save user info
    setBootFinished(true);   // move to boot screen
  };

  return (
    <>
      {/* Registration screen */}
      {!user && <RegisterForm onRegister={handleRegister} />}

      {/* Boot screen after registration */}
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
            <Explorer
              user={user}
              onClose={() => setExplorerOpen(false)}
            />
          )}
          {editorOpen && (
            <PublicEditor
              user={user}
              onClose={() => setEditorOpen(false)}
            />
          )}
        </>
      )}
    </>
  );
}
