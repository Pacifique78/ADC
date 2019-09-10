import newclass from '../controllers/UsersControler';
import express from 'express';
import checkAdmin from '../middleware/checkAdmin';
import checkMentor from '../middleware/checkMentor';
import authentication from '../middleware/middleware';

const router=express.Router(); 
router.post('/api/v2/auth/signup',newclass.createUser);
export default router;