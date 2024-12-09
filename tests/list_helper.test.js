const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')


const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0
  }
]

const listOfBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]


describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

describe('totalLikes', () => {

  test('of list empty is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5)
  })
  test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(listOfBlogs), 36)
  })
})

describe('favoriteBlog', () => {

  const uniqueFavBlog = {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5,
  }
  const favBlogOfBlogs = {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12,
  }
  test('of list empty is an empty object', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), {})
  })
  test('when list has only one blog, the favorite it\'s that', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listWithOneBlog), uniqueFavBlog)
  })
  test('of a bigger list is the one with most likes', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog(listOfBlogs), favBlogOfBlogs)
  })
})

describe('mostBlogs', () => {
  const uniqueBlogAuthor = {
    author: 'Edsger W. Dijkstra',
    blogs: 1,
  }
  const mostBlogsAuthor = {
    author: 'Robert C. Martin',
    blogs: 3
  }
  test('of list empty is an empty object', () => {
    assert.deepStrictEqual(listHelper.mostBlogs([]), {})
  })
  test('when list has only one blog, the author is expected', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), uniqueBlogAuthor)
  })
  test('of a bigger list is the one with most blogs', () => {
    assert.deepStrictEqual(listHelper.mostBlogs(listOfBlogs), mostBlogsAuthor)
  })
})

describe('mostLikes', () => {
  const uniqueBlogAuthor = {
    author: 'Edsger W. Dijkstra',
    likes: 5,
  }
  const mostBlogsAuthor = {
    author: 'Edsger W. Dijkstra',
    likes: 17
  }
  test('of list empty is an empty object', () => {
    assert.deepStrictEqual(listHelper.mostLikes([]), {})
  })
  test('when list has only one blog, the author is expected', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), uniqueBlogAuthor)
  })
  test('of a bigger list is the one with most likes', () => {
    assert.deepStrictEqual(listHelper.mostLikes(listOfBlogs), mostBlogsAuthor)
  })
})