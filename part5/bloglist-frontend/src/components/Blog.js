import { useState } from 'react'

const Blog = ({ blog, updateLikes, removeBlog, user }) => {
  const [visible, setVisible] = useState(false)
  const [postedBy, setPostedBy] = useState('')

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const detailsStyle = {
    display: visible ? '' : 'none'
  }

  const update = () => {
    const newBlog = {
      ...blog,
      user: blog.user.id,
      likes: blog.likes + 1,
    }

    setPostedBy(postedBy || blog.user?.username)
    updateLikes(blog.id, newBlog)
  }

  const remove = () => {
    if (window.confirm(
      `Remove blog You're NOT gonna need it! By ${blog.user?.username || postedBy || user?.username}?`
    )) {
      removeBlog(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      <div className='summary'>
        {blog.title} {blog.author}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      <div style={detailsStyle} className='details'>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes}
          <button onClick={update}>like</button>
        </div>
        <div>{blog.user?.username || postedBy || user?.username}</div>
        {(blog.user?.username === user?.username || postedBy === user?.username || (!blog.user?.username && !postedBy)) && (
          <button onClick={remove}>
            remove
          </button>
        )}
      </div>
    </div >
  )
}

export default Blog