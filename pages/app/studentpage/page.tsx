"use client";
import Link from "next/link";
import * as React from "react";
import {useState} from "react";
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

function createData(id: number, name: string, dataexamen: Date, sala: string, ora: number) {
  const formattedDate = dataexamen.toLocaleDateString();
  return {id, name, formattedDate, sala, ora};
}

export default function StudentAccount() {
  const [rows, setRows] = useState([
    createData(1, "Fizica 1", new Date("2024-12-01"), "Sala 101", 12),
    createData(2, "Matematici speciale", new Date("2024-01-14"), "Sala 202", 14),
    createData(3, "PCLP1", new Date("2024-01-20"), "Sala 101", 12),
    createData(4, "POO", new Date("2024-01-22"), "Sala 202", 14),
    createData(5, "Analiza matematica", new Date("2024-01-26"), "Sala 101", 12),
    createData(6, "Proiectare logica", new Date("2024-01-28"), "Sala 202", 14),
    createData(7, "Proiectare interfete utlizator", new Date("2024-01-30"), "Sala 101", 12),
    createData(8, "Fizica 2", new Date("2024-02-02"), "Sala 202", 14),
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");
  const handleCancel = (id: number) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
    setCancelMessage("Examenul a fost anulat!");
    setOpenDialog(true);
  };

  return (
    <>
      <Link href={`/examen`} style={{textDecoration: "none"}}>
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
          }}>
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
        }}>
        <Table sx={{minWidth: 700}} aria-label="customized table" style={{tableLayout: "fixed"}}>
          <TableHead>
            <TableRow>
              <StyledTableCell style={{width: "20%", textAlign: "center"}}>Materie</StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Data examen
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Sala
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Ora
              </StyledTableCell>
              <StyledTableCell style={{width: "20%", textAlign: "center"}} align="right">
                Acțiune
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
                  {row.sala}
                </StyledTableCell>
                <StyledTableCell align="center" style={{textAlign: "center"}}>
                  {row.ora}
                </StyledTableCell>
                <StyledTableCell
                  align="center"
                  style={{
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                  }}>
                  <Link href={`/examen`} passHref>
                    <Button variant="outlined" size="small" style={{margin: "0 5px"}}>
                      Modifică
                    </Button>
                  </Link>

                  <Button variant="outlined" onClick={() => handleCancel(row.id)}>
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
        }}>
        <DialogTitle sx={{backgroundColor: "#272F54", color: "#ffffff"}}>Mesaj</DialogTitle>
        <DialogContent sx={{backgroundColor: "#ffffff", color: "#000000"}}>
          <p>{cancelMessage}</p>
        </DialogContent>
        <DialogActions sx={{color: "#272F54", backgroundColor: "#ffffff"}}>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{color: "#272F54", backgroundColor: "#ffffff"}}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
