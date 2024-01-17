const blogsRouter = require("express").Router();
const { response } = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
  // Blog.find({}).then((blogs) => {
  //   response.json(blogs);
  // });
});

blogsRouter.post("/", async (request, response) => {
  // const blog = new Blog({
  //   likes: request.body.likes ? request.body.likes : 0,
  //   ...request.body,
  // });
  const user = await User.findOne({});
  const blog = new Blog({ ...request.body, user: user.id });

  // blog.save().then((result) => {
  //   response.status(201).json(result);
  // });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog);
});
//delete
blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});
//update
blogsRouter.put("/:id", async (request, response) => {
  const { body } = request;
  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };
  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });
  response.json(updatedBlog);
});

module.exports = blogsRouter;
