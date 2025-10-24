import React, { useState } from "react";
import Desktop from "./components/Desktop";
import Cursor from "./components/Cursor";
import BootScreen from "./components/BootScreen";
import "./index.css";

export default function App() {
  const [bootFinished, setBootFinished] = useState(false);

  return (
    <>
      {!bootFinished && <BootScreen onFinish={() => setBootFinished(true)} />}
      {bootFinished && (
        <>
          <Desktop />
          <Cursor />
        </>
      )}
    </>
  );
}
