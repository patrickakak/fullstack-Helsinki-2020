import { useState, useEffect } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [msg, setMsg] = useState({ text: '', type: '' })

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMsg({ text: 'Wrong credentials', type: 'error' })
      setTimeout(() => {
        setMsg({ text: '', type: '' })
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInBloglistUser')
    setUser(null)
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    try {
      const newObject = {
        title: title,
        author: author,
        url: url,
      }
      await blogService.create(newObject)
      const updatedBlogs = await blogService.getAll()
      setBlogs(updatedBlogs)
      setTitle('')
      setAuthor('')
      setUrl('')
      setMsg({
        text: `A new blog ${newObject.title} by ${newObject.author} added`,
        type: 'success'
      })
      setTimeout(() => {
        setMsg({ text: '', type: '' })
      }, 5000)
    } catch (exception) {
      setMsg({ text: 'exception in handleCreate try catch!', type: 'error' })
      setTimeout(() => {
        setMsg({ text: '', type: '' })
      }, 5000)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      {user === null ? <h2>Log in to application</h2> : <h2>blogs</h2>}
      <Notification msg={msg} />
      {user === null &&
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
        />
      }
      {user !== null &&
        <div>
          <div>
            {user.username} logged in
            <button onClick={handleLogout}>logout</button>
          </div>
          <h2>create new</h2>
          <BlogForm
            handleCreate={handleCreate}
            title={title}
            author={author}
            url={url}
            handleTitleChange={({ target }) => setTitle(target.value)}
            handleAuthorChange={({ target }) => setAuthor(target.value)}
            handleUrlChange={({ target }) => setUrl(target.value)}
          />
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
        </div>
      }
    </div>
  )
}

export default App
