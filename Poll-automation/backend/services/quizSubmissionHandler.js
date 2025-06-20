const { updateStudentStatOnQuizAttempt } = require('../utils/studentStatUpdater');
const Quiz = require('../models/Quiz');

/**
 * Call this after a quiz is submitted.
 * @param {Object} params
 * @param {ObjectId} params.userId
 * @param {ObjectId} params.quizId
 * @param {Number} params.score
 * @param {Number} params.correctAnswers
 * @param {Number} params.totalQuestions
 * @param {Number} params.timeTaken
 */
async function handleQuizSubmission({ userId, quizId, score, correctAnswers, totalQuestions, timeTaken }) {
  // Optionally, fetch quiz details if you want to store more info in StudentStat
  const quiz = await Quiz.findById(quizId);

  // Update the participant's timeTaken in the Quiz model if not already present
  if (quiz && quiz.participants && quiz.participants.length > 0) {
    // Find the most recent attempt for this user
    const participant = quiz.participants
      .filter(p => p.user.toString() === userId.toString())
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
    if (participant) {
      participant.timeTaken = timeTaken;
      quiz.markModified('participants'); // Ensure Mongoose saves the change
      await quiz.save();
    }
  }

  // Call the updater utility
  await updateStudentStatOnQuizAttempt({
    userId,
    quizId,
    score,
    correctAnswers,
    totalQuestions,
    timeTaken
    // You can extend the StudentStat model/activity to store more quiz details if needed
  });

  // Optionally, you can add more logic here (e.g., send notifications)
}

module.exports = { handleQuizSubmission }; 