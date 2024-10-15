import request from 'supertest';
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { GET } from '@/app/api/products/route';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

// Mock globalen `Request`-Typ
global.Request = class {
  url: string;
  method: string;
  headers: HeadersInit;
  body: any;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method || 'GET';
    this.headers = init?.headers || {};
    this.body = init?.body || null;
  }

  json() {
    return Promise.resolve(this.body);
  }
};

// Mock Prisma
jest.mock('@prisma/client', () => require('../__mocks__/prisma'));

// Mock NextRequest und NextResponse
jest.mock('next/server', () => ({
  NextRequest: jest.fn().mockImplementation((url: string, init: RequestInit) => {
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

    const { NextRequest } = require('next/server');
    const nextRequest = new NextRequest(fullUrl, {
      method: req.method,
      headers: req.headers as any,
      body: req as any,
    });

    GET(nextRequest)
      .then(result => {
        if (result.json) {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.json()));
        } else {
          res.statusCode = 500;
          res.end('Error: Response body is null');
        }
      })
      .catch(err => {
        res.statusCode = 500;
        res.end(`Error: ${err.message}`);
      });
  });
});

afterAll(() => {
  server.close();
});

describe('Webshop API Tests - Kernfunktionalität', () => {
    // Test für gefilterte Kategorie
    test('should return products filtered by category', async () => {
      const response = await request(server).get('/api/products?category=Oils');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(1);  // Wir erwarten nur 1 Produkt in der Kategorie "Oils"
      expect(response.body[0].category).toBe('Oils');
    });
  
    // Test für gefilterten Preisbereich
    test('should return products filtered by price range', async () => {
      const response = await request(server).get('/api/products?minPrice=20&maxPrice=30');
      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);  // 2 Produkte zwischen 20 und 30 Euro
      expect(response.body.every((p: any) => p.price >= 20 && p.price <= 30)).toBeTruthy();
    });
  
      // Test für Sortierung aufsteigend
  test('should return products sorted by price ascending', async () => {
    const response = await request(server).get('/api/products?sortBy=price&sortOrder=asc');
    expect(response.status).toBe(200);
    
    const prices = response.body.map((p: any) => p.price);
    const sortedPrices = [...prices].sort((a: number, b: number) => a - b);
    expect(prices).toEqual(sortedPrices);
  });

  // Test für Sortierung absteigend
  test('should return products sorted by price descending', async () => {
    const response = await request(server).get('/api/products?sortBy=price&sortOrder=desc');
    expect(response.status).toBe(200);
    
    const prices = response.body.map((p: any) => p.price);
    const sortedPrices = [...prices].sort((a: number, b: number) => b - a);
    expect(prices).toEqual(sortedPrices);
  });
});