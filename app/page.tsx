"use client";

import { useEffect, useState } from "react";

export default function Home() {
  let [timeMin, setTimeMin] = useState(1);
  let [timeSec, setTimeSec] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startFlag, setStartFlag] = useState(false);

  let enteredTime: number | null = null;
  let timer: NodeJS.Timeout;

  function startTimer() {
    setStartFlag(true);
  }

  useEffect(() => {
    if (!startFlag) return;

    timer = setInterval(() => {
      if (timeMin === 0 && timeSec === 0) {
        clearInterval(timer);
        setStartFlag(false);
        alert("Time is up! Take a break.");
      } else if (!isPaused) {
        if (timeSec > 0) {
          setTimeSec((prevSec) => prevSec - 1);
        } else {
          setTimeSec(59);
          setTimeMin((prevMin) => prevMin - 1);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startFlag, timeSec, timeMin, isPaused]);

  function togglePauseResume(event: React.MouseEvent<HTMLButtonElement>) {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      event.currentTarget.textContent = "pause";
    } else {
      event.currentTarget.textContent = "resume";
    }
  }

  function restartTimer() {
    clearInterval(timer);
    setTimeMin(enteredTime || 1);
    setTimeSec(0);
    setIsPaused(false);
    setStartFlag(false);
  }

  return (
    <main>
      <h1 className="text-2xl">{`${String(timeMin).padStart(2, "0")}:${String(
        timeSec
      ).padStart(2, "0")}`}</h1>
      <button type="button" onClick={startTimer}>
        start
      </button>
      <br />
      <button type="button" onClick={(event) => togglePauseResume(event)}>
        pause
      </button>
      <br />
      <button type="button" onClick={restartTimer}>
        restart
      </button>
    </main>
  );
}
