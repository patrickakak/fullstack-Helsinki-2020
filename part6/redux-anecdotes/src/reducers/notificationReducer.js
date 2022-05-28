const notificationReducer = (state = '', action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.notification
    case 'REMOVE_NOTIFICATION':
      return ''
    default:
      return state
  }
}

export const setNotification = (notification, delay) => {
  return async dispatch => {
    dispatch({ type: 'SET_NOTIFICATION', notification })
    setTimeout(() => {
      dispatch(clearNotification())
    }, delay * 1000)
  }
}

export const clearNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export default notificationReducer
