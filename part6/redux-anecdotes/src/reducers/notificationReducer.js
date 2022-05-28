const initialState = ''

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      clearTimeout(state.delay)
      return action.data.notification
    case 'REMOVE_NOTIFICATION':
      return initialState
    default:
      return state
  }
}

export const setNotification = notification => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: {
        notification,
        delay: setTimeout(() => {
          dispatch(removeNotification())
        }, 5000),
      }
    })
  }
}

export const removeNotification = () => {
  return {
    type: 'REMOVE_NOTIFICATION',
  }
}

export default notificationReducer
