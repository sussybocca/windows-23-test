import React, { useState } from "react";
import AppWindow from "./AppWindow";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";
import BackgroundApp from "../apps/BackgroundApp";

export default function Desktop() {
  const { openApps, openApp, closeApp, focusApp } = useDesktopStore();
  const [desktopBackground, setDesktopBackground] = useState("#1e1e1e");

  return (
    <div
      className="desktop"
      style={{
        width: "100vw",
        height: "100vh",
        background: `url(${desktopBackground}) center/cover no-repeat`,
        position: "relative",
      }}
    >
      {/* Render open apps */}
      {openApps.map((app) => (
        <AppWindow
          key={app.id}
          title={app.name}
          zIndex={app.zIndex}
          onClose={() => closeApp(app.id)}
          onFocus={() => focusApp(app.id)}
        >
          {app.component === "Calculator" && <Calculator />}
          {app.component === "Notes" && <Notes />}
          {app.component === "BackgroundApp" && (
            <BackgroundApp setDesktopBackground={setDesktopBackground} />
          )}
        </AppWindow>
      ))}

      {/* App icons */}
      <div
        className="app-icons"
        style={{ position: "absolute", bottom: 20, left: 20, display: "flex", gap: 12 }}
      >
        <div onClick={() => openApp({ name: "Calculator", component: "Calculator" })}>
          🧮 Calculator
        </div>
        <div onClick={() => openApp({ name: "Notes", component: "Notes" })}>📝 Notes</div>
        <div onClick={() => openApp({ name: "Backgrounds", component: "BackgroundApp" })}>
          🖼️ Backgrounds
        </div>
      </div>
    </div>
  );
}
