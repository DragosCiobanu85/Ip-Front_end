//doar din partea de student
describe("UI.cy.js", () => {
  beforeEach(() => {
    // Logarea utilizatorului înainte de începerea testelor
    const username = "lavinia@student.usv.ro";
    const password = "Parola12";

    cy.visit("http://localhost:3000/login"); // Vizitează pagina de login

    cy.get("input[id='email']").clear().type(username); // Completează câmpul email
    cy.get("input[id='outlined-basic']").clear().type(password); // Completează câmpul parolă
    cy.get("button[type='submit']").click(); // Apasă butonul de login

    // Verifică dacă utilizatorul este redirecționat corect după logare
    cy.url().should("include", "/studentpage");

    // După logare, apasă butonul 'Programare examen'
    cy.contains("Programare examen").should("be.visible").click(); // Căutăm butonul cu textul 'Programare examen'

    // Verificăm dacă suntem redirecționați corect după ce apasăm pe buton
    cy.url().should("include", "/examen"); // Verifică dacă pagina este schimbată
  });

  // UI Test: Dropdowns should load correctly
  it("Dropdowns should load correctly", () => {
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
  });

  // UI Test: Calendar should render and allow date selection
  it("Calendar should render and allow date selection", () => {
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
  });

  // UI Test: Form should submit successfully
  it("Form should submit successfully", () => {
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
    // Trimite formularul
    cy.get("button[type='submit']").click();
  });
});
