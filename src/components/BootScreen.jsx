import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSpring, animated, config } from "react-spring";
import localforage from "localforage";

export default function BootScreen({ onFinish }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState([0, 1, 2]);
  const [fadeOut, setFadeOut] = useState(false);

  const stages = [
    { text: "BIOS Loaded...", duration: 6000 },
    { text: "Checking Devices...", duration: 8000 },
    { text: "Loading Kernel...", duration: 12000 },
    { text: "Initializing Services...", duration: 14000 },
    { text: "Starting Desktop Environment...", duration: 16000 },
  ];

  const totalDuration = stages.reduce((acc, s) => acc + s.duration, 0);

  const progressSpring = useSpring({
    width: `${progress}%`,
    config: config.gentle,
  });

  useEffect(() => {
    // Check if boot has already finished
    localforage.getItem("bootFinished").then((finished) => {
      if (finished) {
        onFinish?.();
        return;
      }

      let elapsed = 0;
      const step = 100;
      const interval = setInterval(() => {
        elapsed += step;
        const percent = Math.min((elapsed / totalDuration) * 100, 100);
        setProgress(percent);
        if (elapsed >= totalDuration) clearInterval(interval);
      }, step);

      // Stage transitions
      let time = 0;
      stages.forEach((stage, index) => {
        time += stage.duration;
        setTimeout(() => setStageIndex(index), time);
      });

      // Start fade-out 1.5s before finish
      setTimeout(() => setFadeOut(true), totalDuration - 1500);

      // When finished, mark in storage
      const finishTimer = setTimeout(() => {
        localforage.setItem("bootFinished", true);
        onFinish?.();
      }, totalDuration);

      return () => {
        clearInterval(interval);
        clearTimeout(finishTimer);
      };
    });
  }, [onFinish]);

  // Bouncing dots loop
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => prev.map((d) => (d + 1) % 3));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: fadeOut ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: fadeOut ? 2 : 1 }}
        className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center font-mono overflow-hidden"
      >
        {/* CRT flicker */}
        <motion.div
          className="absolute inset-0 bg-white opacity-5 pointer-events-none"
          animate={{ opacity: [0.03, 0.06, 0.04, 0.05, 0.03] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: fadeOut ? 0 : 1, scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
          className="text-7xl mb-10 select-none"
        >
          🪟
        </motion.div>

        {/* Stage text */}
        <motion.div
          key={stages[stageIndex].text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1 }}
          className="mb-6 text-xl tracking-wider"
        >
          {stages[stageIndex].text}
        </motion.div>

        {/* Progress bar */}
        <div className="w-3/4 h-2 bg-gray-800 rounded overflow-hidden mb-6 shadow-inner">
          <animated.div style={progressSpring} className="h-2 bg-blue-500" />
        </div>

        {/* Boot dots */}
        <div className="mt-2 flex space-x-3">
          {dots.map((d, i) => (
            <motion.div
              key={i}
              animate={{
                y: d === i ? [0, -5, 0] : [0, 0, 0],
                opacity: d === i ? [0.4, 1, 0.4] : 0.2,
              }}
              transition={{
                repeat: Infinity,
                duration: 1,
                ease: "easeInOut",
                delay: i * 0.15,
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>

        {/* BIOS hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: fadeOut ? 0 : 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-8 text-sm text-gray-400 tracking-wide"
        >
          Press <span className="text-white">ESC</span> to enter setup |{" "}
          <span className="text-white">F2</span> to enter BIOS
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
