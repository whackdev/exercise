const mongoose = require('mongoose')
mongoose.Promise = global.Promise

class Database {
  constructor() {
    this._connect()
  }
  
  _connect() {
    mongoose.connect(process.env.MLAB_URI, { useMongoClient: true })
    .then(() => {
      console.log('Database connected')
    })
    .catch(err => console.error('Unable to connect to database'))
  }
}

module.exports = new Database()