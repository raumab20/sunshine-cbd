import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getUser(session: { user?: { email?: string } }) {
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }, // Verwende die E-Mail aus der Session
  });

  return user;
}

export async function GET(req: NextRequest) {
  try {
    const session = req.headers.get("authorization"); // Session aus Header holen
    if (!session) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session }, // User anhand der Session-E-Mail finden
    });

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json({ items: [] }); // Falls kein Warenkorb existiert
    }

    const cartItems = await prisma.cartItem.findMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ items: cartItems });
  } catch (error) {
    console.error("Fehler beim Abrufen des Warenkorbs:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen des Warenkorbs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { session } = await req.json();

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

    // Ergänze jedes CartItem um die Produktinformationen
    const cartItemsWithProductData = await Promise.all(
      cartItems.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            image: true,
            category: true,
            description: true,
          },
        });
        return {
          ...item,
          product,
        };
      })
    );

    return NextResponse.json(cartItemsWithProductData);
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
