import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Hilfsmodul für ESM

const prisma = new PrismaClient();

// __dirname in ESM simulieren
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  try {
    // Lade die products.json manuell mit fs
    const filePath = path.join(__dirname, '../products.json');
    const data = await fs.readFile(filePath, 'utf-8');
    const products = JSON.parse(data);

    // Prüfen, ob Produkte bereits in der DB sind
    const count = await prisma.product.count();
    if (count === 0) {
      // Produkte einfügen
      await prisma.product.createMany({
        data: products.map((product) => ({
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          description: product.description,
          stock: product.stock,
        })),
      });
      console.log('Produkte erfolgreich eingefügt!');
    } else {
      console.log('Produkte sind bereits in der Datenbank.');
    }
  } catch (error) {
    console.error('Fehler beim Einfügen der Produkte:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
