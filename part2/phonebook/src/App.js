import { useState, useEffect } from 'react'

import Person from './components/Person'
import personService from './services/persons'

const Filter = ({ handleFilterChange }) => {
  return (
    <div>
      filter shown with
      <input onChange={handleFilterChange} />
    </div>
  )
}

const PersonForm = (props) => {
  const { addPerson, newName, handleNameChange, newNumber, handleNumberChange } = props
  return (
    <form onSubmit={addPerson}>
      <div>
        name:
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>
      <div>
        number:
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const updatePhoneNumber = person => {
    const changedPerson = { ...person, number: newNumber }

    personService
      .update(person.id, changedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(person => JSON.stringify(person.name) === JSON.stringify(newName))
    if (person) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        updatePhoneNumber(person)
      }
      return
    }

    const noteObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    personService
      .create(noteObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
      })
  }

  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value)
  }

  const handleFilterChange = (e) => {
    setFilterText(e.target.value.toLowerCase())
  }

  const deletePersonOf = id => {
    personService
      ._delete(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterText))

  return (
    <>
      <h2>Phonebook</h2>
      <Filter handleFilterChange={handleFilterChange} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      {personsToShow.map(person =>
        <Person
          key={person.id}
          person={person}
          deletePerson={() => deletePersonOf(person.id)}
        />
      )}
    </>
  )
}

export default App