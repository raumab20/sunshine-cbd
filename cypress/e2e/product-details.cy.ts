describe('Product Details Page Tests', () => {
    let firstProduct: any;
    let allProducts: any[];
  
    before(() => {
      cy.request('/api/products').then((response) => {
        allProducts = response.body;
  
        // Gruppiere Produkte nach Kategorie, um eine Kategorie zu finden, die nur ein einziges Produkt enthält
        const categoryCounts = allProducts.reduce((acc: Record<string, number>, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
  
        const uniqueCategory = Object.keys(categoryCounts).find(
          (cat) => categoryCounts[cat] === 1
        );
  
        if (!uniqueCategory) {
          throw new Error(
            'Keine eindeutige Kategorie gefunden. Bitte stellen Sie sicher, dass mindestens ein Produkt eine einzigartige Kategorie besitzt.'
          );
        }
  
        // Wähle ein Produkt mit einzigartiger Kategorie
        firstProduct = allProducts.find((prod: any) => prod.category === uniqueCategory);
        console.log('Ermitteltes firstProduct:', firstProduct);
      });
    });
  
    beforeEach(() => {
      // Besuche die Produktdetailseite des Produkts mit der einzigartigen Kategorie
      cy.visit(`/products/${firstProduct.id}`);
    });

    //---------------------------------
  
    it('should display related products or all products if no related products exist (maximum 10)', () => {
      // Da wir ein Produkt mit einer einzigartigen Kategorie gewählt haben,
      // wird der /api/products?category=... -Aufruf keine weiteren Produkte liefern.
      // In diesem Fall soll der Code alle Produkte außer dem aktuellen anzeigen.
      // Außerdem soll maximal 10 Produkte angezeigt werden (sowohl bei verwandten als auch bei Fallback-Produkten).
  
      cy.request(`/api/products?category=${firstProduct.category}`).then((relatedResponse) => {
        const relatedProducts = relatedResponse.body.filter(
          (product: { id: any }) => product.id !== firstProduct.id
        );
  
        if (relatedProducts.length > 0) {
          // Falls doch verwandte Produkte vorhanden sind, teste Anzeige mit max. 10
          const expectedCount = Math.min(relatedProducts.length, 10);
          cy.get('[data-testid="related-products"]')
            .children()
            .should('have.length', expectedCount);
        } else {
          // Keine verwandten Produkte: Alle anderen Produkte anzeigen (max. 10)
          const allProductsExceptCurrent = allProducts.filter(
            (product: { id: any }) => product.id !== firstProduct.id
          );
          const expectedCount = Math.min(allProductsExceptCurrent.length, 10);
  
          cy.get('[data-testid="related-products"]')
            .children()
            .should('have.length', expectedCount);
        }
      });
    });

    //---------------------------------
  
    it('should not include the current product in the related products list', () => {
      // Es sollte niemals das aktuelle Produkt in der Liste auftauchen
      cy.get('[data-testid="related-products"] a[href="/products/' + firstProduct.id + '"]')
        .should('not.exist');
    });

    //---------------------------------
  
    it('should display correct product details dynamically', () => {
      cy.get('h1').should('contain', firstProduct.name);
      cy.get('p').should('contain', firstProduct.description);
      cy.contains(`$${firstProduct.price.toFixed(2)}`).should('exist');
  
      if (firstProduct.stock > 0) {
        cy.contains('Auf Lager').should('exist');
      } else {
        cy.contains('Nicht verfügbar').should('exist');
      }
  
      cy.get(`img[alt="${firstProduct.name}"]`).should('be.visible');
    });

    //---------------------------------
    it('should navigate to a related product and ensure it shares the same category', () => {
        // Suche eine Kategorie mit mehreren Produkten
        const categoryCounts = allProducts.reduce((acc: Record<string, number>, product: any) => {
          acc[product.category] = (acc[product.category] || 0) + 1;
          return acc;
        }, {});
        const multiProductCategory = Object.keys(categoryCounts).find((cat) => categoryCounts[cat] > 1);
        if (!multiProductCategory) {
          throw new Error('Keine Kategorie mit mehreren Produkten gefunden.');
        }
      
        // Produkt aus dieser Kategorie auswählen
        const productWithRelated = allProducts.find((prod: any) => prod.category === multiProductCategory);
      
        // Produktdetailseite aufrufen
        cy.visit(`/products/${productWithRelated.id}`);
      
        // Prüfen, ob verwandte Produkte vorhanden sind
        cy.request(`/api/products?category=${productWithRelated.category}`).then((relatedResponse) => {
          const relatedProducts = relatedResponse.body;
          expect(relatedProducts.length).to.be.greaterThan(0, 'Es sollten verwandte Produkte vorhanden sein');
      
          // Das erste verwandte Produkt anklicken
          cy.get('[data-testid="related-products"]')
            .children()
            .first()
            .invoke('attr', 'href')
            .then((href) => {
              cy.visit(href!);
      
              // Produktdaten des aufgerufenen Produkts holen und prüfen mittels API Aufruf
              cy.request(href!.replace('/products', '/api/products')).then((res) => {
                const visitedProduct = res.body;
                expect(visitedProduct.category).to.equal(productWithRelated.category);
              });
            });
        });
      });      
      
  });
  