import Row from './Row'

const List = (props) => (
  props.countries.map(country =>
    <Row
      key={country.name.common}
      country={country}
      handleShowClick={props.handleShowClick}
    />
  )
)

export default List