import React, { useEffect, useState } from "react";

export default function Cursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Hide the regular cursor
    document.body.style.cursor = "none";

    const moveCursor = (e) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.style.cursor = "auto"; // restore cursor if unmounted
    };
  }, []);

  return (
    <div
      className="custom-cursor"
      style={{
        left: pos.x + "px",
        top: pos.y + "px",
        position: "fixed",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        fontSize: "32px",
        zIndex: 9999,
      }}
    >
      🖱️
    </div>
  );
}
