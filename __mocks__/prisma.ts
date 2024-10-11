// __mocks__/prisma.ts
const mockPrisma = {
  product: {
    findMany: jest.fn((args) => {
      const products = [
        { id: 1, name: 'CBD Oil Tincture', price: 49.99, category: 'Oils' },
        { id: 2, name: 'CBD Gummies', price: 29.99, category: 'Edibles' },
        { id: 3, name: 'CBD Topical Cream', price: 39.99, category: 'Topicals' },
        { id: 4, name: 'CBD Pet Treats', price: 24.99, category: 'Pet Products' },
        { id: 5, name: 'CBD Sleep Capsules', price: 34.99, category: 'Capsules' },
        { id: 6, name: 'CBD Bath Bombs', price: 19.99, category: 'Bath Products' },
        { id: 7, name: 'CBD Vape Cartridge', price: 59.99, category: 'Vapes' },
        { id: 8, name: 'CBD Flowers', price: 14.99, category: 'Flowers' },
      ];

      // Simuliere Filterung
      if (args?.where?.category) {
        return products.filter(p => p.category === args.where.category);
      }

      // Simuliere Preisbereichsfilterung
      if (args?.where?.price) {
        return products.filter(p => {
          const { gte, lte } = args.where.price;
          return (gte ? p.price >= gte : true) && (lte ? p.price <= lte : true);
        });
      }

      // Simuliere Sortierung
      if (args?.orderBy?.price) {
        const sortOrder = args.orderBy.price === 'asc' ? 1 : -1;
        return products.sort((a, b) => (a.price - b.price) * sortOrder);
      }

      return products;
    }),
  },
};

export const PrismaClient = jest.fn(() => mockPrisma);
export default PrismaClient;
