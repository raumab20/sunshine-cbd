import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getUser(session: any) {
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  // Finde den Benutzer anhand der E-Mail in der Session
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }, // Verwende die E-Mail aus der Session
  });

  return user;
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await req.json(); // Session aus dem Request-Body holen

    if (!session) {
      return NextResponse.json(
        { error: "Nicht authentifiziert" },
        { status: 401 }
      );
    }

    const user = await getUser(session);

    if (!user) {
      return NextResponse.json(
        { error: "Benutzer nicht gefunden" },
        { status: 404 }
      );
    }

    // Überprüfe, ob der Benutzer einen Warenkorb hat
    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    // Falls kein Warenkorb existiert, erstelle einen neuen
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    // Überprüfe, ob der Warenkorb bereits Artikel enthält
    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    if (cartItems.length === 0) {
      // Füge einen Artikel hinzu, wenn der Warenkorb leer ist
      const product = await prisma.product.findFirst(); // Beispiel: Nimm das erste Produkt aus der DB
      if (product) {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId: product.id,
            quantity: 1, // Setze die Menge auf 1
          },
        });
      }
    }

    // Lade die aktualisierten Artikel des Warenkorbs
    const updatedCartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json(updatedCartItems); // Gib die Artikel des Warenkorbs zurück
  } catch (error) {
    console.error(
      "Fehler beim Abrufen oder Aktualisieren des Warenkorbs:",
      error
    );
    return NextResponse.json(
      { error: "Fehler beim Abrufen des Warenkorbs" },
      { status: 500 }
    );
  }
}
