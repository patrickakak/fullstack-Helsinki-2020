import axios from 'axios'
import { useState, useEffect } from 'react'

const View = ({ country }) => {
  const api_key = process.env.REACT_APP_API_KEY
  console.log("api_key:", api_key)
  axios
    .get('https://openweathermap.org/')
    .then(response => {
      console.log(response.data)
    })
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital}</div>
      <div>area {country.area}</div>
      <h3>languages</h3>
      <ul>
        {Object.values(country.languages).map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags['png']} alt="" />
      <h3>Weather in {country.capital}</h3>

    </div>
  )
}

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

const List = (props) => {
  return (
    props.countries.map(country => <Row key={country.name.common} country={country} handleShowClick={props.handleShowClick} />)
  )
}

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

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
        // console.log(response.data)
      })
  }, [])

  const handleFilterChange = (e) => {
    setFilterText(e.target.value.toLowerCase())
  }

  const countriesToShow = countries.filter(country => {
    return (
      country.name.common.toLowerCase().includes(filterText)
    )
  })

  const handleShowClick = text => {
    setFilterText(text.toLowerCase())
  }

  return (
    <div>
      <div>
        find countries
        <input value={filterText} onChange={handleFilterChange} />
      </div>
      <Display countries={countriesToShow} handleShowClick={handleShowClick} />
    </div>
  )
}

export default App