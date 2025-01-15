describe("template spec", () => {
  it("Profesorul se autentifică și șterge cererea de examen", () => {
    // Pasul 1: Profesorul se autentifică
    cy.visit("http://localhost:3000/login");

    const username2 = "pop@usm.ro";
    const password2 = "Parola12";

    cy.get("input[id='email']").clear().type(username2);
    cy.get("input[id='outlined-basic']").clear().type(password2);
    cy.get("button[type='submit']").click();

    // Verifică că profesorul este pe pagina corectă
    cy.url().should("include", "/teacherpage");

    // Pasul 2: Profesorul vizualizează cererea de examen
    cy.wait(2000); // Așteaptă datele
    cy.get("td:contains('PIU')").should("be.visible"); // Verifică existența datelor

    // Pasul 3: Profesorul dă click pe butonul "Anulează"
    cy.contains("Anulează").first().click();

    // Pasul 4: Dialogul apare, și confirmă ștergerea
    cy.contains("Ești sigur că dorești să anulezi cererea?").should("be.visible");
    cy.contains("Confirmă").click();

    // Pasul 5: Verifică că cererea a fost ștearsă
    cy.get("td:contains('PIU')").should("not.exist");
  });
});
