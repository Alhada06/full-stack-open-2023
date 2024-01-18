const blogsRouter = require("express").Router();
const { response } = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/middleware");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  // const decodedToken = jwt.verify(request.token, process.env.SECRET);
  // if (!decodedToken.id) {
  //   return response.status(401).json({ error: "token invalid" });
  // }
  const user = request.user;
  console.log(request.user);
  // const user = await User.findOne({});
  const blog = new Blog({ ...request.body, user: user.id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog.id);
  await user.save();
  response.status(201).json(savedBlog);
});
//delete
blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    // const decodedToken = jwt.verify(request.token, process.env.SECRET);
    // if (!decodedToken.id) {
    //   return response.status(401).json({ error: "token invalid" });
    // }
    const user = request.user;
    const blogToDelete = await Blog.findById(request.params.id);

    if (blogToDelete.user.toString() !== user.id.toString()) {
      return response.status(401).json({ error: "invalid user" });
    }
    await Blog.findByIdAndDelete(request.params.id);
    user.blogs = user.blogs.filter((e) => e !== request.params.id);
    response.status(204).end();
  }
);
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
