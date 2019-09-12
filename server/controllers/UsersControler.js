import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createSessionSchema from '../joiSchemas/createSessionSchema';
import reviewMentorSchema from '../joiSchemas/reviewMentorSchema';
import dotenv from 'dotenv';
import {query} from '../db'
dotenv.config();
class usersClass{
    async createUser(req, res){
        try {
            const {email}= req.body;
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
                        const values = [firstName, lastName, email, password, status, address, bio, occupation, expertise];
                        const results = await query(insertQuerry,values);
                        const id = results[0].id;
                        const token = await jwt.sign({
                            id,firstName,lastName,email,status
                        }, process.env.secret, {
                            expiresIn: '24h'
                        })
                        return res.status(201).json({
                            status: 201,
                            message: "User created",
                            data: {
                                id,
                                firstName,
                                lastName,
                                email,
                                status,
                                address,
                                bio,
                                occupation,
                                expertise
                            },
                            token
                        })
            }
        } catch (error) {
            const message = error.message || "Unknown error occured";
            res.status(400).json({
                error:{
                    message
                }
            })
        }
    }
    async login(req, res){
        try {
            const {email,password}= req.body;
            const selectQuerry = `SELECT * FROM users WHERE email=$1;`;
            const value=[email];
            const rows = await query(selectQuerry, value);
            if(rows[0]){
                const {id, firstname, lastname, email, status} = rows[0];
                const compare = await bcrypt.compare(password, rows[0].password);
                if(compare){
                    const token = await jwt.sign({
                        id,firstname,lastname,email,status
                    }, process.env.secret, {
                        expiresIn: '24h'
                    })
                    const {id, firstname, lastname, email, status, address, bio, occupation, expertise} = rows[0];
                    return res.status(200).json({
                        status:200,
                        message: "User looged in successfully",
                        data: {
                            id,
                            firstname,
                            lastname,
                            email,
                            status,
                            address,
                            bio,
                            occupation,
                            expertise
                        },
                        token
                    })
                }
                return res.status(401).json({
                    status:401,
                    error: "Incorrect password"
                })
            }
            else{
                return res.status(404).json({
                    status:404,
                    error: "Email not found"
                })
            }
        } catch (error) {
            const message = error.message || "Unknown error occured";
            return res.status(400).json({
                status:400,
                error: message
            })
        }
    }
    
    
}

const newclass= new usersClass();
export default newclass;