const mongoose = require('mongoose')

const url = ''

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})

if (process.argv.length === 2) {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person.name , person.number)
      })
      mongoose.connection.close()
    })

} else {

  const person = new Person({
    name: process.argv[2],
    number: process.argv[3]
  })

  person
    .save()
    .then(response => {
      console.log('number saved')
      mongoose.connection.close()
    })

}