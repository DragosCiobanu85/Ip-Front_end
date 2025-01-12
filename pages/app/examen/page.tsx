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

export default function ProgramareExamen() {
  const { addExamToTeacher, addExamsToStudentPage, updateExam } = useExams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subject, setSubject] = useState<number | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [professor, setProfessor] = useState<number | null>(null);
  const [faculty, setFaculty] = useState<number | null>(null);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);

  const today = dayjs();

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
  const [selectedGrupa, setSelectedGrupa] = useState<number | null>(null);
  const [selectedSpecializare, setSelectedSpecializare] = useState<
    number | null
  >(null);

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfessorDropdownOpen, setIsProfessorDropdownOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSpecializationDropdownOpen, setIsSpecializationDropdownOpen] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [grupe, setGrupe] = useState<Array<{ id_Grupa: number; nume: string }>>(
    []
  );
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

  const fetchWithAuth = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  useEffect(() => {
    if (!token) {
      router.push("/login"); // Redirect to the 401 page if there's no token
      return; // Exit if there's no token
    }

    const decodedToken: CustomJwtPayload = jwtDecode(token); // Decodificarea corectă a tokenului

    if (
      decodedToken.rol !== "Student" &&
      decodedToken.user_details.rol !== "Student"
    ) {
      router.push("/login"); // Redirect to login if the role is not 'Profesor'
    }

    setIsAuthenticated(true);
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

    if (faculty) {
      fetchStudentSpecializare(faculty);
    }
  }, [token, faculty, subject]);

  const fetchProfesor = async (id_Materie: number) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/materii/materii/${id_Materie}/profesor`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include tokenul în antetul cererii
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setProfesori([data]);
      } else {
        console.error(
          "Eroare la încărcarea profesorului:",
          await response.text()
        );
      }
    } catch (error) {
      console.error("Eroare la conexiunea cu API-ul:", error);
    }
  };

  const handleSubjectSelection = async (id_Materie: number, nume: string) => {
    setSubject(id_Materie);
    setIsSubjectDropdownOpen(false);
    fetchProfesor(id_Materie);
  };

  const handleProfessorSelection = (id_Profesor: number, nume: string) => {
    setProfessor(id_Profesor); // Setează profesorul selectat
    setIsProfessorDropdownOpen(false); // Închide dropdown-ul
    console.log(`Profesor selectat: ${nume} (ID: ${id_Profesor})`); // Opțional: pentru debug
  };

  const handleSpecializareSelection = (
    id_Specializare: number,
    nume: string
  ) => {
    setSelectedSpecializare(id_Specializare);
    setIsSpecializationDropdownOpen(false);
  };

  const handleStudentGrupa = (id_Grupa: number, nume: string) => {
    setSelectedGrupa(id_Grupa); // Setează grupa selectată
    setIsGroupDropdownOpen(false); // Închide dropdown-ul
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    setIsCalendarOpen(false);
  };

  const handleFacultySelection = (id_Facultate: number, nume: string) => {
    setFaculty(id_Facultate);
    setIsFacultyDropdownOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    console.log("Date trimise catre backend:", newExam);

    try {
      const response = await fetch("http://127.0.0.1:8000/cereri/cereri/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExam),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json(); // Preia răspunsul ca JSON
          const errorMessage = errorData.detail;
          setErrorMessage(errorMessage); // Setează mesajul de eroare în Snackbar
          return; // Opriți execuția și nu aruncați eroarea mai departe
        }
        throw new Error("Eroare necunoscută la crearea cererii.");
      }

      alert("Cererea de examen a fost trimisă cu succes!");
      router.push("/studentpage");
    } catch (error) {
      console.error("Eroare la comunicarea cu serverul:", error);
    }

    // Resetează valorile formularului
    setSubject(null);
    setProfessor(null);
    setFaculty(null);
    setDate(null);
  };

  if (isAuthenticated === null) {
    // Înainte să știm dacă este autenticat sau nu, putem returna un loading sau un fallback
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col pb-40 bg-white max-md:pb-24">
      <h1 className="self-center mt-16 text-3xl font-medium text-blue-950 max-md:mt-10">
        Programare examen
      </h1>

      <form
        className="flex flex-col gap-10 px-20 mt-20 w-full text-2xl font-medium text-blue-950 max-md:px-5 max-md:mt-10"
        onSubmit={handleSubmit}
      >
        {/* Facultate */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsFacultyDropdownOpen((prevState) => !prevState)
              }
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {faculty !== null
                ? facultati.find((item) => item.id_Facultate === faculty)?.nume
                : "Selectează Facultatea"}
            </button>

            {isFacultyDropdownOpen && (
              <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                {facultati.map((option) => (
                  <li
                    key={option.id_Facultate}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      handleFacultySelection(option.id_Facultate, option.nume)
                    }
                  >
                    {option.nume}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Specializare */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsSpecializationDropdownOpen((prevState) => !prevState)
              }
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {selectedSpecializare !== null
                ? specializari.find(
                    (item) => item.id_Specializare === selectedSpecializare
                  )?.nume
                : "Selectează Specializarea"}
            </button>

            {isSpecializationDropdownOpen && (
              <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                {specializari.map((option) => (
                  <li
                    key={option.id_Specializare}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      handleSpecializareSelection(
                        option.id_Specializare,
                        option.nume
                      )
                    }
                  >
                    {option.nume}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsGroupDropdownOpen((prevState) => !prevState)}
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {selectedGrupa !== null
                ? grupe.find((item) => item.id_Grupa === selectedGrupa)?.nume
                : "Selectează Grupa"}
            </button>

            {isGroupDropdownOpen && (
              <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                {grupe.map((option) => (
                  <li
                    key={option.id_Grupa}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      handleStudentGrupa(option.id_Grupa, option.nume)
                    }
                  >
                    {option.nume}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Materie */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setIsSubjectDropdownOpen((prevState) => !prevState)
              }
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {subject !== null
                ? materii.find((item) => item.id_Materie === subject)?.nume
                : "Selectează Materia"}
            </button>

            {isSubjectDropdownOpen && (
              <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                {materii.map((option) => (
                  <li
                    key={option.id_Materie}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      handleSubjectSelection(option.id_Materie, option.nume)
                    }
                  >
                    {option.nume}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Profesor */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfessorDropdownOpen((prev) => !prev)}
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {professor !== null
                ? profesori.find((item) => item.id_Profesor === professor)?.nume
                : "Selectează Profesorul"}
            </button>
            {isProfessorDropdownOpen && profesori.length > 0 && (
              <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                {profesori.map((option) => (
                  <li
                    key={option.id_Profesor}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() =>
                      handleProfessorSelection(option.id_Profesor, option.nume)
                    }
                  >
                    {option.nume}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Calendar */}
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

        {/* Submit Button */}
        <button
          type="submit"
          className="self-center w-60 py-3 mt-5 text-white bg-blue-950 rounded"
        >
          Trimite cererea
        </button>
      </form>

      {/* Mesaj de eroare */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </main>
  );
}
