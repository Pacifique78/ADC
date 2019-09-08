import newclass from '../controllers/UsersControler';
import express from 'express';
import checkAdmin from '../middleware/checkAdmin';
import checkMentor from '../middleware/checkMentor';
import authentication from '../middleware/middleware';

const router=express.Router(); 
router.post('/api/v1/auth/signup',newclass.createUser);
router.post('/api/v1/auth/signin',newclass.Login);
router.patch('/api/v1/user/:userId', [authentication, checkAdmin], newclass.becomeMentor);
router.get('/api/v1/mentors', authentication, newclass.getAllMentors);
router.get('/api/v1/mentors/:mentorId', authentication, newclass.getSpecificMentor);
router.post('/api/v1/sessions', authentication, newclass.createMentorshipSession);
router.patch('/api/v1/sessions/:sessionId/accept', [authentication, checkMentor], newclass.acceptMentorShipRequest);
router.patch('/api/v1/sessions/:sessionId/reject', [authentication, checkMentor], newclass.rejectMentorShipRequest);
router.get('/api/v1/sessions', authentication, newclass.getSession);
export default router;