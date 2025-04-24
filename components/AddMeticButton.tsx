"use client";
// Can't use mongoDB on client
// import { insertUserMetric } from "@/lib/mongodb";
import { useEffect, useState } from "react";

export default function AddMetricButton(props: any) {
  const [errorFlag, setErrorFlag] = useState(false);
  const [sendingFlag, setSendingFlag] = useState(false);
  const [nameMetric, setNameMetric] = useState<string | null>(null);
  const [typeMetric, setTypeMetric] = useState<string | null>(null);
  const userId = props.userId;

  if (!userId) {
    throw Error("add metrics button: where is userId?");
  }

  useEffect(() => {
    async function sendMetricsData() {
      if (!(nameMetric && typeMetric)) {
        return;
      }

      const body = JSON.stringify({"userId":userId, "metricsName": nameMetric, "metricsType": typeMetric})
      // console.log(body)

      const response = await fetch("http://localhost:3000/api/add-metric", {
        method: "POST",
        body: body
      });

      console.log("api metrics add respons", response.status);
    }

    sendMetricsData();
  }, [sendingFlag]);

  function addMetric(formData: FormData) {
    const metricsName = formData.get("metricsName");
    const metricsType = formData.get("metricsType");

    if (!(metricsName && metricsType)) {
      setErrorFlag(true);
      return;
    }

    setNameMetric(metricsName.toString());
    setTypeMetric(metricsType.toString());

    setSendingFlag(!sendingFlag);
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
          <form action={addMetric}>
            <h1>Adjust Metric</h1>
            {errorFlag && (
              <p className="text-red-400">there must be a name and a type</p>
            )}
            <label htmlFor="metricsName">Metrics name:</label>
            <input name="metricsName" id="metricsName" />
            <br />
            <label htmlFor="metricsType">Metrics type:</label>
            <select id="metricsType" name="metricsType">
              <option value="">--Please choose an option--</option>
              <option value="Bool">Bool</option>
              <option value="Number">Number</option>
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
