"use strict";

const shipFile = require("../shipItApi");
shipFile.shipProduct = jest.fn();

const request = require("supertest");
const app = require("../app");



describe("POST /", function () {
  /**Mock shipProduct before every test */
  beforeEach(function () {
    shipFile.shipProduct.mockReturnValue(12345);
  });

  test("valid", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: "12345-6789",
    });

    expect(resp.body).toEqual({ shipped: 12345 });
  });

  test("throws error if empty request body", async function () {
    const resp = await request(app)
      .post("/shipments")
      .send();
    expect(resp.statusCode).toEqual(400);
  });

  test("throws error if missing field", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St"
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual("instance requires property \"zip\"");
  });

  test("throws error if incorrect type is entered", async function () {
    const resp = await request(app).post("/shipments").send({
      productId: 1000,
      name: "Test Tester",
      addr: "100 Test St",
      zip: 12345 - 6789
    });

    expect(resp.statusCode).toEqual(400);
    expect(resp.body.error.message[0]).toEqual("instance.zip is not of a type(s) string");
  });

});
