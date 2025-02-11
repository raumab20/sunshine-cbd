"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LogoutButton from "./LogoutButton";
import { ShoppingCart, FileText } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-background">
      <div className="flex h-16 items-center justify-between mx-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">Sunshine CBD</span>
        </Link>
        <div className="flex items-center space-x-4">
          {session?.user && (
            <>
              <Link href="/cart">
                <ShoppingCart className="h-6 w-6 text-white" />
              </Link>

              <Link href="/orders">
                <FileText className="h-6 w-6 text-white" />
              </Link>
            </>
          )}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name || ""}
                    />
                    <AvatarFallback>
                      {session.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="flex-col items-start">
                  <div className="text-sm font-medium">{session.user.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {session.user.email}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <LogoutButton />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button variant="secondary" size="sm">
                Anmelden
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
