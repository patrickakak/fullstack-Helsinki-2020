// blog_app.spec.js created with Cypress
//
// Start writing your Cypress tests below!
// If you're unfamiliar with how Cypress works,
// check out the link below and learn how to write your first test:
// https://on.cypress.io/writing-first-test

describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'root',
      username: 'root',
      password: 'password',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)

    const other = {
      name: 'other',
      username: 'other',
      password: 'secret',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', other)

    cy.visit('http://localhost:3000')
  })

  it('Log in form is shown', function () {
    cy.contains('Log in to application')
    cy.get("input[name='username']")
    cy.get("input[name='password']")
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get("input[name='username']").type('root')
      cy.get("input[name='password']").type('password')
      cy.get('button[type="submit"]').click()
      cy.contains('root logged in')
    })

    it('fails with wrong credentials and displays (red) error message', function () {
      cy.get("input[name='username']").type('wrong')
      cy.get("input[name='password']").type('credentials')
      cy.get('button[type="submit"]').click()
      cy.contains('Wrong credentials')
        .should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'root', password: 'password' })
    })

    it('A blog can be created', function () {
      cy.contains('create new blog').click()
      cy.get('input[name="title"]').type('A new blog created by Cypress')
      cy.get('input[name="author"]').type('Cypress')
      cy.get('input[name="url"]').type('https://docs.cypress.io/')
      cy.get('button[type="submit"]').click()

      cy.contains('A new blog created by Cypress')
    })

    describe('A blog already exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'Cypress creating a new blog',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
        })
      })

      it('A user can like a blog', function () {
        cy.contains('view').click()
        cy.get('#likes').should('contain', 0)
        cy.get('#like-btn').click()
        cy.get('#likes').should('contain', 1)
      })

      it('A user who created the blog can delete it', function () {
        cy.contains('view').click()
        cy.contains('Cypress creating a new blog')
        cy.contains('remove').click()
        cy.contains('Cypress creating a new blog').should('not.exist')
      })
    })

    describe('When another user logs in', function () {
      beforeEach(function () {
        cy.login({ username: 'root', password: 'password' })
        cy.createBlog({
          title: 'Blog created by root',
          author: 'root',
          url: 'http://only-root-can-delete.com',
        })
      })

      it("user can't delete blog created by another user", function () {
        cy.contains('Blog created by root')
        cy.contains('remove')
        cy.contains('logout').click()
        cy.login({ username: 'other', password: 'secret' })
        cy.contains('Blog created by root')
        cy.contains('view').click()
        cy.contains('root')
        cy.contains('remove').should('not.exist')
      })
    })

    describe('and multiple blogs exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 15,
        })
        cy.createBlog({
          title: 'The title with the least likes',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 0,
        })
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'Cypress',
          url: 'https://www.cypress.io/',
          likes: 2,
        })
      })

      it('Blogs are ordered based on number of likes, in descending order (from most to least likes)', function () {
        cy.get('.blog').eq(0).should('contain', 'The title with the most likes')
        cy.get('.blog').eq(1).should('contain', 'The title with the second most likes')
        cy.get('.blog').eq(2).should('contain', 'The title with the least likes')
      })
    })
  })
})