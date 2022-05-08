const Row = (props) => {
  const handleShowClick = () => {
    props.handleShowClick(props.country.name.common)
  }
  return (
    <div>
      {props.country.name.common}
      <button onClick={handleShowClick}>show</button>
    </div>
  )
}

export default Row