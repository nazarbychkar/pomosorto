"use client";

import { useEffect, useState } from "react";
import AddMetricButton from "@/components/AddMeticButton";
// TODO: fix tr, td, th keys, now it is a temporary solution

export default function Table(props: any) {
  const userId = props.userId;
  const dataByDate: Record<string, Record<string, any>> = props.dataByDate;

  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Record<string, any>>({});
  const [sendDataFlag, setSendDataFlage] = useState(false);

  const headers = Object.entries(dataByDate[Object.keys(dataByDate)[0]]);
  // TODO: also implement instant retrieve
  useEffect(() => {
    async function sendData() {
      if (editingRow) {
        console.log("editingRow", editingRow);
        const body = JSON.stringify({
          userId: userId,
          date: editingRow,
          data: editedData,
        });

        const response = await fetch(
          "http://localhost:3000/api/update-metric",
          {
            method: "POST",
            body: body,
          }
        );

        console.log("api metrics update respons", response.status);
        // await updateUserMetrics(userId, editingRow, editedData)
        setEditingRow(null);
        setEditedData({});
      } else {
        console.log(
          "table error: editingRow is missing, how? must be start up useEffect"
        );
      }
    }
    sendData();
  }, [sendDataFlag]);

  // TODO: create this button, maybe separatly, maybe on the profile page
  function removeMetric() {}

  function handleInputChange(key: string, value: any) {
    setEditedData((prev) => ({ ...prev, [key]: value }));
  }

  function handleEdit(date: string) {
    console.log("date", date);
    setEditingRow(date);
    setEditedData({ ...dataByDate[date] });
  }

  function handleSave() {
    setSendDataFlage(!sendDataFlag);
  }

  function handleCancel() {
    setEditingRow(null);
    setEditedData({});
  }

  // console.log("dataByDate", dataByDate);
  // TODO: remake .entries loops into .values
  return (
    <div>
      <AddMetricButton userId={userId} />
      <table>
        <thead>
          <tr key="chama">
            <th>Date</th>
            {/* <th>FocusTime</th> */}
            {headers &&
              headers.map((key, value) => <th className="p-3">{key[0]}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        {/* TODO: continue on the editing table part */}
        <tbody>
          {Object.keys(dataByDate).map((currentDate, key) => {
            const isEditing = editingRow === currentDate;
            return (
              <tr key={key}>
                <td key={currentDate} className="p-3">
                  {currentDate}
                </td>
                {Object.entries(dataByDate[currentDate]).map((value, key) => (
                  <td key={key} className="text-center">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedData[value[0]] ?? ""}
                        onChange={(e) =>
                          handleInputChange(value[0], e.target.value)
                        }
                      />
                    ) : (
                      String(value[1])
                    )}
                  </td>
                ))}
                {/* edit button right here */}
                <td>
                  {isEditing ? (
                    <>
                      <button type="button" onClick={handleSave}>
                        Save
                      </button>
                      <button type="button" onClick={handleCancel}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEdit(currentDate)}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
