import React, { useState } from "react";
import Calculator from "../apps/Calculator";
import Notes from "../apps/Notes";

const appsList = [
  { name: "Calculator", icon: "🧮", component: <Calculator /> },
  { name: "Notes", icon: "📝", component: <Notes /> },
];

export default function Desktop() {
  const [openApp, setOpenApp] = useState(null);

  return (
    <div className="desktop">
      {appsList.map((app) => (
        <div
          key={app.name}
          className="app-icon"
          onClick={() => setOpenApp(app.component)}
        >
          <span>{app.icon}</span>
          <span style={{ fontSize: "14px", marginTop: "5px" }}>{app.name}</span>
        </div>
      ))}

      <div style={{ position: "absolute", top: 100, left: 100 }}>
        {openApp}
      </div>
    </div>
  );
}
