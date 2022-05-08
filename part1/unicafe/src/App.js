import { useState } from 'react'

const Display = ({ text }) => <h1>{text}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Statistic = ({ text, value }) => <tr><td>{text}</td><td>{value}</td></tr>

// eslint-disable-next-line
const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad
  const average = (good * 1 + neutral * 0 + bad * -1) / all
  const positive = good / all * 100 + "%"

  if (all === 0) {
    return <p>No feedback given</p>
  }
  const pairs = [
    {
      text: "good",
      value: good,
    }, {
      text: "neutral",
      value: neutral,
    }, {
      text: "bad",
      value: bad,
    }, {
      text: "all",
      value: all,
    }, {
      text: "average",
      value: average,
    }, {
      text: "positive",
      value: positive,
    },
  ]
  return (
    <table>
      <tbody>
        {pairs.map(pair => <Statistic key={pair.text} text={pair.text} value={pair.value} />)}
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Display text="give feedback" />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Display text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App