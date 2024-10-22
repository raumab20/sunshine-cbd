"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartPage: NextPage = () => {
  const [cart, setCart] = useState<any[]>([]); // Initialisiere mit einem leeren Array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: session, status } = useSession(); // session und status von next-auth holen

  // Funktion, um den Warenkorb abzurufen
  const fetchCart = async () => {
    if (!session) {
      setError("Nicht authentifiziert");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const url = new URL(`${baseUrl}/api/cart`);

    try {
      const res = await fetch(url.toString(), {
        method: "POST", // Verwende POST, um die Session zu senden
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }), // Sende die Session im Body der Anfrage
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }

      const data = await res.json();
      setCart(data); // Setze den Warenkorb mit den zurückgegebenen Daten
    } catch (error) {
      console.error("Error fetching cart:", error);
      setError("Failed to fetch cart. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Verwende useEffect, um den Warenkorb nach dem ersten Rendern abzurufen
  useEffect(() => {
    if (session && status === "authenticated") {
      fetchCart(); // Cart wird nur abgerufen, wenn der User authentifiziert ist
    }
  }, [session, status]); // Läuft, wenn session oder status sich ändern

  // Ladezustand anzeigen
  if (loading) {
    return <div>Lade Warenkorb...</div>;
  }

  // Fehler anzeigen, wenn der Abruf fehlgeschlagen ist
  if (error) {
    return <div>Fehler: {error}</div>;
  }

  // Wenn der Warenkorb leer ist, zeige eine Nachricht an
  if (cart.length === 0) {
    return <div>Der Warenkorb ist leer.</div>;
  }

  // Warenkorbinhalt anzeigen
  return (
    <div>
      <h1>Warenkorb</h1>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            Produkt: {item.productId} - Menge: {item.quantity}
          </li>
        ))}
      </ul>
      <br />
    </div>
  );
};

export default CartPage;
