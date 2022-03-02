const bcrypt = require("bcrypt");
const User = require("../models/user");
const token = require("../controllers/login");
const helper = require("../utils/test_helper");
const supertest = require("supertest");
const App = require("../App");
const api = supertest(App);

describe("when there is initially one user at db", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash("secret", 10);
    const user = new User({ username: "root", passwordHash });

    await user.save();
  });

  test("login succeeds", async () => {
    const loginuser = await api
      .post("/api/login")
      .send({ username: "root", password: "secret" });
    const { token } = loginuser.body;
    expect(token).toBeDefined();
  });
});
