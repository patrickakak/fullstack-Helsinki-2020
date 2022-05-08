const Row = ({ country, handleShowClick }) => {
  return (
    <div>
      {country.name.common}
      <button onClick={() => handleShowClick(country.name.common)}>show</button>
    </div>
  )
}

export default Row