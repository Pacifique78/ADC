import newclass from '../controllers/UsersControler';
import express from 'express';

const router=express.Router();

router.post('/api/v1/auth/signup',newclass.createUser);
router.post('/api/v1/auth/signin',newclass.Login);
export default router;