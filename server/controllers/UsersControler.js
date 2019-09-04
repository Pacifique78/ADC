import createUserSchema from '../joi_schemas/createuser_schem';
import Joi from '@hapi/joi';
import users from '../model/userModel';
import loginUserSchema from '../joi_schemas/loginUserSchema';

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
                users.push(newUser);
                return res.status(200).json({
                status: 200,
                message: "user created",
                data: users
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
                            fName: user_found.fName,
                            lName: user_found.lName,
                            email: user_found.email,
                            status: user_found.status
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