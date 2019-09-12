const {Pool} = require('pg');
import dotenv from 'dotenv';
import connect from '../db/config';
dotenv.config();
const pool = new Pool({
    connectionString:connect
})
export const deleteTable = () => {
    const deleteTablesQuerry = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS sessions CASCADE;
    DROP TABLE IF EXISTS REVIEWS CASCADE;`
    pool.query(deleteTablesQuerry)
    .then((res) => console.log("All tables deleted successfully..."))
    .catch((err) => {
        console.log(err);
        pool.end();
    })

}
export default pool;
require('make-runnable');