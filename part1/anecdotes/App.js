import { useState } from 'react'

const Display = ({ text, anecdotes, points, index }) => {
  return (
    <>
      <h1>{text}</h1>
      <div>{anecdotes[index]}</div>
      <div>has {points[index]} votes</div>
    </>
  )
}

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(new Uint8Array(anecdotes.length))
  const [mostVoteIndex, setMost] = useState(0)

  const getRandomInt = max => Math.floor(Math.random() * max)
  const handleNextAnecdote = () => setSelected(getRandomInt(anecdotes.length))

  const handleVote = () => {
    const copy = [...points]
    copy[selected] += 1
    setPoints(copy)

    let mostIndex = 0
    for (let i = 0; i < copy.length; i++) {
      if (copy[mostIndex] < copy[i]) {
        mostIndex = i
      }
    }
    setMost(mostIndex)
  }

  return (
    <>
      <Display text="Anecdote of the day" anecdotes={anecdotes} points={points} index={selected} />
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={handleNextAnecdote} text="next anecdote" />
      <Display text="Anecdote with most votes" anecdotes={anecdotes} points={points} index={mostVoteIndex} />
    </>
  )
}

export default App
