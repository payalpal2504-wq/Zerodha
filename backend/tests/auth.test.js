const { test, describe, before, after } = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const mongoose = require("mongoose");
const app = require("../src/app");
const User = require("../src/models/User");
const { connectDB } = require("../src/config/db");

let server;
let baseUrl;

before(async () => {
  await connectDB();
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://127.0.0.1:${port}/api`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  await mongoose.connection.close();
});

describe("Authentication & Security Tests", () => {
  const testEmail = `test_${Date.now()}@zerodha.local`;
  let authToken = "";

  test("1. POST /api/auth/register creates user and returns JWT", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: testEmail,
        password: "TestPassword@123",
        phone: "9998887770",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 201);
    assert.strictEqual(data.success, true);
    assert.ok(data.token, "Token should be returned");
    assert.strictEqual(data.user.email, testEmail);
    assert.ok(!data.user.password, "Password must not be returned in response");
    authToken = data.token;
  });

  test("2. Duplicate email registration is prevented", async () => {
    const res = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Duplicate User",
        email: testEmail,
        password: "DifferentPassword@123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
  });

  test("3. POST /api/auth/login succeeds with valid credentials", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "TestPassword@123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.token);
  });

  test("4. POST /api/auth/login fails with invalid password", async () => {
    const res = await fetch(`${baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword123",
      }),
    });

    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.success, false);
  });

  test("5. GET /api/auth/me fails without token", async () => {
    const res = await fetch(`${baseUrl}/auth/me`);
    const data = await res.json();
    assert.strictEqual(res.status, 401);
    assert.strictEqual(data.success, false);
  });

  test("6. GET /api/auth/me succeeds with Bearer token", async () => {
    const res = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });

    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.strictEqual(data.user.email, testEmail);
  });

  const testPhone = "98765" + String(Math.floor(10000 + Math.random() * 90000));
  let devOtp = "";

  test("7. POST /api/auth/send-otp validates 10-digit Indian phone", async () => {
    const res = await fetch(`${baseUrl}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: "123" }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
  });

  test("8. POST /api/auth/send-otp generates and sends OTP for valid number", async () => {
    const res = await fetch(`${baseUrl}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, purpose: "signup" }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.devOtp, "devOtp should be present in development mode");
    devOtp = data.devOtp;
  });

  test("9. POST /api/auth/send-otp enforces 30s cooldown", async () => {
    const res = await fetch(`${baseUrl}/auth/send-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, purpose: "signup" }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 429);
    assert.strictEqual(data.success, false);
    assert.ok(data.retryAfter > 0);
  });

  test("10. POST /api/auth/verify-otp fails with incorrect OTP", async () => {
    const res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, otp: "000000" }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
  });

  test("11. POST /api/auth/verify-otp succeeds with correct OTP & generates JWT", async () => {
    const res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, otp: devOtp, name: "Rahul Trader" }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 200);
    assert.strictEqual(data.success, true);
    assert.ok(data.token, "JWT token must be returned");
    assert.strictEqual(data.user.phone, testPhone);
    assert.ok(data.user.userId, "Kite User ID must be generated");
  });

  test("12. POST /api/auth/verify-otp prevents OTP reuse", async () => {
    const res = await fetch(`${baseUrl}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: testPhone, otp: devOtp }),
    });
    const data = await res.json();
    assert.strictEqual(res.status, 400);
    assert.strictEqual(data.success, false);
  });
});
