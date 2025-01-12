"use client";

import React, { useState, useEffect } from "react";
import { useExams } from "../context/examcontext";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams, useRouter } from "next/navigation";
import "./app.css";
import { jwtDecode } from "jwt-decode";

interface CustomJwtPayload {
  rol: string;
  user_details: {
    id: number;
    name: string;
    rol: string;
  };
}

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
  >([]); // Initializing as an empty array

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfessorDropdownOpen, setIsProfessorDropdownOpen] = useState(false);
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  // Fetch materiile, profesorii, și facultățile din backend
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/login"); // Redirect to the 401 page if there's no token
      return; // Exit if there's no token
    }
    setIsAuthenticated(true);

    const decodedToken: CustomJwtPayload = jwtDecode(token); // Decodificarea corectă a tokenului

    if (
      decodedToken.rol !== "Student" &&
      decodedToken.user_details.rol !== "Student"
    ) {
      router.push("/login"); // Redirect to login if the role is not 'Profesor'
    }

    const fetchFilteredMaterii = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/materii/materii/filter",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include tokenul în antetul cererii
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMaterii(data); // Setează materiile filtrate
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };

    const fetchFacultati = async () => {
      const response = await fetch(
        "http://127.0.0.1:8000/studenti/studenti/facultate/authenticated",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include tokenul în antetul cererii
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setFacultati([data]); // Setează doar facultățile la care este înscris studentul
      }
    };

    fetchFacultati();
    fetchFilteredMaterii();
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
        fetchProfesor(exam.id_Materie);
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

  const fetchProfesor = async (id_Materie: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/materii/materii/${id_Materie}/profesor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched professors:", data);
        setProfesori([data]); // Update the list of professors
      } else {
        console.error("Error loading professors:", await response.text());
      }
    } catch (error) {
      console.error("Error fetching professors:", error);
    }
  };

  const handleProfessorSelection = (id_Profesor: number, nume: string) => {
    setProfessor(id_Profesor); // Setează profesorul selectat
    setIsProfessorDropdownOpen(false); // Închide dropdown-ul
    console.log(`Profesor selectat: ${nume} (ID: ${id_Profesor})`); // Opțional: pentru debug
  };
  const handleFacultySelection = (id_Facultate: number, nume: string) => {
    setFaculty(id_Facultate);
    setIsFacultyDropdownOpen(false);
  };

  const handleSubjectSelection = async (id_Materie: number, nume: string) => {
    setSubject(id_Materie);
    setIsSubjectDropdownOpen(false);
    fetchProfesor(id_Materie);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    setIsCalendarOpen(false); // Close the calendar after selecting the date
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
      // Get the token from localStorage
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login"); // Redirect to the 401 page if there's no token
        return; // Exit if there's no token
      }

      setIsAuthenticated(true);

      const url = `http://127.0.0.1:8000/cereri/cereri/${idCerere}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token in Authorization header
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

  if (isAuthenticated === null) {
    // Înainte să știm dacă este autenticat sau nu, putem returna un loading sau un fallback
    return <div>Loading...</div>;
  }

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
            onChange={(e) => {
              const selectedFaculty = facultati.find(
                (item) => item.id_Facultate === Number(e.target.value)
              );
              if (selectedFaculty) {
                handleFacultySelection(
                  selectedFaculty.id_Facultate,
                  selectedFaculty.nume
                );
              }
            }}
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
        {/* Profesor Dropdown */}
        <div className="relative">
          <select
            value={professor || ""}
            onChange={(e) => {
              const selectedProfessor = profesori.find(
                (item) => item.id_Profesor === Number(e.target.value)
              );
              if (selectedProfessor) {
                handleProfessorSelection(
                  selectedProfessor.id_Profesor,
                  selectedProfessor.nume
                );
              }
            }}
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
            onChange={(e) => {
              const selectedSubject = materii.find(
                (item) => item.id_Materie === Number(e.target.value)
              );
              if (selectedSubject) {
                handleSubjectSelection(
                  selectedSubject.id_Materie,
                  selectedSubject.nume
                );
              }
            }}
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
        <div className="relative mt-4">
          <button
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
          >
            {date ? date.format("DD/MM/YYYY") : "Selectează Data"}
          </button>
          {isCalendarOpen && (
            <div className="absolute z-10 mt-2 w-full bg-white shadow-md">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={date}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
                />
              </LocalizationProvider>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="self-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          Salvează Modificările
        </button>
      </form>
    </main>
  );
}
