const {Pool} = require('pg');
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
    connectionString:process.env.DATABASE_URL
})
export const createTable = () => {
    const createTablesQuerry = `CREATE TABLE IF NOT EXISTS
    users(
        id serial,
        firstName character varying(30) NOT NULL,
        lastName character varying(30) NOT NULL,
        email character varying(30) NOT NULL,
        password character varying(500) NOT NULL,
        status character varying(10) NOT NULL,
        address character varying(30) NOT NULL,
        bio character varying(100) NOT NULL,
        occupation character varying(30) NOT NULL,
        expertise character varying(30) NOT NULL,
        PRIMARY KEY(id)
    );
    CREATE TABLE IF NOT EXISTS
    reviews(
        sessionId integer NOT NULL,
        mentorId integer NOT NULL,
        menteeId integer NOT NULL,
        score integer NOT NULL,
        menteeFullName character varying(30) NOT NULL,
        remark character varying(500) NOT NULL
    );
    CREATE TABLE IF NOT EXISTS
    sessions(
        sessionId serial,
        mentorId integer,
        menteeId integer,
        questions character varying(500),
        menteeEmail character varying(30),
        sessionStatus character varying(50),
        PRIMARY KEY(sessionId)
    );
    INSERT INTO users 
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('system', 'admin', 'systemadmin@gmail.com', '$2b$10$af95diBy/crnvEWxiA2r3u64S6osMVM0kg7mNIjm9AGwFkZYxa1Ni', 'admin', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO users
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('system2', 'admin2', 'systemadmin2@gmail.com', '$2b$10$af95diBy/crnvEWxiA2r3u64S6osMVM0kg7mNIjm9AGwFkZYxa1Ni', 'admin', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO users 
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('john', 'Smith', 'john@gmail.com', '$2b$10$YJhS2kP82GXKAPwp9EULle4TLs0T05qPVOzKrCZACziadCmhXmQcq', 'mentor', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO users 
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('peter', 'Okabo', 'peter@gmail.com', '$2b$10$bV37mu7gaOE9Usmw4bg4DuRxFW1lKJKIKaVsLKjFnzBZVwUQFdshS', 'mentee', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO sessions 
    (mentorId, menteeId, questions, menteeEmail, sessionStatus)
    VALUES(3, 4, 'jidsjvbaervpfuiacdaf jvc uajafbpvu ivuuiasdc', 'qwert@gmail.com', 'Request submited successfully');
    INSERT INTO reviews 
    (sessionId, mentorId, menteeId, score, menteeFullName, remark)
    VALUES(2, 3, 4, 3, 'Peter Okabo', 'fjjcbvjdfbvjfbvbfvhdhvjfbsvui');
    INSERT INTO users 
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('john2', 'Smith2', 'john2@gmail.com', '$2b$10$YJhS2kP82GXKAPwp9EULle4TLs0T05qPVOzKrCZACziadCmhXmQcq', 'mentor', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO users 
    (firstName, lastName, email, password, status, address, bio, occupation, expertise)
    VALUES('peter2', 'Okabo2', 'peter2@gmail.com', '$2b$10$bV37mu7gaOE9Usmw4bg4DuRxFW1lKJKIKaVsLKjFnzBZVwUQFdshS', 'mentee', 'address', 'bio', 'occupation', 'expertise');
    INSERT INTO sessions 
    (mentorId, menteeId, questions, menteeEmail, sessionStatus)
    VALUES(5, 6, 'jidsjvbaervpfuiacdaf jvc uajafbpvu ivuuiasdc', 'qwert123@gmail.com', 'Request submited successfully');
    INSERT INTO reviews 
    (sessionId, mentorId, menteeId, score, menteeFullName, remark)
    VALUES(3, 2, 8, 1, 'Peter Okabo', 'fjjcbvjdfbvjfbvbfvhdhvjfbsvuihvd');
    `
    pool.query(createTablesQuerry)
    .then((res) => console.log("Database tables set successfully..."))
    .catch((err) => {
        console.log(err);
        pool.end();
    })

}
export default pool;
require('make-runnable');