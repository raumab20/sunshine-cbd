import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb"; // Importiere ObjectId

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    // Hole die params asynchron aus dem context
    const { id } = await context.params;

    // Überprüfe, ob die ID eine gültige MongoDB ObjectId ist
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Finde das Produkt basierend auf der ID
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      },
    });

    // Wenn das Produkt nicht existiert, gib einen 404-Fehler zurück
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Gib das Produkt als Antwort zurück
    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: 500 }
    );
  }
}
