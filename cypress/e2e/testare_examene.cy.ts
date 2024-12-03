import "cypress";

describe("Exam Scheduling UI Tests", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000");
  });

  it("Dropdowns should load correctly", () => {
    // Verifică existența și funcționalitatea dropdown-urilor
    cy.contains("Selectează Materia").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista se încarcă
    cy.contains("Selectează Profesorul").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista se încarcă
    cy.contains("Selectează Facultatea").should("be.visible").click();
    cy.get("ul").should("have.length.greaterThan", 0); // Verifică dacă lista se încarcă
  });

  it("Calendar should render and allow date selection", () => {
    // Apasă butonul pentru calendar
    cy.contains("Selectează Data").click();
    cy.get("[role='grid']").should("be.visible"); // Verifică dacă calendarul este vizibil

    // Selectează o dată din calendar (de exemplu, ziua 15)
    cy.get("[role='gridcell']").contains("15").click();

    // Verifică dacă data selectată este afișată corect
    cy.contains("15/").should("be.visible");
  });

  it("Form should submit successfully", () => {
    // Selectează valori pentru toate câmpurile
    cy.contains("Selectează Materia").click();
    cy.get("ul li").first().click(); // Selectează prima materie

    cy.contains("Selectează Profesorul").click();
    cy.get("ul li").first().click(); // Selectează primul profesor

    cy.contains("Selectează Facultatea").click();
    cy.get("ul li").first().click(); // Selectează prima facultate

    // Selectează o dată din calendar
    cy.contains("Selectează Data").click();
    cy.get("[role='gridcell']").contains("15").click();

    // Trimite formularul
    cy.get("button[type='submit']").click();

    // Verifică existența unui mesaj de succes (ajustat în funcție de aplicație)
    cy.contains("Cererea de examen a fost trimisă cu succes!").should("be.visible");
  });
});
