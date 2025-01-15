describe("Security Tests for Authentication", () => {
  it("Dropdowns and Calendar should load and interact correctly", () => {
    cy.visit("http://localhost:3000/login");

    const username1 = "lavinia@student.usv.ro";
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
    cy.contains("Selectează Facultatea").click(); // Folosește textul corect pentru Facultatea
    cy.get("ul li").first().click(); // Selectează prima opțiune Facultatea

    // Selectează Specializarea
    cy.contains("Selectează Specializarea").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Specializarea

    // Selectează Grupa
    cy.contains("Selectează Grupa").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Grupa

    // Selectează Materia
    cy.contains("Selectează Materia").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Materia

    // Selectează Profesorul
    cy.contains("Selectează Profesorul").click();
    cy.get("ul li").first().click(); // Selectează prima opțiune Profesorul

    // Selectează Data
    cy.contains("Selectează Data").click();
    cy.get("[role='gridcell']").contains("22").click(); // Selectează o dată

    // Trimite cererea pentru aprobare
    cy.get("button[type='submit']").click();
  });
  it("Profesorul se autentifică și aprobă cererea de examen", () => {
    // Pasul 4: Profesorul se autentifică
    cy.visit("http://localhost:3000/login");

    const username2 = "pop@usm.ro";
    const password2 = "Parola12";

    cy.get("input[id='email']").clear().type(username2);
    cy.get("input[id='outlined-basic']").clear().type(password2);
    cy.get("button[type='submit']").click();

    // Verifică că profesorul este pe pagina corectă
    cy.url().should("include", "/teacherpage");

    // Pasul 5: Profesorul vizualizează cererea de examen
    cy.wait(2000); // Wait for 2 seconds

    // Verifică dacă butonul "Acceptă" este prezent în secțiunea Actiuni
    cy.contains("Acceptă").should("be.visible");

    // Profesorul aprobă cererea
    cy.contains("Acceptă").first().click(); // Căutăm butonul "Acceptă" și îl click-uim pe primul din listă

    cy.url().should("include", "/examenprofesor");

    // Pasul 3: Completarea formularului de programare a examenului
    // Selectează Asistent de profesor
    cy.get("select").eq(0).select(4); // Selectează prima opțiune validă din lista Asistent (indexul 1)

    // Selectează Sala
    cy.get("select").eq(1).select(1); // Selectează prima opțiune validă din lista Sala (indexul 1)

    // Selectează Ora
    cy.get("select").eq(2).select(1); // Selectează prima opțiune validă din lista Ora (indexul 1)

    // Trimite cererea pentru aprobare
    cy.get("button[type='submit']").click();
  });

  it("Check the status of the request", () => {
    cy.visit("http://localhost:3000/login");

    const username1 = "lavinia@student.usv.ro";
    const password1 = "Parola12";

    // Pasul 2: Studentul se autentifică
    cy.get("input[id='email']").clear().type(username1);
    cy.get("input[id='outlined-basic']").clear().type(password1);
    cy.get("button[type='submit']").click();

    // Verifică dacă studentul este autentificat
    cy.url().should("include", "/studentpage");
    cy.contains("acceptata").should("be.visible");
  });
});
