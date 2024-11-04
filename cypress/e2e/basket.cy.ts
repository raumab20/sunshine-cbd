describe("Cart Functionality", () => {
  beforeEach(() => {
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

    cy.visit("/cart");
    cy.get(".text-2xl").contains("Cart");
    cy.get("ul").find("li").should("have.length", 1);
  });

  it("Increases the product quantity to 2 and checks the update", () => {
    cy.visit("/cart");

    cy.get("ul")
      .find("li")
      .first()
      .within(() => {
        cy.get("button").contains("+").click();
      });
    cy.reload();
    cy.wait(1000);

    cy.get("ul")
      .find("li")
      .first()
      .within(() => {
        cy.get("span").contains("2");
      });
  });

  it("Reduces the product quantity back to 1 and verifies the update", () => {
    cy.visit("/cart");

    cy.get("ul")
      .find("li")
      .first()
      .within(() => {
        cy.get("button").contains("-").click();
      });
    cy.reload();
    cy.wait(1000);

    cy.get("ul")
      .find("li")
      .first()
      .within(() => {
        cy.get("span").contains("1");
      });
  });

  it("Removes the product and verifies the cart is empty", () => {
    cy.visit("/cart");

    cy.get("ul")
      .find("li")
      .first()
      .within(() => {
        cy.get("button").contains("Delete").click();
      });
    cy.wait(1000);
    cy.reload();

    cy.contains("The cart is empty");
    cy.get("ul").should("not.exist");
  });
});
