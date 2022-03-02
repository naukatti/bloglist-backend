const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");
const Blog = require("../models/Blog");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const api = supertest(App);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
});

test("the title cannot be missing", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    author: "Carol Kuratassu",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.statusCode).toBe(400);
});

test("the url cannot be missing", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    title: "Testi Mau",
    author: "Nils Viiksikarva",
    likes: 9000,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.statusCode).toBe(400);
});

test("the author cannot be left empty", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    title: "Karvanlähdön ABC",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.statusCode).toBe(400);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
