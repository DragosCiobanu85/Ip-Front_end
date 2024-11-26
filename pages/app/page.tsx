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
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Image from "next/image";
import icon from "../app/images/boy.png";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3", // Gri deschis pentru capul tabelului
    color: "#000",
    // Textul va fi negru
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

function createData(
  id: number,
  name: string,
  dataexamen: Date,
  sala: string,
  ora: number
) {
  const formattedDate = dataexamen.toLocaleDateString();
  return { id, name, formattedDate, sala, ora };
}

const rows = [
  createData(1, "Fizica 1", new Date("2024-12-01"), "Sala 101", 12),
  createData(2, "Matematici speciale", new Date("2024-01-14"), "Sala 202", 14),
  createData(3, "PCLP1", new Date("2024-01-20"), "Sala 101", 12),
  createData(4, "POO", new Date("2024-01-22"), "Sala 202", 14),
  createData(5, "Analiza matematica", new Date("2024-01-26"), "Sala 101", 12),
  createData(6, "Proiectare logica", new Date("2024-01-28"), "Sala 202", 14),
  createData(
    7,
    "Proiectare interfete utlizator",
    new Date("2024-01-30"),
    "Sala 101",
    12
  ),
  createData(8, "Fizica 2", new Date("2024-02-02"), "Sala 202", 14),
];

export default function Home() {
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
          marginLeft: "42px", // Adaugă margine de 42px pe stânga
          marginRight: "42px", // Adaugă margine de 42px pe dreapta
          maxWidth: "calc(100% - 84px)", // Setează lățimea tabelului mai mică
          margin: "0 auto", // Centrează tabelul pe orizontală
        }}
      >
        <Table
          sx={{ minWidth: 700 }}
          aria-label="customized table"
          style={{ tableLayout: "fixed" }} // Setează lățimea fixă pentru coloane
        >
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ width: "25%" }}>
                Materie
              </StyledTableCell>
              <StyledTableCell style={{ width: "25%" }} align="right">
                Data examen
              </StyledTableCell>
              <StyledTableCell style={{ width: "25%" }} align="right">
                Sala
              </StyledTableCell>
              <StyledTableCell style={{ width: "25%" }} align="right">
                Ora
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row">
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.formattedDate}
                </StyledTableCell>
                <StyledTableCell align="right">{row.sala}</StyledTableCell>
                <StyledTableCell align="right">{row.ora}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
