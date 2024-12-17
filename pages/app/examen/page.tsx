"use client";
import React, { useState, useEffect } from "react";
import { useExams } from "../context/examcontext";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams, useRouter } from "next/navigation";
import "./app.css";

export default function ProgramareExamen() {
  const { addExamToTeacher, addExamsToStudentPage, updateExam } = useExams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subject, setSubject] = useState<number | null>(null);
  const [group, setGroup] = useState<string | null>(null);
  const [professor, setProfessor] = useState<number | null>(null);
  const [faculty, setFaculty] = useState<number | null>(null);
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [status, setStatus] = useState("");
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

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfessorDropdownOpen, setIsProfessorDropdownOpen] = useState(false);
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const token = localStorage.getItem("auth_token");
  console.log("Token-ul din localStorage:", token); // Obține token-ul din localStorage

  const fetchWithAuth = async (url: string) => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`, // Adaugă token-ul în antet
        "Content-Type": "application/json",
      },
    });
    return response;
  };

  useEffect(() => {
    const fetchMaterii = async () => {
      try {
        const response = await fetchWithAuth(
          "http://127.0.0.1:8000/materii/materii/"
        );
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
        const response = await fetchWithAuth(
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
        const response = await fetchWithAuth(
          "http://127.0.0.1:8000/facultati/"
        );
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
  }, [token]);

  const handleSubjectSelection = (id_Materie: number, nume: string) => {
    setSubject(id_Materie);
    setIsSubjectDropdownOpen(false);
  };

  const handleProfessorSelection = (id_Profesor: number, nume: string) => {
    setProfessor(id_Profesor);
    setIsProfessorDropdownOpen(false);
  };

  const handleFacultySelection = (id_Facultate: number, nume: string) => {
    setFaculty(id_Facultate);
    setIsFacultyDropdownOpen(false);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    setIsCalendarOpen(false); // Close the calendar after selecting the date
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
      status: status,
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/cereri/cereri/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Adaugă token-ul în antet
        },
        body: JSON.stringify(newExam),
      });

      if (!response.ok) {
        throw new Error("Eroare la crearea cererii de examen!");
      }

      alert("Cererea de examen a fost trimisă cu succes!");
      router.push("/studentpage");
    } catch (error) {
      console.error("Eroare la comunicarea cu serverul:", error);
      alert("A apărut o eroare. Te rugăm să încerci din nou.");
    }

    setSubject(null);
    setProfessor(null);
    setFaculty(null);
    setDate(null);
    setStatus("");
  };

  return (
    <main className="flex flex-col pb-40 bg-white max-md:pb-24">
      <h1 className="self-center mt-16 text-3xl font-medium text-blue-950 max-md:mt-10">
        Programare examen
      </h1>

      <form
        className="flex flex-col gap-10 px-20 mt-20 w-full text-2xl font-medium text-blue-950 max-md:px-5 max-md:mt-10"
        onSubmit={handleSubmit}
      >
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
              onClick={() =>
                setIsProfessorDropdownOpen((prevState) => !prevState)
              }
              className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
            >
              {professor !== null
                ? profesori.find((item) => item.id_Profesor === professor)?.nume
                : "Selectează Profesorul"}
            </button>

            {isProfessorDropdownOpen && (
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
    </main>
  );
}
