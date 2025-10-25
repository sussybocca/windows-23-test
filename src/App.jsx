import React, { useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import Search from "./components/Search";
import "./index.css";

export default function App() {
  const [launchFinished, setLaunchFinished] = useState(false);
  const [bootFinished, setBootFinished] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Launch Screen */}
      {!launchFinished && (
        <LaunchScreen onFinish={() => setLaunchFinished(true)} />
      )}

      {/* Boot screen */}
      {launchFinished && !bootFinished && (
        <BootScreen onFinish={() => setBootFinished(true)} />
      )}

      {/* Main desktop */}
      {launchFinished && bootFinished && (
        <>
          <Desktop />
          <Cursor />
          {searchOpen && <Search />}
        </>
      )}
    </>
  );
}
