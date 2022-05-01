const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

let persons = [
  {
    "id": 1,
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": 2,
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": 3,
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": 4,
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
]

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

// app.use(morgan('tiny'))
morgan.token('reqestBody', (req, _) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqestBody'))

app.get('/api/persons', (_, res) => {
  res.json(persons)
})

app.get('/api/info', (_, res) => {
  res.send(`<p>Phonebook has info for ${persons.length} people</p><div>${new Date()}</div>`)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(p => p.id !== id)
  res.status(204).send()
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  const found = persons.find(p => p.name === body.name)
  if (found) {
    return res.status(400).json({
      error: 'name must be unique'
    })
  }

  const getRandomInt = max => {
    return Math.floor(Math.random() * max);
  }
  const person = {
    id: getRandomInt(999999999),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)
  res.json(person)
})

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
