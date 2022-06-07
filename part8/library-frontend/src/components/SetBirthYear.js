import { useState } from 'react'
import { useMutation } from '@apollo/client'
import Select from 'react-select'

import { ALL_AUTHORS, EDIT_BIRTHYEAR } from '../queries'

const SetBirthYear = (props) => {
  const [name, setName] = useState('')
  const [setBornTo, setBorn] = useState('')

  const [changeAuthor] = useMutation(EDIT_BIRTHYEAR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  const submit = async (event) => {
    event.preventDefault()

    changeAuthor({ variables: { name, setBornTo } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h3>Set birth year</h3>
      <form onSubmit={submit}>
        <Select
          placeholder="Select author..."
          options={props.options}
          onChange={({ label }) => setName(label)}
          value={name ? { label: name, value: name?.toLowerCase() } : null}
        />
        <div>
          born
          <input
            type="number"
            value={setBornTo}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear