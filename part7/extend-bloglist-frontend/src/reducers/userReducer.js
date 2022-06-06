import loginService from '../services/login'

const initialState = JSON.parse(
  window.localStorage.getItem('loggedBlogappUser'),
)

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.data
  case 'LOGOUT':
    return null
  default:
    return state
  }
}

export const userLogin = (username, password) => {
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
