const { updateStudentStatOnQuizAttempt } = require('../utils/studentStatUpdater');

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
  // Only update student stats, do not update quiz participant here
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