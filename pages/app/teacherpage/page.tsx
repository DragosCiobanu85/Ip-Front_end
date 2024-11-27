"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useExams, Exam } from "../context/examcontext";

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

export default function TeacherAccount() {
  const { teacherExams, removeExamFromTeacher, removeExamFromStudent } =
    useExams();
  const router = useRouter();

  const handleCancel = (id: number) => {
    removeExamFromTeacher(id);
    removeExamFromStudent(id);
  };

  const handleEdit = (exam: Exam) => {
    const url = `/examenprofesor?id=${exam.id}&name=${encodeURIComponent(
      exam.name
    )}&grupa=${encodeURIComponent(exam.grupa)}&data=${encodeURIComponent(
      exam.dataexamen.toLocaleDateString()
    )}`;
    router.push(url);
  };

  return (
    <div>
      <h1
        style={{ textAlign: "center", marginTop: "50px", marginBottom: "40px" }}
      >
        Cereri de examene
      </h1>
      <TableContainer
        component={Paper}
        style={{
          margin: "20px auto",
          maxWidth: "90%",
        }}
      >
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                Materie
              </StyledTableCell>
              <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                Grupa
              </StyledTableCell>
              <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                Data examen
              </StyledTableCell>
              <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                Acțiune
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teacherExams.map((exam) => (
              <StyledTableRow key={exam.id}>
                <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                  {exam.name}
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                  {exam.grupa}
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                  {exam.dataexamen.toLocaleDateString()}
                </StyledTableCell>
                <StyledTableCell style={{ textAlign: "center", width: "25%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      width: "100%",
                    }}
                  >
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(exam)}
                    >
                      Modifică
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEdit(exam)}
                    >
                      Accepta
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      color="error"
                      onClick={() => handleCancel(exam.id)}
                    >
                      Anulează
                    </Button>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
