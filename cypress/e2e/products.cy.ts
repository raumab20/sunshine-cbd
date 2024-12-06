describe('Product Page E2E Tests', () => {
    // Test 1: Verify the product page loads correctly
    it('should load the product page', () => {
      cy.visit('/products')
      cy.get('h1').contains('Our Products')  
    })
  
    // Test 2: Filtere nach Kategorie "Flowers"
  it('should filter products by category "Flowers"', () => {
    cy.visit('/products')
    cy.get('.category').click({ force: true }) 
    cy.get('div[role="option"]').contains('Flowers').click({ force: true }) 
    cy.wait(500)
    cy.get('.product-card').should('have.length', 3)  
    cy.get('.product-card').contains('Flowers') 
  })
  
    // Test 3: Filter products by price range between $20 and $30
    it('should filter products by price range between $20 and $30', () => {
      cy.visit('/products')  // Visit the product page
      cy.get('input[placeholder="Min Price"]').type('20')  // Enter minimum price
      cy.get('input[placeholder="Max Price"]').type('30')  // Enter maximum price
      cy.wait(500)
      cy.get('.product-card').should('have.length', 1)  // Verify two products are displayed
      cy.get('.product-card').each(($el) => {
        cy.wrap($el).find('.price').then(($price) => {
          const productPrice = parseFloat($price.text().replace('$', ''))
          expect(productPrice).to.be.within(20, 30)
        })
      })
    })
  
    // Test 4: Sort products by price ascending
    it('should sort products by price ascending', () => {
      cy.visit('/products')  
      cy.get('button[data-testid="sort-select"]').click({ force: true }) 
      cy.get('div[role="option"]').contains('Price (Low to High)').click({ force: true }) 
      cy.wait(500)
      cy.get('.product-card .price').then(($prices) => {
        const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
        const sorted = [...priceValues].sort((a, b) => a - b)
        expect(priceValues).to.deep.equal(sorted) 
      })
    })
  
    // Test 5: Sort products by price descending
    it('should sort products by price descending', () => {
      cy.visit('/products')  
      cy.get('button[data-testid="sort-select"]').click({ force: true }) 
      cy.get('div[role="option"]').contains('Price (High to Low)').click({ force: true }) 
      cy.wait(500)
      cy.get('.product-card .price').then(($prices) => {
        const priceValues = [...$prices].map((price) => parseFloat(price.innerText.replace('$', '')))
        const sorted = [...priceValues].sort((a, b) => b - a)
        expect(priceValues).to.deep.equal(sorted) 
      })
    })
  })
  