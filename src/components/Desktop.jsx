import React from "react";
import { useDesktopStore } from "../store/desktopStore";
import AppWindow from "./AppWindow";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";

export default function Desktop() {
  const { openApps, openApp, closeApp, focusApp } = useDesktopStore();

  return (
    <div className="desktop">
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
        </AppWindow>
      ))}

      {/* App icons */}
      <div className="app-icons">
        <div onClick={() => openApp({ name: "Calculator", component: "Calculator" })}>🧮 Calculator</div>
        <div onClick={() => openApp({ name: "Notes", component: "Notes" })}>📝 Notes</div>
      </div>
    </div>
  );
}
