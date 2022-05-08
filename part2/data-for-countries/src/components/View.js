import { useState, useEffect } from 'react'
import axios from 'axios'

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

  if (isLoading) return <></>

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

export default View