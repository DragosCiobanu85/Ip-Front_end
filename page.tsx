"use client";

import * as React from "react";
import {styled} from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

// Styling for the table cells
const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
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
  const [specializari, setSpecializari] = React.useState<any[]>([]);
  const [professors, setProfessors] = React.useState<any[]>([]);
  const [subjects, setSubjects] = React.useState<any[]>([]);
  const [groups, setGroups] = React.useState<any[]>([]);
  const [rooms, setRooms] = React.useState<any[]>([]);
  // Filtre
  const [selectedGroup, setSelectedGroup] = React.useState<string>("");
  const [selectedSubject, setSelectedSubject] = React.useState<string>("");
  const [selectedProfessor, setSelectedProfessor] = React.useState<string>("");

  const filteredExamDetails = examDetails.filter((exam) => {
    const matchesGroup = !selectedGroup || exam.id_Grupa === parseInt(selectedGroup);
    const matchesSubject = !selectedSubject || exam.id_Materie === parseInt(selectedSubject);
    const matchesProfessor = !selectedProfessor || exam.id_Profesor === parseInt(selectedProfessor);

    return matchesGroup && matchesSubject && matchesProfessor;
  });
  // Fetch data for exams, faculties, professors, subjects, and rooms
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from multiple API endpoints
        const [
          examsRes,
          facultiesRes,
          specializariRes,
          professorsRes,
          groupsRes,
          subjectsRes,
          roomsRes,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/examene/examene/"), // Exam data
          fetch("http://127.0.0.1:8000/facultati/"),
          fetch("http://127.0.0.1:8000/specializare/"),
          fetch("http://127.0.0.1:8000/profesori/profesori/"),
          fetch("http://127.0.0.1:8000/grupe/grupe/"), // Professors
          fetch("http://127.0.0.1:8000/materii/materii/"), // Subjects
          fetch("http://127.0.0.1:8000/sali/"), // Rooms
        ]);

        if (
          examsRes.ok &&
          facultiesRes.ok &&
          specializariRes.ok &&
          professorsRes.ok &&
          groupsRes &&
          subjectsRes.ok &&
          roomsRes.ok
        ) {
          const examsData = await examsRes.json();
          const facultiesData = await facultiesRes.json();
          const specializariData = await specializariRes.json();
          const professorsData = await professorsRes.json();
          const groupsData = await groupsRes.json();
          const subjectsData = await subjectsRes.json();
          const roomsData = await roomsRes.json();

          // Update state with the fetched data
          setExamDetails(examsData);
          setFaculties(facultiesData);
          setSpecializari(specializariData);
          setProfessors(professorsData);
          setGroups(groupsData);
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
      <title style={{marginTop: "10px"}}>Programare examene</title>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "40px",
            marginBottom: "13px",
          }}>
          Programare examene
        </h1>

        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "6px",
            marginBottom: "0px",
          }}>
          Sesiunea ordinara nr. 1
        </h1>
        <h1
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            color: "#333",
            marginTop: "2px",
            marginBottom: "20px",
          }}>
          An universitar 2024-2025
        </h1>
      </div>
      {/* Filtreleeeeeeeeeeeeeeeeeee */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "20px",
          flexWrap: "wrap",
          width: "100%",
          color: "#ff5722",
        }}>
        <FormControl style={{minWidth: 120, margin: "5px"}}>
          <InputLabel>Grupa</InputLabel>
          <Select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            label="Grupa">
            <MenuItem value="">
              <em>Toate</em>
            </MenuItem>
            {groups.map((group) => (
              <MenuItem key={group.id_Grupa} value={group.id_Grupa}>
                {group.nume}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{minWidth: 120, margin: "5px"}}>
          <InputLabel>Materie</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            label="Materie">
            <MenuItem value="">
              <em>Toate</em>
            </MenuItem>
            {subjects.map((subject) => (
              <MenuItem key={subject.id_Materie} value={subject.id_Materie}>
                {subject.nume}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl style={{minWidth: 120, margin: "5px"}}>
          <InputLabel>Profesor</InputLabel>
          <Select
            value={selectedProfessor}
            onChange={(e) => setSelectedProfessor(e.target.value)}
            label="Profesor">
            <MenuItem value="">
              <em>Toți</em>
            </MenuItem>
            {professors.map((professor) => (
              <MenuItem key={professor.id_Profesor} value={professor.id_Profesor}>
                {professor.nume}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* tabela cu exameneeeeeeeeeeee */}
      <TableContainer
        component={Paper}
        style={{marginLeft: "42px", marginRight: "42px", margin: "0 auto"}}>
        <Table sx={{minWidth: 700}} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Facultate</StyledTableCell>
              <StyledTableCell align="center">Specializare</StyledTableCell>
              <StyledTableCell align="center">Profesor</StyledTableCell>
              <StyledTableCell align="center">Materie</StyledTableCell>
              <StyledTableCell align="center">Grupa</StyledTableCell>
              <StyledTableCell align="center">Asistent</StyledTableCell>
              <StyledTableCell align="center">Data examen</StyledTableCell>
              <StyledTableCell align="center">Sala</StyledTableCell>
              <StyledTableCell align="center">Ora</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExamDetails.length > 0 ? (
              filteredExamDetails.map((row) => (
                <StyledTableRow key={row.id_Examen}>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Facultate, faculties, "id_Facultate")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Specializare, specializari, "id_Specializare")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Profesor, professors, "id_Profesor")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Materie, subjects, "id_Materie")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Grupa, groups, "id_Grupa")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Profesor_1, professors, "id_Profesor")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(row.data).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Sala, rooms, "id_Sala") || "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.ora
                      ? new Date(`1970-01-01T${row.ora}`).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "N/A"}
                  </StyledTableCell>
                </StyledTableRow>
              ))
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={9} align="center">
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
