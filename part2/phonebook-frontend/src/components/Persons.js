import Person from './Person'

const Persons = ({ personsToShow, op }) => (
  personsToShow.map(person =>
    <Person
      key={person.id}
      person={person}
      op={op}
    />
  )
)

export default Persons