const Person = ({ person, op }) => (
  <div>
    {person.name} {person.number}
    <button onClick={() => op(person)}>delete</button>
  </div>
)

export default Person