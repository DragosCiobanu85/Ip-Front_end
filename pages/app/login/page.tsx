// acest cod este pentru Desktop 2 din figma
"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import * as React from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    } else {
      setEmailError("");
    }

    const emailDomain = email.split("@")[1];

    try {
      const response = await fetch("http://127.0.0.1:8000/useri/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          parola: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login success - Redirecționează utilizatorul pe baza domeniului
        if (emailDomain === "student.usv.ro") {
          router.push("/studentpage");
        } else if (emailDomain === "usm.ro") {
          router.push("/teacherpage");
        }
      } else {
        // Dacă login-ul a eșuat
        setPasswordError(data.message || "Email sau parolă incorectă.");
      }
    } catch (error) {
      console.error("Eroare la trimiterea cererii de login:", error);
      setPasswordError("A apărut o eroare la autentificare.");
    }
  };

  return (
    <>
      <title>Programare examene</title>
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
            marginTop: "80px",
            marginBottom: "18px",
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
          }}>
          An universitar 2024-2025
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            error={!!emailError}
            helperText={emailError}
            style={{marginBottom: "20px", marginTop: "40px", width: "300px"}}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#192041",
                },
                "&:hover fieldset": {
                  borderColor: "#192041",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#192041",
                },
              },
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}>
          <TextField
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={!!passwordError}
            helperText={passwordError}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#192041",
                },
                "&:hover fieldset": {
                  borderColor: "#192041",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#192041",
                },
              },
            }}
            style={{width: "300px", marginBottom: "17px"}}
          />
        </div>
        <Button
          variant="contained"
          type="submit"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            margin: "0 auto",
            marginTop: "20px",
            backgroundColor: "#192041",
            width: "300px",
          }}>
          Login
        </Button>
      </form>
    </>
  );
}