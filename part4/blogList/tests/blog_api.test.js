const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('root', 10)
    const user = new User({ username: 'root', name: 'woozway', passwordHash })

    await user.save()
  }, 100000)

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('when there is initially no blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyNzIwYWE3YjY3NjdjYTIwZjYyNjRkZCIsImlhdCI6MTY1MTY1NDkzOCwiZXhwIjoxNjUxNjU4NTM4fQ.qyv0kk4ZeQ1QFaPO95AUcYirWTJXxarh3HdLuSXEWOQ')
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
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyNzI0NWYxMGRjMzgyN2M2N2ZiZGU0YyIsImlhdCI6MTY1MTY1NjM4MCwiZXhwIjoxNjUxNjU5OTgwfQ.AdqvYtgz3HND--uk8FMCvtlVki-optrwh7bLnUwTPaQ')
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

      const blogsAtStart = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyNzI0NWYxMGRjMzgyN2M2N2ZiZGU0YyIsImlhdCI6MTY1MTY1NjM4MCwiZXhwIjoxNjUxNjU5OTgwfQ.AdqvYtgz3HND--uk8FMCvtlVki-optrwh7bLnUwTPaQ')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length + 1)

      const titles = blogsAtEnd.map(b => b.title)
      expect(titles).toContainEqual(
        newBlog.title
      )
    })

    test('fails with status code 400 if data invalid', async () => {
      const newBlog = {}

      const blogsAtStart = await helper.blogsInDb()
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyNzI0NWYxMGRjMzgyN2M2N2ZiZGU0YyIsImlhdCI6MTY1MTY1NjM4MCwiZXhwIjoxNjUxNjU5OTgwfQ.AdqvYtgz3HND--uk8FMCvtlVki-optrwh7bLnUwTPaQ')
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
    })

    test('fails with status code 401 Unauthorized if a token is not provided', async () => {
      const newBlog = {}

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
    })
  })

  describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjYyNzI0NWYxMGRjMzgyN2M2N2ZiZGU0YyIsImlhdCI6MTY1MTY1NjM4MCwiZXhwIjoxNjUxNjU5OTgwfQ.AdqvYtgz3HND--uk8FMCvtlVki-optrwh7bLnUwTPaQ')
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