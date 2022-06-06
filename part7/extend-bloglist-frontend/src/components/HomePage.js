import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'
import Notification from './Notification'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import Blog from './Blog'
import styles from './HomePage.module.css'

const HomePage = () => {
  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.login)
  const blogFormRef = React.createRef()

  const addBlog = async blogObject => {
    try {
      blogFormRef.current.toggleVisibility()

      if (!blogObject.title || !blogObject.author || !blogObject.url) {
        dispatch(setNotification({ error: 'Please fill in all the fields' }, 5))
        return
      }
      dispatch(createBlog(blogObject, user))

      dispatch(
        setNotification({
          notification: `A new blog ${blogObject.title} by ${blogObject.author} added`,
        }, 5)
      )
    } catch (err) {
      dispatch(
        setNotification({
          error: `Oh~ nooo! ${err}`,
        }, 5),
      )
    }
  }

  return (
    <>
      <Notification />

      <h1 className={styles.title}>Create New</h1>
      <Togglable btnText="New Blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      <div className={styles.blogs}>
        {blogs
          .sort((a, b) => b.likes - a.likes)
          .map(blog => (
            <Blog
              key={blog.id}
              blog={blog}
            />
          ))}
      </div>
    </>
  )
}

export default HomePage
