import InputField from './InputField'

const PersonForm = ({
  onSubmit,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange
}) => (
  <form onSubmit={onSubmit}>
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

export default PersonForm
