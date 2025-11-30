import React, { useState, useEffect } from 'react';
import { TrophyIcon, StarIcon, GiftIcon } from '@heroicons/react/24/outline';
import { TrophyIcon as TrophyIconSolid } from '@heroicons/react/24/solid';
import API from '../api';

const HelperScore = ({ user, compact = false }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  useEffect(() => {
    if (showLeaderboard) {
      fetchLeaderboard();
    }
  }, [showLeaderboard]);

  const fetchLeaderboard = async () => {
    try {
      const response = await API.get('/verification/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getBadgeIcon = (badge) => {
    const iconProps = { className: "h-5 w-5" };
    switch (badge) {
      case 'Helper Bronze': return <TrophyIcon {...iconProps} className="text-amber-600" />;
      case 'Helper Silver': return <TrophyIcon {...iconProps} className="text-gray-400" />;
      case 'Helper Gold': return <TrophyIconSolid {...iconProps} className="text-yellow-500" />;
      default: return <StarIcon {...iconProps} />;
    }
  };

  const getScoreLevel = (score) => {
    if (score >= 500) return { level: 'Gold Helper', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score >= 250) return { level: 'Silver Helper', color: 'text-gray-600', bg: 'bg-gray-100' };
    if (score >= 100) return { level: 'Bronze Helper', color: 'text-amber-600', bg: 'bg-amber-100' };
    return { level: 'New Helper', color: 'text-blue-600', bg: 'bg-blue-100' };
  };

  if (compact) {
    const level = getScoreLevel(user.helperScore || 0);
    return (
      <div className="flex items-center space-x-2">
        <GiftIcon className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">{user.helperScore || 0} pts</span>
        <span className={`text-xs px-2 py-1 rounded-full ${level.bg} ${level.color}`}>
          {level.level}
        </span>
      </div>
    );
  }

  const level = getScoreLevel(user.helperScore || 0);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Helper Score</h3>
        <button
          onClick={() => setShowLeaderboard(!showLeaderboard)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showLeaderboard ? 'Hide' : 'View'} Leaderboard
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{user.helperScore || 0}</div>
          <div className="text-sm text-gray-600">Total Points</div>
        </div>
        <div className="text-center">
          <div className={`text-sm px-3 py-1 rounded-full ${level.bg} ${level.color} font-medium`}>
            {level.level}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
        <div>Items Reported: {user.interactions?.itemsReported || 0}</div>
        <div>Items Returned: {user.interactions?.itemsReturned || 0}</div>
        <div>Challenges Completed: {user.interactions?.challengesCompleted || 0}</div>
        <div>Positive Ratings: {user.interactions?.positiveRatings || 0}</div>
      </div>

      {user.badges && user.badges.length > 0 && (
        <div className="mb-3">
          <div className="text-sm font-medium text-gray-700 mb-2">Badges</div>
          <div className="flex flex-wrap gap-2">
            {user.badges.map((badge, index) => (
              <div key={index} className="flex items-center space-x-1 bg-white px-2 py-1 rounded-full border">
                {getBadgeIcon(badge)}
                <span className="text-xs">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs text-gray-500">
        <div>• Report items: +5 points</div>
        <div>• Successful claims: +10 points</div>
        <div>• Successful returns: +15 points</div>
      </div>

      {showLeaderboard && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Top Helpers</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {leaderboard.map((helper, index) => (
              <div key={helper._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">#{index + 1}</span>
                  <span className={helper._id === user._id ? 'font-bold text-blue-600' : ''}>
                    {helper.name}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{helper.helperScore}</span>
                  {helper.badges.length > 0 && (
                    <div className="flex space-x-1">
                      {helper.badges.slice(0, 2).map((badge, i) => (
                        <div key={i} className="w-4 h-4">
                          {getBadgeIcon(badge)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelperScore;