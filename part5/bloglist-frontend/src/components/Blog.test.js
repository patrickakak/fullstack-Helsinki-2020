/* eslint-disable testing-library/no-node-access */
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders the blog title and author, not its url or number of likes by default', () => {
  const blog = {
    title: 'title',
    author: 'author',
    url: 'https://url.com',
    likes: 0,
  }

  const container = render(<Blog blog={blog} />).container

  const divSummary = container.querySelector('.summary')
  expect(divSummary).not.toHaveStyle('display: none')

  const divDetails = container.querySelector('.details')
  expect(divDetails).toHaveStyle('display: none')
})
