const Notification = ({ notification }) => {
  if (notification.message.text === '') {
    return null
  }
  return (
    <div className={notification.message.type}>
      {notification.message.text}
    </div>
  )
}

export default Notification
