const mongoose = require('mongoose')

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URL

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: String,
  name: String,
  number: String
})

personSchema.statics.format = function(person) {
  return {
    id: person._id,
    name: person.name,
    number: person.number
  }
}

const Person = mongoose.model('Person', personSchema)

module.exports = Person