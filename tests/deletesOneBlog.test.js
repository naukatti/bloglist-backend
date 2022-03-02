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
  const userwrong = new User({ username: "einain", passwordHash });
  await userwrong.save();
});

test("deletes one blog when id's match", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;

  const blog = {
    title: "Test delete Vuf",
    author: "Koer Poega",
    url: "https://example.com/example",
    likes: 90,
  };

  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);

  const blogId = newBlog.body.id;

  expect(blogId).toBeDefined();
  console.log(blogId);

  await api
    .del(`/api/blogs/${blogId}`)
    .set("Authorization", `bearer ${token}`)
    .expect(204);

  await api
    .get(`/api/blogs/${blogId}`)
    .set("Authorization", `bearer ${token}`)
    .expect(404);

  const listIsEmpty = await api
    .get(`/api/blogs/`)
    .set("Authorization", `bearer ${token}`);
  expect(listIsEmpty.body.length === 0);
});

test("doesn't delete blog when id's do NOT match", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;

  const blog = {
    title: "Test delete Vuf",
    author: "Koer Poega",
    url: "https://example.com/example",
    likes: 90,
  };
  const newBlog = await api
    .post("/api/blogs")
    .set("Authorization", `bearer ${token}`)
    .send(blog);
  expect(newBlog.body.id).toBeDefined();

  const otheruser = await api
    .post("/api/login")
    .send({ username: "einain", password: "secret" });
  const otherToken = otheruser.body.token;

  await api
    .delete(`/api/blogs/${newBlog.body.id}`)
    .set("Authorization", `bearer ${otherToken}`)
    .expect(403);

  await api
    .get(`/api/blogs/${newBlog.body.id}`)
    .set("Authorization", `bearer ${otherToken}`)
    .expect(200);
  const listIsEmpty = await api
    .get(`/api/blogs/`)
    .set("Authorization", `bearer ${otherToken}`);
  expect(listIsEmpty.body.length === 1);
});
