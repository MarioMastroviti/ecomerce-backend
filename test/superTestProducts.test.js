const chai = require("chai");

const supertest = require("supertest");

const expect = chai.expect;

const requester = supertest("http://localhost:8080");

describe("Testing", () => {
  describe("Test de productos", () => {
    it("El endpoint POST/api/product debe crear un producto", async () => {
      const mockProduct = {
        titulo: "aceite de cbd",
        categoria: "aceites",
        precio: 6000,
        stock: 100,
        };
      const { statusCode, ok, _body } = await requester
        .post("/api/product")
        .send(mockProduct);
      console.log(statusCode, ok, _body);
      
      expect(_body.payload).to.have.property("_id")
    });
    it("El endpoint GET /api/product debe obtener todos los productos", async () => {
        const { statusCode } = await requester.get("/api/product");
        expect(statusCode).to.equal(200);
      });
      it("El endpoint GET /api/product/:pid debe obtener un producto", async () => {
        const { statusCode } = await requester.get(
          "/api/products/655fc8203160a69175a18c4a"
        );
        expect(statusCode).to.equal(200);
      });
  });
  describe("Test de usuarios", () => {
    it("El endpoint POST /api/sessions/register debe crear un usuario", async () => {
      const mockUser = {
        first_name: "lolaso",
        last_name: "mastroviti",
        email: "lolasomastroviti1@mail.com",
        age: 28,
        password: "jueguejuegue",
     };
      const { statusCode, ok, _body } = await requester
        .post("/api/sessions/register")
        .send(mockUser);
      console.log(statusCode, ok, _body);
        expect(_body.payload).to.have.property("_id")
    });
    it("El endpoint GET /api/sessions/login debe renderizar login", async () => {
      const { statusCode } = await requester.get("/api/sessions/login");
      expect(statusCode).to.equal(200);
    });
    it("El endpoint GET /api/sessions/register debe renderizar register", async () => {
      const { statusCode } = await requester.get("/api/sessions/register");
      expect(statusCode).to.equal(200);
    });
  });
});