describe("Proces de programare a examenului", () => {
  it("Studentul se autentifică și completează formularul de programare a examenului", () => {
    // Pasul 1: Studentul accesează aplicația
    cy.visit("http://localhost:3000/login");

    const username1 = "lavinia@student.ro";
    const password1 = "Parola12";

    // Pasul 2: Studentul se autentifică
    cy.get("input[id='email']").clear().type(username1);
    cy.get("input[id='outlined-basic']").clear().type(password1);
    cy.get("button[type='submit']").click();

    // Verifică dacă studentul este autentificat
    cy.url().should("include", "/studentpage");

    // După logare, apasă butonul 'Programare examen'
    cy.contains("Programare examen").should("be.visible").click(); // Căutăm butonul cu textul 'Programare examen'

    // Verificăm dacă suntem redirecționați corect după ce apasăm pe buton
    cy.url().should("include", "/examen"); // Verifică dacă pagina este schimbată

    // Pasul 3: Completarea formularului de programare a examenului
    cy.contains("Selectează Materia").click(); // Folosește textul corect pentru Materia
    cy.get("ul li").first().click(); // Selectează prima opțiune Materia

    // Selectează Profesorul
    cy.contains("Selectează Profesorul").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Profesorul

    // Selectează Facultatea
    cy.contains("Selectează Facultatea").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Facultatea

    // Selectează Data
    cy.contains("Selectează Data").click();
    cy.get("[role='gridcell']").contains("22").click(); // Selectează o dată

    // Trimite cererea pentru aprobare
    cy.get("button[type='submit']").click();
  });

  it("Profesorul se autentifică și aprobă cererea de examen", () => {
    // Pasul 4: Profesorul se autentifică
    cy.visit("http://localhost:3000/login");

    const username2 = "lavinia@usm.ro";
    const password2 = "Parola12";

    cy.get("input[id='email']").clear().type(username2);
    cy.get("input[id='outlined-basic']").clear().type(password2);
    cy.get("button[type='submit']").click();

    // Verifică că profesorul este pe pagina corectă
    cy.url().should("include", "/teacherpage");

    // Pasul 5: Profesorul vizualizează cererea de examen
    cy.wait(2000); // Wait for 2 seconds
    cy.get(".id_Materie", {timeout: 10000}).should("be.visible");
    cy.get(".id_Materie").should("contain", "PIU");

    // Profesorul aprobă cererea
    cy.contains("Acceptă").first().click(); // Căutăm butonul "Acceptă" și îl click-uim pe primul din listă
  });

  it("Studentul verifică dacă cererea aprobată apare în secțiunea „Examene programate”", () => {
    // Pasul 6: Studentul verifică cererea aprobată
    cy.visit("http://localhost:3000/");

    // Verifică că tabelul de examene este vizibil
    cy.get("table").should("be.visible");

    // Verifică că mesajul "Nu sunt examene programate." NU este vizibil
    cy.get("table").contains("Nu sunt examene programate.").should("not.exist");

    // Verifică că există cel puțin un rând în tabelul de examene
    cy.get("table tbody tr").should("have.length.greaterThan", 0);
  });
});
