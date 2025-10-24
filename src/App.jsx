import React, { useState } from "react";
import LaunchScreen from "./components/LaunchScreen";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search"; // Optional search component
import "./index.css";

export default function App() {
  const [launchFinished, setLaunchFinished] = useState(false);
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Launch Screen */}
      {!launchFinished && (
        <LaunchScreen onLaunchComplete={() => setLaunchFinished(true)} />
      )}

      {/* Boot Screen */}
      {launchFinished && !bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Main Desktop */}
      {launchFinished && bootFinished && (
        <>
          <Desktop />
          <Cursor />
          {searchOpen && <Search />}
          {/* You can add a button or keyboard shortcut to toggle searchOpen */}
        </>
      )}
    </>
  );
}
