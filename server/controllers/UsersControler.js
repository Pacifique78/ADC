import loginUserSchema from '../joiSchemas/loginUserSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createSessionSchema from '../joiSchemas/createSessionSchema';
import reviewMentorSchema from '../joiSchemas/reviewMentorSchema';
import pool from '../db/createTables';
import dotenv from 'dotenv';
import {query} from '../db'
dotenv.config();
class usersClass{
    async createUser(req,res){
        try {
            const email= req.body.email;
            const selectQuerry = `SELECT * FROM users WHERE email=$1;`;
            const value=[email];
            const rows = await query(selectQuerry, value);
            if(rows[0]){
                return res.status(409).json({
                    status: 409,
                    error: "User with such email already exists"
                })
            }
            else{
                const {firstName, lastName, email, password, address, bio, occupation, expertise} = req.body;
                        const status = "mentee";
                        const saltRounds = 10;
                        const passWord = await bcrypt.hash(password, saltRounds)
                        const insertQuerry = `INSERT INTO users 
                        (firstname, lastname, email, password, status, address, bio, occupation, expertise)
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
                        const values = [firstName, lastName, email, passWord, status, address, bio, occupation, expertise];
                        const results = await query(insertQuerry,values);
                        return res.status(201).json({
                            status: 201,
                            message: "User created",
                            data: results[0]
                        })
            }
        } catch (error) {
            const message = error.message || "Error occured";
            res.status(400).json({
                error:{
                    message
                }
            })
        }
    }
    
    
}

const newclass= new usersClass();
export default newclass;