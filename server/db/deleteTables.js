const {Pool} = require('pg');
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
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