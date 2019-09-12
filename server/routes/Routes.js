import newclass from '../controllers/UsersControler';
import express from 'express';
import {checkAdmin} from '../middleware/checkAdmin';
import {checkMentor} from '../middleware/checkMentor';
import {checkToken} from '../middleware/middleware';
import {checkNewUser} from '../middleware/checkNewUser';
import {checkUser} from '../middleware/checkUser';
import { validateSession } from '../middleware/validateSession';

const router=express.Router(); 
router.post('/api/v2/auth/signup', checkNewUser, newclass.createUser);
router.post('/api/v2/auth/signin', checkUser, newclass.login);
router.patch('/api/v2/user/:userId', [checkToken, checkAdmin], newclass.changeUser);
router.get('/api/v2/mentors', checkToken, newclass.getAllMentors);
router.get('/api/v2/mentors/:mentorId', checkToken, newclass.getSpecificMentor);
router.post('/api/v2/sessions', [checkToken, validateSession], newclass.createMentorshipSession);
router.patch('/api/v2/sessions/:sessionId/accept', [checkToken, checkMentor], newclass.acceptMentorshipRequest);
router.patch('/api/v2/sessions/:sessionId/reject', [checkToken, checkMentor], newclass.rejectMentorshipSession);
export default router;