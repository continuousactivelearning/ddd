// Utility function to send real-time notifications via Socket.IO

const sendNotification = (userId, notification) => {
  try {
    const io = global.io;
    const connectedUsers = global.connectedUsers;
    
    if (!io || !connectedUsers) {
      console.log('Socket.IO not initialized');
      return;
    }

    const socketId = connectedUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit('new_notification', notification);
      console.log(`Real-time notification sent to user ${userId}`);
    } else {
      console.log(`User ${userId} not connected, notification will be shown on next login`);
    }
  } catch (error) {
    console.error('Error sending real-time notification:', error);
  }
};

const sendNotificationToMultipleUsers = (userIds, notification) => {
  try {
    const io = global.io;
    const connectedUsers = global.connectedUsers;
    
    if (!io || !connectedUsers) {
      console.log('Socket.IO not initialized');
      return;
    }

    userIds.forEach(userId => {
      const socketId = connectedUsers.get(userId.toString());
      if (socketId) {
        io.to(socketId).emit('new_notification', notification);
      }
    });
    
    console.log(`Real-time notifications sent to ${userIds.length} users`);
  } catch (error) {
    console.error('Error sending real-time notifications to multiple users:', error);
  }
};

module.exports = {
  sendNotification,
  sendNotificationToMultipleUsers
}; 