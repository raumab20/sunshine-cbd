describe("Product Page E2E Tests", () => {
  // Test 1: Verify the product page loads correctly
  it("should load the product page", () => {
    cy.visit("/products");
    cy.wait(3000); // Warte nach dem Laden der Seite
    cy.get("h1", { timeout: 5000 }).contains("Our Products");
  });

  //Test 2: Filter products by category "Flowers"
  it('should filter products by category "Flowers"', () => {
    let expectedCount = 0;

    cy.visit("/products");
    cy.get(".product-card")
      .then(($cards) => {
        $cards.each((index, card) => {
          const categoryText = Cypress.$(card)
            .find('[data-testid="product-category"]')
            .text()
            .trim();
          if (categoryText === "Flowers") {
            expectedCount++;
          }
        });
        cy.log("Ermittelte Anzahl (expectedCount): " + expectedCount);
      })
      .then(() => {
        cy.get(".category", { timeout: 5000 }).click({ force: true });
        cy.get('div[role="option"]', { timeout: 5000 })
          .contains("Flowers")
          .click({ force: true });
        cy.wait(3000);

        cy.get(".product-card", { timeout: 5000 }).should(
          "have.length",
          expectedCount
        );

        cy.get(".product-card").each(($card) => {
          const categoryText = Cypress.$($card)
            .find('[data-testid="product-category"]')
            .text()
            .trim();
          expect(categoryText).to.equal("Flowers");
        });
      });
  });

  // Test 3: Filter products by price range between $20 and $30
  it("should filter products by price range between $20 and $30 and display all matching products", () => {
    let expectedCount = 0;

    cy.visit("/products");
    cy.get(".product-card")
      .then(($cards) => {
        $cards.each((index, card) => {
          const priceText = Cypress.$(card).find(".price").text();
          const price = parseFloat(priceText.replace("$", ""));
          if (price >= 20 && price <= 30) {
            expectedCount++;
          }
        });
      })
      .then(() => {
        cy.get('input[placeholder="Min Price"]', { timeout: 5000 })
          .clear()
          .type("20");
        cy.get('input[placeholder="Max Price"]', { timeout: 5000 })
          .clear()
          .type("30");

        cy.wait(3000);

        cy.get(".product-card", { timeout: 5000 }).should(
          "have.length",
          expectedCount
        );

        cy.get(".product-card").each(($card) => {
          cy.wrap($card)
            .find(".price")
            .invoke("text")
            .then((priceText) => {
              const price = parseFloat(priceText.replace("$", ""));
              expect(price).to.be.within(20, 30);
            });
        });
      });
  });

  // Test 4: Sort products by price ascending
  it("should sort products by price ascending", () => {
    cy.visit("/products");
    cy.get('button[data-testid="sort-select"]', { timeout: 5000 }).click({
      force: true,
    });
    cy.get('div[role="option"]', { timeout: 5000 })
      .contains("Price (Low to High)")
      .click({ force: true });
    cy.wait(3000);
    cy.get(".product-card .price", { timeout: 5000 }).then(($prices) => {
      const priceValues = [...$prices].map((price) =>
        parseFloat(price.innerText.replace("$", ""))
      );
      const sorted = [...priceValues].sort((a, b) => a - b);
      expect(priceValues).to.deep.equal(sorted);
    });
  });

  // Test 5: Sort products by price descending
  it("should sort products by price descending", () => {
    cy.visit("/products");
    cy.get('button[data-testid="sort-select"]', { timeout: 5000 }).click({
      force: true,
    });
    cy.get('div[role="option"]', { timeout: 5000 })
      .contains("Price (High to Low)")
      .click({ force: true });
    cy.wait(3000);
    cy.get(".product-card .price", { timeout: 5000 }).then(($prices) => {
      const priceValues = [...$prices].map((price) =>
        parseFloat(price.innerText.replace("$", ""))
      );
      const sorted = [...priceValues].sort((a, b) => b - a);
      expect(priceValues).to.deep.equal(sorted);
    });
  });
});
