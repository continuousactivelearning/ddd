const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendNotification, sendNotificationToMultipleUsers } = require('../utils/socketNotifications');
const { sendMail } = require('../utils/mail');

class NotificationService {
  // Create a notification for a specific user
  static async createNotification(data) {
    try {
      const notification = new Notification({
        recipient: data.recipientId,
        type: data.type,
        title: data.title,
        message: data.message,
        quizId: data.quizId,
        quizName: data.quizName,
        metadata: data.metadata || {}
      });

      await notification.save();

      // Send real-time notification
      sendNotification(data.recipientId, notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Create notifications for all students when a new quiz is created
  static async notifyStudentsForNewQuiz(quiz, adminId) {
    try {
      // Find the admin who created the quiz
      const admin = await User.findById(adminId);
      if (!admin) return;

      // Get all students allowed by this admin
      const allowedStudents = admin.allowedStudents || [];
      
      // Find user documents for these students
      const studentUsers = await User.find({ 
        email: { $in: allowedStudents },
        role: 'student'
      });

      // Debug logs
      console.log('Allowed students:', allowedStudents);
      console.log('Student users found:', studentUsers.map(s => s.email));

      // Create notifications for each student user (existing in DB)
      const notifications = studentUsers.map(student => ({
        recipientId: student._id,
        type: 'new_quiz_available',
        title: 'New Quiz Available',
        message: `A new quiz "${quiz.topic}" has been created by ${admin.name}`,
        quizId: quiz._id,
        quizName: quiz.topic
      }));

      // Save all notifications
      await Promise.all(notifications.map(notification => 
        this.createNotification(notification)
      ));

      // Send real-time notifications to connected students
      const studentIds = studentUsers.map(student => student._id);
      const realTimeNotification = {
        type: 'new_quiz_available',
        title: 'New Quiz Available',
        message: `A new quiz "${quiz.topic}" has been created by ${admin.name}`,
        quizId: quiz._id,
        quizName: quiz.topic,
        createdAt: new Date()
      };
      sendNotificationToMultipleUsers(studentIds, realTimeNotification);

      // Send email to all allowedStudents (even if not in DB)
      const quizUrl = `http://localhost:5173/quiz/${quiz.quizCode}`;
      await Promise.all(allowedStudents.map(email =>
        sendMail({
          to: email,
          subject: `🚀 New Quiz: ${quiz.topic} (from ${admin.name})`,
          text: `Hello,\n\nA new quiz titled "${quiz.topic}" has just been created by ${admin.name}.\n\nYou can access and attempt the quiz directly from your dashboard or by clicking the link below:\n${quizUrl}\n\nGood luck!\n\nBest regards,\nQuiz Team`,
          html: `<div style=\"font-family:sans-serif;max-width:500px;margin:auto;\"><h2>New Quiz Available!</h2><p>Hello,</p><p>A new quiz titled <b>"${quiz.topic}"</b> has just been created by <b>${admin.name}</b>.</p><p style=\"margin:20px 0;\"><a href=\"${quizUrl}\" style=\"background:#4CAF50;color:#fff;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;\">Attempt the Quiz</a></p><p>Or copy and paste this link in your browser:<br/><a href=\"${quizUrl}\">${quizUrl}</a></p><hr/><p style=\"font-size:12px;color:#888;\">Best regards,<br/>Quiz Team</p></div>`
        })
      ));

      return notifications.length;
    } catch (error) {
      console.error('Error notifying students for new quiz:', error);
      throw error;
    }
  }

  // Notify admin when a student completes a quiz
  static async notifyAdminForQuizCompletion(quiz, student, score) {
    try {
      const notification = await this.createNotification({
        recipientId: quiz.createdBy,
        type: 'quiz_completed',
        title: 'Quiz Completed',
        message: `${student.name} completed "${quiz.topic}" with a score of ${score}%`,
        quizId: quiz._id,
        quizName: quiz.topic,
        metadata: {
          studentName: student.name,
          studentEmail: student.email,
          score: score
        }
      });

      return notification;
    } catch (error) {
      console.error('Error notifying admin for quiz completion:', error);
      throw error;
    }
  }

  // Notify student about their quiz result
  static async notifyStudentForQuizResult(quiz, student, score) {
    try {
      const notification = await this.createNotification({
        recipientId: student._id,
        type: 'quiz_result',
        title: 'Quiz Result Available',
        message: `You scored ${score}% on "${quiz.topic}"`,
        quizId: quiz._id,
        quizName: quiz.topic,
        metadata: {
          score: score,
          totalQuestions: quiz.questions.length
        }
      });

      return notification;
    } catch (error) {
      console.error('Error notifying student for quiz result:', error);
      throw error;
    }
  }

  // Get notifications for a user
  static async getUserNotifications(userId, limit = 20) {
    try {
      const notifications = await Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('quizId', 'topic quizCode');

      return notifications;
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true },
        { new: true }
      );

      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );

      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Get unread count for a user
  static async getUnreadCount(userId) {
    try {
      const count = await Notification.countDocuments({
        recipient: userId,
        read: false
      });

      return count;
    } catch (error) {
      console.error('Error getting unread count:', error);
      throw error;
    }
  }

  // Delete a notification
  static async deleteNotification(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndDelete({
        _id: notificationId,
        recipient: userId
      });

      return notification;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 