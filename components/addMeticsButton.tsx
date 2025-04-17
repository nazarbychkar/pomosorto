"use client";
// Can't use mongoDB on client
// import { insertUserMetric } from "@/lib/mongodb";
import { useEffect, useState } from "react";

export default function AddMetricButton(props: any) {
  const [errorFlag, setErrorFlag] = useState(false);
  const [sendingFlag, setSendingFlag] = useState(false);

  function addMetric(formData: FormData) {
    const metricsName = formData.get("metricsName");
    const metricsType = formData.get("metricsType");
    // console.log(formData);
    // console.log(metricsName, metricsType);

    if (!(metricsName && metricsType)) {
      setErrorFlag(true);
      return;
    }

    const newFormData = new FormData();
    newFormData.set("userId", props.userId);
    newFormData.set("metricsName", metricsName);
    newFormData.set("metricsType", metricsType);

    // TODO: some error with hook/hooks
    useEffect(() => {
      async function sendMetricsData() {
        const response = await fetch("https://localhost:3000/api/metric", {
          method: "POST",
          body: newFormData,
        });

        console.log("api metrics respons", response.status);
      }

      sendMetricsData();
    }, [sendingFlag]);

    // insertUserMetric(
    //   props.userId,
    //   metricsName.toString(),
    //   metricsType.toString()
    // );

    return;
  }

  // TODO: add metric button -> dialog -> mongo -> retriev, okie?
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
                setSendingFlag(!sendingFlag);
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
