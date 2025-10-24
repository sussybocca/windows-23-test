import React, { useState } from "react";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";
import Settings from "../apps/Settings";
import Explorer from "../apps/Explorer";
import AppWindow from "./AppWindow"; // Ensure path is correct

const appsList = [
  { name: "Calculator", icon: "🧮", component: <Calculator /> },
  { name: "Notes", icon: "📝", component: <Notes /> },
  { name: "Settings", icon: "⚙️", component: <Settings /> },
  { name: "Explorer", icon: "🗂️", component: <Explorer /> },
];

export default function Desktop() {
  const [openApps, setOpenApps] = useState([]);

  const openApp = (app) => {
    // Avoid opening duplicate apps
    if (!openApps.some((a) => a.name === app.name)) {
      setOpenApps([...openApps, app]);
    }
  };

  const closeApp = (appName) => {
    setOpenApps(openApps.filter((a) => a.name !== appName));
  };

  return (
    <div
      className="desktop"
      style={{ width: "100vw", height: "100vh", position: "relative" }}
    >
      {/* App Icons */}
      {appsList.map((app) => (
        <div
          key={app.name}
          className="app-icon"
          onClick={() => openApp(app)}
          style={{
            cursor: "pointer",
            display: "inline-block",
            margin: 20,
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "32px" }}>{app.icon}</span>
          <div style={{ fontSize: "14px", marginTop: 5 }}>{app.name}</div>
        </div>
      ))}

      {/* Open Apps */}
      {openApps.map((app, index) => (
        <AppWindow
          key={app.name}
          title={app.name}
          zIndex={index + 1}
          onClose={() => closeApp(app.name)}
        >
          {app.component}
        </AppWindow>
      ))}
    </div>
  );
}
