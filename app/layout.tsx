"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import HomeIcon from "./images/person101.png";
import LoginIcon from "./images/backarrow.png";
import HomeIcon1 from "./images/home.png";
import Sigla from "./images/poza.png";
import { ExamProvider } from "./context/examcontext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        style={{
          margin: "0px",
          width: "100%",
          height: "100vh",
          overflowX: "hidden",
        }}
      >
        <ExamProvider>
          <div
            style={{
              position: "fixed",
              top: "10%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 1,
            }}
          >
            <Image
              src={Sigla}
              alt="Logo"
              width={169}
              height={180}
              style={{
                objectFit: "contain",
              }}
            />
          </div>

          <header
            style={{
              backgroundColor: "#192041",
              color: "white",
              width: "100%",
              height: "72px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {pathname === "/" ? (
              <Link href="/login">
                <Image
                  src={HomeIcon}
                  alt="Go to Login"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : pathname === "/login" ? (
              <Link href="/">
                <Image
                  src={LoginIcon}
                  alt="Home Icon"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : pathname === "/studentpage" ? (
              <Link href="/">
                <Image
                  src={HomeIcon1}
                  alt="Back to Home"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : pathname === "/teacherpage" ? (
              <Link href="/">
                <Image
                  src={HomeIcon1}
                  alt="Back to Home"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : pathname === "/examen" ? (
              <Link href="/studentpage">
                <Image
                  src={LoginIcon}
                  alt="Back to Home"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : pathname === "/examenprofesor" ? (
              <Link href="/teacherpage">
                <Image
                  src={LoginIcon}
                  alt="Back to Home"
                  width={40}
                  height={40}
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                  }}
                />
              </Link>
            ) : null}
          </header>

          <h1
            style={{
              backgroundColor: "#272F54",
              height: "72px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "0px",
            }}
          ></h1>

          {children}
        </ExamProvider>
      </body>
    </html>
  );
}
