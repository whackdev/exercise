const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const moment = require('moment')
const cors = require('cors')

// Connect to database via mongoose
const Database = require('./database/db')

// import mongoose models
const User = require('./models/User')
const Exercise = require('./models/Exercise')

// middleware
app.use(cors())
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

// Serve public
app.use(express.static('public'))

// Send index
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Create a new user
app.post('/api/exercise/new-user', (req, res, next) => {
  const {
    username
  } = req.body
  
  User
    .create({username})
    .then(result => res.json(result))
    .catch(err => next(err))
})

// Add exercise document
app.post('/api/exercise/add', (req, res, next) => {
  let {
    userId,
    description,
    duration,
  } = req.body
  
  let date = req.body.date || moment().format('YYYY-MM-DD')

  User
    .findById(userId)
    .then(user => {
      let { username } = user
      
      Exercise
        .create({
          userId,
          username,
          description,
          duration,
          date
      })
    .then(result => res.send(result))
    })
    .catch(err => next(err))
})

app.get('/api/exercise/log', (req, res, next) => {
  const { userId } = req.query
  
  const from = req.query.from || moment('1960-01-01')
  const to = req.query.to || moment().format('YYYY-MM-DD')
  const limit = +req.query.limit || 0
  
  let query = Exercise.find({ userId, date: { $gte: from, $lte: to} }).limit(limit)
  
  query
    .select({username: true, description: true, duration: true, date: true, _id: false})
    .sort({ date: 1 })
    .exec()
    .then(exercises => res.send(exercises))
    .catch(err => next(err))
})


// Not found middleware
app.use((req, res, next) => {
  return next({
    status: 404,
    message: 'not found'
  })
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})