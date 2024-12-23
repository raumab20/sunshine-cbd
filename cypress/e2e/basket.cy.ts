describe("Cart Functionality", () => {
  beforeEach(() => {
    // Add uncaught exception handler to prevent Cypress from failing due to unexpected app errors
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.log("Caught uncaught exception:", err.message);
      return false; // Prevents Cypress from failing the test
    });

    cy.session("user-session", () => {
      cy.visit("/sign-in");
      cy.get('input[name="email"]').type("a1@gmail.com");
      cy.get('input[name="password"]').type("a1@gmail.com");
      cy.get('button[type="submit"]').click();

      cy.url().should("not.include", "/sign-in");
      cy.get("nav").contains("SunshineCBD");
      cy.get("nav").find(".h-6.w-6");
    });
  });

  it("Adds a product to the cart and verifies it is added", () => {
    cy.visit("/products");

    cy.get("button").contains("Add to Cart").first().click();
    cy.wait(3000); // Warte für 3 Sekunden, um sicherzustellen, dass die Seite geladen ist

    cy.visit("/cart");
    cy.get(".text-2xl", { timeout: 5000 }).contains("Cart").should('be.visible');
    cy.get("ul", { timeout: 5000 }).find("li").should("have.length", 1);
  });

  it("Increases the product quantity to 2 and checks the update", () => {
    cy.visit("/cart");

    cy.get("ul", { timeout: 5000 })
      .find("li")
      .first()
      .within(() => {
        // Click the increase button
        cy.get("button").contains("+").click();
        cy.wait(3000); // Warte nach dem Klick

        // Wait for the quantity to update and check it
        cy.get("span", { timeout: 5000 }).should("contain", "2");
      });
  });

  it("Reduces the product quantity back to 1 and verifies the update", () => {
    cy.visit("/cart");

    cy.get("ul", { timeout: 5000 })
      .find("li")
      .first()
      .within(() => {
        // Click the decrease button
        cy.get("button").contains("-").click();
        cy.wait(3000); // Warte nach dem Klick

        // Reload the page to ensure backend consistency
        cy.reload();
        cy.wait(3000); // Warte nach dem Reload

        // Wait for the quantity to update and check it
        cy.get("span", { timeout: 5000 }).should("contain", "1");
      });
  });

  it("Removes the product and verifies the cart is empty", () => {
    cy.visit("/cart");

    cy.get("ul", { timeout: 5000 })
      .find("li")
      .first()
      .within(() => {
        // Click the delete button
        cy.get("button").contains("Delete").click();
      });
    cy.wait(3000); // Warte nach dem Löschen

    cy.get("ul", { timeout: 5000 }).should("not.exist");
    cy.contains("The cart is empty", { timeout: 5000 });
  });
});
