describe("Cart Functionality - New Approach", () => {
  // Ignoriere Hydration-Fehler
  Cypress.on("uncaught:exception", (err) => {
    if (err.message.includes("Hydration failed")) {
      return false; // Ignoriere diesen spezifischen Fehler
    }
    return true; // Andere Fehler weiterhin melden
  });

  it("Logs in, adds a product to the cart, and verifies the cart is not empty", () => {
    // Login-Logik
    cy.visit("/sign-in");
    cy.wait(5000);
    cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
    cy.get('input[name="password"]').type("a1@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/sign-in");

    // Produkt hinzufügen
    cy.visit("/products");
    cy.get("button").contains("Add to Cart").first().click();
    cy.wait(3000);

    // Warenkorb überprüfen
    cy.visit("/cart");
    cy.get("ul li").should("have.length.greaterThan", 0);
  });

  it("Logs in, checks if the cart page displays the total price", () => {
    // Login-Logik
    cy.visit("/sign-in");
    cy.wait(5000);
    cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
    cy.get('input[name="password"]').type("a1@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/sign-in");

    // Zum Warenkorb navigieren
    cy.visit("/cart");

    // Überprüfen, ob die Gesamtsumme angezeigt wird
    cy.get(".text-xl").should("contain", "Total Price:");
  });

  it("Logs in, verifies the cart displays product details", () => {
    // Login-Logik
    cy.visit("/sign-in");
    cy.wait(5000);
    cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
    cy.get('input[name="password"]').type("a1@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/sign-in");

    // Zum Warenkorb navigieren
    cy.visit("/cart");

    // Überprüfen, ob Produktdetails im Warenkorb angezeigt werden
    cy.get("ul li")
      .first()
      .within(() => {
        cy.get("h2").should("exist"); // Produktname
        cy.get("p").should("exist"); // Kategorie oder Preis
      });
  });

  it("Logs in, navigates to cart, and ensures the 'Continue Shopping' link works", () => {
    // Login-Logik
    cy.visit("/sign-in");
    cy.wait(5000);
    cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
    cy.get('input[name="password"]').type("a1@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/sign-in");

    // Zum Warenkorb navigieren
    cy.visit("/cart");

    // Weiter zum Shop navigieren
    cy.get("a").contains("Continue Shopping").click();

    // Überprüfen, ob die Produktseite geladen ist
    cy.url().should("include", "/products");
    cy.get("h1").should("contain", "Products");
  });

  it("Removes the product and verifies the cart is empty", () => {
    // Login-Logik
    cy.visit("/sign-in");
    cy.wait(5000);
    cy.get('input[name="email"]').should("be.enabled").type("a1@gmail.com");
    cy.get('input[name="password"]').type("a1@gmail.com");
    cy.get('button[type="submit"]').click();
    cy.url().should("not.include", "/sign-in");

    // Navigiere zum Warenkorb
    cy.visit("/cart");

    // Sicherstellen, dass der Warenkorb Elemente enthält
    cy.get("ul", { timeout: 10000 }).should("exist").and("be.visible");

    // Lösche das erste Produkt
    cy.get("ul li")
      .first()
      .within(() => {
        cy.get("button").contains("Delete").click({ force: true }); // Klick auf den Delete-Button erzwingen
      });

    // Warten, um sicherzustellen, dass das Löschen abgeschlossen ist
    cy.wait(3000);

    // Seite neu laden, um sicherzustellen, dass die Änderungen übernommen wurden
    cy.reload();

    // Überprüfen, ob der Text "The cart is empty." angezeigt wird
    cy.contains("p", "The cart is empty.", { timeout: 5000 }).should(
      "be.visible"
    );
  });
});
