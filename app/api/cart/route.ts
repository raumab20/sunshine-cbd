import { PrismaClient } from "@prisma/client";
import { Session } from "inspector/promises";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

async function getSession(req: NextRequest) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { sessionToken: token },
  });

  return session;
}

//Finde den zugehörigen User zur Session

async function getUser(session: any) {
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  });

  return user;
}

export async function GET(req: NextRequest) {
  const session = await getSession(req);

  if (!session) {
    return NextResponse.json(
      { error: "Nicht authentifiziert" },
      { status: 401 }
    );
  }

  const user = await getUser(getSession(req));

  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  const session = await getSession(req);

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

  const body = await req.json();

  const newProduct = await prisma.product.create({
    data: {
      ...body,
      userId: user.id,
    },
  });

  return NextResponse.json(newProduct);
}
