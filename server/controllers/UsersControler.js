import createUserSchema from '../joi_schemas/createUserSchema';
import Joi from '@hapi/joi';
import users from '../model/userModel';
import loginUserSchema from '../joi_schemas/loginUserSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secret from '../config/config';
import sessions from '../model/sessionModel';
import createSessionSchema from '../joi_schemas/createSessionSchema';
import reviews from '../model/reviewModel';
import reviewMentorSchema from '../joi_schemas/reviewMentorSchema'

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
            const Email= req.body.email;
            const userFound= users.find(user=>user.email===Email);
            if(userFound){
                return res.status(409).json({
                    status:409,
                    error: "user with such email already exists"
                })
            }
            else{
                const newUser={
                    id: users.length+1,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    status: "mentee",
                    address: req.body.address,
                    bio: req.body.bio,
                    occupation: req.body.occupation,
                    expertise: req.body.expertise
                }
                const saltRounds = 10;
                const passWord = newUser.password;
                bcrypt.hash(passWord, saltRounds, (err, hash) => {
                    newUser.password = hash;
                    users.push(newUser);
                  });
                let token = jwt.sign({
                    id: newUser.id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email,
                    status: newUser.status
                }, secret, {
                    expiresIn: '24h'
                })
                return res.status(201).json({
                status: 201,
                message: "user created",
                data: {
                    "id":users.length+1,
                    "firstName": newUser.firstName,
                    "lastName": newUser.lastName,
                    "email": newUser.email,
                    "status": newUser.status,
                    "address":newUser.address,
                    "bio":newUser.bio,
                    "occupation":newUser.occupation,
                    "expertise":newUser.expertise
                },
                token:token
            });
            }
            
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
                bcrypt.compare(Password, userFound.password, (err, result)=>{
                    if(result === true){
                        let token = jwt.sign({
                            id: userFound.id,
                            firstName: userFound.firstName,
                            lastName: userFound.lastName,
                            email: userFound.email,
                            status: userFound.status
                        }, secret, {
                            expiresIn: '24h'
                        })
                        return res.status(200).json({
                            status: 200,
                            message: "User logged in",
                            data: {
                                id: userFound.id,
                                firstName: userFound.firstName,
                                lastName: userFound.lastName,
                                email: userFound.email,
                                status: userFound.status,
                                address: userFound.address,
                                bio: userFound.bio,
                                occupation: userFound.occupation,
                                expertise: userFound.expertise
                            },
                            token:token
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
            if(mentor.status === "mentor"){
                let mentorFound = {
                    id: mentor.id,
                    firstName: mentor.firstName,
                    lastName: mentor.lastName,
                    email: mentor.email,
                    status: mentor.status,
                    address: mentor.address,
                    bio: mentor.bio,
                    occupation: mentor.occupation,
                    expertise: mentor.expertise
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
            const mentor = {
                id: mentorFound.id,
                firstName: mentorFound.firstName,
                lastName: mentorFound.lastName,
                email: mentorFound.email,
                status: mentorFound.status,
                address: mentorFound.address,
                bio: mentorFound.bio,
                occupation: mentorFound.occupation,
                expertise: mentorFound.expertise
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
            const mentorId = req.body.mentorId;
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
                const sessionCreated = {
                    sessionId: sessions.length+1,
                    mentorId: mentorId,
                    menteeId: req.tokenData.id,
                    questions: req.body.questions,
                    menteeEmail: req.tokenData.email,
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
                const reviewCreated = {
                    reviewId: reviews.length+1,
                    mentorId: sessionFound.mentorId,
                    menteeId: sessionFound.menteeId,
                    score: req.body.score,
                    menteeFullName: `${req.tokenData.firstName} ${req.tokenData.lastName}`,
                    remark: req.body.remark
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
}

const newclass= new usersClass();
export default newclass;