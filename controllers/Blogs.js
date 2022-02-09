const blogsRouter = require("express").Router();
const Blog = require("../models/Blog");

blogsRouter.get("/", (request, response) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs.map((blog) => blog.toJSON()));
    })
    .catch((error) => next(error));
});

blogsRouter.get("/:id", (request, response, next) => {
  Blog.findById(request.params.id)
    .then((blog) => {
      if (blog) {
        response.json(blog.toJSON());
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

blogsRouter.post("/", (request, response, next) => {
  const body = request.body;

  const blog = new Blog({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  blog
    .save()
    .then((savedBlog) => {
      response.json(savedBlog.toJSON());
    })
    .catch((error) => next(error));
});

blogsRouter.delete("/:id", (request, response, next) => {
  Blog.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

blogsRouter.put("/:id", (request, response, next) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Blog.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(updatedNote.toJSON());
    })
    .catch((error) => next(error));
});

module.exports = blogsRouter;
