//2 si 3 ar trebui sa dea fail ca nu avem asa ceva implementat
describe("Security Tests for Authentication", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("Simulează încercări multiple de autentificare cu parole greșite", () => {
    const username = "lavinia@student.ro";
    const wrongPassword = "parola_gresita";

    for (let i = 0; i < 5; i++) {
      cy.get("input[id='email']").clear().type(username);
      cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
      cy.get("button[type='submit']").click();

      // Verifică dacă apare mesajul de eroare corect pentru email sau parolă incorectă
      cy.get(".setPasswordError").should("contain", "Email sau parolă incorect");
    }
  });

  it("Verifică dacă aplicația limitează numărul de încercări", () => {
    const username = "lavinia@student.ro";
    const wrongPassword = "parola_gresita";

    cy.get("input[id='email']").clear().type(username);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    cy.get(".setPasswordError").should("contain", "Cont blocat temporar");
  });

  it("Analizează răspunsurile aplicației pentru indicii despre existența utilizatorilor", () => {
    const existingUser = "lavinia@student.ro";
    const nonExistingUser = "utilizator_inexistent";
    const wrongPassword = "parola_gresita";

    cy.get("input[id='email']").clear().type(nonExistingUser);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    cy.get(".setEmailError").should("not.contain", "Utilizator inexistent");
    cy.get(".setEmailError").should("contain", "Please enter a valid email address.");

    cy.get("input[id='email']").clear().type(existingUser);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    cy.get(".setEmailError").should("contain", "Please enter a valid email address.");
  });

  it("Autentificare corectă cu utilizatorul și parola corecte", () => {
    const username = "lavinia@student.ro";
    const password = "Parola12";

    cy.get("input[id='email']").clear().type(username);
    cy.get("input[id='outlined-basic']").clear().type(password);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/studentpage");
  });
});
