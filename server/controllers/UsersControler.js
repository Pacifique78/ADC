import createUserSchema from '../joiSchemas/createUserSchema';
import Joi from '@hapi/joi';
import users from '../model/userModel';
import loginUserSchema from '../joiSchemas/loginUserSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sessions from '../model/sessionModel';
import createSessionSchema from '../joiSchemas/createSessionSchema';
import reviews from '../model/reviewModel';
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
                const selectQuerry = `SELECT * FROM users WHERE email= $1`;
                const value=[email];
                client.query(selectQuerry, value, (err, result) => {
                    if(result.rows[0]){
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
                            (firstName, lastName, email, password, status, address, bio, occupation, expertise)
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
                            const values = [firstName, lastName, email, passWord, status, address, bio, occupation, expertise];
                            client.query(insertQuerry, values, (err, results) => {
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
            })
        }
    }
    Login(req, res){
        const schemasValidation = Joi.validate(req.body, loginUserSchema);
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
            const Password= req.body.password;
            const Email= req.body.email;
    
            const userFound= users.find(user=>user.email===Email);
            if(userFound){
                const {id, firstName, lastName, email, status, address, bio, occupation, expertise} = userFound;
                bcrypt.compare(Password, userFound.password, (err, result)=>{
                    if(result === true){
                        let token = jwt.sign({
                            id,
                            firstName,
                            lastName,
                            email,
                            status
                        }, process.env.secret, {
                            expiresIn: '24h'
                        })
                        return res.status(200).json({
                            status: 200,
                            message: "User logged in",
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
                        });
                    }else{
                        return res.status(404).json({
                            status: 404,
                            error: "incorrect password",
                        });
                    }

                })
            }else{
                return res.status(404).json({
                    status: 404,
                    error: "User with such email not found",
                });
            }

        }
    }
    becomeMentor(req, res){
        const userId = parseInt(req.params.userId);
        const userFound= users.find(user=>user.id===userId);
        if(!userFound){
            return res.status(404).json({
                status: 404,
                error: "User with such id not found"
            })
        }
        else{
            if(userFound.status === "mentor"){
                return res.status(409).json({
                    status:409,
                    error: "user is already a mentor"
                });
            }
            userFound.status = "mentor";
            return res.status(200).json({
                status:200,
                message: "user changed successfully"
            })
        }
    }
    getAllMentors(req,res){
        const mentors = [];
        for(let mentor of users){
            const {id, firstName, lastName, email, status, address, bio, occupation, expertise} = mentor;
            if(mentor.status === "mentor"){
                let mentorFound = {
                    id,
                    firstName,
                    lastName,
                    email,
                    status,
                    address,
                    bio,
                    occupation,
                    expertise
                }
                mentors.push(mentorFound);
            }
        }
        return res.status(200).json({
            status: 200,
            message: "Mentors retrieved successfully",
            data: mentors
        })
    }
    getSpecificMentor(req, res){
        const mentorId = parseInt(req.params.mentorId);
        const mentors = [];
        for(let user of users){
            if(user.status === "mentor"){
                mentors.push(user);
            }
        }
        const mentorFound = mentors.find(mentor=>mentor.id===mentorId);
        if(!mentorFound){
            return res.status(404).json({
                status: 404,
                error: "mentor with such id not found"
            })
        }
        else{
            const {id,firstName,lastName,email,status,address,bio,occupation,expertise} = mentorFound;
            const mentor = {
                id,
                firstName,
                lastName,
                email,
                status,
                address,
                bio,
                occupation,
                expertise
            }
            return res.status(200).json({
                status: 200,
                message: "mentor retrieved successfully",
                data: mentor
            })
        }
    }
    createMentorshipSession(req, res){
        const  schemasValidation=Joi.validate(req.body, createSessionSchema);
        if(schemasValidation.error){
            const validationErrors=[];
            for(let i=0; i<schemasValidation.error.details.length;i++){
                validationErrors.push(schemasValidation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).json({
                status: 400,
                error: validationErrors[0]
            });
        }else{
            const {mentorId, questions} = req.body;
            const mentors = [];
            for(let user of users){
                if(user.status === "mentor"){
                    mentors.push(user);
                }
            }
            const mentorFound = mentors.find(mentor=>mentor.id===mentorId);
            if(!mentorFound){
                return res.status(404).json({
                    status:404,
                    error: "mentor with such id doesn't exist"
                })
            }
            else{
                const {id:menteeId, email:menteeEmail} = req.tokenData;
                const sessionCreated = {
                    sessionId: sessions.length+1,
                    mentorId,
                    menteeId,
                    questions,
                    menteeEmail,
                    status: "Request submited"
                }
                sessions.push(sessionCreated);
                return res.status(201).json({
                    status: 201,
                    message: "Session created successfully",
                    data: sessionCreated
                })
            }
        }
        
    }
    acceptMentorShipRequest(req, res){
        const sessionId = parseInt(req.params.sessionId);
        const sessionFound = sessions.find(session=>session.sessionId===sessionId);
        if(!sessionFound){
            return res.status(404).json({
                status: 404,
                error: "session not found"
            })
        }
        else{
            if(sessionFound.mentorId===req.tokenData.id){
                sessionFound.status = "session accepted";
                return res.status(200).json({
                status: 200,
                message: "Mentorship session accepted successfully",
                data: sessionFound
                })
            }
            else{
                return res.status(403).json({
                    status: 403,
                    error: "not yours to accept"
                })
            }
        }
    }
    rejectMentorShipRequest(req, res){
        const sessionid = parseInt(req.params.sessionId);
        const sessionFound = sessions.find(session=>session.sessionId===sessionid);
        if(!sessionFound){
            return res.status(404).json({
                status: 404,
                error: "session not found"
            })
        }
        else{
            if(sessionFound.mentorId===req.tokenData.id){
                sessionFound.status = "session rejected";
                return res.status(200).json({
                status: 200,
                message: "Mentorship session rejected",
                data: sessionFound
                })
            }
            else{
                return res.status(403).json({
                    status: 403,
                    error: "not yours to reject"
                })
            }
        }
    }
    getSession(req,res){
        if( req.tokenData.status=== "mentee"){
            const id = req.tokenData.id;
            const sessionsFound = [];
            for(let session of sessions){
                if(session.menteeId === id){
                    sessionsFound.push(session);
                }
            }
            if(sessionsFound.length === 0){
                return res.status(404).json({
                    status: 404,
                    error: "No session created"
                })
            }
            else{
                return res.status(200).json({
                    status: 200,
                    message: "session(s) found",
                    data: sessionsFound
                })
            }
        }
        if(req.tokenData.status === "mentor"){
            const id = req.tokenData.id;
            const sessionsFound = [];
            for(let session of sessions){
                if(session.mentorId === id){
                    sessionsFound.push(session);
                }
            }
            if(sessionsFound.length == 0){
                return res.status(404).json({
                    status: 404,
                    error: "No session yet"
                })
            }
            else{
                return res.status(200).json({
                    status: 200,
                    message: "session(s) found",
                    data: sessionsFound
                })
            }
        }
    }
    reviewMentor(req,res){
        const  schemasValidation=Joi.validate(req.body, reviewMentorSchema);
        if(schemasValidation.error){
            const validationErrors=[];
            for(let i=0; i<schemasValidation.error.details.length;i++){
                validationErrors.push(schemasValidation.error.details[i].message.split('"').join(" "));
            }
            return res.status(400).json({
                status: 400,
                error: validationErrors[0]
            });
        }else{
            const sessionid = parseInt(req.params.sessionId);
            const sessionFound = sessions.find(session=>session.sessionId === sessionid);
            if(!sessionFound){
                return res.status(404).json({
                    status:404,
                    error: "there is no session with such id"
                })
            }
            else{
                const {mentorId, menteeId} = sessionFound;
                const {score, remark} = req.body;
                const {firstName, lastName} = req.tokenData;
                const reviewCreated = {
                    reviewId: reviews.length+1,
                    mentorId,
                    menteeId,
                    score,
                    menteeFullName: `${firstName} ${lastName}`,
                    remark
                }
                reviews.push(reviewCreated);
                return res.status(201).json({
                    status: 201,
                    message: "review created successfully",
                    data: reviewCreated
                })
            }
        }
    }
    deleteReview(req,res){
        const sessionid = parseInt(req.params.sessionId);
        const sessionFound = sessions.find(session=>session.sessionId === sessionid);
        if(!sessionFound){
            return res.status(404).json({
                status:404,
                error: "there is no session with such id"
            })
        }
        else{
            const reviewFound = reviews.findIndex(review => review.sessionId === sessionid);
            reviews.splice(reviewFound, 1);
            return res.status(200).json({
                status: 200,
                message: "review successfully deleted"
            })
        }
    }
}

const newclass= new usersClass();
export default newclass;