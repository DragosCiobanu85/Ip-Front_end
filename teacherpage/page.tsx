"use client";

import React, {useState, useEffect} from "react";
import Button from "@mui/material/Button";
import {styled} from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import {Exam, useExams} from "../context/examcontext";
import {useRouter} from "next/navigation";
import {jwtDecode} from "jwt-decode";

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

interface CustomJwtPayload {
  rol: string;
  user_details: {
    id: number;
    name: string;
    rol: string;
  };
}
export default function RequestsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [specializari, setSpecializari] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [status, setStatus] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const router = useRouter();

  // Fetch data for requests, faculties, professors, and subjects
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("auth_token"); // Obține token-ul din localStorage
      if (!token) {
        router.push("/login"); // Redirect to the 401 page if there's no token
        return; // Exit if there's no token
      }
      const decodedToken: CustomJwtPayload = jwtDecode(token); // Decodificarea corectă a tokenului

      if (decodedToken.rol !== "Profesor" && decodedToken.user_details.rol !== "Profesor") {
        router.push("/login"); // Redirect to login if the role is not 'Profesor'
      }

      setIsAuthenticated(true);

      console.log("Token:", token); // Log token pentru a verifica

      const [
        requestsRes,
        facultiesRes,
        specializariRes,
        professorsRes,
        subjectsRes,
        studentsRes,
        groupsRes,
        statusRes,
      ] = await Promise.all([
        fetch("http://127.0.0.1:8000/cereri/cereri/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/facultati/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/specializare/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/profesori/profesori/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/materii/materii/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/studenti/studenti/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch("http://127.0.0.1:8000/grupe/grupe/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),

        fetch("http://127.0.0.1:8000/status/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      // Verifică statusul și loghează răspunsurile
      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        console.log("Cereri:", requestsData); // Log date cereri
        setRows(requestsData);
      } else {
        console.error("Eroare la cereri:", requestsRes.status);
      }

      if (facultiesRes.ok) {
        const facultiesData = await facultiesRes.json();
        console.log("Facultăți:", facultiesData); // Log date facultăți
        setFaculties(facultiesData);
      } else {
        console.error("Eroare la facultăți:", facultiesRes.status);
      }

      if (specializariRes.ok) {
        const specializariData = await specializariRes.json();
        console.log("Facultăți:", specializariData); // Log date facultăți
        setSpecializari(specializariData);
      } else {
        console.error("Eroare la facultăți:", specializariRes.status);
      }

      if (professorsRes.ok) {
        const professorsData = await professorsRes.json();
        console.log("Profesori:", professorsData); // Log date profesori
        setProfessors(professorsData);
      } else {
        console.error("Eroare la profesori:", professorsRes.status);
      }

      if (subjectsRes.ok) {
        const subjectsData = await subjectsRes.json();
        console.log("Materii:", subjectsData); // Log date materii
        setSubjects(subjectsData);
      } else {
        console.error("Eroare la materii:", subjectsRes.status);
      }
      if (studentsRes.ok) {
        const studentsData = await studentsRes.json();
        console.log("Studenti:", studentsData); // Log date materii
        setStudents(studentsData);
      } else {
        console.error("Eroare la materii:", studentsRes.status);
      }

      if (groupsRes.ok) {
        const groupsData = await groupsRes.json();
        console.log("Grupe sunt acestea gggggggg:", groupsData); // Log date materii
        setGroups(groupsData);
      } else {
        console.error("Eroare la materii:", groupsRes.status);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        console.log("Profesori:", statusData); // Log date profesori
        setStatus(statusData);
      } else {
        console.error("Eroare la profesori:", professorsRes.status);
      }
    } catch (error) {
      console.error("Error fetching data:", error); // Log error general
    }
  };

  // Helper function to map ID to name
  const getNameById = (id: number, data: any[], key: string) => {
    console.log("Căutăm id:", id); // Log pentru id-ul căutat
    console.log("Datele disponibile:", data); // Log pentru datele complete disponibile

    const item = data.find((entry) => {
      console.log(`Comparăm ${entry[key]} cu ${id}`);
      return entry[key] === id;
    });

    console.log("Obiect găsit:", item); // Log pentru obiectul găsit

    return item ? item.nume : "N/A"; // Returnează numele sau "N/A"
  };

  const handleModify = (exam: Exam) => {
    const queryParams = `?exam=${encodeURIComponent(JSON.stringify(exam))}`;
    router.push(`/examenprofesor${queryParams}`);
  };

  // Handle canceling a request
  const handleCancel = (id: number) => {
    setRequestToDelete(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete !== null) {
      try {
        const token = localStorage.getItem("auth_token");

        // Trimite cererea de actualizare a statusului la "respins"
        const response = await fetch(
          `http://127.0.0.1:8000/cereri/cereri/${requestToDelete}/update-status-respinsa`,
          {
            method: "PUT", // Folosim PUT pentru a actualiza cererea
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              status: "respinsa", // Trimit statusul "respins"
            }),
          }
        );

        if (response.ok) {
          // Dacă cererea a fost respinsă cu succes, actualizează UI-ul
          console.log("Cererea a fost respinsă!");
          const updatedRequest = await response.json(); // Așteaptă răspunsul cu cererea actualizată

          // Actualizează întreaga cerere în lista locală
          setRows((prevRows) =>
            prevRows.map((row) =>
              row.id_Cerere === requestToDelete
                ? {...row, ...updatedRequest} // Înlocuiește întreaga cerere cu cea actualizată
                : row
            )
          );
        } else {
          console.error("Failed to update cererea status to respinsă.");
        }
      } catch (error) {
        console.error("Error updating cererea status:", error);
      } finally {
        setOpenDialog(false); // Închide dialogul după confirmare
      }
    }
  };

  useEffect(() => {
    fetchData(); // Apelăm funcția la montarea componentei
  }, []);

  if (isAuthenticated === null) {
    // Înainte să știm dacă este autenticat sau nu, putem returna un loading sau un fallback
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          margin: "50px 0",
          fontSize: "2rem",
          fontWeight: "bold",
          color: "#333",
        }}>
        Cereri Examene
      </h1>
      <div style={{display: "flex", justifyContent: "center", marginTop: "20px"}}>
        <TableContainer
          component={Paper}
          style={{
            maxWidth: "95%", // Setează lățimea maximă a tabelului
            margin: "auto", // Centrează tabelul
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adaugă o umbră discretă
          }}>
          <Table
            aria-label="customized table"
            style={{
              tableLayout: "fixed", // Forțează coloanele să aibă dimensiuni fixe
              width: "100%", // Asigură că tabelul ocupă întreaga lățime disponibilă
            }}>
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Facultate
                </StyledTableCell>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Specializare
                </StyledTableCell>

                <StyledTableCell align="center" style={{width: "12%"}}>
                  Studentul care a facut cererea
                </StyledTableCell>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Grupa din care face parte studentul
                </StyledTableCell>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Materie
                </StyledTableCell>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Data
                </StyledTableCell>
                <StyledTableCell align="center" style={{width: "12%"}}>
                  Status
                </StyledTableCell>

                <StyledTableCell align="center" style={{width: "12%"}}>
                  Acțiuni
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => {
                console.log("Row current:", row); // Log pentru obiectul complet

                return (
                  <StyledTableRow key={row.id_Cerere}>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Facultate, faculties, "id_Facultate")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Specializare, specializari, "id_Specializare")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Student, students, "id_Student")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Grupa, groups, "id_Grupa")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Materie, subjects, "id_Materie")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {new Date(row.data).toLocaleDateString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Status, status, "id_Status")}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {getNameById(row.id_Status, status, "id_Status") !== "anulata" &&
                        getNameById(row.id_Status, status, "id_Status") !== "respinsa" &&
                        getNameById(row.id_Status, status, "id_Status") !== "acceptata" && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-around",
                              gap: "0 10px",
                            }}>
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleModify(row)}>
                              Acceptă
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              onClick={() => handleCancel(row.id_Cerere)}>
                              Respinge
                            </Button>
                          </div>
                        )}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmare ștergere</DialogTitle>
        <DialogContent>Sunteti sigur că doriti să respingeti cererea?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Inchide</Button>
          <Button
            onClick={confirmDelete}
            sx={{
              backgroundColor: "red",
              color: "#fff",
            }}>
            Confirmă
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
