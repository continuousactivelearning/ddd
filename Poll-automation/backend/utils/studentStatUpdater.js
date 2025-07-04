const StudentStat = require('../models/StudentStat');
const Quiz = require('../models/Quiz');

/**
 * Update or create StudentStat for a user after quiz submission.
 * @param {ObjectId} userId - The student's user ID
 * @param {ObjectId} quizId - The quiz ID
 * @param {Number} score - The score for this quiz
 * @param {Number} correctAnswers - Number of correct answers
 * @param {Number} totalQuestions - Total questions in the quiz
 * @param {Number} timeTaken - Time taken in seconds (optional)
 */
async function updateStudentStatOnQuizAttempt({ userId, quizId, score, correctAnswers, totalQuestions, timeTaken = 0 }) {
  let stat = await StudentStat.findOne({ userId });
  if (!stat) {
    stat = new StudentStat({ userId });
  }

  // Update stats
  stat.totalQuizzesAttempted += 1;
  stat.totalScore += score;
  stat.totalQuestions += totalQuestions;
  stat.correctAnswers += correctAnswers;
  stat.totalTimeTaken += timeTaken;
  stat.lastQuizAt = new Date();

  // Recalculate averages
  stat.averageScore = stat.totalScore / stat.totalQuizzesAttempted;
  stat.accuracy = stat.totalQuestions > 0 ? (stat.correctAnswers / stat.totalQuestions) * 100 : 0;
  stat.averageTimePerQuiz = stat.totalTimeTaken / stat.totalQuizzesAttempted;

  // XP calculation: 10 XP per correct answer + score as XP
  const xpEarned = (correctAnswers * 10) + score;
  stat.xp = (stat.xp || 0) + xpEarned;

  // Badge logic
  const newBadges = [];
  if ((stat.totalQuizzesAttempted === 1) && !stat.badges.some(b => b.name === 'First Quiz')) {
    newBadges.push({ name: 'First Quiz' });
  }
  if ((stat.totalQuizzesAttempted === 10) && !stat.badges.some(b => b.name === '10 Quizzes')) {
    newBadges.push({ name: '10 Quizzes' });
  }
  if ((correctAnswers === totalQuestions) && !stat.badges.some(b => b.name === 'Perfect Score')) {
    newBadges.push({ name: 'Perfect Score' });
  }
  if (newBadges.length > 0) {
    stat.badges = [...(stat.badges || []), ...newBadges];
  }

  // Add activity
  stat.activity.push({
    type: 'quiz_attempted',
    message: `Attempted a quiz (ID: ${quizId}) and scored ${score}`,
    quizId,
    createdAt: new Date()
  });

  await stat.save();
}

/**
 * Add a notification activity for a student when a quiz is added for them.
 * @param {ObjectId} userId - The student's user ID
 * @param {ObjectId} quizId - The quiz ID
 * @param {String} message - Notification message
 */
async function addQuizNotificationForStudent({ userId, quizId, message }) {
  let stat = await StudentStat.findOne({ userId });
  if (!stat) {
    stat = new StudentStat({ userId });
  }
  stat.activity.push({
    type: 'quiz_added',
    message,
    quizId,
    createdAt: new Date()
  });
  await stat.save();
}

module.exports = {
  updateStudentStatOnQuizAttempt,
  addQuizNotificationForStudent
}; 