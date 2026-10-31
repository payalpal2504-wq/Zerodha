const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const mongoose = require("mongoose");
const app = require("../src/app");
const { connectDB } = require("../src/config/db");

let server;
let baseUrl;
let authToken;

before(async () => {
  await connectDB();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api`;

  // Create trader user for test
  const traderEmail = `trader_${Date.now()}@zerodha.local`;
  const regRes = await fetch(`${baseUrl}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Trading Test User",
      email: traderEmail,
      password: "TraderPassword@123",
    }),
  });
  const regData = await regRes.json();
  authToken = regData.token;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
});

describe("Trading, Orders, Holdings & Funds Tests", () => {
  test("1. GET /api/funds retrieves initial allocated balance", async () => {
    const res = await fetch(`${baseUrl}/funds`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.availableBalance, 100000);
  });

  test("2. POST /api/orders places a valid BUY order and updates funds", async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        symbol: "ITC",
        qty: 10,
        type: "BUY",
        product: "CNC",
        orderType: "MARKET",
      }),
    });

    const json = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.order.status, "COMPLETE");
    assert.ok(json.availableFunds < 100000, "Funds must be deducted");
  });

  test("3. POST /api/orders rejects BUY order if funds are insufficient", async () => {
    const res = await fetch(`${baseUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        symbol: "RELIANCE",
        qty: 10000, // Massive quantity requiring crores
        type: "BUY",
        product: "CNC",
        orderType: "MARKET",
      }),
    });

    const json = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(json.success, false);
    assert.match(json.message, /Insufficient funds/i);
  });

  test("4. GET /api/holdings returns updated user holdings", async () => {
    const res = await fetch(`${baseUrl}/holdings`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
    const itc = json.data.find((h) => h.symbol === "ITC");
    assert.ok(itc, "ITC should be in holdings");
    assert.strictEqual(itc.qty, 10);
  });

  test("5. POST /api/watchlist and DELETE /api/watchlist updates watchlist", async () => {
    // Add WIPRO
    const addRes = await fetch(`${baseUrl}/watchlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ symbol: "WIPRO" }),
    });
    const addJson = await addRes.json();
    assert.strictEqual(addRes.status, 201);
    assert.strictEqual(addJson.success, true);

    // Delete WIPRO
    const delRes = await fetch(`${baseUrl}/watchlist/WIPRO`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    const delJson = await delRes.json();
    assert.strictEqual(delRes.status, 200);
    assert.strictEqual(delJson.success, true);
  });

  test("6. POST /api/funds/deposit adds simulated funds", async () => {
    const res = await fetch(`${baseUrl}/funds/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ amount: 50000 }),
    });
    const json = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(json.success, true);
  });
});
