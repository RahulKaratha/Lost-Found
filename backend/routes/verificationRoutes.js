import express from 'express';
import { 
  submitClaimVerification, 
  getVerificationChallenges,
  updateHelperScore,
  getLeaderboard,
  approveClaimRequest 
} from '../controllers/verificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/claim/:itemId', protect, submitClaimVerification);
router.get('/challenges/:itemId', protect, getVerificationChallenges);
router.post('/helper-score', protect, updateHelperScore);
router.get('/leaderboard', getLeaderboard);
router.post('/approve/:itemId/:claimAttemptId', protect, approveClaimRequest);

export default router;