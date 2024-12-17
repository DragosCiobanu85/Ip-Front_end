"use client";
import * as React from "react";
import { useExams } from "./context/examcontext";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

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
  const { homeExams } = useExams();

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
            {homeExams.length > 0 ? (
              homeExams.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.name}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.professor}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.assistant}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    {row.dataexamen.toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.sala}</StyledTableCell>
                  <StyledTableCell align="right">{row.ora}</StyledTableCell>
                </StyledTableRow>
              ))
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
