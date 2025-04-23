"use client";

import { useState } from "react";
import AddMetricButton from "@/components/AddMeticButton";
// TODO: fix tr, td, th keys, now it is a temporary solution

export default function Table(props: any) {
  const userId = props.userId;
  const dataByDate: Record<string, Record<string, any>> = props.dataByDate;

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedData, setEditedDate] = useState<Record<string, any>>({});

  // TODO: create this button, maybe separatly
  function removeMetric() {}

  console.log("dataByDate", dataByDate);
  // TODO: remake .entries loops into .values
  return (
    <div>
      <table>
        <thead>
          <tr key="chama">
            <th>Date</th>
            {/* <th>FocusTime</th> */}
            {dataByDate &&
              Object.entries(dataByDate[Object.keys(dataByDate)[0]]).map(
                (key, value) => <th className="p-3">{key[0]}</th>
              )}
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
                {Object.entries(dataByDate[currentDate]).map((value, key) => (
                  <td key={key} className="text-center">
                    {String(value[1])}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
