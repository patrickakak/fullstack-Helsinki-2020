import { filterChange } from "../reducers/filterReducer"
import { connect } from 'react-redux'

const Filter = (props) => {
  const handleChange = (event) => {
    props.filterChange(event.target.value)
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

// Alternatively, we could pass the following function definition as the second parameter to `connect`
const mapDispatchToProps = dispatch => {
  return {
    filterChange: value => {
      dispatch(filterChange(value))
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Filter)