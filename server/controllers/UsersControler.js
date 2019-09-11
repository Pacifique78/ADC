import createUserSchema from '../joiSchemas/createUserSchema';
import Joi from '@hapi/joi';
import loginUserSchema from '../joiSchemas/loginUserSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createSessionSchema from '../joiSchemas/createSessionSchema';
import reviewMentorSchema from '../joiSchemas/reviewMentorSchema';
import pool from '../db/createTables';
import dotenv from 'dotenv';
dotenv.config();
class usersClass{
    createUser(req,res){
        const  schemasValidation=Joi.validate(req.body, createUserSchema);
        if(schemasValidation.error){
            const validationErrors=[];
            for(let i=0; i<schemasValidation.error.details.length;i++){
                validationErrors.push(schemasValidation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).json({
                status: 400,
                error: validationErrors[0]
            });
        }
        else{
            pool.connect((err, client, done) => {
                const {email}= req.body;
                const selectQuerry = `SELECT * FROM users WHERE email=$1`;
                const value=[email];
                client.query(selectQuerry, value, (err, result) => {
                    if(err){
                        return res.status(500).json({
                            status: 500,
                            error: err.message
                        })
                    }
                    else if(result.rows[0]){
                        return res.status(409).json({
                            status: 409,
                            error: "User with such email already exists"
                        })
                    }
                    else{
                        const {firstName, lastName, email, password, address, bio, occupation, expertise} = req.body;
                        const status = "mentee";
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds, (err, hash) => {
                            const passWord = hash;
                            const insertQuerry = `INSERT INTO users 
                            ("firstName", "lastName", email, password, status, address, bio, occupation, expertise)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
                            const values = [firstName, lastName, email, passWord, status, address, bio, occupation, expertise];
                            client.query(insertQuerry, values, (err, results) => {
                                if(err){
                                    return res.status(500).json({
                                        status: 500,
                                        error: err.message
                                    })
                                }
                                if(results.rows[0]){
                                    const id = results.rows[0].id;
                                    let token = jwt.sign({
                                        id,firstName,lastName,email,status
                                    }, process.env.secret, {
                                        expiresIn: '24h'
                                    })
                                    return res.status(201).json({
                                        status:201,
                                        message: "User created",
                                        data: {
                                            id:results.rows[0].id,
                                            firstName,
                                            lastName,
                                            email,
                                            status: results.rows[0].status,
                                            address,
                                            bio,
                                            occupation,
                                            expertise
                                        },
                                        token
                                    })
                                }
                            })
                        });
                        
                    }
                })
                done();
            })
        }
    }
    
}

const newclass= new usersClass();
export default newclass;