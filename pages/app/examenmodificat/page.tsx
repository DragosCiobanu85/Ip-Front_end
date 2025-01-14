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
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
  const [specializare, setSpecializare] = useState<number | null>(null);
  const [grupa, setGrupa] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

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
  const [specializari, setSpecializari] = useState<
    Array<{ id_Specializare: number; nume: string }>
  >([]);
  const [grupe, setGrupe] = useState<Array<{ id_Grupa: number; nume: string }>>(
    []
  ); // Initializing as an empty array

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
    const fetchStudentGrupa = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/studenti/studenti/grupa",
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include tokenul în antetul cererii
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setGrupe([data]); // Setează doar grupa studentului în lista de grupe
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };
    const fetchStudentSpecializare = async (id_Facultate: number) => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/specializare/student/specializare/${id_Facultate}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include tokenul în antetul cererii
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setSpecializari([data]);
        }
      } catch (error) {
        console.error("Eroare la conexiunea cu API-ul:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([
        fetchFacultati(),
        fetchStudentGrupa(),
        fetchFilteredMaterii(),
      ]);
    };

    fetchData();
    console.log("Facultateaaaaaaaaaa", faculty);
    if (faculty) {
      fetchStudentSpecializare(faculty);
    }
    console.log(subject);
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
          console.log("Răspuns API pentru profesori:", data);

          // Asigură-te că datele sunt un array
          setProfesori([data]);
        } else {
          console.error("Eroare API la fetchProfesor:", await response.text());
        }
      } catch (error) {
        console.error("Eroare la fetchProfesor:", error);
      }
    };
    if (subject) {
      console.log("Apel fetchProfesor pentru subject:", subject);
      fetchProfesor(subject);
    }
  }, [token, faculty, subject]);

  useEffect(() => {
    console.log("Profesori disponibili:", profesori);
  }, [profesori]);

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
        setSpecializare(exam.id_Specializare);
        setDate(dayjs(exam.data));
        setGrupa(exam.id_Grupa);
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
      id_Specializare: specializare,
      id_Grupa: grupa,
      data: date.format("YYYY-MM-DD"),
    };

    console.log("Examen modificat:", newExam);

    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/login");
        return;
      }

      setIsAuthenticated(true);

      const url = `http://127.0.0.1:8000/cereri/cereri/${idCerere}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExam),
      });

      if (!response.ok) {
        throw new Error("Eroare la actualizarea cererii!");
      }

      setSnackbarMessage("Cererea de examen a fost actualizată cu succes!");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Eroare la comunicarea cu serverul:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }
  };

  // Callback pentru închiderea Snackbar-ului
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    router.push("/studentpage"); // Redirecționează după ce Snackbar se închide
  };

  if (isAuthenticated === null) {
    // Înainte să știm dacă este autenticat sau nu, putem returna un loading sau un fallback
    return <div>Loading...</div>;
  }

  console.log("Valoarea professor:", professor);
  console.log("Lista profesori:", profesori);
  console.log(
    "Profesor găsit:",
    profesori.find((item) => item.id_Profesor === Number(professor))
  );

  return (
    <main className="flex flex-col pb-40 bg-white max-md:pb-24">
      <h1 className="self-center mt-16 text-3xl font-medium text-blue-950 max-md:mt-10">
        Modificare cerere
      </h1>

      <form
        className="flex flex-col gap-10 px-20 mt-20 w-full text-2xl font-medium text-blue-950 max-md:px-5 max-md:mt-10"
        onSubmit={handleSubmit}
      >
        {/* Facultate Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Facultate Input */}
          <div className="relative">
            <input
              type="text"
              value={
                faculty
                  ? facultati.find((item) => item.id_Facultate === faculty)
                      ?.nume || ""
                  : ""
              }
              readOnly
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded shadow ml-60 cursor-not-allowed hover:bg-gray-100"
              placeholder="Selectează Facultatea"
            />
          </div>

          {/* Specializare Input */}
          <div className="relative">
            <input
              type="text"
              value={
                specializare
                  ? specializari.find(
                      (item) => item.id_Specializare === specializare
                    )?.nume || ""
                  : ""
              }
              readOnly
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded shadow ml-60 cursor-not-allowed hover:bg-gray-100"
              placeholder="Selectează Specializarea"
            />
          </div>

          {/* Grupa Input */}
          <div className="relative">
            <input
              type="text"
              value={
                grupa
                  ? grupe.find((item) => item.id_Grupa === grupa)?.nume || ""
                  : ""
              }
              readOnly
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded shadow ml-60 cursor-not-allowed hover:bg-gray-100"
              placeholder="Selectează Grupa"
            />
          </div>

          {/* Profesor Input */}
          <div className="relative">
            <input
              type="text"
              value={
                professor !== null
                  ? profesori.find(
                      (item) => item.id_Profesor === Number(professor)
                    )?.nume || "Profesor Inexistent"
                  : ""
              }
              readOnly
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded shadow ml-60 cursor-not-allowed hover:bg-gray-100"
              placeholder="Selectează Profesorul"
            />
          </div>

          {/* Materie Input */}
          <div className="relative">
            <input
              type="text"
              value={
                subject
                  ? materii.find((item) => item.id_Materie === subject)?.nume ||
                    ""
                  : ""
              }
              readOnly
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded shadow ml-60 cursor-not-allowed hover:bg-gray-100"
              placeholder="Selectează Materia"
            />
          </div>

          {/* Data examenului */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              className="w-80 px-4 py-2 bg-white border border-slate-800 rounded flex justify-between items-center ml-60"
            >
              {date ? date.format("DD/MM/YYYY") : "Selectează Data"}
              <span className="ml-2">&#9660;</span>
            </button>
            {isCalendarOpen && (
              <div className="absolute z-10 mt-2 left-0 ml-60 w-80 bg-white shadow-md">
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
        </div>

        <button
          type="submit"
          className="self-center px-6 py-2  ml-14 bg-blue-950 text-white rounded-lg shadow"
        >
          Salvează Modificările
        </button>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={800}
        onClose={handleSnackbarClose} // Apelează callback-ul pentru redirecționare
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
