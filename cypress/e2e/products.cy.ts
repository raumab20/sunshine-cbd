describe('Product Page E2E Tests', () => {

  // Test 1: Verify the product page loads correctly
  it('should load the product page', () => {
    cy.visit('/products')  // Visit the product page
    cy.get('h1').contains('Sunshine CBD Products')  // Verify the page heading is displayed
  })

  // Test: Open filters and filter by category "Flowers"
  it('should open the filters and make the content visible', () => {
    cy.visit('/products')
  
    
    // Hier kannst du jetzt die Interaktionen innerhalb des geöffneten Collapsibles durchführen
    cy.get('#category').click({ force: true })
    cy.get('div[role="option"]').contains('Flowers').click({ force: true })

    cy.get('.product-card').should('have.length.greaterThan', 0)  // Verify products are displayed
    cy.get('.product-card').contains('Flowers')  // Verify the correct category is displayed
  })

  // Test 3: Filter products by price range between $20 and $30
  it('should filter products by price range between $20 and $30', () => {
    cy.visit('/products')
    cy.get('input#min-price').clear().type('20')  // Enter minimum price
    cy.get('input#max-price').clear().type('30')  // Enter maximum price
    cy.get('.product-card').should('have.length.greaterThan', 0)  // Verify products are displayed
    cy.get('.product-card').each(($el) => {
      cy.wrap($el).find('.price').then(($price) => {
        const productPrice = parseFloat($price.text().replace('$', ''))
        expect(productPrice).to.be.within(20, 30)  // Verify the price range
      })
    })
  })
  //test 4
  it('should sort products by price ascending', () => {
    cy.visit('/products')
    cy.get('#sort').click({ force: true })
    cy.get('div[role="option"]').contains('Price').click({ force: true })
    cy.get('#order').click({ force: true })
    cy.get('div[role="option"]').contains('Ascending').click({ force: true })
    cy.get('.product-card .price').then(($prices) => {
      const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
      const sorted = [...priceValues].sort((a, b) => a - b)
      expect(priceValues).to.deep.equal(sorted)  // Verify ascending order
    })
  })

  // Test 5: Sort products by price descending
  it('should sort products by price descending', () => {
    cy.visit('/products')
    cy.get('#sort').click({ force: true })  // Click sort dropdown
    cy.get('div[role="option"]').contains('Price').click({ force: true })  // Select "Price"
    cy.get('#order').click({ force: true })  // Click order dropdown
    cy.get('div[role="option"]').contains('Descending').click({ force: true })  // Select "Descending"
    cy.get('.product-card .price').then(($prices) => {
      const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
      const sorted = [...priceValues].sort((a, b) => b - a)
      expect(priceValues).to.equal(sorted)  // Verify prices are sorted in descending order
    })
  })

  // Test 6: Search for a product by name "Flower"
  it('should search for a product by name "Flower"', () => {
    cy.visit('/products')
    cy.get('input[placeholder="Search products..."]').type('Flower')  // Enter search term
    cy.get('.product-card').should('have.length.greaterThan', 0)  // Expect 1 product to be displayed
    cy.get('.product-card').contains('Flowers')  // Verify the product matches the search term
  })

  // Test 7: Search for a product and check if results are displayed
  it('should search for products based on a keyword', () => {
    cy.visit('/products')
    cy.get('input[placeholder="Search products..."]').type('CBD')  // Enter a search term
    cy.get('.product-card').should('have.length.greaterThan', 0)  // Verify at least one product is displayed
  })

  // Test 8: Search with filters (category "Oils" and search term "CBD")
  it('should search for products by category "Oils" and search term "CBD"', () => {
    cy.visit('/products')
    cy.get('#category').click({ force: true })  // Open category dropdown
    cy.get('div[role="option"]').contains('Oils').click({ force: true })  // Select "Oils"
    cy.get('input[placeholder="Search products..."]').type('CBD')  // Enter search term
    cy.get('.product-card').should('have.length.greaterThan', 0)  // Verify at least one product is displayed
    cy.get('.product-card').contains('Oils')  // Verify the product matches the "Oils" category
    cy.get('.product-card').contains('CBD')  // Verify the product matches the search term
  })

  // Test 9: Search and filter by price range (search term "gummies" and price between $20 and $50)
  it('should search for products by search term "gummies" and price range between $20 and $50', () => {
    cy.visit('/products')
    cy.get('input[placeholder="Search products..."]').type('gummies')  // Enter search term
    cy.get('input#min-price').clear().type('20')  // Enter minimum price
    cy.get('input#max-price').clear().type('50')  // Enter maximum price
    cy.get('.product-card').should('have.length.greaterThan', 0)  // Verify at least one product is displayed
    cy.get('.product-card').each(($el) => {
      cy.wrap($el).find('.price').then(($price) => {
        const productPrice = parseFloat($price.text().replace('$', ''))
        expect(productPrice).to.be.within(20, 50)  // Verify the price is within the range
      })
    })
    cy.get('.product-card').contains('gummies')  // Verify the product matches the search term
  })
})