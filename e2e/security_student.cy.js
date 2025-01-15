describe("Security Tests for Authentication", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
  });

  it("Simulează încercări multiple de autentificare cu parole greșite", () => {
    const username = "pop@student.usv.ro";
    const wrongPassword = "parola_gresita";

    for (let i = 0; i < 5; i++) {
      cy.get("input[id='email']").clear().type(username);
      cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
      cy.get("button[type='submit']").click();

      // Verifică dacă apare mesajul de eroare corect pentru email sau parolă incorectă
      cy.get("#outlined-basic-helper-text").should("contain", "Email sau parolă incorectă.");
    }
  });

  it("Verifică dacă aplicația limitează numărul de încercări", () => {
    const username = "lavinia@student.usv.ro";
    const wrongPassword = "parola_gresita";

    cy.get("input[id='email']").clear().type(username);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    cy.get("#outlined-basic-helper-text").should("contain", "Cont blocat temporar");
  });

  it("Analizează răspunsurile aplicației pentru indicii despre existența utilizatorilor", () => {
    const existingUser = "lavinia@student.usv.ro";
    const nonExistingUser = "utilizator_inexistent";
    const wrongPassword = "parola_gresita";

    cy.get("input[id='email']").clear().type(nonExistingUser);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    // Verify that error message does not contain "Utilizator inexistent"
    cy.get(".setEmailError").should("not.contain", "Utilizator inexistent");

    // Verify that error message contains "Please enter a valid email address."
    cy.get(".setEmailError").should("contain", "Please enter a valid email address.");

    // Test with existing user
    cy.get("input[id='email']").clear().type(existingUser);
    cy.get("input[id='outlined-basic']").clear().type(wrongPassword);
    cy.get("button[type='submit']").click();

    // Verify error message for existing user
    cy.get(".setEmailError").should("contain", "Please enter a valid email address.");
  });

  it("Autentificare corectă cu utilizatorul și parola corecte", () => {
    const username = "lavinia@student.usv.ro";
    const password = "Parola12";

    cy.get("input[id='email']").clear().type(username);
    cy.get("input[id='outlined-basic']").clear().type(password);
    cy.get("button[type='submit']").click();

    cy.url().should("include", "/studentpage");
  });
});
