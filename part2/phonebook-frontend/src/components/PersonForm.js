import InputField from './InputField'

const Form = (props) => {
  const { addPerson, newName, handleNameChange, newNumber, handleNumberChange } = props

  return (
    <form onSubmit={addPerson}>
      <InputField
        label='name:'
        htmlFor='name'
        type='text'
        value={newName}
        onChange={handleNameChange}
      />

      <InputField
        label='number:'
        htmlFor='number'
        type='text'
        value={newNumber}
        onChange={handleNumberChange}
      />

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default Form
