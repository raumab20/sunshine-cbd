import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getUser(session: { user?: { email?: string } }) {
  if (!session || !session.user || !session.user.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

// ✅ GET: Alle Bestellungen eines Users abrufen
export async function GET(req: NextRequest) {
  try {
    const session = req.headers.get("authorization"); // Session aus Header holen
    if (!session) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session },
    });

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    // Bestellungen des Nutzers abrufen
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: { items: true }, // Enthält nur OrderItems mit productId
    });

    // Produktdetails für jedes OrderItem nachladen
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const itemsWithProducts = await Promise.all(
          order.items.map(async (item) => {
            const product = await prisma.product.findUnique({
              where: { id: item.productId },
            });
            return { ...item, product };
          })
        );

        return { ...order, items: itemsWithProducts };
      })
    );

    return NextResponse.json(ordersWithProducts);
  } catch (error) {
    console.error("Fehler beim Abrufen der Bestellungen:", error);
    return NextResponse.json({ error: "Fehler beim Abrufen der Bestellungen" }, { status: 500 });
  }
}

// ✅ POST: Warenkorb in Bestellung umwandeln
export async function POST(req: NextRequest) {
  try {
    const { session } = await req.json();

    if (!session) {
      return NextResponse.json({ error: "Nicht authentifiziert" }, { status: 401 });
    }

    const user = await getUser(session);

    if (!user) {
      return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
    }

    // Warenkorb abrufen
    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
      include: { items: true },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Warenkorb ist leer" }, { status: 400 });
    }

    // ✅ Produktpreise abrufen
    const itemsWithPrices = await Promise.all(
      cart.items.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true }, // Nur den Preis abrufen
        });
        return {
          productId: item.productId,
          quantity: item.quantity,
          price: product ? product.price : 0, // Falls kein Produkt gefunden, 0 setzen
        };
      })
    );

    // ✅ Gesamtpreis korrekt berechnen
    const total = itemsWithPrices.reduce((sum, item) => sum + item.quantity * item.price, 0);

    // Neue Bestellung erstellen
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total: total,
        status: "pending",
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Warenkorb leeren
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({ message: "Bestellung erfolgreich erstellt", order });
  } catch (error) {
    console.error("Fehler beim Erstellen der Bestellung:", error);
    return NextResponse.json({ error: "Fehler beim Erstellen der Bestellung" }, { status: 500 });
  }
}