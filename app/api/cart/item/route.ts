import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getUser(session: { user?: { email?: string } }) {
  if (!session || !session?.user || !session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  return user;
}

export async function POST(req: NextRequest) {
  try {
    const { session, productId } = await req.json();

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

    let cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (existingCartItem) {
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: productId,
          quantity: 1,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
    return NextResponse.json(
      { error: "Fehler beim Hinzufügen des Produkts zum Warenkorb" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { session, productId } = await req.json();

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

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Warenkorb nicht gefunden" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId: productId,
      },
    });

    if (!cartItem) {
      return NextResponse.json(
        { error: "Artikel nicht im Warenkorb gefunden" },
        { status: 404 }
      );
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    return NextResponse.json({ message: "Artikel erfolgreich entfernt" });
  } catch (error) {
    console.error("Fehler beim Löschen des Warenkorbartikels:", error);
    return NextResponse.json(
      { error: "Fehler beim Löschen des Artikels" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { session, itemId, quantity } = await req.json();

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

    const cart = await prisma.cart.findFirst({
      where: { userId: user.id },
    });

    if (!cart) {
      return NextResponse.json(
        { error: "Warenkorb nicht gefunden" },
        { status: 404 }
      );
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id: itemId },
    });

    if (!cartItem || cartItem.cartId !== cart.id) {
      return NextResponse.json(
        { error: "Artikel nicht im Warenkorb gefunden" },
        { status: 404 }
      );
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: Math.max(1, quantity) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Menge:", error);
    return NextResponse.json(
      { error: "Fehler beim Aktualisieren der Menge des Produkts" },
      { status: 500 }
    );
  }
}
