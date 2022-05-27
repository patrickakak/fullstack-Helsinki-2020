const notificationReducer = (state = 'initial value set for the message...', action) => {
  switch (action.type) {
    case 'SET_MESSAGE':
      return action.message
    default:
      return state
  }
}

export default notificationReducer
