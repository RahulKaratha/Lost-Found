import Item from '../models/Item.js';
import User from '../models/User.js';

export const submitClaimVerification = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { hiddenDetails, challengeAnswers } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    if (item.status !== 'open') {
      return res.status(400).json({ message: 'Item is not available for claiming' });
    }
    
    // Record claim attempt
    const claimAttempt = {
      claimant: req.user._id,
      hiddenDetailsProvided: hiddenDetails,
      challengeAnswers: challengeAnswers || []
    };
    
    // Verify hidden details (simple similarity check)
    const hiddenDetailsMatch = hiddenDetails.toLowerCase().includes(item.hiddenDetails.toLowerCase().substring(0, 10));
    
    // Verify challenge answers
    let challengeScore = 0;
    if (item.verificationChallenges.length > 0 && challengeAnswers) {
      item.verificationChallenges.forEach((challenge, index) => {
        if (challengeAnswers[index] && 
            challengeAnswers[index].toLowerCase().includes(challenge.answer.toLowerCase())) {
          challengeScore++;
        }
      });
    }
    
    const isVerified = hiddenDetailsMatch || challengeScore >= Math.ceil(item.verificationChallenges.length / 2);
    claimAttempt.isVerified = isVerified;
    
    item.claimAttempts.push(claimAttempt);
    
    if (isVerified) {
      item.claimedBy = req.user._id;
      item.claimerName = req.user.name;
      item.status = 'claimed';
      item.claimDate = new Date();
      
      // Update claimer's helper score
      const claimer = await User.findById(req.user._id);
      claimer.interactions.challengesCompleted += 1;
      claimer.helperScore += 10; // 10 points for successful claim
      await claimer.save();
      
      // Update reporter's helper score for successful return
      const reporter = await User.findById(item.user);
      if (reporter) {
        reporter.interactions.itemsReturned += 1;
        reporter.helperScore += 15; // 15 points for successful return
        await reporter.save();
      }
    }
    
    await item.save();
    
    res.json({
      success: isVerified,
      message: isVerified ? 'Claim verified successfully!' : 'Verification failed. Please try again.',
      item: isVerified ? await Item.findById(itemId).populate('user claimedBy', 'name email') : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVerificationChallenges = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Return only questions, not answers
    const challenges = item.verificationChallenges.map(challenge => ({
      _id: challenge._id,
      question: challenge.question
    }));
    
    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateHelperScore = async (req, res) => {
  try {
    const { userId, action, points } = req.body;
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    user.helperScore += points;
    
    // Award badges based on score
    const badges = [];
    if (user.helperScore >= 100 && !user.badges.includes('Helper Bronze')) {
      badges.push('Helper Bronze');
    }
    if (user.helperScore >= 250 && !user.badges.includes('Helper Silver')) {
      badges.push('Helper Silver');
    }
    if (user.helperScore >= 500 && !user.badges.includes('Helper Gold')) {
      badges.push('Helper Gold');
    }
    
    user.badges = [...new Set([...user.badges, ...badges])];
    await user.save();
    
    res.json({ user, newBadges: badges });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLeaderboard = async (req, res) => {
  try {
    const topUsers = await User.find({})
      .select('name helperScore badges interactions')
      .sort({ helperScore: -1 })
      .limit(10);
    
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};