import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm />', () => {
  const addBlog = jest.fn()
  const { container } = render(<BlogForm createBlog={addBlog} />)

  const inputTitle = screen.getByPlaceholderText('title')
  const inputAuthor = screen.getByPlaceholderText('author')
  const inputUrl = screen.getByPlaceholderText('url')
  const form = container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: { value: 'blog title' },
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'blog author' },
  })
  fireEvent.change(inputUrl, {
    target: { value: 'https://blog-url.com' },
  })
  fireEvent.submit(form)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('blog title')
  expect(addBlog.mock.calls[0][0].author).toBe('blog author')
  expect(addBlog.mock.calls[0][0].url).toBe('https://blog-url.com')
})