// acest cod este pentru Desktop 7 din figma
"use client";
import * as React from "react";
import {useState} from "react";
import {styled} from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, {tableCellClasses} from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {useRouter} from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // import arrowback icon

// Styling pentru celulele tabelului
const StyledTableCell = styled(TableCell)(({theme}) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#d3d3d3",
    color: "#000",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Styling pentru rândurile tabelului
const StyledTableRow = styled(TableRow)(({theme}) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

// Funcție pentru a crea datele pentru tabel
function createData(
  id: number,
  name: string,
  dataexamen: Date,
  ora: number,
  sala: string,
  grupa: string
) {
  const formattedDate = dataexamen.toLocaleDateString();
  return {id, name, formattedDate, ora, sala, grupa};
}

export default function TeacherAccount() {
  const [rows, setRows] = useState([
    createData(1, "Fizica 1", new Date("2024-12-01"), 12, "Sala 101", "3142A"),
    createData(2, "Matematici speciale", new Date("2024-12-01"), 14, "Sala 202", "3141A"),
    createData(3, "PCLP1", new Date("2024-12-01"), 12, "Sala 101", "3142B"),
    createData(4, "POO", new Date("2024-12-01"), 14, "Sala 202", "3142C"),
    createData(5, "Analiza matematica", new Date("2024-12-01"), 12, "Sala 101", "3143A"),
    createData(6, "Proiectare logica", new Date("2024-12-01"), 14, "Sala 202", "3147A"),
    createData(
      7,
      "Proiectare interfete utlizator",
      new Date("2024-12-01"),
      12,
      "Sala 101",
      "3148A"
    ),
    createData(8, "Fizica 2", new Date("2024-12-01"), 14, "Sala 202", "3142D"),
  ]);

  const router = useRouter(); // Initialize useRouter

  const handleBack = () => {
    router.back(); // Go back to the previous page
  };

  return (
    <>
      {}
      <ArrowBackIcon
        onClick={handleBack}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          zIndex: 10,
          fontSize: "3rem",
          color: "ffffff",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginBottom: "18px",
        }}>
        <h1 style={{marginTop: "40px"}}>Examene Programate</h1>
      </div>
      <TableContainer
        component={Paper}
        style={{
          marginLeft: "42px",
          marginRight: "42px",
          maxWidth: "calc(100% - 84px)",
          margin: "0 auto",
          marginTop: "20px",
        }}>
        <Table sx={{minWidth: 700}} aria-label="customized table" style={{tableLayout: "fixed"}}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{width: "20%", textAlign: "center"}}>Materie</StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Data examen
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Ora
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Sala
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Grupa
              </StyledTableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell component="th" scope="row" style={{textAlign: "center"}}>
                  {row.name}
                </StyledTableCell>
                <StyledTableCell align="center">{row.formattedDate}</StyledTableCell>
                <StyledTableCell align="center" style={{textAlign: "center"}}>
                  {row.ora}
                </StyledTableCell>
                <StyledTableCell align="center" style={{textAlign: "center"}}>
                  {row.sala}
                </StyledTableCell>
                <StyledTableCell align="center" style={{textAlign: "center"}}>
                  {row.grupa}
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
