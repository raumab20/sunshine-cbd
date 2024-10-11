export interface Product {
    id: string;  // Prisma verwendet möglicherweise eine string-ID (insbesondere bei MongoDB)
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string;
    stock: number;
  }
  