describe("Checkout Process", () => {
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
  
    it("Adds a product, proceeds to checkout, and verifies order success", () => {
      cy.visit("/products");
      cy.get("button").contains("Add to Cart").first().should("be.visible").click();
      cy.wait(3000);
      cy.visit("/cart");
      cy.get("ul li").should("have.length.greaterThan", 0);
      cy.get("a").contains("Proceed to Checkout").click();
      cy.url().should("include", "/checkout");
      cy.get("button").contains("Place Order").click();
      cy.url().should("include", "/order-success");
      cy.contains("h1", "Order Placed Successfully").should("be.visible");
      cy.visit("/cart");
      cy.contains("p", "The cart is empty.").should("be.visible");
    });
  });