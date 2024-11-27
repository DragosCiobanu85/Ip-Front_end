"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExams } from "../context/examcontext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./index.css";

export default function ExamenProfesor() {
  const [selectedAssistant, setSelectedAssistant] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [queryParams, setQueryParams] = useState<any>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { addExamToHome, removeExamFromTeacher, removeExamFromStudent } =
    useExams();
  const router = useRouter();

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const id = searchParams.get("id");
    const name = searchParams.get("name");
    const data = searchParams.get("data");
    const grupa = searchParams.get("grupa");

    if (id && name && data && grupa) {
      setQueryParams({ id, name, data, grupa });
      console.log("Parametri URL:", { id, name, data, grupa });
    } else {
      console.log("Parametri lipsă în URL");
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const newExam = {
      id: queryParams.id ? parseInt(queryParams.id) : 0,
      name: queryParams.name || "Exemplu Materie",
      professor: "Prof. Example",
      assistant: selectedAssistant,
      sala: selectedRoom,
      ora: selectedTime,
      dataexamen: new Date(queryParams.data || "2024-12-01"),
      grupa: queryParams.grupa || "Exemplu Grupa",
    };

    addExamToHome(newExam);

    removeExamFromTeacher(newExam.id);
    removeExamFromStudent(newExam.id);

    setMessage("Examen salvat cu succes!");

    setTimeout(() => {
      router.push("/teacherpage");
    }, 800);
  };

  return (
    <div className="examenprofeor-container">
      <div className="center-container">
        <h1>Cerere de examen</h1>
      </div>

      <div className="form-container">
        <form className="form-content" onSubmit={handleSave}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Obiect</th>
                  <th>Data</th>
                  <th>Grupa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{queryParams.name || "Exemplu Materie"}</td>
                  <td>{queryParams.data || "Exemplu Data"}</td>
                  <td>{queryParams.grupa || "Exemplu Grupa"}</td>
                </tr>
              </tbody>
            </table>
          </div>

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
        </form>
      </div>

      <Snackbar
        open={message !== ""}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        sx={{ backgroundColor: "#192041", marginTop: "150px" }}
      >
        <Alert
          onClose={() => setMessage("")}
          severity="success"
          sx={{
            backgroundColor: "#192041",
            color: "#ffffff",
            fontSize: "18px",
            padding: "16px",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
