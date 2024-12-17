const mongoose = require('mongoose')
const minLengthUsername = 3
const minLengthPassword = 3

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    minLength: minLengthUsername,
    required: [true, 'username is required'],
    validate: {
      validator: (value) => {
        const pattern = new RegExp(`^[a-z]{${minLengthUsername},}$`)
        return pattern.test(value)
      },
      message: (props) => `username '${props.value}' is not valid. It must be minimum ${minLengthUsername} lowercase characters`
    }
  },
  name: String,
  passwordHash: String,
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = { User, minLengthUsername, minLengthPassword }