const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  res.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  const { body, user } = req
  const _user = await User.findById(user.id)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: _user._id
  })

  const savedBlog = await blog.save()
  _user.blogs = _user.blogs.concat(savedBlog._id)
  await _user.save()
  res.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (req, res) => {
  const { user } = req
  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(401).json({ error: 'cannot find a blog with that id' })
  } else {
    if (blog.user.toString() !== user.id.toString()) {
      return res.status(401).json({ error: 'can only delete blog(s) of your own' })
    } else {
      await Blog.findByIdAndRemove(req.params.id)
      res.status(204).end()
    }
  }
})

blogsRouter.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (blog) {
    res.json(blog.toJSON())
  } else {
    res.status(404).end()
  }
})

blogsRouter.put('/:id', async (req, res) => {
  const { body } = req

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  }

  const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
  if (updatedBlog) {
    res.status(200).json(updatedBlog.toJSON())
  } else {
    res.status(404).end()
  }
})

module.exports = blogsRouter