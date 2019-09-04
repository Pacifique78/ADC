import createUserSchema from '../joi_schemas/createuser_schem';
import Joi from '@hapi/joi';
import users from '../model/userModel';
import loginUserSchema from '../joi_schemas/loginUserSchema';
import bcrypt from 'bcrypt';

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
                return res.status(200).json({
                status: 200,
                message: "user created",
                data: {
                    "fName": newUser.fName,
                    "lName": newUser.lName,
                    "email": newUser.email,
                    "status": newUser.status
                }
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
                if(userFound.password===Password){
                    return res.status(200).json({
                        status: 200,
                        message: "User logged in",
                        data: {
                            fName: userFound.fName,
                            lName: userFound.lName,
                            email: userFound.email,
                            status: userFound.status
                        }
                    });
                }else{
                    return res.status(400).json({
                        status: 400,
                        error: "incorrect password",
                    });
                }
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