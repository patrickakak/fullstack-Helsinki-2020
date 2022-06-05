import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlogs(state, action) {
      return action.payload
    },
    setLikes(state, action) {
      const changedBlog = action.payload
      return state.map(blog =>
        blog.id !== changedBlog.id ? blog : changedBlog
      )
    },
    delBlog(state, action) {
      const id = action.payload
      return state.filter(blog => blog.id !== id)
    }
  },
})

export const initialiseBlogs = () => {
  return async dispatch => {
    const notes = await blogService.getAll()
    dispatch(setBlogs(notes))
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newNote = await blogService.create(content)
    dispatch(appendBlog(newNote))
  }
}

export const updateLikes = (id, blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.update(id, blogObject)
    dispatch(setLikes(newBlog))
  }
}

export const deleteBlog = id => {
  return async dispatch => {
    await blogService._delete(id)
    dispatch(delBlog(id))
  }
}

export const setToken = token => {
  blogService.setToken(token)
}

export const { appendBlog, setBlogs, setLikes, delBlog } = blogSlice.actions
export default blogSlice.reducer