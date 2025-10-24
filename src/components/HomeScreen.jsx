import React, { useState, useEffect } from "react";
import AppWindow from "./AppWindow";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";
import AnimatedApp from "../apps/AnimatedApp";
import CodeEditorApp from "../apps/CodeEditorApp";
import localforage from "localforage";

const appsList = [
  { name: "Calculator", icon: "🧮", component: <Calculator /> },
  { name: "Notes", icon: "📝", component: <Notes /> },
  { name: "AnimatedApp", icon: "✨", component: <AnimatedApp /> },
  { name: "CodeEditor", icon: "💻", component: <CodeEditorApp /> },
];

export default function HomeScreen() {
  const [openApps, setOpenApps] = useState([]);
  const [customApps, setCustomApps] = useState([]);

  useEffect(() => {
    localforage.getItem("customApps").then((apps) => {
      if (apps) setCustomApps(apps);
    });
  }, []);

  const openApp = (app) => {
    if (!openApps.some((a) => a.name === app.name)) setOpenApps([...openApps, app]);
  };

  const closeApp = (appName) => {
    setOpenApps(openApps.filter((a) => a.name !== appName));
  };

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {appsList.concat(customApps).map((app) => (
        <div key={app.name} onClick={() => openApp(app)} style={{ cursor: "pointer", display: "inline-block", margin: 20, textAlign: "center" }}>
          <span style={{ fontSize: "32px" }}>{app.icon}</span>
          <div style={{ fontSize: "14px", marginTop: 5 }}>{app.name}</div>
        </div>
      ))}

      {openApps.map((app, idx) => (
        <AppWindow key={app.name} title={app.name} zIndex={idx + 1} onClose={() => closeApp(app.name)}>
          {app.component}
        </AppWindow>
      ))}
    </div>
  );
}
