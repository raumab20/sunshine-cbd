import request from "supertest";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { GET } from "@/app/api/products/route";
import "@testing-library/jest-dom";
import { expect } from "@jest/globals";

// Mock globalen `Request`-Typ
global.Request = class {
  url: string;
  method: string;
  headers: HeadersInit;
  body: any;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = typeof input === "string" ? input : input.toString();
    this.method = init?.method || "GET";
    this.headers = init?.headers || {};
    this.body = init?.body || null;
  }

  json() {
    return Promise.resolve(this.body);
  }
};

// Mock Prisma
jest.mock("@prisma/client", () => require("../__mocks__/prisma"));

// Mock NextRequest und NextResponse
jest.mock("next/server", () => ({
  NextRequest: jest
    .fn()
    .mockImplementation((url: string, init: RequestInit) => {
      return {
        url,
        method: init?.method,
        headers: init?.headers,
        json: jest.fn(() => Promise.resolve(init?.body || {})),
      };
    }),
  NextResponse: {
    json: jest.fn((data: any) => ({
      status: 200,
      json: jest.fn(() => data),
    })),
  },
}));

let server: any;

beforeAll(() => {
  server = createServer((req: IncomingMessage, res: ServerResponse) => {
    const fullUrl = `http://localhost${req.url}`; // Vollständige URL mit http://localhost

    const { NextRequest } = require("next/server");
    const nextRequest = new NextRequest(fullUrl, {
      method: req.method,
      headers: req.headers as any,
      body: req as any,
    });

    GET(nextRequest)
      .then((result) => {
        if (result.json) {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(result.json()));
        } else {
          res.statusCode = 500;
          res.end("Error: Response body is null");
        }
      })
      .catch((err) => {
        res.statusCode = 500;
        res.end(`Error: ${err.message}`);
      });
  });
});

afterAll(() => {
  server.close();
});

describe("Webshop API Tests - Kernfunktionalität", () => {
  // Test für gefilterte Kategorie
  test("should return products filtered by category (manual double-check)", async () => {
    const allResponse = await request(server).get("/api/products");
    expect(allResponse.status).toBe(200);
    const allProducts = allResponse.body;

    const expectedProducts = allProducts.filter(
      (product: any) => product.category === "Oils"
    );

    const response = await request(server).get("/api/products?category=Oils");
    expect(response.status).toBe(200);

    expect(response.body.length).toBe(expectedProducts.length);

    response.body.forEach((product: any) => {
      expect(product.category).toBe("Oils");
    });
  });

  // Test für gefilterten Preisbereich
  test("should return products filtered by price range (manual double-check)", async () => {
    const allResponse = await request(server).get("/api/products");
    expect(allResponse.status).toBe(200);
    const allProducts = allResponse.body;

    const expectedProducts = allProducts.filter(
      (product: any) => product.price >= 20 && product.price <= 30
    );

    const response = await request(server).get(
      "/api/products?minPrice=20&maxPrice=30"
    );
    expect(response.status).toBe(200);

    expect(response.body.length).toBe(expectedProducts.length);

    response.body.forEach((product: any) => {
      expect(product.price).toBeGreaterThanOrEqual(20);
      expect(product.price).toBeLessThanOrEqual(30);
    });
  });

  // Test für Sortierung aufsteigend
  test("should return products sorted by price ascending (manual double-check)", async () => {
    const allResponse = await request(server).get("/api/products");
    expect(allResponse.status).toBe(200);
    const allProducts = allResponse.body;

    const expectedProducts = [...allProducts].sort((a, b) => a.price - b.price);

    const response = await request(server).get(
      "/api/products?sortBy=price&sortOrder=asc"
    );
    expect(response.status).toBe(200);

    expect(response.body.length).toBe(expectedProducts.length);

    const sortedPrices = response.body.map((p) => p.price);
    const expectedPrices = expectedProducts.map((p) => p.price);

    expect(sortedPrices).toEqual(expectedPrices);
  });

  // Test für Sortierung absteigend
  test("should return products sorted by price descending (manual double-check)", async () => {
    const allResponse = await request(server).get("/api/products");
    expect(allResponse.status).toBe(200);
    const allProducts = allResponse.body;

    const expectedProducts = [...allProducts].sort((a, b) => b.price - a.price);

    const response = await request(server).get(
      "/api/products?sortBy=price&sortOrder=desc"
    );
    expect(response.status).toBe(200);

    expect(response.body.length).toBe(expectedProducts.length);

    const sortedPrices = response.body.map((p) => p.price);
    const expectedPrices = expectedProducts.map((p) => p.price);

    expect(sortedPrices).toEqual(expectedPrices);
  });
});
