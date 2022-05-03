const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')

describe('when there is initially some blogs saved', () => {
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

  describe('addition of a new blog', () => {
    test('succeeds with valid data', async () => {
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

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {}

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).not.toContain(blogToDelete.title)
    })
  })

  describe('update a blog', () => {
    test('succeeds with status code 200 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = { ...blogsAtStart[0], likes: blogsAtStart[0].likes + 1 }

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
      )
      expect(blogsAtEnd[0].likes).toBe(blogsAtStart[0].likes + 1)
    })

    test('fails with status code 400 if id is invalid', async () => {
      await api
        .put('/api/blogs/1')
        .send({})
        .expect(400)
    })
  })
})

afterAll(() => {
  mongoose.connection.close()
})