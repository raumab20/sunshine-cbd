import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// CORS-Unterstützung hinzufügen
async function applyCors() {
  return {
    "Access-Control-Allow-Origin": "*", // Erlaubt alle Ursprünge, für Produktion anpassen!
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// GET: Produkte abrufen
export async function GET(request: NextRequest) {
  try {
    const headers = await applyCors();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");

    // Filter erstellen
    const whereClause: Record<string, any> = {};
    if (category) {
      whereClause.category = category;
    }
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice) + 50;
    }

    const orderBy: Record<string, any> = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder === "desc" ? "desc" : "asc";
    }

    const products = await prisma.product.findMany({
      where: Object.keys(whereClause).length ? whereClause : undefined,
      orderBy: Object.keys(orderBy).length ? orderBy : undefined,
    });

    return NextResponse.json(products, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Neues Produkt erstellen
export async function POST(request: NextRequest) {
  try {
    const headers = await applyCors();
    const body = await request.json();
    const newProduct = await prisma.product.create({
      data: body,
    });
    return NextResponse.json(newProduct, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT: Produkt aktualisieren
export async function PUT(request: NextRequest) {
  try {
    const headers = await applyCors();
    const body = await request.json();
    const { id, ...data } = body;
    const updatedProduct = await prisma.product.update({
      where: { id },
      data,
    });
    return NextResponse.json(updatedProduct, { headers });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE: Produkt löschen
export async function DELETE(request: NextRequest) {
  try {
    const headers = await applyCors();
    const body = await request.json();
    const { id } = body;
    await prisma.product.delete({
      where: { id },
    });
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { headers }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

// OPTIONS: Für Preflight-Anfragen (CORS)
export async function OPTIONS() {
  const headers = await applyCors();
  return new NextResponse(null, { headers });
}
