"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useExams } from "../context/examcontext";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import dayjs from "dayjs";
import "./index.css";

export default function ExamenProfesor() {
  const [selectedAssistant, setSelectedAssistant] = useState<number | string>(
    ""
  ); // ID-ul asistentului
  const [selectedRoom, setSelectedRoom] = useState<number | string>(""); // ID-ul sălii
  const [selectedTime, setSelectedTime] = useState<string>(""); // Ora
  const [message, setMessage] = useState<string>(""); // Mesajul de succes
  const [examDetails, setExamDetails] = useState<any>({}); // Detaliile examenului
  const [professors, setProfessors] = useState<any[]>([]); // Lista de profesori
  const [groups, setGroups] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]); // Lista de săli
  const [facultyName, setFacultyName] = useState<string>(""); // Numele facultății
  const [professorName, setProfessorName] = useState<string>("");
  const [groupsName, setGroupsName] = useState<string>(""); // Numele profesorului
  const [subjectName, setSubjectName] = useState<string>(""); // Numele materiei
  const [examDate, setExamDate] = useState(dayjs()); // Data examenului
  const [idCerere, setIdCerere] = useState<number | null>(null); // ID-ul cererii

  const [faculties, setFaculties] = useState<any[]>([]); // Facultăți
  const [professorsData, setProfessorsData] = useState<any[]>([]); // Datele profesorilor
  const [subjects, setSubjects] = useState<any[]>([]); // Materii

  const { addExamToHome, removeExamFromTeacher, removeExamFromStudent } =
    useExams();
  const router = useRouter();

  const times = Array.from({ length: 11 }, (_, i) => `${8 + i}:00:00`);

  const getToken = () => localStorage.getItem("auth_token") || ""; // Funcție pentru a obține token-ul

  useEffect(() => {
    const { searchParams } = new URL(window.location.href);
    const examQuery = searchParams.get("exam");

    if (examQuery) {
      try {
        const exam = JSON.parse(decodeURIComponent(examQuery));
        console.log("Exam extras:", exam);

        setExamDetails(exam);
        setExamDate(dayjs(exam.data));

        if (exam.id_Cerere) {
          setIdCerere(exam.id_Cerere);
        } else {
          console.error("id_Cerere nu există în exam.");
        }
      } catch (error) {
        console.error("Eroare la parsarea JSON-ului exam:", error);
      }
    } else {
      console.log("Parametri lipsă în URL");
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = getToken(); // Obține token-ul din localStorage
      try {
        const [facultiesRes, professorsRes, subjectsRes, roomsRes, groupsRes] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/facultati/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8000/profesori/profesori/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8000/materii/materii/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8000/sali/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            fetch("http://127.0.0.1:8000/grupe/grupe/", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (
          facultiesRes.ok &&
          professorsRes.ok &&
          subjectsRes.ok &&
          roomsRes.ok &&
          groupsRes.ok
        ) {
          setFaculties(await facultiesRes.json());
          const professorsData = await professorsRes.json();
          setProfessorsData(professorsData);
          setProfessors(professorsData); // Setezi lista de profesori cu ID-uri
          setSubjects(await subjectsRes.json());
          setRooms(await roomsRes.json());
          setGroups(await groupsRes.json()); // Setezi lista de săli cu ID-uri
        } else {
          console.error("Eroare la obținerea datelor din API-uri");
        }
      } catch (error) {
        console.error("Eroare la fetch:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (
      examDetails &&
      professorsData.length &&
      faculties.length &&
      subjects.length &&
      groups.length
    ) {
      setProfessorName(
        getNameById(examDetails.id_Profesor, professorsData, "id_Profesor")
      );
      setFacultyName(
        getNameById(examDetails.id_Facultate, faculties, "id_Facultate")
      );
      setSubjectName(
        getNameById(examDetails.id_Materie, subjects, "id_Materie")
      );
      setGroupsName(getNameById(examDetails.id_Grupa, groups, "id_Grupa"));
    }
  }, [examDetails, professorsData, faculties, subjects, groups]);

  const getNameById = (
    id: number | string,
    data: any[],
    key: string
  ): string => {
    const item = data.find((item) => item[key] === id);
    return item ? item.nume : "N/A";
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken(); // Obține token-ul din localStorage

    const newExam = {
      id_Facultate: examDetails.id_Facultate || 0,
      id_Profesor_1: selectedAssistant || 0, // ID-ul asistentului
      id_Grupa: examDetails.id_Grupa || 0,
      id_Materie: examDetails.id_Materie || 0,
      data: examDate.format("YYYY-MM-DD"),
      id_Sala: selectedRoom || 0, // ID-ul sălii
      ora: selectedTime, // Ora cu secunde
      id_Cerere: idCerere || 0, // ID-ul cererii
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/examene/examene/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExam),
      });

      if (response.ok) {
        removeExamFromTeacher(newExam.id_Cerere);
        removeExamFromStudent(newExam.id_Cerere);
        setMessage("Examen salvat cu succes!");
      } else {
        console.error("Eroare la salvarea examenului.");
      }
    } catch (error) {
      console.error("Eroare la trimiterea cererii POST:", error);
    }
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
                  <th>Facultate</th>

                  <th>Materie</th>
                  <th>Grupa</th>
                  <th>Data</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{facultyName || "Exemplu Facultate"}</td>
                  <td>{subjectName || "Exemplu Materie"}</td>
                  <td>{groupsName || "Exemplu grupa"}</td>

                  <td>{examDate.format("YYYY-MM-DD") || "Exemplu Data"}</td>
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
                {professors.map((assistant) => (
                  <option
                    key={assistant.id_Profesor}
                    value={assistant.id_Profesor}
                  >
                    {assistant.nume}
                  </option>
                ))}
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
                {rooms.map((room) => (
                  <option key={room.id_Sala} value={room.id_Sala}>
                    {room.nume}
                  </option>
                ))}
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
                {times.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button className="save-button" type="submit">
            Salvează
          </button>
        </form>
      </div>

      <Snackbar
        open={message !== ""}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        key={"topcenter"}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}
