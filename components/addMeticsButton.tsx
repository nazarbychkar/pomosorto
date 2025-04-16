"use client";

import { useState } from "react";

export default function AddMetricButton() {
  const [errorFlag, setErrorFlag] = useState(false);
  function addMetric() {
    return;
  }

  return (
    <div>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          const modal = document.getElementById(
            "add_metric"
          ) as HTMLDialogElement | null;
          if (modal) modal.showModal();
        }}
      >
        Add Metrics
      </button>
      <dialog id="add_metric">
        <div>
          <form action="addMetric">
            <h1>Adjust Metric</h1>
            {errorFlag && <p className="text-red-400">there must be a name</p>}
            <label htmlFor="metricsName">Metrics name:</label>
            <input name="metricsName" id="metricsName" />
            <br />
            <label htmlFor="metricsType">Metrics type:</label>
            <select id="type-select">
              <option value="">--Please choose an option--</option>
              <option value="dog">Bool</option>
              <option value="cat">Int</option>
            </select>
            <button type="submit">Submit</button>
            <br />
            <button
              type="button"
              onClick={() => {
                const modal = document.getElementById(
                  "add_metric"
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
    </div>
  );
}
