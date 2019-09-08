import jwt from 'jsonwebtoken';
import secret from '../config/config';

const checkToken =  (req,res,next) =>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            status: 401,
            error: "Token not provided"
        })
    }
    else{
        const verified = jwt.verify(token, secret);
        req.tokenData = verified;
        next();
    }
}
export default checkToken;