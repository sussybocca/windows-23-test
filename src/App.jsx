import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import RegisterForm from "./components/RegisterForm"; // import your register form
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [user, setUser] = useState(null); // will hold the registered/logged-in user

  // Handler when registration is complete
  const handleRegister = (registeredUser) => {
    setUser(registeredUser); // save user info
    setBootFinished(true);   // move to boot screen
  };

  return (
    <>
      {/* Show register form if user is not registered */}
      {!user && <RegisterForm onRegister={handleRegister} />}

      {/* Boot screen */}
      {user && !bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Main desktop */}
      {user && bootFinished && (
        <>
          <Desktop />
          <Cursor />
          {searchOpen && <Search />}
        </>
      )}
    </>
  );
}
