import Item from '../models/Item.js';
import User from '../models/User.js';

export const submitClaimVerification = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { hiddenDetails, challengeAnswers } = req.body;
    
    console.log('Claim verification request:', { itemId, userId: req.user._id });
    
    // Check if item is still available for claims
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (item.status === 'claimed') {
      return res.status(400).json({ message: 'This item has already been claimed and is no longer available.' });
    }
    
    // Simple direct database update
    const result = await Item.findByIdAndUpdate(
      itemId,
      {
        $push: {
          claimAttempts: {
            claimant: req.user._id,
            hiddenDetailsProvided: hiddenDetails || 'No details provided',
            challengeAnswers: challengeAnswers || [],
            isVerified: false,
            attemptDate: new Date()
          }
        }
      },
      { new: true }
    ).populate('user', 'name email').populate('claimAttempts.claimant', 'name email');
    
    if (!result) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    console.log('Claim attempt added successfully');
    
    res.json({
      success: true,
      message: 'Claim request submitted successfully!',
      item: result
    });
  } catch (error) {
    console.error('Claim submission error:', error);
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

export const approveClaimRequest = async (req, res) => {
  try {
    const { itemId, claimAttemptId } = req.params;
    const { approved } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Only the item owner can approve claims
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the item owner can approve claims' });
    }
    
    const claimAttempt = item.claimAttempts.id(claimAttemptId);
    if (!claimAttempt) {
      return res.status(404).json({ message: 'Claim attempt not found' });
    }
    
    if (approved) {
      // Approve the claim
      claimAttempt.isVerified = true;
      item.claimedBy = claimAttempt.claimant;
      item.status = 'claimed';
      item.claimDate = new Date();
      
      // Remove all other claim attempts
      item.claimAttempts = item.claimAttempts.filter(attempt => 
        attempt._id.toString() === claimAttemptId
      );
      
      // Update claimer's helper score
      const claimer = await User.findById(claimAttempt.claimant);
      if (claimer) {
        claimer.interactions.challengesCompleted += 1;
        claimer.helperScore += 10;
        item.claimerName = claimer.name;
        await claimer.save();
      }
      
      // Update reporter's helper score
      const reporter = await User.findById(item.user);
      if (reporter) {
        reporter.interactions.itemsReturned += 1;
        reporter.helperScore += 15;
        await reporter.save();
      }
    } else {
      // Reject the claim
      item.claimAttempts.pull(claimAttemptId);
    }
    
    await item.save();
    
    res.json({
      success: true,
      message: approved ? 'Claim approved successfully!' : 'Claim rejected.',
      item: await Item.findById(itemId).populate('user claimedBy', 'name email')
    });
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