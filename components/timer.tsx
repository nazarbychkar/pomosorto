"use client";

import clientSessionFetch from "@/lib/clientSessionFetch";
import { insertPomodoroSession } from "@/lib/postgresql";
import { SessionUserId } from "@/lib/sessionInterface";
import { useEffect, useState } from "react";


// TODO: Impement for floating numbers

export default function Timer() {
  // Remake this list into a dictionary for better readiablity
  let [workRestTime, setWorkRestTime] = useState([25, 5, 15]);
  const [cycle, setCycle] = useState(0);
  // let cycle = 0;
  let [timeMin, setTimeMin] = useState(1);
  let [timeSec, setTimeSec] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [startFlag, setStartFlag] = useState(false);
  const [errorFlag, setErrorFlag] = useState(false);
  const [session, setSession] = useState<SessionUserId | null>(null);
  const [dbFlag, setDbFlag] = useState(false);
  const [dbTime, setDbTime] = useState<number>(0);

  let timer: NodeJS.Timeout;

  useEffect(() => {
    async function uploadToDb() {
      if (session) {
        await insertPomodoroSession(
          session.userId,
          new Date(),
          dbTime,
          !(cycle % 2)
        );
        setDbTime(0);
      }
    }

    uploadToDb();
  }, [dbFlag]);

  useEffect(() => {
    async function fetchUser() {
      const fetchedSession = await clientSessionFetch();

      setSession(fetchedSession as SessionUserId);
    }

    fetchUser();
  }, []);

  function startTimer() {
    setStartFlag(true);
  }

  useEffect(() => {
    if (!startFlag) return;

    timer = setInterval(() => {
      if (timeMin === 0 && timeSec === 0) {
        clearInterval(timer);
        setStartFlag(false);
        // if (cycle % 2) alert("Time is up! Let's work.");
        // else alert("Time is up! Take a break.");
        alert(cycle % 2 ? "Time is up! Let's work." : "Time is up! Take a break.");

        if (session) {
          setDbFlag(!dbFlag);
        }

        // cycle functionality
        let newCycle = cycle + 1;

        if (newCycle > 7) newCycle = 0;
        setCycle(newCycle);

        if (newCycle % 2 === 0) setTimeMin(workRestTime[0]);
        else if (newCycle === 7) setTimeMin(workRestTime[2]);
        else setTimeMin(workRestTime[1]);
        //
      } else if (!isPaused) {
        if (timeSec > 0) {
          setTimeSec((prevSec) => prevSec - 1);
        } else {
          setTimeSec(59);
          setTimeMin((prevMin) => prevMin - 1);
        }
        setDbTime(dbTime + 1);
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
    setCycle(0);
  }

  function skipTimer() {
    setTimeMin(0);
    setTimeSec(0);
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
    restartTimer();
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
      <button type="button" onClick={skipTimer}>
        skip
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
