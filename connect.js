/* const { MongoClient } = require('mongodb');
const config = require('./config');

const { dbUrl } = config;
const client = new MongoClient(dbUrl);

async function connect() {
  try {
    await client.connect();
    const db = client.db('bq');
    return db;
  } catch (error) {
    console.log('Error connecting to the database', error);
  }
}

module.exports = { connect }; */
