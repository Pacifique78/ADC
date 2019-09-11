import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const checkToken =  (req,res,next) =>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            status: 401,
            error: "Token not provided"
        })
    }
    else{
        const verified = jwt.verify(token, process.env.secret);
        req.tokenData = verified;
        next();
    }
}