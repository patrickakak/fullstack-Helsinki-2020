import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Notification from './components/Notification'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

import { initialiseBlogs, createBlog, updateLikes, deleteBlog, setToken } from './reducers/blogReducer'
import { setNotification } from './reducers/notificationReducer'
import { login, logout } from './reducers/loginReducer'

const App = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const notification = useSelector(state => state.notification)
  const user = useSelector(state => state.login)

  useEffect(() => {
    dispatch(initialiseBlogs())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setToken(user?.token)
    }
  }, [user])

  const handleLogin = async (username, password) => {
    try {
      await dispatch(login(username, password))
    } catch (exception) {
      dispatch(setNotification({
        text: 'Wrong credentials',
        type: 'error'
      }, 5))
    }
  }

  const addBlog = blogObject => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification({
      text: `A new blog ${blogObject.title} by ${blogObject.author} added`,
      type: 'success'
    }, 5))
  }

  const addLikes = (id, blogObject) => {
    dispatch(updateLikes(id, blogObject))
  }

  const removeBlog = id => {
    dispatch(deleteBlog(id))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logout())
  }

  const blogFormRef = useRef()

  return (
    <div>
      {user === null ? <h2>Log in to application</h2> : <h2>blogs</h2>}
      <Notification notification={notification} />
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
            .slice()
            .sort((a, b) => b.likes - a.likes)
            .map(blog =>
              <Blog
                key={blog.id}
                blog={blog}
                user={user}
                updateLikes={addLikes}
                removeBlog={removeBlog}
              />
            )}
        </>
      }
    </div>
  )
}

export default App
