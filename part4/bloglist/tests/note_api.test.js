const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  let blogObject = new Blog(initialBlogs[0]);
  await blogObject.save();
  blogObject = new Blog(initialBlogs[1]);
  await blogObject.save();
});

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

afterAll(async () => {
  await mongoose.connection.close();
});
