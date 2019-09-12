const {Pool} = require('pg');
import dotenv from 'dotenv';
import connect from '../db/config';
dotenv.config();
const pool = new Pool({
    connectionString:connect
})

export const query = async(queryString, values=[]) =>pool
.connect()
.then(client => {
  return client
    .query(queryString, values)
    .then(res => {
      client.release()
      return res.rows
    })
    .catch(e => {
      client.release()
      throw e
    })
})
