const Notification = ({ msg }) => {
  if (msg.text === '') {
    return null
  }
  return (
    <div className={msg.type}>
      {msg.text}
    </div>
  )
}

export default Notification
