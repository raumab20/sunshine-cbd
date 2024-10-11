import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const category = searchParams.get('category');
      const minPrice = searchParams.get('minPrice');
      const maxPrice = searchParams.get('maxPrice');
      const sortBy = searchParams.get('sortBy');
      const sortOrder = searchParams.get('sortOrder');
  
      let whereClause: any = {};
      if (category) {
        whereClause.category = category;
      }
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price.gte = parseFloat(minPrice);
        if (maxPrice) whereClause.price.lte = parseFloat(maxPrice);
      }
  
      let orderBy: any = {};
      if (sortBy) {
        orderBy[sortBy] = sortOrder === 'desc' ? 'desc' : 'asc';
      }
  
      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: orderBy,
      });
  
      return NextResponse.json(products);
    } catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

// POST: Neues Produkt erstellen
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newProduct = await prisma.product.create({
      data: body,
    });
    return NextResponse.json(newProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Erstellen des Produkts' }, { status: 500 });
  }
}

// PUT: Produkt aktualisieren (z.B. mit Produkt-ID)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedProduct);
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Aktualisieren des Produkts' }, { status: 500 });
  }
}

// DELETE: Produkt löschen (z.B. mit Produkt-ID)
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Produkt gelöscht' });
  } catch (error) {
    return NextResponse.json({ error: 'Fehler beim Löschen des Produkts' }, { status: 500 });
  }
}
