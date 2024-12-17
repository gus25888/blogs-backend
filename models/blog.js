const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'title is required'] },
  author: String,
  url: { type: String, required: [true, 'url is required'] },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)