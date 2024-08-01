const mongoose = require("mongoose");

const supertest = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");
const api = supertest(app);

const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "http://test1.test",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://test2.test",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("sekret", 10);
  const user = new User({
    name: "Superuser",
    username: "root",
    passwordHash,
  });
  const savedUser = await user.save();
  // console.log(savedUser);
  let blogObject = new Blog({ ...initialBlogs[0], user: savedUser.id });
  await blogObject.save();
  blogObject = new Blog({ ...initialBlogs[1], user: savedUser.id });
  await blogObject.save();
}, 100000);

test(`blogs are returned as json with the correct amount of blog ${initialBlogs.length}  posts`, async () => {
  const response = await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/);
  expect(response.body).toHaveLength(initialBlogs.length);
});
// test("there are two blogs", async () => {
//   const response = await api.get("/api/blogs");

//   expect(response.body).toHaveLength(2);
// });

// test("the first blog is about React patterns", async () => {
//   const response = await api.get("/api/blogs");

//   expect(response.body[0].title).toBe("React patterns");
// });

test("Blogs unique identifier is id", async () => {
  const response = await api.get("/api/blogs");
  response.body.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("Creates a new Blog post", async () => {
  const loggedUser = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    likes: 1,
    url: "http://test.test",
  };

  const saveResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlogObj)
    .expect(201);

  expect(saveResponse.body).toMatchObject(newBlogObj);
  const postRes = await api.get("/api/blogs");
  expect(postRes.body).toHaveLength(initialBlogs.length + 1);
});

test("likes is missing from request and defaults to 0", async () => {
  const loggedUser = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    url: "http://test.test",
  };
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlogObj);
  expect(postResponse.body).toMatchObject({ likes: 0 });
});

test("Creating a new post without title response is 400", async () => {
  const loggedUser = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });
  const newBlogObj = {
    author: "test Author",
    url: "http://test.test",
  };
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlogObj)
    .expect(400);
});

test("Creating a new post without url response is 400", async () => {
  const loggedUser = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  const newBlogObj = {
    title: "test blog",
    author: "test Author",
  };
  const postResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .send(newBlogObj)
    .expect(400);
});

test("Deleting a blog check if status code is 204 and if is not in the collection", async () => {
  const loggedUser = await api
    .post("/api/login")
    .send({ username: "root", password: "sekret" });

  const blogToDelete = await Blog.findOne({});
  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .set("Authorization", `Bearer ${loggedUser.body.token}`)
    .expect(204);
  const response = await api.get("/api/blogs");
  expect(response.body).not.toContainEqual(blogToDelete);
});
test("Updating a blog check if likes are updated", async () => {
  const blogToUpdate = await Blog.findOne({});

  const updatedBlog = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({ likes: blogToUpdate.likes + 3 });
  expect(updatedBlog.body).toMatchObject({
    likes: blogToUpdate.likes + 3,
  });
});

test("adding a blog fails with 401 code if token is invalid ", async () => {
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    likes: 1,
    url: "http://test.test",
  };

  const saveResponse = await api
    .post("/api/blogs")
    .set("Authorization", `Bearer 12324534677`)
    .send(newBlogObj)
    .expect(401);
});

test("adding a blog fails with 401 code if token is not given ", async () => {
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    likes: 1,
    url: "http://test.test",
  };

  const saveResponse = await api
    .post("/api/blogs")
    .send(newBlogObj)
    .expect(401);
});

afterAll(async () => {
  await mongoose.connection.close();
});
