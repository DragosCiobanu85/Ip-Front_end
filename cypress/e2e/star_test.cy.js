describe("template spec", () => {
  it("studentul se autentifica si programeaza un examen", () => {
    cy.visit("https://star-d-frontend.netlify.app/login");
    const username1 = "lavinia.burlacu@student.usv.ro";
    const password1 = "default_password";

    // Step 1: Log in
    cy.get("input[id='email']").clear().type(username1);
    cy.get("input[id='password']").clear().type(password1);
    cy.get("button[type='submit']").click();

    // Verify authentication
    cy.url().should("include", "/student/exams");

    // Step 2: Navigate to the exam scheduling page
    cy.contains("testing").should("be.visible").click();
    cy.url().should("include", "/student/exams/30");

    // Step 3: Fill out the exam scheduling form
    // Open the datepicker
    cy.get("mat-datepicker-toggle button").click();

    // Step 4: Wait for the calendar to load
    cy.get("mat-calendar").should("be.visible");

    // Wait explicitly for the calendar to finish loading
    cy.wait(1000); // Additional wait for any potential rendering delay

    // Step 5: Select the specific date (24)
    cy.get("mat-calendar .mat-calendar-body-cell")
      .contains("24")
      .should("be.visible") // Ensure the date is visible
      .click({force: true}); // Force click if it is blocked by overlays

    // Wait for 500ms to ensure the calendar updates
    cy.wait(500);

    // Select the starting hour
    cy.contains("Ora incepere").scrollIntoView().click({force: true}); // Force click if the field is still blocked by the overlay

    // Click the "OK" button after selecting the hour
    cy.get("button.mat-mdc-button").contains("OK").click({force: true});

    // Step 6: Select the ending hour ("Ora incheiere")
    cy.contains("Ora incheiere").scrollIntoView().click({force: true});

    // Wait for the clock face to be visible
    cy.wait(500);

    // Click on the button that contains "10"
    cy.get("button.mat-mdc-mini-fab")
      .contains("10") // Click the button with the label "10"
      .click({force: true}); // Force click if the button is covered or blocked

    // Wait for the changes to be reflected
    cy.wait(500);

    // Click on the OK button to confirm the selection
    cy.get("button.mat-mdc-button").contains("OK").click({force: true});

    // Selectează Sala (Classroom)
    cy.contains("Sala").click({force: true}); // Click on "Sala"

    // Select the first option from the dropdown
    cy.get("mat-select[role='combobox']").click({force: true}); // Open the select dropdown forcibly
    cy.get("mat-option").first().click({force: true}); // Select the first option forcibly

    // Wait for the selection to be reflected
    cy.wait(500);

    // Submit the request
    cy.get("button[type='submit']").click();
  });

  it("Profesorul se autentifică și aprobă cererea de examen", () => {
    // Pasul 4: Profesorul se autentifică
    cy.visit("https://star-d-frontend.netlify.app/login");

    const username2 = "alexito.olar@gmail.com";
    const password2 = "default_password";

    cy.get("input[id='email']").clear().type(username2);
    cy.get("input[id='password']").clear().type(password2);
    cy.get("button[type='submit']").click();

    // Verifică că profesorul este pe pagina corectă
    cy.url().should("include", "/professor/appointments");

    // Pasul 5: Profesorul vizualizează cererea de examen
    cy.wait(2000); // Wait for 2 seconds

    // Verifică dacă butonul "Acceptă" este prezent în secțiunea Actiuni
    cy.contains("IN ASTEPTARE").should("be.visible").click();
    // Profesorul aprobă cererea
    cy.contains("Acceptă").first().click(); // Căutăm butonul "Acceptă" și îl click-uim pe primul din listă
  });

  it("verificare final", () => {
    cy.visit("https://star-d-frontend.netlify.app/login");
    const username1 = "lavinia.burlacu@student.usv.ro";
    const password1 = "default_password";

    // Step 1: Log in
    cy.get("input[id='email']").clear().type(username1);
    cy.get("input[id='password']").clear().type(password1);
    cy.get("button[type='submit']").click();

    // Verify authentication
    cy.url().should("include", "/student/exams");

    cy.contains("PROGRAMAT").should("be.visible");
  });
});
