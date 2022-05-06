import axios from 'axios'
import { useState, useEffect } from 'react'

const View = ({ country }) => {
  const [isLoading, setLoading] = useState(true)
  const [weatherData, setWeatherData] = useState()

  const API_URL = `http://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${process.env.REACT_APP_API_KEY}`
  useEffect(() => {
    axios
      .get(API_URL)
      .then(response => {
        setWeatherData(response.data)
        setLoading(false)
      })
  }, [API_URL])

  if (isLoading) {
    return <></>
  }
  const weatherIconURL = `http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`
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
      <div>temperature {(weatherData.main.temp - 273.15).toFixed(2)} Celcius</div>
      <img src={weatherIconURL} alt="" />
      <div>wind {weatherData.wind.speed} m/s</div>
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
    props.countries.map(country =>
      <Row key={country.name.common} country={country} handleShowClick={props.handleShowClick} />)
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