"use client";

import React, { useState, useEffect } from "react";
import { useExams } from "../context/examcontext";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams, useRouter } from "next/navigation";
import "./app.css";

export default function ModificareExamen() {
  const { updateExam } = useExams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subject, setSubject] = useState<number | null>(null);
  const [professor, setProfessor] = useState<number | null>(null);
  const [faculty, setFaculty] = useState<number | null>(null);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const [idCerere, setIdCerere] = useState<number | null>(null);

  const [materii, setMaterii] = useState<
    Array<{ id_Materie: number; nume: string }>
  >([]);
  const [profesori, setProfesori] = useState<
    Array<{ id_Profesor: number; nume: string }>
  >([]);
  const [facultati, setFacultati] = useState<
    Array<{ id_Facultate: number; nume: string }>
  >([]);

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfessorDropdownOpen, setIsProfessorDropdownOpen] = useState(false);
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Fetch materiile, profesorii, și facultățile din backend
  useEffect(() => {
    const fetchMaterii = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/materii/materii/");
        if (response.ok) {
          const data = await response.json();
          setMaterii(data);
        } else {
          console.error("Eroare la încărcarea materiilor");
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };

    const fetchProfesori = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/profesori/profesori/"
        );
        if (response.ok) {
          const data = await response.json();
          setProfesori(data);
        } else {
          console.error("Eroare la încărcarea profesorilor");
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };

    const fetchFacultati = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/facultati/");
        if (response.ok) {
          const data = await response.json();
          setFacultati(data);
        } else {
          console.error("Eroare la încărcarea facultăților");
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };

    fetchMaterii();
    fetchProfesori();
    fetchFacultati();
  }, []);

  // Extrage datele din query params
  useEffect(() => {
    const examQuery = searchParams.get("exam");
    if (examQuery) {
      try {
        const exam = JSON.parse(decodeURIComponent(examQuery));
        console.log("Exam extras:", exam);
        setProfessor(exam.id_Profesor);
        setFaculty(exam.id_Facultate);
        setSubject(exam.id_Materie);
        setDate(dayjs(exam.data));

        if (exam.id_Cerere) {
          setIdCerere(exam.id_Cerere);
        } else {
          console.error("id_Cerere nu există în exam.");
        }
      } catch (error) {
        console.error("Eroare la parsarea JSON-ului exam:", error);
      }
    }
  }, [searchParams]);

  // Funcții de obținere a numelui pentru Facultate, Profesor și Materie
  const getFacultyName = () => {
    if (faculty !== null) {
      const facultyName = facultati.find(
        (item) => item.id_Facultate === faculty
      );
      return facultyName ? facultyName.nume : "Facultate Inexistentă";
    }
    return "Selectează Facultatea";
  };

  const getProfessorName = () => {
    if (professor !== null) {
      const professorName = profesori.find(
        (item) => item.id_Profesor === professor
      );
      return professorName ? professorName.nume : "Profesor Inexistent";
    }
    return "Selectează Profesorul";
  };

  const getSubjectName = () => {
    if (subject !== null) {
      const subjectName = materii.find((item) => item.id_Materie === subject);
      return subjectName ? subjectName.nume : "Materie Inexistentă";
    }
    return "Selectează Materia";
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!idCerere) {
      alert("ID-ul cererii nu a fost găsit. Nu se poate modifica cererea.");
      return;
    }

    if (!subject || !date || !professor || !faculty) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }

    const newExam = {
      id_Materie: subject,
      id_Profesor: professor,
      id_Facultate: faculty,
      data: date.format("YYYY-MM-DD"),
    };

    console.log("Examen modificat:", newExam);

    try {
      const url = `http://127.0.0.1:8000/cereri/cereri/${idCerere}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExam),
      });

      if (!response.ok) {
        throw new Error("Eroare la actualizarea cererii!");
      }

      alert("Cererea de examen a fost actualizată cu succes!");
      router.push("/studentpage");
    } catch (error) {
      console.error("Eroare la comunicarea cu serverul:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  return (
    <main className="flex flex-col pb-40 bg-white max-md:pb-24">
      <h1 className="self-center mt-16 text-3xl font-medium text-blue-950 max-md:mt-10">
        Modificare examen
      </h1>

      <form
        className="flex flex-col gap-10 px-20 mt-20 w-full text-2xl font-medium text-blue-950 max-md:px-5 max-md:mt-10"
        onSubmit={handleSubmit}
      >
        {/* Facultate Dropdown */}
        <div className="relative">
          <select
            value={faculty || ""}
            onChange={(e) => setFaculty(Number(e.target.value))}
            className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
          >
            <option value="" disabled>
              Selectează Facultatea
            </option>
            {facultati.map((item) => (
              <option key={item.id_Facultate} value={item.id_Facultate}>
                {item.nume}
              </option>
            ))}
          </select>
        </div>

        {/* Profesor Dropdown */}
        <div className="relative">
          <select
            value={professor || ""}
            onChange={(e) => setProfessor(Number(e.target.value))}
            className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
          >
            <option value="" disabled>
              Selectează Profesorul
            </option>
            {profesori.map((item) => (
              <option key={item.id_Profesor} value={item.id_Profesor}>
                {item.nume}
              </option>
            ))}
          </select>
        </div>

        {/* Materie Dropdown */}
        <div className="relative">
          <select
            value={subject || ""}
            onChange={(e) => setSubject(Number(e.target.value))}
            className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
          >
            <option value="" disabled>
              Selectează Materia
            </option>
            {materii.map((item) => (
              <option key={item.id_Materie} value={item.id_Materie}>
                {item.nume}
              </option>
            ))}
          </select>
        </div>

        {/* Data examenului */}
        <div className="relative">
          <input
            type="date"
            value={date ? date.format("YYYY-MM-DD") : ""}
            onChange={(e) => setDate(dayjs(e.target.value))}
            className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
          />
        </div>

        <button
          type="submit"
          className="self-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Modifică Cererea
        </button>
      </form>
    </main>
  );
}
