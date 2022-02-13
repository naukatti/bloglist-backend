const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  let allLikes = blogs.map((blog) => blog.likes);

  let oneSum = allLikes.reduce((a, b) => a + b, 0);
  return oneSum;
};

const favouriteBlog = (blogs) => {
  let sorted = [...blogs].sort((a, b) => b.likes - a.likes);
  return sorted[0];
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
};
