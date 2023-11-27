var _ = require("lodash");

const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, part) => {
    return sum + part.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  const likesMap = blogs.map((b) => b.likes);
  const mostLikedIndex = likesMap.indexOf(Math.max(...likesMap));
  return blogs[mostLikedIndex];
};
const mostBlogs = (blogs) => {
  return _.orderBy(
    _.map(
      _.groupBy(blogs, "author"),
      (value, key) => {
        return { author: key, blogs: value.length };
      },
      {}
    ),
    ["blogs"],
    ["desc"]
  )[0];
};

const mostLikes = (blogs) => {
  return _.orderBy(
    _.map(_.groupBy(blogs, "author"), (value, key) => {
      return {
        author: key,
        likes: value.reduce((r, v) => r + v.likes, 0),
      };
    }),
    ["likes"],
    ["desc"]
  )[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
