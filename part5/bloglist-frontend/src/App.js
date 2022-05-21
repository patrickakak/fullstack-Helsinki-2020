import { useState, useEffect, useRef } from 'react'

import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [msg, setMsg] = useState({ text: '', type: '' })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
    } catch (exception) {
      setMsg({ text: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setMsg({ text: '', type: '' })
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMsg({
          text: `A new blog ${blogObject.title} by ${blogObject.author} added`,
          type: 'success'
        })
        setTimeout(() => {
          setMsg({ text: '', type: '' })
        }, 5000)
      })
  }

  const addLikes = (id, blogObject) => {
    blogService.update(id, blogObject).then(returnedBlog => {
      setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
    })
  }

  const deleteBlog = id => {
    blogService._delete(id).then(ret => {
      setBlogs(blogs.filter(blog => blog.id !== id))
    })
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const blogFormRef = useRef()

  return (
    <div>
      {user === null ? <h2>Log in to application</h2> : <h2>blogs</h2>}
      <Notification msg={msg} />
      {user === null && <LoginForm handleLogin={handleLogin} />}
      {user !== null &&
        <>
          <div>
            {user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </div>
          <br />

          <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>

          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateLikes={addLikes}
                removeBlog={deleteBlog}
              />
            )}
        </>
      }
    </div>
  )
}

export default App
