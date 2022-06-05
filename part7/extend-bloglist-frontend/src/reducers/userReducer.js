import loginService from '../services/login'

const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    console.log('action.data:', action.data)
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const userLogin = (username, password) => {
  // return async dispatch => {
  //   dispatch({
  //     type: 'SET_NOTIFICATION',
  //     payload: {
  //       message,
  //       timeoutID: setTimeout(() => {
  //         dispatch(clearNotification())
  //       }, delay * 1000)
  //     }
  //   })
  // }

  // return async dispatch => {
  //   const newBlog = await blogService.update(id, blogObject)
  //   dispatch(setLikes(newBlog))
  // }
  console.log('in userLogin:', username, ', ', password)
  return async dispatch => {
    const user = await loginService.login({ username, password })
    dispatch({
      type: 'LOGIN',
      data: user,
    })
  }
}

export const userLogout = () => {
  return {
    type: 'LOGOUT',
  }
}

export default userReducer
