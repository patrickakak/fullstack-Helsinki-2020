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

const _ = require('lodash')
const mostBlogs = blogs => {
  const hashMap = _.countBy(blogs.map(blog => blog.author))
  const authorWithMostBlogs = Object.keys(hashMap).reduce((a, b) => hashMap[a] > hashMap[b] ? a : b, '')
  return {
    author: authorWithMostBlogs,
    blogs: hashMap[authorWithMostBlogs]
  }
}

const mostLikes = blogs => {
  const hashMap = new Map()
  for (const blog of blogs) {
    if (hashMap.has(blog.author)) {
      hashMap.set(blog.author, hashMap.get(blog.author) + blog.likes)
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