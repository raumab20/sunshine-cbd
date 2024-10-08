describe("Register Page", () => {
  it("should load the register page", () => {
    cy.visit("/register");
    cy.contains("Register");
    cy.get('input[name="email"]').should("be.visible");
    cy.get('input[name="confirmPassword"]').should("be.visible");
  });

  it("should submit the form with no error", () => {
    cy.visit("/register");

    cy.get('input[name="email"]').type("aed@gmail.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('input[name="confirmPassword"]').type("testpassword");

    cy.get('button[type="submit"]').click();
  });

  it("should show an error if passwords do not match", () => {
    cy.visit("/register");

    cy.get('input[name="email"]').type("test@example.com");
    cy.get('input[name="password"]').type("testpassword");
    cy.get('input[name="confirmPassword"]').type("differentpassword");

    cy.get('button[type="submit"]').click();

    cy.contains("Passwords do not match").should("be.visible");
  });
});
