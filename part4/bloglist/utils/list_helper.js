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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
