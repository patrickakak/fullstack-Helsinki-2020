import { useState, useEffect } from 'react'

import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import Person from './components/Person'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterText, setFilterText] = useState('')
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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
    setSuccessMessage(`Added ${newName} ${newNumber}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 3000)
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

  const deletePersonOf = per => {
    personService
      ._delete(per.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== per.id))
      })
      .catch(error => {
        setErrorMessage(`Information of ${per.name} has already been removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 3000)
        setPersons(persons.filter(p => p.id !== per.id))
      })
  }

  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(filterText))

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />
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
          deletePerson={() => deletePersonOf(person)}
        />
      )}
    </>
  )
}

export default App
