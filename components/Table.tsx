"use client";

import { useState } from "react";
import AddMetricButton from "@/components/AddMeticButton";
// TODO: fix tr, td, th keys, now it is a temporary solution

export default function Table(props: any) {
  const userId = props.userId;
  const dataByDate = props.dataByDate;

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedData, setEditedDate] = useState<Record<string, any>>({});

  // TODO: create this button, maybe separatly
  function removeMetric() {}

  console.log("dataByDate", dataByDate)


  return (
    <div>
      <table>
        <thead>
          <tr key="chama">
            <th>Date</th>
            <th>FocusTime</th>
            {/* TODO: headings */}
            {dataByDate &&
              Object.keys(dataByDate[Object.keys(dataByDate)[0]]).map((metricsKey, key) => (
                <th key={key} className="p-3">
                  {metricsKey}
                </th>
              ))}
            <th>
              <AddMetricButton userId={userId} />
            </th>
          </tr>
        </thead>
        {/* TODO: continue on the editing table part */}
        <tbody>
          {Object.keys(dataByDate).map((currentDate, key) => {
            const isEditing = editingRow === currentDate;
            return (
              <tr key={key}>
                <td key={key} className="p-3">
                  {currentDate}
                </td>
                <td key={100 - key} className="p-3">
                  {dataByDate[currentDate].focusTime}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
