"use client";
import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";
import "./app.css";

export default function Examen() {
  const options = {
    facultate: [
      "Facultatea de Inginerie Electrica si Stiinta Calculatoarelor",
      "Facultatea de Stiinte ale Educatiei",
      "Facultatea de Economie, Administratie si Afaceri",
    ],
    materie: [
      "Ingineria Programelor",
      "Calcul mobil",
      "Proiectarea bazelor de date",
    ],
    profesor: [
      "Prof. Dr. Popescu",
      "Lect. Dr. Ionescu",
      "Asist. Dr. Georgescu",
    ],
    grupa: ["3141", "3142", "3143", "3144"],
  };

  const [faculty, setFaculty] = useState("");
  const [subject, setSubject] = useState("");
  const [professor, setProfessor] = useState("");
  const [group, setGroup] = useState("");
  const [date, setDate] = useState<dayjs.Dayjs | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const [isSubjectDropdownOpen, setIsSubjectDropdownOpen] = useState(false);
  const [isProfessorDropdownOpen, setIsProfessorDropdownOpen] = useState(false);

  const toggleDropdown =
    (dropdownSetter: (value: boolean) => void, currentValue: boolean) =>
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      dropdownSetter(!currentValue);
    };

  const handleSelection = (
    setter: (value: string) => void,
    value: string,
    dropdownSetter: (value: boolean) => void
  ) => {
    setter(value);
    dropdownSetter(false);
  };

  const toggleCalendar = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsCalendarOpen((prevState) => !prevState);
  };

  const handleDateChange = (newDate: dayjs.Dayjs | null) => {
    setDate(newDate);
    setIsCalendarOpen(false);
  };

  return (
    <main className="flex flex-col pb-40 bg-white max-md:pb-24">
      <h1 className="self-center mt-16 text-3xl font-medium text-blue-950 max-md:mt-10">
        Programare examene
      </h1>
      <h2 className="self-center mt-4 text-3xl font-medium leading-9 text-center text-blue-950">
        Sesiunea ordinară nr. 1<br /> An universitar 2024 - 2025
      </h2>

      <form className="flex flex-col gap-10 px-20 mt-20 w-full text-2xl font-medium text-blue-950 max-md:px-5 max-md:mt-10">
        <div className="flex justify-between w-full gap-6">
          <div className="flex flex-col w-[60%] gap-6">
            <div className="relative">
              <button
                onClick={toggleDropdown(
                  setIsFacultyDropdownOpen,
                  isFacultyDropdownOpen
                )}
                className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
              >
                {faculty || "Selectează Facultatea"}
              </button>

              {isFacultyDropdownOpen && (
                <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                  {options.facultate.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() =>
                        handleSelection(
                          setFaculty,
                          option,
                          setIsFacultyDropdownOpen
                        )
                      }
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown(
                  setIsSubjectDropdownOpen,
                  isSubjectDropdownOpen
                )}
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
                      onClick={() =>
                        handleSelection(
                          setSubject,
                          option,
                          setIsSubjectDropdownOpen
                        )
                      }
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="relative">
              <button
                onClick={toggleDropdown(
                  setIsProfessorDropdownOpen,
                  isProfessorDropdownOpen
                )}
                className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
              >
                {professor || "Selectează Profesorul"}
              </button>

              {isProfessorDropdownOpen && (
                <ul className="absolute w-full bg-white border border-slate-800 rounded shadow z-10 max-h-48 overflow-auto">
                  {options.profesor.map((option, index) => (
                    <li
                      key={index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() =>
                        handleSelection(
                          setProfessor,
                          option,
                          setIsProfessorDropdownOpen
                        )
                      }
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="flex flex-col w-[35%] gap-6">
            <button
              onClick={toggleCalendar}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              {date ? date.format("DD/MM/YYYY") : "Selectează Data"}{" "}
            </button>
            {isCalendarOpen && (
              <div className="p-4 bg-white rounded-lg border border-solid border-slate-800 shadow-md">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateCalendar value={date} onChange={handleDateChange} />
                </LocalizationProvider>
              </div>
            )}

            <div className="w-full">
              <label className="block mb-2 text-lg font-medium text-blue-950">
                Grupa
              </label>
              <select
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-800 rounded shadow"
              >
                <option value="">Selectează Grupa</option>
                {options.grupa.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
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
