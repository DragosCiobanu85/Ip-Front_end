"use client";

import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

// Styling for the table cells
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Home() {
  const [examDetails, setExamDetails] = React.useState<any[]>([]);
  const [faculties, setFaculties] = React.useState<any[]>([]);
  const [professors, setProfessors] = React.useState<any[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [rooms, setRooms] = React.useState<any[]>([]);

  // Fetch data for exams, faculties, professors, subjects, and rooms
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from multiple API endpoints
        const [examsRes, facultiesRes, professorsRes, subjectsRes, roomsRes] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/examene/examene/"), // Exam data
            fetch("http://127.0.0.1:8000/facultati/"), // Faculties
            fetch("http://127.0.0.1:8000/profesori/profesori/"), // Professors
            fetch("http://127.0.0.1:8000/materii/materii/"), // Subjects
            fetch("http://127.0.0.1:8000/sali/"), // Rooms
          ]);

        if (
          examsRes.ok &&
          facultiesRes.ok &&
          professorsRes.ok &&
          subjectsRes.ok &&
          roomsRes.ok
        ) {
          const examsData = await examsRes.json();
          const facultiesData = await facultiesRes.json();
          const professorsData = await professorsRes.json();
          const subjectsData = await subjectsRes.json();
          const roomsData = await roomsRes.json();

          // Update state with the fetched data
          setExamDetails(examsData);
          setFaculties(facultiesData);
          setProfessors(professorsData);
          setSubjects(subjectsData);
          setRooms(roomsData);
        } else {
          console.error("Failed to fetch data from one or more APIs.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to map ID to name for different entities (faculties, subjects, etc.)
  const getNameById = (id: number, data: any[], key: string) => {
    const item = data.find((entry) => entry[key] === id); // Dacă id este de tip string
    return item ? item.nume : "N/A";
  };

  return (
    <>
      <title style={{ marginTop: "10px" }}>Programare examene</title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "40px",
            marginBottom: "13px",
          }}
        >
          Programare examene
        </h1>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "6px",
            marginBottom: "0px",
          }}
        >
          Sesiunea ordinara nr. 1
        </h1>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "2px",
            marginBottom: "20px",
          }}
        >
          An universitar 2024-2025
        </h1>
      </div>
      <TableContainer
        component={Paper}
        style={{
          marginLeft: "42px",
          marginRight: "42px",
          maxWidth: "calc(100% - 84px)",
          margin: "0 auto",
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          style={{ tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: "20%" }}>
                Materie
              </StyledTableCell>
              <StyledTableCell style={{ width: "20%" }} align="right">
                Profesor
              </StyledTableCell>
              <StyledTableCell style={{ width: "20%" }} align="right">
                Asistent
              </StyledTableCell>
              <StyledTableCell style={{ width: "20%" }} align="right">
                Data examen
              </StyledTableCell>
              <StyledTableCell style={{ width: "10%" }} align="right">
                Sala
              </StyledTableCell>
              <StyledTableCell style={{ width: "10%" }} align="right">
                Ora
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {examDetails.length > 0 ? (
              examDetails.map((row) => {
                // Adaugă log aici pentru a inspecta datele row
                console.log("Row data:", row);

                return (
                  <StyledTableRow key={row.id_Examen}>
                    <StyledTableCell component="th" scope="row">
                      {getNameById(row.id_Materie, subjects, "id_Materie")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {getNameById(row.id_Profesor, professors, "id_Profesor")}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {getNameById(
                        row.id_Profesor_1,
                        professors,
                        "id_Profesor"
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {new Date(row.data).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {getNameById(row.id_Sala, rooms, "id_Sala") !== "N/A"
                        ? getNameById(row.id_Sala, rooms, "id_Sala")
                        : "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.ora
                        ? new Date(`1970-01-01T${row.ora}`).toLocaleTimeString(
                            [],
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )
                        : "N/A"}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={6} align="center">
                  Nu sunt examene programate.
                </StyledTableCell>
              </StyledTableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
