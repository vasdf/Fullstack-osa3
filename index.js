const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(express.static('build'))

let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Martti Tienari",
    number: "040-123456",
    id: 2
  },
  {
    name: "Arto Järvinen",
    number: "040-123456",
    id: 3
  },
  {
    name: "Lea Kutvonen",
    number: "040-123456",
    id: 4
  },
]

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(Person.format))
    })
})

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.send(`
        <p>puhelinluettelossa ${persons.length} henkilön tiedot</p>
        <p>${new Date()}</p>
      `)
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(Person.format(person))
    })
    .catch(error => {
      console.log(error)
      res.status(404).end()
    })
})

app.delete('/api/persons/:id', (req, res) => {
  Person
    .findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (body.name === undefined | body.name.length === 0) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (body.number === undefined | body.number.length === 0) {
    return res.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  Person
    .find({ name: person.name })
    .then(result => {
      if (result.length > 0) {
        res.status(400).send({ error: "name is on the list already" })
      } else {
        person
          .save()
          .then(savedPerson => {
            res.json(Person.format(person))
          })
      }
    })
})

app.put('/api/persons/:id', (req, res) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, person)
    .then(updatedPerson => {
      res.json(Person.format(updatedPerson))
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: "malformatted id" })
    })
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
