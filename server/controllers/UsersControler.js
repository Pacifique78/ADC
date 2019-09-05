import createUserSchema from '../joi_schemas/createuser_schem';
import Joi from '@hapi/joi';
import users from '../model/userModel';
import loginUserSchema from '../joi_schemas/loginUserSchema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import secret from '../config/config';

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
                return res.status(400).json({
                    status:400,
                    error: "user with such email already exists"
                })
            }
            else{
                const newUser=req.body;
                const saltRounds = 10;
                const passWord = newUser.password;
                bcrypt.hash(passWord, saltRounds, (err, hash) => {
                    newUser.password = hash;
                    users.push(newUser);
                  });
                let token = jwt.sign({email: newUser.email}, secret, {
                    expiresIn: '24h'
                })
                return res.status(200).json({
                status: 200,
                message: "user created",
                data: {
                    "firstName": newUser.firstName,
                    "lastName": newUser.lastName,
                    "email": newUser.email,
                    "status": newUser.status
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
                        let token = jwt.sign({email: Email}, secret, {
                            expiresIn: '24h'
                        })
                        return res.status(200).json({
                            status: 200,
                            message: "User logged in",
                            data: {
                                firstName: userFound.fName,
                                lastName: userFound.lName,
                                email: userFound.email,
                                status: userFound.status
                            },
                            token:token
                        });
                    }else{
                        return res.status(400).json({
                            status: 400,
                            error: "incorrect password",
                        });
                    }

                })
            }else{
                return res.status(400).json({
                    status: 400,
                    error: "User with such email not found",
                });
            }

        }
    }
}

const newclass= new usersClass();
export default newclass;