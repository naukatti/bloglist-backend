const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");

const api = supertest(App);

test("blogs are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

afterAll(() => {
  mongoose.connection.close();
});
