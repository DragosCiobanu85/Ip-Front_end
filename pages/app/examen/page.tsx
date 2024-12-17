"use client";

import React, { useState, useEffect } from "react";
import { useExams } from "../context/examcontext";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useSearchParams, useRouter } from "next/navigation";
import "./app.css";

const options = {
  materie: [
    "Ingineria Programelor",
    "Calcul mobil",
    "Proiectarea bazelor de date",
  ],
  grupa: ["3141", "3142", "3143", "3144"],
};

export default function ProgramareExamen() {
  const { addExamToTeacher, addExamsToStudentPage, updateExam } = useExams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [subject, setSubject] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isGroupDropdownOpen, setIsGroupDropdownOpen] = useState(false);

  useEffect(() => {
    const examQuery = searchParams.get("exam");

    if (examQuery) {
      const exam = JSON.parse(decodeURIComponent(examQuery));
      setSubject(exam.name);
      setGroup(exam.grupa);
      setDate(dayjs(exam.dataexamen));

      setIsSubjectDropdownOpen(false);
      setIsGroupDropdownOpen(false);
    }
  }, [searchParams]);

  const toggleCalendar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCalendarOpen((prevState) => !prevState);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    setIsCalendarOpen(false);
  };

  const handleSubjectSelection = (selectedSubject: string) => {
    setSubject(selectedSubject);
    setIsSubjectDropdownOpen(false);
  };

  const handleGroupSelection = (selectedGroup: string) => {
    setGroup(selectedGroup);
    setIsGroupDropdownOpen(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!subject || !group || !date) {
      alert("Te rugăm să completezi toate câmpurile.");
      return;
    }

    const newExam = {
      id: searchParams.get("exam")
        ? JSON.parse(decodeURIComponent(searchParams.get("exam") as string)).id
        : Date.now(),
      name: subject,
      professor: "",
      assistant: "",
      sala: "",
      ora: "",
      dataexamen: date.toDate(),
      grupa: group,
    };

    if (searchParams.get("exam")) {
      const examId = JSON.parse(
        decodeURIComponent(searchParams.get("exam") as string)
      ).id;
      updateExam(examId, newExam);
      alert("Examenul a fost actualizat cu succes!");
      router.push("/studentpage");
    } else {
      addExamToTeacher(newExam);
      addExamsToStudentPage(newExam);
      alert("Examenul a fost programat cu succes!");
      router.push("/studentpage");
    }

    setSubject("");
    setGroup("");
    setDate(null);
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
        <div className="flex justify-between w-full gap-6">
          <div className="flex flex-col w-[60%] gap-6">
            {/* Selector pentru Materie */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSubjectDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
              >
                {subject || "Selectează Materia"}
              </button>

              {isSubjectDropdownOpen && (
                <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                  {options.materie.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSubjectSelection(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Selector pentru Grupă */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsGroupDropdownOpen((prev) => !prev)}
                className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
              >
                {group || "Selectează Grupa"}
              </button>

              {isGroupDropdownOpen && (
                <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                  {options.grupa.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleGroupSelection(option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Selector pentru Dată */}
          <div className="flex flex-col w-[35%] gap-6">
            <button
              onClick={toggleCalendar}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              {date ? date.format("DD/MM/YYYY") : "Selectează Data"}
            </button>
            {isCalendarOpen && (
              <div className="p-4 bg-white rounded-lg border border-solid border-slate-800 shadow-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={date} onChange={handleDateChange} />
                </LocalizationProvider>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2 mt-8 text-white bg-blue-600 rounded-full hover:bg-blue-700"
        >
          Programează Examen
        </button>
      </form>
    </main>
  );
}
