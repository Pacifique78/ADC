const {Pool} = require('pg');
import {DATABASE_URL} from '../config/config';

const pool = new Pool({
    connectionString:DATABASE_URL
})
export const deleteTable = () => {
    const deleteTablesQuerry = `
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS sessions CASCADE;
    DROP TABLE IF EXISTS REVIEWS CASCADE;`
    pool.query(deleteTablesQuerry)
    .then((res) => console.log(res))
    .catch((err) => {
        console.log(err);
        pool.end();
    })

}
export default pool;
require('make-runnable');