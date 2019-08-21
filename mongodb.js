const { MongoClient, ObjectID } = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
  if (error) {
    return console.log('cannot connect')
  }

  const db = client.db(dbName)

  db.collection('users').updateMany({
    name: 'Tuan'
  }, {
    $set: {
      name: 'Tuan1'
    }
  }).then(rs => console.log(rs))
  .catch(err => console.log(err))
})
