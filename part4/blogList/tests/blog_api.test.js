const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
}, 100000)

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('id exists as the unique identifier instead of _id', async () => {
  const response = await api.get('/api/blogs')
  if (response.body.length) {
    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  }
})

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'title',
    author: 'author',
    url: 'www.url.com',
    likes: 4,
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContainEqual(
    newBlog.title
  )
})

test('likes property missing from the request will default to the value 0 in DB', async () => {
  const newBlog = {
    title: 'whatever',
    url: 'www.whatever.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  const titles = blogsAtEnd.map(b => b.title)
  expect(titles).toContainEqual(
    newBlog.title
  )
  for (let blog of blogsAtEnd) {
    if (blog.title.localeCompare(newBlog.title) === 0) {
      expect(blog.likes).toBe(0)
    }
  }
})

test('backend responds with the status code 400 if the title and url properties are missing from the request', async () => {
  const newBlog = {}

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
    .expect('Content-Type', /application\/json/)
})

afterAll(() => {
  mongoose.connection.close()
})