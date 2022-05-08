import View from './View'
import List from './List'

const Display = ({ countries, handleShowClick }) => {
  if (countries.length === 0) {
    return <></>
  } else if (countries.length === 1) {
    return <View country={countries[0]} />
  } else if (countries.length <= 10) {
    return <List countries={countries} handleShowClick={handleShowClick} />
  } else {
    return "Too many matches, specify another filter"
  }
}

export default Display