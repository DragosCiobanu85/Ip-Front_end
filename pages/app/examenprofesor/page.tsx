"use client";
import React, { useState } from "react";
import "./index.css";

export default function Examenprofeor() {
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");

  const handleSave = () => {
    setMessage("Saved successfully!");
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <div className="examenprofeor-container">
      <div className="center-container">
        <div
          style={{
            display: "flex",

            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "18px",
          }}
        >
          <h1 style={{ marginTop: "40px" }}>Cereri de examen</h1>
        </div>
      </div>
      <div className="form-container">
        <form className="form-content">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Obiect</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Exemplul1</td>
                  <td>Exemplul2</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="app-container">
            <div className="dropdown-wrapper">
              <div className="dropdown">
                <select
                  value={selectedAssistant}
                  onChange={(e) => setSelectedAssistant(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="" disabled>
                    Asistent de profesor
                  </option>
                  <option value="Prof. A">Prof. A</option>
                  <option value="Prof. B">Prof. B</option>
                  <option value="Prof. C">Prof. C</option>
                </select>
              </div>
              <div className="dropdown">
                <select
                  value={selectedRoom}
                  onChange={(e) => setSelectedRoom(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="" disabled>
                    Sala
                  </option>
                  <option value="Room 101">Room 101</option>
                  <option value="Room 202">Room 202</option>
                  <option value="Room 303">Room 303</option>
                </select>
              </div>
              <div className="dropdown">
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="dropdown-select"
                >
                  <option value="" disabled>
                    Ora
                  </option>
                  <option value="09:00">09:00</option>
                  <option value="11:00">11:00</option>
                  <option value="13:00">13:00</option>
                </select>
              </div>
            </div>
            <button
              className="save-button"
              onClick={handleSave}
              disabled={!selectedAssistant || !selectedRoom || !selectedTime}
            >
              Salvează
            </button>

            {message && <div className="success-message">{message}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
