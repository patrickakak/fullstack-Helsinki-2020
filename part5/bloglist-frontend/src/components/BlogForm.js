const BlogForm = ({
  handleCreate,
  title,
  author,
  url,
  handleTitleChange,
  handleAuthorChange,
  handleUrlChange,
}) => (
  <form onSubmit={handleCreate}>
    <div>
      title:
      <input
        type='text'
        value={title}
        name='Title'
        onChange={handleTitleChange}
      />
    </div>
    <div>
      author:
      <input
        type='text'
        value={author}
        name='Author'
        onChange={handleAuthorChange}
      />
    </div>
    <div>
      url:
      <input
        type='text'
        value={url}
        name='Url'
        onChange={handleUrlChange}
      />
    </div>
    <button type='submit'>create</button>
  </form>
)

export default BlogForm
