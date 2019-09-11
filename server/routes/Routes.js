import newclass from '../controllers/UsersControler';
import express from 'express';
import {checkAdmin} from '../middleware/checkAdmin';
import {checkMentor} from '../middleware/checkMentor';
import {authentication} from '../middleware/middleware';
import {checkNewUser} from '../middleware/checkNewUser';
import {checkUser} from '../middleware/checkUser';

const router=express.Router(); 
router.post('/api/v2/auth/signup', checkNewUser, newclass.createUser);
router.post('/api/v2/auth/signin', checkUser, newclass.login);
export default router;