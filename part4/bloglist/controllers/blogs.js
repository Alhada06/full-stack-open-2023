const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.post("/", async (request, response) => {
  const blog = new Blog({
    likes: request.body.likes ? request.body.likes : 0,
    ...request.body,
  });

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

module.exports = blogsRouter;
