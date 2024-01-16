const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const Blog = require("../models/blog");

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

test("Creates a new Blog post", async () => {
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    likes: 1,
    url: "http://test.test",
  };

  const saveResponse = await api
    .post("/api/blogs")
    .send(newBlogObj)
    .expect(201);

  expect(saveResponse.body).toMatchObject(newBlogObj);
  const postRes = await api.get("/api/blogs");
  expect(postRes.body).toHaveLength(initialBlogs.length + 1);
});

test("likes is missing from request and defaults to 0", async () => {
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
    url: "http://test.test",
  };
  const postResponse = await api.post("/api/blogs").send(newBlogObj);
  expect(postResponse.body).toMatchObject({ likes: 0 });
});

test("Creating a new post without title response is 400", async () => {
  const newBlogObj = {
    author: "test Author",
    url: "http://test.test",
  };
  const postResponse = await api
    .post("/api/blogs")
    .send(newBlogObj)
    .expect(400);
});

test("Creating a new post without url response is 400", async () => {
  const newBlogObj = {
    title: "test blog",
    author: "test Author",
  };
  const postResponse = await api
    .post("/api/blogs")
    .send(newBlogObj)
    .expect(400);
});

test("Deleting a blog check if status code is 204 and if is not in the collection", async () => {
  const blogToDelete = await Blog.findOne({});
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);
  const response = await api.get("/api/blogs");
  expect(response.body).not.toContainEqual(blogToDelete);
});

afterAll(async () => {
  await mongoose.connection.close();
});
