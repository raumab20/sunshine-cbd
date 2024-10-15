describe('Product Page E2E Tests', () => {
    // Test 1: Verify the product page loads correctly
    it('should load the product page', () => {
      cy.visit('/products')  // Visit the product page
      cy.get('h1').contains('Our Products')  // Verify the page heading is displayed
    })
  
    // Test 2: Filtere nach Kategorie "Flowers"
  it('should filter products by category "Flowers"', () => {
    cy.visit('/products')  // Besuche die Produktseite
    cy.get('#category').click({ force: true })  // Klicke auf das Kategorien-Auswahlfeld
    cy.get('div[role="option"]').contains('Flowers').click({ force: true })  // Wähle "Flowers" aus der Dropdown-Liste
    cy.get('button').contains('Apply Filters and Sort').click()  // Klicke auf "Apply Filters and Sort"
    cy.get('.product-card').should('have.length', 1)  // Überprüfe, ob nur 1 Produkt angezeigt wird
    cy.get('.product-card').contains('Flowers')  // Überprüfe, ob das angezeigte Produkt der Kategorie "Flowers" entspricht
  })
  
    // Test 3: Filter products by price range between $20 and $30
    it('should filter products by price range between $20 and $30', () => {
      cy.visit('/products')  // Visit the product page
      cy.get('input[placeholder="Min Price"]').type('20')  // Enter minimum price
      cy.get('input[placeholder="Max Price"]').type('30')  // Enter maximum price
      cy.get('button').contains('Apply Filters and Sort').click()  // Click "Apply Filters and Sort"
      cy.get('.product-card').should('have.length', 2)  // Verify two products are displayed
      cy.get('.product-card').each(($el) => {
        cy.wrap($el).find('.price').then(($price) => {
          const productPrice = parseFloat($price.text().replace('$', ''))
          expect(productPrice).to.be.within(20, 30)
        })
      })
    })
  
    // Test 4: Sort products by price ascending
    it('should sort products by price ascending', () => {
      cy.visit('/products')  // Visit the product page
      cy.get('button[data-testid="sort-select"]').click({ force: true })  // Click the sort dropdown
      cy.get('div[role="option"]').contains('Price').click({ force: true })  // Select "Price" as sorting criterion
      cy.get('button[data-testid="sort-order"]').click({ force: true })  // Click the order dropdown
      cy.get('div[role="option"]').contains('Ascending').click({ force: true })  // Select "Ascending"
      cy.get('button').contains('Apply Filters and Sort').click()  // Apply filters
      cy.get('.product-card .price').then(($prices) => {
        const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
        const sorted = [...priceValues].sort((a, b) => a - b)
        expect(priceValues).to.deep.equal(sorted)  // Verify prices are sorted in ascending order
      })
    })
  
    // Test 5: Sort products by price descending
    it('should sort products by price descending', () => {
      cy.visit('/products')  // Visit the product page
      cy.get('button[data-testid="sort-select"]').click({ force: true })  // Click the sort dropdown
      cy.get('div[role="option"]').contains('Price').click({ force: true })  // Select "Price" as sorting criterion
      cy.get('button[data-testid="sort-order"]').click({ force: true })  // Click the order dropdown
      cy.get('div[role="option"]').contains('Descending').click({ force: true })  // Select "Descending"
      cy.get('button').contains('Apply Filters and Sort').click()  // Apply filters
      cy.get('.product-card .price').then(($prices) => {
        const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
        const sorted = [...priceValues].sort((a, b) => b - a)
        expect(priceValues).to.deep.equal(sorted)  // Verify prices are sorted in descending order
      })
    })
  })
  