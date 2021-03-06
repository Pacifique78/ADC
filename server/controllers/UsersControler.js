import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
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
                        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;`;
                        const values = [firstName, lastName, email, passWord, status, address, bio, occupation, expertise];
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
                                email,
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
                const {id, firstname, lastname, email, status, address, bio, occupation, expertise} = rows[0];
                const compare = await bcrypt.compare(password, rows[0].password);
                if(compare){
                    const token = await jwt.sign({
                        id,firstname,lastname,email,status
                    }, process.env.secret, {
                        expiresIn: '24h'
                    })
                    return res.status(200).json({
                        status:200,
                        message: "User looged in successfully",
                        data: {
                            id,
                            email,
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
    async changeUser(req, res){
        try {
            const userId = parseInt(req.params.userId);
            const selectQuerry = `SELECT * FROM users WHERE id= $1 AND status=$2;`;
            const values = [userId, "mentee"];
            const result = await query(selectQuerry, values);
            if(result[0]){
                const updateQuerry = `UPDATE users SET status=$1 WHERE id=$2;`;
                const updateValues = ["mentor", result[0].id];
                const results = await query(updateQuerry, updateValues);
                if(results){
                    return res.status(200).json({
                        status: 200,
                        message: "User changed successfully"
                    })
                }
            }
            else{
                return res.status(404).json({
                    status:404,
                    error: "User with such id not found or he is already a mentor"
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
    async getAllMentors(req, res){
        try {
            const selectQuerry = `SELECT * FROM users WHERE status=$1;`;
            const value = ["mentor"];
            const results = await query(selectQuerry, value);
            const mentors= [];
            for(let i=0; i<results.length; i++){
                const {id, firstname, lastname, email, status, address, bio, occupation, expertise} = results[i];
                mentors.push({id, firstname, lastname, email, status, address, bio, occupation, expertise});
            }
            return res.status(200).json({
                status:200,
                message: "All mentors retrieved successfully...",
                data: mentors
            })
        } catch (error) {
            const message = error.message || "Unknown error occured";
            return res.status(400).json({
                status:400,
                error: message
            })
        }
    }
    async getSpecificMentor(req, res){
        try {
            const mentorId = parseInt(req.params.mentorId);
            const selectQuerry = `SELECT * FROM users WHERE id=$1 AND status=$2;`;
            const values = [mentorId,"mentor"];
            const results = await query(selectQuerry, values);
            if(results[0]){
                const {id, firstname, lastname, email, status, address, bio, occupation, expertise} = results[0];
                return res.status(200).json({
                    status:200,
                    message: "Mentor retrieved successfully...",
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
                    }
                })
            }
            return res.status(404).json({
                status:404,
                error: "mentor with such id not found"
            })
        } catch (error) {
            const message = error.message || "Unknown error occured";
            return res.status(400).json({
                status:400,
                error: message
            })
        }
    }
    async createMentorshipSession(req, res){
        const {mentorId, questions} = req.body;
        const {id:menteeid, email:menteeemail} = req.tokenData;
        const selectQuerry = `SELECT * FROM users WHERE id=$1 AND status=$2;`;
        const values = [mentorId, "mentor"];
        const result = await query(selectQuerry, values);
        if(!result[0]){
            return res.status(404).json({
                status:404,
                error: "Mentor with such id not found"
            })
        }
        const insertQuerry = `INSERT INTO sessions (mentorId, menteeId, questions, menteeEmail, sessionStatus)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;`
        const insertValues = [mentorId, menteeid, questions, menteeemail, "request submited"];
        const insertResult = await query(insertQuerry, insertValues);
        return res.status(201).json({
            status:201,
            message: "Session created successfully",
            data: insertResult
        })
    }
    async acceptMentorshipRequest(req, res){
        const sessionId = parseInt(req.params.sessionId);
        const selectQuerry = `SELECT * FROM sessions WHERE sessionid=$1;`;
        const value = [sessionId];
        const result = await query(selectQuerry, value);
        if(!result[0]){
            return res.status(404).json({
                status:404,
                error: "Session not found"
            })
        }
        else{
            if(result[0].mentorid === req.tokenData.id){
                const updateQuerry = `UPDATE sessions SET sessionstatus=$1 where sessionid=$2;`;
                const values = ["request accepted", result[0].sessionid];
                const results = await query(updateQuerry, values);
                return res.status(200).json({
                    status:200,
                    message: "Request accepted",
                    data: result[0]
                })
            }
            return res.status(401).json({
                status:401,
                error: "Not yours to accept"
            })
        }
    }
    async rejectMentorshipSession(req, res){
        const sessionId = parseInt(req.params.sessionId);
        const selectQuerry = `SELECT * FROM sessions WHERE sessionid=$1;`;
        const value = [sessionId];
        const result = await query(selectQuerry, value);
        if(!result[0]){
            return res.status(404).json({
                status:404,
                error: "Session not found"
            })
        }
        else{
            if(result[0].mentorid === req.tokenData.id){
                const updateQuerry = `UPDATE sessions SET sessionstatus=$1 where sessionid=$2;`;
                const values = ["request rejected", result[0].sessionid];
                const results = await query(updateQuerry, values);
                return res.status(200).json({
                    status:200,
                    message: "Request rejected",
                    data: result[0]
                })
            }
            return res.status(401).json({
                status:401,
                error: "Not yours to accept"
            })
        }
    }
    async getSession(req, res){
        const {id, status} = req.tokenData
        if(status === "mentee"){
            const selectQuerry = `SELECT * FROM sessions WHERE menteeid=$1;`;
            const value = [id];
            const result = await query(selectQuerry, value);
            if(!result[0]) return res.status(404).json({
                status:404,
                error: "there is no session for this mentee"
            })
            return res.status(200).json({
                status:200,
                message: "session(s) retrieved successfully",
                data: result
            })
        }
        if(status === "mentor"){
            const selectQuerry1 = `SELECT * FROM sessions WHERE mentorid=$1;`;
            const value1 = [id];
            const result = await query(selectQuerry1, value1);
            if(!result[0]) return res.status(404).json({
                status:404,
                error: "there is no session for this mentor"
            })
            return res.status(200).json({
                status:200,
                message: "session(s) retrieved successfully",
                data: result
            })
        }
        const selectQuerry2 = `SELECT * FROM sessions;`;
        const result = await query(selectQuerry2);
        return res.status(200).json({
            status:200,
            message: "session(s) retrieved successfully",
            data: result
        })
    }
    async reviewMentor(req, res){
        const sessionid = parseInt(req.params.sessionId);
        const selectQuerry = `SELECT * FROM sessions WHERE sessionid=$1;`;
        const value = [sessionid];
        const result = await query(selectQuerry, value);
        if(!result[0]) return res.status(404).json({
            status:404,
            error: "Session with such id not found"
        })
        const {mentorid, menteeid} = result[0];
        const {score, remark} = req.body;
        const {firstName, lastName} = req.tokenData;
        const menteefullname = `${firstName} ${lastName}`;
        const insertQuerry = `INSERT INTO reviews (sessionid, mentorid, menteeid, score, menteefullname, remark)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`;
        const values = [sessionid, mentorid, menteeid, score, menteefullname, remark];
        const results = await query(insertQuerry, values);
        return res.status(201).json({
            status:201,
            message: "review created successfully",
            data: results[0]
        })
    }
    async deleteReview(req, res){
        const sessionid = parseInt(req.params.sessionId);
        const deleteQuerry = `DELETE FROM reviews WHERE sessionid=$1 RETURNING *;`;
        const value = [sessionid];
        const result = await query(deleteQuerry, value);
        if(!result[0]) return res.status(404).json({
            status:404,
            error: "Review with such Id not found"
        })
        return res.status(200).json({
            status:200,
            message: "Review deleted successfully"
        })
    }
}

const newclass= new usersClass();
export default newclass;