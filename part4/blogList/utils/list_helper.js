const dummy = () => {
  return 1
}

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
  let favorite = {}
  let maxLikes = 0
  for (const blog of blogs) {
    if (blog.likes > maxLikes) {
      maxLikes = blog.likes
      favorite = blog
    }
  }
  return favorite
}

// var _ = require('lodash')
const mostBlogs = blogs => {
  const hashMap = new Map()
  for (const blog of blogs) {
    if (hashMap.has(blog.author)) {
      const cur = hashMap.get(blog.author)
      hashMap.set(blog.author, cur + 1)
    } else {
      hashMap.set(blog.author, 1)
    }
  }
  let authorWithMostBlogs = {}
  let maxBlog = 0
  for (const [key, value] of hashMap.entries()) {
    if (maxBlog < value) {
      maxBlog = value
      authorWithMostBlogs = {
        author: key,
        blogs: maxBlog
      }
    }
  }
  return authorWithMostBlogs
}

const mostLikes = blogs => {
  const hashMap = new Map()
  for (const blog of blogs) {
    if (hashMap.has(blog.author)) {
      const cur = hashMap.get(blog.author)
      hashMap.set(blog.author, cur + blog.likes)
    } else {
      hashMap.set(blog.author, blog.likes)
    }
  }
  let authorWithMostLikes = {}
  let maxLike = 0
  for (const [key, value] of hashMap.entries()) {
    if (maxLike < value) {
      maxLike = value
      authorWithMostLikes = {
        author: key,
        likes: maxLike
      }
    }
  }
  return authorWithMostLikes
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}