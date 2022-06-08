const {
  UserInputError,
  AuthenticationError,
  PubSub,
} = require('apollo-server')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

const Book = require('../models/books')
const Author = require('../models/authors')
const User = require('../models/user')

const pubsub = new PubSub()
const JWT_SECRET = process.env.SECRET

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({
          $and: [
            { author: { $in: author.id } },
            { genres: { $in: args.genre } },
          ],
        }).populate('author')
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author })
        return Book.find({ author: { $in: author.id } }).populate('author')
      } else if (args.genre) {
        return Book.find({ genres: { $in: args.genre } }).populate('author')
      } else {
        return Book.find({}).populate('author')
      }
    },
    allAuthors: async () => {
      const authors = await Author.find({})
      const retAuthors = authors.map((author) => {
        return {
          name: author.name,
          born: author.born,
          bookCount: author.books.length,
          id: author.id,
        }
      })
      return retAuthors
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Book: {
    author: async (root, args, { loaders }) => {
      const id = root.author
      const author = await loaders.author.load(root.author._id)
      return {
        name: author.name,
        born: author.born,
        bookCount: author.books.length,
        id: root.author._id,
      }
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        await user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return user
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    addBook: async (root, args, context) => {
      let book
      try {
        const currentUser = context.currentUser
        if (!currentUser) throw new AuthenticationError('not authenticated')

        let author = await Author.findOne({ name: args.author })
        if (author) {
          book = new Book({ ...args, author: author._id })
          author.books = author.books.concat(book._id)
          await book.save()
          await author.save()
        } else {
          const _id = mongoose.Types.ObjectId()
          book = new Book({ ...args, author: _id })

          author = new Author({
            name: args.author,
            born: null,
            bookCount: 1,
            _id,
            books: [book._id],
          })
          await author.save()
          await book.save()
        }
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({ name: args.name })
      const currentUser = context.currentUser

      if (!currentUser) throw new AuthenticationError('not authenticated')
      if (!author) return null

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    }
  }
}

module.exports = {
  resolvers
}
