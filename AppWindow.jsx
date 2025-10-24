import React, { useState } from "react";
import { Rnd } from "react-rnd";
import { motion } from "framer-motion";
import { AiOutlineClose, AiOutlineMinus, AiOutlineBorder } from "react-icons/ai";

export default function AppWindow({ title, children, defaultSize = { width: 400, height: 300 }, zIndex, onClose, onFocus }) {
  const [minimized, setMinimized] = useState(false);
  const [maximized, setMaximized] = useState(false);

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: defaultSize.width,
        height: defaultSize.height
      }}
      bounds="window"
      dragHandleClassName="app-header"
      style={{ zIndex }}
      enableResizing={!maximized}
    >
      <motion.div
        className="app-window"
        layout
        onMouseDown={onFocus}
        style={{
          display: minimized ? "none" : "flex",
          flexDirection: "column",
          background: "#1e1e1e",
          border: "2px solid #555",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <div className="app-header" style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", cursor: "grab", background: "#333", color: "#fff" }}>
          <span>{title}</span>
          <div className="app-controls" style={{ display: "flex", gap: 8 }}>
            <AiOutlineMinus onClick={() => setMinimized(!minimized)} />
            <AiOutlineBorder onClick={() => setMaximized(!maximized)} />
            <AiOutlineClose onClick={onClose} />
          </div>
        </div>
        <div className="app-body" style={{ flex: 1, padding: 8 }}>
          {children}
        </div>
      </motion.div>
    </Rnd>
  );
}
