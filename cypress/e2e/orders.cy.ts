describe("Order History", () => {
    Cypress.on("uncaught:exception", (err) => {
      if (err.message.includes("Hydration failed")) {
        return false;
      }
      return true;
    });
  
    beforeEach(() => {
      cy.visit("/sign-in");
      cy.wait(5000);
      cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
      cy.get('input[name="password"]').type("a1@gmail.com");
      cy.get('button[type="submit"]').click();
      cy.url().should("not.include", "/sign-in");
    });
  
    it("Checks if order history displays past orders", () => {
      cy.visit("/orders");
      cy.get("ul li").should("have.length.greaterThan", 0);
      cy.contains("Status").should("exist");
      cy.get("ul li").first().within(() => {
        cy.get("h2").should("exist");
        cy.get("p").contains("Status").should("exist");
      });
    });
  });
  