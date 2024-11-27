"use client";

import Link from "next/link";
import * as React from "react";
import { useState } from "react";
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

export default function StudentAccount() {
  const { studentExams, removeExamFromStudent, removeExamFromTeacher } =
    useExams();
  const [rows, setRows] = useState(studentExams);
  const [openDialog, setOpenDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const router = useRouter();

  const handleCancel = (id: number) => {
    removeExamFromStudent(id);
    removeExamFromTeacher(id);

    setRows((prevRows) => prevRows.filter((exam) => exam.id !== id));

    setCancelMessage("Examenul a fost anulat!");
    setOpenDialog(true);
  };

  const handleModifyClick = (exam: Exam) => {
    const queryParams = `?exam=${encodeURIComponent(JSON.stringify(exam))}`;
    router.push(`/examen${queryParams}`);
  };

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
            marginTop: "40px",
            backgroundColor: "#ffffff",
            color: "#000000",
            height: "55px",
            marginBottom: "30px",
          }}
          sx={{
            width: "calc(100% - 84px)",
            marginLeft: "42px",
            marginRight: "42px",
            "&:hover": {
              backgroundColor: "#1E90FF",
              color: "#ffffff",
              borderColor: "#1E90FF",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#192041",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#192041",
              },
            },
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
              <StyledTableCell style={{ width: "20%", textAlign: "center" }}>
                Materie
              </StyledTableCell>
              <StyledTableCell
                style={{ width: "20%", textAlign: "center" }}
                align="right"
              >
                Data examen
              </StyledTableCell>
              <StyledTableCell
                style={{ width: "20%", textAlign: "center" }}
                align="right"
              >
                Sala
              </StyledTableCell>
              <StyledTableCell
                style={{ width: "20%", textAlign: "center" }}
                align="right"
              >
                Ora
              </StyledTableCell>
              <StyledTableCell
                style={{ width: "20%", textAlign: "center" }}
                align="right"
              >
                Acțiune
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {studentExams.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell
                  component="th"
                  scope="row"
                  style={{ textAlign: "center" }}
                >
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {new Date(row.dataexamen).toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell align="center" style={{ textAlign: "center" }}>
                  {row.sala}
                </StyledTableCell>
                <StyledTableCell align="center" style={{ textAlign: "center" }}>
                  {row.ora}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    style={{ margin: "0 5px" }}
                    onClick={() => handleModifyClick(row)}
                  >
                    Modifică
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => handleCancel(row.id)}
                  >
                    Anulează
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#f0f8ff",
            color: "#333",
            borderRadius: "12px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          },
        }}
      >
        <DialogTitle sx={{ backgroundColor: "#272F54", color: "#ffffff" }}>
          Mesaj
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: "#ffffff", color: "#000000" }}>
          <p>{cancelMessage}</p>
        </DialogContent>
        <DialogActions sx={{ color: "#272F54", backgroundColor: "#ffffff" }}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: "#272F54", backgroundColor: "#ffffff" }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
