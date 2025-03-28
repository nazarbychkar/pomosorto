"use client";

import { useEffect, useState } from "react";

// Impement for floating numbers

export default function Home() {
  // Remake this list into a dictionary for better readiablity
  let [workRestTime, setWorkRestTime] = useState<number[]>([25, 5, 15]);
  // const [cycles, setCycles] = useState(0)
  let cycle = 0;
  let [timeMin, setTimeMin] = useState(1);
  let [timeSec, setTimeSec] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startFlag, setStartFlag] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);

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
        // cycle functionality
        cycle++
        if (cycle > 7) cycle = 0;

        if (cycle % 2 === 0) setTimeMin(workRestTime[0]);
        else if (cycle === 7) setTimeMin(workRestTime[2]);
        else setTimeMin(workRestTime[1]);
        // 
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
    setTimeMin(workRestTime[0] || 25);
    setTimeSec(0);
    setIsPaused(false);
    setStartFlag(false);
  }

  function saveParams(formData: FormData) {
    const timeWork = formData.get("timeWork");
    const timeRest = formData.get("timeRest");
    const timeLongRest = formData.get("timeLongRest");

    if (!(timeWork && timeRest && timeLongRest)) {
      setErrorFlag(true);
      return;
    }
    setWorkRestTime([+timeWork, +timeRest, +timeLongRest]);
    restartTimer()
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
      <br />
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const modal = document.getElementById(
            "my_modal_1"
          ) as HTMLDialogElement | null;
          if (modal) modal.showModal();
        }}
      >
        settings
      </button>
      <dialog id="my_modal_1">
        <div>
          <form action={saveParams}>
            <h1>Pomodoro Params</h1>
            {errorFlag && <p className="text-red-400">there must be numbers</p>}
            <label htmlFor="timeWork">time for work:</label>
            <input name="timeWork" id="timeWork" />
            <br />
            <label htmlFor="timeRest">time for rest:</label>
            <input name="timeRest" id="timeRest" />
            <br />
            <label htmlFor="timeLongRest">time for long rest:</label>
            <input name="timeLongRest" id="timeLongRest" />
            <br />
            <button type="submit">submit</button>
            <br />
            <button
              type="button"
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_1"
                ) as HTMLDialogElement | null;
                if (modal) modal.close();
                if (errorFlag) setErrorFlag(false);
              }}
            >
              close
            </button>
          </form>
        </div>
      </dialog>
    </main>
  );
}
