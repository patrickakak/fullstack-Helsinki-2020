const Notification = ({ msg }) => {
  if (msg.message.text === '') {
    return null
  }
  return (
    <div className={msg.message.type}>
      {msg.message.text}
    </div>
  )
}

export default Notification
