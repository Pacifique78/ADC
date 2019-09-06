import newclass from '../controllers/UsersControler';
import express from 'express';

const router=express.Router(); 

router.post('/api/v1/auth/signup',newclass.createUser);
router.post('/api/v1/auth/signin',newclass.Login);
router.patch('/api/v1/user/:userId', newclass.becomeMentor);
router.get('/api/v1/mentors', newclass.getAllMentors);
router.get('/api/v1/mentors/:mentorId', newclass.getSpecificMentor);
router.post('/api/v1/sessions', newclass.createMentorshipSession);
router.patch('/api/v1/sessions/:sessionId/accept', newclass.acceptMentorShipRequest);
router.patch('/api/v1/sessions/:sessionId/reject', newclass.rejectMentorShipRequest);
router.get('/api/v1/sessions', newclass.getSession);
export default router;