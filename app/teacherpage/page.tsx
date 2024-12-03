"use client";

import React, { useState, useEffect } from "react";
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

export default function RequestsTable() {
  const [rows, setRows] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [professors, setProfessors] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<number | null>(null);
  const router = useRouter();

  // Fetch data for requests, faculties, professors, and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsRes, facultiesRes, professorsRes, subjectsRes] =
          await Promise.all([
            fetch("http://127.0.0.1:8000/cereri/cereri/"),
            fetch("http://127.0.0.1:8000/facultati/"),
            fetch("http://127.0.0.1:8000/profesori/profesori/"),
            fetch("http://127.0.0.1:8000/materii/materii/"),
          ]);

        if (
          requestsRes.ok &&
          facultiesRes.ok &&
          professorsRes.ok &&
          subjectsRes.ok
        ) {
          setRows(await requestsRes.json());
          setFaculties(await facultiesRes.json());
          setProfessors(await professorsRes.json());
          setSubjects(await subjectsRes.json());
        } else {
          console.error("Failed to fetch one or more data sources.");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Helper function to map ID to name
  const getNameById = (id: number, data: any[], key: string) => {
    const item = data.find((entry) => entry[key] === id);
    return item ? item.nume : "N/A";
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
        const response = await fetch(
          `http://127.0.0.1:8000/cereri/cereri/${requestToDelete}/`,
          { method: "DELETE" }
        );

        if (response.ok) {
          setRows((prevRows) =>
            prevRows.filter((row) => row.id_Cerere !== requestToDelete)
          );
        } else {
          console.error("Failed to delete request.");
        }
      } catch (error) {
        console.error("Error deleting request:", error);
      } finally {
        setOpenDialog(false);
      }
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "50px 0" }}>Cereri Examene</h1>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <TableContainer
          component={Paper}
          style={{
            maxWidth: "95%", // Setează lățimea maximă a tabelului
            margin: "auto", // Centrează tabelul
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Adaugă o umbră discretă
          }}
        >
          <Table
            aria-label="customized table"
            style={{
              tableLayout: "fixed", // Forțează coloanele să aibă dimensiuni fixe
              width: "100%", // Asigură că tabelul ocupă întreaga lățime disponibilă
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell align="center" style={{ width: "15%" }}>
                  Facultate
                </StyledTableCell>
                <StyledTableCell align="center" style={{ width: "15%" }}>
                  Profesor
                </StyledTableCell>
                <StyledTableCell align="center" style={{ width: "15%" }}>
                  Materie
                </StyledTableCell>
                <StyledTableCell align="center" style={{ width: "15%" }}>
                  Data
                </StyledTableCell>

                <StyledTableCell align="center" style={{ width: "25%" }}>
                  Acțiuni
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id_Cerere}>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Facultate, faculties, "id_Facultate")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Profesor, professors, "id_Profesor")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {getNameById(row.id_Materie, subjects, "id_Materie")}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {new Date(row.data).toLocaleDateString()}
                  </StyledTableCell>

                  <StyledTableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleModify(row)}
                      style={{ marginRight: "10px" }}
                    >
                      Modifică
                    </Button>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleModify(row.id_Cerere)}
                      style={{ marginRight: "10px" }}
                    >
                      Acceptă
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleCancel(row.id_Cerere)}
                    >
                      Anulează
                    </Button>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmare ștergere</DialogTitle>
        <DialogContent>Ești sigur că dorești să anulezi cererea?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Anulează</Button>
          <Button onClick={confirmDelete} color="secondary">
            Confirmă
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
