import newclass from '../controllers/UsersControler';
import express from 'express';
import checkAdmin from '../middleware/checkAdmin';
import checkMentor from '../middleware/checkMentor';
import authentication from '../middleware/middleware';
import checkUser from '../middleware/newUserSchema';

const router=express.Router(); 
router.post('/api/v2/auth/signup', checkUser, newclass.createUser);
router.get('/api/users', newclass.findUsers);
export default router;