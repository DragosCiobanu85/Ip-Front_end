//doar din partea de student
describe("examen.cy.js", () => {
  beforeEach(() => {
    // Logarea utilizatorului înainte de începerea testelor
    const username = "lavinia@student.ro";
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
    // Verifică dropdown-ul pentru Materia
    cy.contains("Selectează Materia").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista este populată

    // Verifică dropdown-ul pentru Profesorul
    cy.contains("Selectează Profesorul").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista este populată

    // Verifică dropdown-ul pentru Facultatea
    cy.contains("Selectează Facultatea").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista este populată
  });

  // UI Test: Calendar should render and allow date selection
  it("Calendar should render and allow date selection", () => {
    // Deschide calendarul
    cy.contains("Selectează Data").click();
    cy.get("[role='grid']").should("be.visible"); // Verifică vizibilitatea calendarului

    // Selectează o dată din calendar
    cy.get("[role='gridcell']").contains("22").should("be.visible").click(); // Retry until the date is found
    cy.contains("22/").should("be.visible"); // Verifică dacă data selectată este vizibilă
  });

  // UI Test: Form should submit successfully
  it("Form should submit successfully", () => {
    // Selectează Materia
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

    // Verifică dacă cererea de examen a fost trimisă cu succes
    cy.on("window:alert", (alertText) => {
      expect(alertText).to.include("Cererea de examen a fost trimisă cu succes!");
    });
    // Trimite formularul
    cy.get("button[type='submit']").click();
  });
});
