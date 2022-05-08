import { useState, useEffect } from 'react'
import Display from './components/Display'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => setCountries(response.data))
  }, [])

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(filterText.toLowerCase())
  )

  return (
    <>
      <div>
        find countries
        <input
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>
      <Display
        countries={countriesToShow}
        handleShowClick={text => setFilterText(text)}
      />
    </>
  )
}

export default App