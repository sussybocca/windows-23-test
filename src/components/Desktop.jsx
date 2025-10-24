import React, { useState, useEffect } from "react";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";
import Settings from "../apps/Settings";
import Explorer from "../apps/Explorer";
import Search from "./Search";
import AppWindow from "./AppWindow";
import localforage from "localforage";

// Built-in apps
const builtInApps = [
  { name: "Calculator", icon: "🧮", component: <Calculator /> },
  { name: "Notes", icon: "📝", component: <Notes /> },
  { name: "Settings", icon: "⚙️", component: <Settings /> },
  { name: "Explorer", icon: "🗂️", component: <Explorer /> },
];

export default function Desktop() {
  const [openApps, setOpenApps] = useState([]);
  const [customApps, setCustomApps] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);

  // Load custom apps from localforage on mount
  useEffect(() => {
    localforage.getItem("customApps").then((apps) => {
      if (apps) {
        setCustomApps(apps);
      }
    });
  }, []);

  // Combine built-in and custom apps
  const appsList = [...builtInApps, ...customApps];

  const openApp = (app) => {
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

      {/* Search App */}
      {searchOpen && (
        <AppWindow
          title="Search"
          zIndex={openApps.length + 1}
          onClose={() => setSearchOpen(false)}
        >
          <Search />
        </AppWindow>
      )}
    </div>
  );
}
