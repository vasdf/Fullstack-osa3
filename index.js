const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('data', function (req, res) { return JSON.stringify(req.body) })

app.use(bodyParser.json())
app.use(morgan(':method :url :data :status :res[content-length] - :response-time ms'))
app.use(cors())

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
  res.json(persons)
})

app.get('/info', (req, res) => {
  const length = persons.length
  res.send(`
    <p>puhelinluettelossa ${length} henkilön tiedot</p>
    <p>${new Date()}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const personsListContainsName = (name) => {
  person = persons.find(person => person.name === name)
  if ( person ) {
    return true
  } else {
    return false
  }
}


app.post('/api/persons', (req, res) => {
  const person = req.body

  if (person.name === undefined | person.name.length === 0) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (person.number === undefined | person.number.length === 0) {
    return res.status(400).json({ error: 'number missing' })
  }

  if (personsListContainsName(person.name)) {
    return res.status(400).json({ error: 'name must be unique' })
  }

  person.id = Math.floor(Math.random() * 1000)

  persons = persons.concat(person)

  res.json(person)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
