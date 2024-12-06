import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const GET = auth(async function GET(req: any) {
  if (req.auth) {
    return NextResponse.json(req.auth);
  }
  return NextResponse.json({ message: "Not Authenticated" }, { status: 401 });
});