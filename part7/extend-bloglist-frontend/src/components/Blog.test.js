import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  let addLikes

  beforeEach(() => {
    const blog = {
      title: 'title',
      author: 'author',
      url: 'https://url.com',
      likes: 0,
    }
    addLikes = jest.fn()
    container = render(
      <Blog
        blog={blog}
        updateLikes={addLikes}
      />
    ).container
  })

  test('renders the blog title and author, not its url or number of likes by default', () => {
    const divSummary = container.querySelector('.summary')
    expect(divSummary).not.toHaveStyle('display: none')

    const divDetails = container.querySelector('.details')
    expect(divDetails).toHaveStyle('display: none')
  })

  test('renders blog url and number of likes when view button is clicked', () => {
    const button = screen.getByText('view')
    fireEvent.click(button)

    const divDetails = container.querySelector('.details')
    expect(divDetails).not.toHaveStyle('display: none')
  })

  test('clicking the like button twice calls event handler passed as a prop twice', () => {
    const button = screen.getByText('like')

    fireEvent.click(button)
    fireEvent.click(button)

    expect(addLikes.mock.calls).toHaveLength(2)
  })
})