"use client";

import Link from "next/link";
import * as React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Exam, useExams } from "../context/examcontext";
import { useRouter } from "next/navigation";
import { Token } from "@mui/icons-material";
import { jwtDecode } from "jwt-decode";

// Styled components
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

interface CustomJwtPayload {
  rol: string;
  user_details: {
    id: number;
    name: string;
    rol: string;
  };
}

export default function StudentAccount() {
  const { studentExams, removeExamFromStudent, removeExamFromTeacher } =
    useExams();
  const [rows, setRows] = useState<any[]>([]); // To store exams fetched from API
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [examToDelete, setExamToDelete] = useState<number | null>(null); // Track the exam to delete
  const [faculties, setFaculties] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [specializari, setSpecializari] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const router = useRouter();

  // Fetch exams from the API on component mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("auth_token");

        // Check if token exists
        if (!token) {
          router.push("/login");
          return; // Redirect to the 401 page if there's no token
          // Exit if there's no token
        }
        setIsAuthenticated(true);

        const decodedToken: CustomJwtPayload = jwtDecode(token); // Decodificarea corectă a tokenului

        if (
          decodedToken.rol !== "Student" &&
          decodedToken.user_details.rol !== "Student"
        ) {
          router.push("/login"); // Redirect to login if the role is not 'Profesor'
        }

        setIsAuthenticated(true);

        console.log("Token:", token); // Dacă există token, setăm autentificarea ca adevărată

        console.log("Token retrieved:", token); // Debugging line

        // Fetch exams
        const response = await fetch("http://127.0.0.1:8000/cereri/cereri/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRows(data); // Assuming the response contains the list of exams
        } else {
          console.error("Failed to fetch exams");
        }
      } catch (error) {
        console.error("Error fetching exams:", error);
      }
    };

    // Fetch exams on component mount
    fetchExams();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch faculties, professors, and subjects
  useEffect(() => {
    const fetchNames = async () => {
      try {
        // Fetch data from API
        const facultyResponse = await fetch("http://127.0.0.1:8000/facultati/");
        const professorResponse = await fetch(
          "http://127.0.0.1:8000/profesori/profesori/"
        );
        const subjectResponse = await fetch(
          "http://127.0.0.1:8000/materii/materii/"
        );
        const statusResponse = await fetch("http://127.0.0.1:8000/status/");
        const specializareResponse = await fetch(
          "http://127.0.0.1:8000/specializare/"
        );

        if (
          facultyResponse.ok &&
          professorResponse.ok &&
          subjectResponse.ok &&
          statusResponse.ok &&
          specializareResponse.ok
        ) {
          const facultyData = await facultyResponse.json();
          const professorData = await professorResponse.json();
          const subjectData = await subjectResponse.json();
          const statusData = await statusResponse.json();
          const specializareData = await specializareResponse.json();

          // Debugging logs
          console.log("Faculties:", facultyData);
          console.log("Professors:", professorData);
          console.log("Subjects:", subjectData);

          setFaculties(facultyData);
          setProfessors(professorData);
          setSubjects(subjectData);
          setStatus(statusData);
          setSpecializari(specializareData);
        } else {
          console.error("Failed to fetch names");
        }
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, []);

  // Function to handle canceling a request
  const handleCancel = async (id: number) => {
    setExamToDelete(id); // Set the exam to delete before showing the dialog
    setCancelMessage("Cererea va fi anulata! Ești sigur?");
    setOpenDialog(true); // Open the dialog for confirmation
  };

  // Function to confirm the deletion of the exam
  const confirmDelete = async () => {
    if (examToDelete !== null) {
      try {
        const token = localStorage.getItem("auth_token");
        // Trimite cererea de actualizare a statusului la anulata
        const response = await fetch(
          `http://127.0.0.1:8000/cereri/cereri/${examToDelete}/update-status-anulata`,
          {
            method: "PUT", // Folosim PUT pentru a actualiza cererea
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "anulata", // Trimit statusul "anulata"
            }),
          }
        );

        if (response.ok) {
          // Dacă cererea a fost anulată cu succes, actualizează UI-ul

          removeExamFromStudent(examToDelete);
          removeExamFromTeacher(examToDelete);
          setCancelMessage("Cererea a fost anulată!");
          const updatedRequest = await response.json(); // Așteaptă răspunsul cu cererea actualizată

          // Actualizează întreaga cerere în lista locală
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id_Cerere === examToDelete
                ? { ...row, ...updatedRequest } // Înlocuiește întreaga cerere cu cea actualizată
                : row
            )
          );
        } else {
          console.error("Failed to update cererea status");
        }
      } catch (error) {
        console.error("Error updating cererea status:", error);
      }

      setOpenDialog(false); // Închide dialogul după confirmare
    }
  };

  // Function to modify an exam
  const handleModifyClick = (exam: Exam) => {
    const queryParams = `?exam=${encodeURIComponent(JSON.stringify(exam))}`;
    router.push(`/examenmodificat${queryParams}`);
  };

  // Helper function to get the name by id
  const getNameById = (id: any, data: any[], key: string) => {
    const idAsNumber = Number(id); // Convertim ID-ul într-un număr
    const item = data.find((item) => Number(item[key]) === idAsNumber); // Folosim key pentru a căuta corect ID-ul

    if (item) {
      return item.nume; // Returnează numele
    }

    return "N/A"; // Dacă nu găsește, returnează "N/A"
  };

  if (isAuthenticated === null) {
    // Înainte să știm dacă este autenticat sau nu, putem returna un loading sau un fallback
    return <div>Loading...</div>;
  }

  return (
    <>
      <Link href={`/examen`} style={{ textDecoration: "none" }}>
        <Button
          variant="outlined"
          type="submit"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            margin: "0 auto",
            marginTop: "60px",
            backgroundColor: "#192041",
            color: "#ffffff",
            height: "55px",
            marginBottom: "30px",
            width: "350px",
          }}
        >
          Programare examen
        </Button>
      </Link>

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
              <StyledTableCell style={{ width: "14%", textAlign: "center" }}>
                Facultate
              </StyledTableCell>
              <StyledTableCell style={{ width: "17%", textAlign: "center" }}>
                Specializare
              </StyledTableCell>
              <StyledTableCell style={{ width: "14%", textAlign: "center" }}>
                Profesor
              </StyledTableCell>
              <StyledTableCell style={{ width: "14%", textAlign: "center" }}>
                Materie
              </StyledTableCell>
              <StyledTableCell style={{ width: "12%", textAlign: "center" }}>
                Data
              </StyledTableCell>
              <StyledTableCell style={{ width: "13%", textAlign: "center" }}>
                Status
              </StyledTableCell>

              <StyledTableCell style={{ width: "15%", textAlign: "center" }}>
                Acțiune
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id_Cerere}>
                {/* Facultate */}
                <StyledTableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {getNameById(row.id_Facultate, faculties, "id_Facultate")}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {getNameById(
                    row.id_Specializare,
                    specializari,
                    "id_Specializare"
                  )}
                </StyledTableCell>

                {/* Profesor */}
                <StyledTableCell align="center">
                  {getNameById(row.id_Profesor, professors, "id_Profesor")}
                </StyledTableCell>

                {/* Materie */}
                <StyledTableCell align="center">
                  {getNameById(row.id_Materie, subjects, "id_Materie")}
                </StyledTableCell>

                {/* Data examenului */}
                <StyledTableCell align="center">
                  {new Date(row.data).toLocaleDateString()}
                </StyledTableCell>

                <StyledTableCell align="center">
                  {getNameById(row.id_Status, status, "id_Status")}
                </StyledTableCell>
                {/* Acțiune */}
                <StyledTableCell align="center">
                  {/* Verifică dacă statusul este "anulata", dacă da, ascunde butoanele */}
                  {getNameById(row.id_Status, status, "id_Status") !==
                    "anulata" &&
                    getNameById(row.id_Status, status, "id_Status") !==
                      "respinsa" &&
                    getNameById(row.id_Status, status, "id_Status") !==
                      "respinsa" &&
                    getNameById(row.id_Status, status, "id_Status") !==
                      "acceptata" && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          gap: "0 10px",
                        }}
                      >
                        <Button
                          variant="outlined"
                          onClick={() => handleModifyClick(row)}
                        >
                          Modifică
                        </Button>
                        <Button
                          variant="outlined"
                          onClick={() => handleCancel(row.id_Cerere)}
                          style={{
                            marginLeft: "10px",
                            backgroundColor: "#FF0000",
                            color: "white",
                          }}
                        >
                          Anulează
                        </Button>
                      </div>
                    )}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for cancel confirmation */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmare anulare</DialogTitle>
        <DialogContent>{cancelMessage}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Închide
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              backgroundColor: "red",
              color: "#fff",
            }}
          >
            Confirmă
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
