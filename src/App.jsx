import React, { useState } from "react";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import BootScreen from "./components/BootScreen";
import Search from "./components/Search"; // New component
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Boot screen */}
      {!bootFinished && <BootScreen onFinish={() => setBootFinished(true)} />}

      {/* Main desktop */}
      {bootFinished && (
        <>
          <Desktop />
          <Cursor />
          {searchOpen && <Search />}
          {/* Optional: a button or keyboard shortcut could toggle searchOpen */}
        </>
      )}
    </>
  );
}
