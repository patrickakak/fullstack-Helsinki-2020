const initialState = {
  message: '',
  timeoutID: undefined
}

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    clearTimeout(state.timeoutID)
    return action.payload
  case 'REMOVE_NOTIFICATION':
    return initialState
  default:
    return state
  }
}

export const setNotification = (message, delay) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      payload: {
        message,
        timeoutID: setTimeout(() => {
          dispatch(clearNotification())
        }, delay * 1000)
      }
    })
  }
}

export const clearNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export default notificationReducer
