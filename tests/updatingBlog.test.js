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

test("title can be updated", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    title: "Kylpyammeen valloittajat",
    author: "Carol Kuratassu",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.body.id).toBeDefined();

  const updatedTitle = "Kylpyammeen kaihtajat";

  const updatedBlog = await api
    .put(`/api/blogs/${newBlog.body.id}`)
    .set("Authorization", `bearer ${token}`)
    .send({ title: updatedTitle });
  expect(updatedBlog.body.title).toBe(updatedTitle);
  expect(updatedBlog.body.author).toBe(blog.author);
  expect(updatedBlog.body.url).toBe(blog.url);
  expect(updatedBlog.body.likes).toBe(blog.likes);
});

test("author can be updated", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    title: "Viiksiniekkojen kesäkokous",
    author: "Nils Kiiskivarva",
    url: "https://example.com/example",
    likes: 900,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.body.id).toBeDefined();

  const updatedAuthor = "Nils Viiksikarva";

  const updatedBlog = await api
    .put(`/api/blogs/${newBlog.body.id}`)
    .set("Authorization", `bearer ${token}`)
    .send({ author: updatedAuthor });
  expect(updatedBlog.body.title).toBe(blog.title);
  expect(updatedBlog.body.author).toBe(updatedAuthor);
  expect(updatedBlog.body.url).toBe(blog.url);
  expect(updatedBlog.body.likes).toBe(blog.likes);
});

test("url can be updated", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;
  const blog = {
    title: "Karvanlähdön ABC",
    author: "Kerkko Karvahinen",
    url: "https://example.com",
    likes: 90,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.body.id).toBeDefined();

  const updatedUrl = "https://example.com/example";

  const updatedBlog = await api
    .put(`/api/blogs/${newBlog.body.id}`)
    .set("Authorization", `bearer ${token}`)
    .send({ url: updatedUrl });
  expect(updatedBlog.body.title).toBe(blog.title);
  expect(updatedBlog.body.author).toBe(blog.author);
  expect(updatedBlog.body.url).toBe(updatedUrl);
  expect(updatedBlog.body.likes).toBe(blog.likes);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
