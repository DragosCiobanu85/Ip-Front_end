import React from "react";
import {mount} from "@cypress/react";
import PaginaTest from "../../pages/app/paginatest"; // Adjust the path as needed

describe("Test1.cy.jsx", () => {
  it("renders and handles input", () => {
    mount(<PaginaTest />); // Mount the component in the Cypress test

    // Check if the button is rendered
    cy.get("button").contains("Login").should("be.visible");

    // Type in the input field
    cy.get("input").type("Test User");

    // Check if the input field value is updated
    cy.get("input").should("have.value", "Test User");
  });

  it("submits the form when clicked", () => {
    mount(<PaginaTest />);

    // Fill in the input field
    cy.get("input").type("Test User");

    // Click the login button
    cy.get("button").contains("Login").click();

    // Check if any expected outcome happens
    // For example, ensure a log message is output, or if you have a navigation
    cy.window().its("console").invoke("log").should("be.calledWith", "Test User");
  });
});
