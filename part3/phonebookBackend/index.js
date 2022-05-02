const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.json())

app.use(cors())

app.use(express.static('build'))

// app.use(morgan('tiny'))
morgan.token('reqestBody', (req, _) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :reqestBody'))

app.get('/api/info', (_, res) => {
  Person.find({}).then(persons => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><div>${new Date()}</div>`)
  })
})

app.get('/api/persons', (_, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id, (err, docs) => {
    if (err) {
      res.status(400).end()
    } else if (docs) {
      res.json(docs)
    } else {
      res.status(404).end()
    }
  })
})

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id, (err, _) => {
    if (err) {
      res.status(400).end()
    } else {
      res.status(204).send()
    }
  })
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'name or number is missing'
    })
  }

  Person.find({ name: body.name }, (_, docs) => {
    if (docs.length > 0) {
      return res.status(400).json({
        error: 'name must be unique'
      })
    } else {
      const person = new Person({
        name: body.name,
        number: body.number,
      })
      person.save().then(savedPerson => {
        res.json(savedPerson)
      })
    }
  })
})

const unknownEndpoint = (_, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
