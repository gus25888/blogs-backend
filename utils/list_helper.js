const _ = require('lodash')

const dummy = (blogs) => {
  console.log({ blogs })
  return 1
}

const totalLikes = (blogs) => {
  let total = 0

  const likesCalculator = (accumulator, blog) => accumulator + blog.likes

  if (blogs) {
    total = blogs.reduce(likesCalculator, 0)
  }

  return total
}

const favoriteBlog = (blogs) => {
  let favBlog = {}, maxLikes = 0

  if (blogs) {
    blogs.forEach(blog => {
      const { title, author, likes } = blog
      if (likes > maxLikes) {
        maxLikes = likes
        favBlog = { title, author, likes }
      }
    })
  }

  return favBlog
}

const mostBlogs = (blogs) => {
  let blogsPerAuthor = []

  if (blogs) {
    blogs.forEach(blog => {
      const { author } = blog
      const authorIndex = _.findIndex(blogsPerAuthor, (authorItem) => authorItem.author === author)

      if (authorIndex > -1) {
        const authorFound = blogsPerAuthor[authorIndex]
        authorFound.blogs += 1
        blogsPerAuthor[authorIndex] = authorFound
      } else {
        blogsPerAuthor.push({ author, blogs: 1 })
      }

    })

  }

  return (blogsPerAuthor.length) ? _.maxBy(blogsPerAuthor, (author) => author.blogs) : {}
}

const mostLikes = (blogs) => {
  let likesPerAuthor = []

  if (blogs) {
    blogs.forEach(blog => {
      const { author, likes } = blog
      const authorIndex = likesPerAuthor.findIndex((authorItem) => authorItem.author === author)

      if (authorIndex > -1) {
        const authorFound = likesPerAuthor[authorIndex]
        authorFound.likes += likes
        likesPerAuthor[authorIndex] = authorFound
      } else {
        likesPerAuthor.push({ author, likes })
      }

    })

  }

  /* Explicación de maxLikes
     Se consulta cual es el que tiene más likes y se retorna ese elemento.
     Con ello, se asegura que siempre se obtendrá algún elemento de los presentes en el array, que será el más grande de todos.

     Además, considerando que se llama dentro de reduce, sin valor inicial, la primera iteración considera comparar los primeros elementos.
  */
  const maxLikes = (savedElement, currElement) => (currElement.likes > savedElement.likes) ? currElement : savedElement

  return (likesPerAuthor.length) ? likesPerAuthor.reduce(maxLikes) : {}
}

module.exports = {
  dummy,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  totalLikes,
}