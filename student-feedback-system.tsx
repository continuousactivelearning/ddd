import React, { useState, useEffect } from 'react';
import { Bell, Plus, Send, User, Calendar, MessageCircle, Star, BookOpen, Users, X } from 'lucide-react';

const StudentFeedbackSystem = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [feedbackList, setFeedbackList] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      subject: 'Mathematics',
      assignment: 'Algebra Quiz #3',
      grade: 'A-',
      feedback: 'Excellent work on complex equations. Minor calculation errors in problem 5.',
      date: '2025-01-15',
      status: 'reviewed',
      teacherName: 'Mr. Smith'
    },
    {
      id: 2,
      studentName: 'Bob Chen',
      subject: 'English',
      assignment: 'Essay: Climate Change',
      grade: 'B+',
      feedback: 'Strong arguments and good structure. Could improve conclusion paragraph.',
      date: '2025-01-14',
      status: 'new',
      teacherName: 'Ms. Davis'
    }
  ]);
  
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      studentName: 'Alice Johnson',
      subject: 'Mathematics',
      query: 'Could you explain the quadratic formula approach for problem 7?',
      date: '2025-01-16',
      status: 'pending',
      type: 'question'
    }
  ]);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      message: 'New feedback available for Algebra Quiz #3',
      date: '2025-01-15',
      read: false,
      type: 'feedback'
    },
    {
      id: 2,
      message: 'Response received for your Math query',
      date: '2025-01-14',
      read: false,
      type: 'response'
    }
  ]);
  
  const [newFeedback, setNewFeedback] = useState({
    studentName: '',
    subject: '',
    assignment: '',
    grade: '',
    feedback: '',
    teacherName: ''
  });
  
  const [newSubmission, setNewSubmission] = useState({
    studentName: '',
    subject: '',
    query: '',
    type: 'question'
  });
  
  const [showNotifications, setShowNotifications] = useState(false);
  
  const unreadNotifications = notifications.filter(n => !n.read).length;
  
  const addFeedback = () => {
    if (newFeedback.studentName && newFeedback.subject && newFeedback.feedback) {
      const feedback = {
        id: Date.now(),
        ...newFeedback,
        date: new Date().toISOString().split('T')[0],
        status: 'new'
      };
      setFeedbackList([...feedbackList, feedback]);
      setNewFeedback({
        studentName: '',
        subject: '',
        assignment: '',
        grade: '',
        feedback: '',
        teacherName: ''
      });
      
      // Add notification
      const notification = {
        id: Date.now(),
        message: `New feedback added for ${newFeedback.studentName} - ${newFeedback.subject}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'feedback'
      };
      setNotifications([notification, ...notifications]);
    }
  };
  
  const submitQuery = () => {
    if (newSubmission.studentName && newSubmission.subject && newSubmission.query) {
      const submission = {
        id: Date.now(),
        ...newSubmission,
        date: new Date().toISOString().split('T')[0],
        status: 'pending'
      };
      setSubmissions([...submissions, submission]);
      setNewSubmission({
        studentName: '',
        subject: '',
        query: '',
        type: 'question'
      });
      
      // Add notification
      const notification = {
        id: Date.now(),
        message: `New ${newSubmission.type} submitted by ${newSubmission.studentName}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
        type: 'submission'
      };
      setNotifications([notification, ...notifications]);
    }
  };
  
  const markAsRead = (feedbackId) => {
    setFeedbackList(feedbackList.map(f => 
      f.id === feedbackId ? { ...f, status: 'reviewed' } : f
    ));
  };
  
  const markNotificationRead = (notificationId) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  };
  
  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 bg-green-100';
    if (grade.startsWith('B')) return 'text-blue-600 bg-blue-100';
    if (grade.startsWith('C')) return 'text-yellow-600 bg-yellow-100';
    if (grade.startsWith('D')) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Feedback System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-gray-600 hover:text-blue-600 relative"
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-20">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <button
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-gray-500 text-center">No notifications</p>
                      ) : (
                        notifications.map(notification => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationRead(notification.id)}
                          >
                            <p className="text-sm text-gray-900">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
              <Users className="h-6 w-6 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['dashboard', 'feedback', 'submissions', 'add-feedback'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'dashboard' && 'Dashboard'}
                {tab === 'feedback' && 'All Feedback'}
                {tab === 'submissions' && 'Student Submissions'}
                {tab === 'add-feedback' && 'Add Feedback'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Feedback</p>
                    <p className="text-2xl font-bold text-gray-900">{feedbackList.length}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending Submissions</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {submissions.filter(s => s.status === 'pending').length}
                    </p>
                  </div>
                  <MessageCircle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">New Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">{unreadNotifications}</p>
                  </div>
                  <Bell className="h-8 w-8 text-red-500" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Feedback</h3>
                <div className="space-y-4">
                  {feedbackList.slice(0, 3).map(feedback => (
                    <div key={feedback.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(feedback.grade)}`}>
                          {feedback.grade}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{feedback.studentName}</p>
                        <p className="text-sm text-gray-600">{feedback.subject} - {feedback.assignment}</p>
                        <p className="text-xs text-gray-500">{feedback.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Submissions</h3>
                <div className="space-y-4">
                  {submissions.slice(0, 3).map(submission => (
                    <div key={submission.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{submission.studentName}</p>
                        <p className="text-sm text-gray-600">{submission.subject}</p>
                        <p className="text-xs text-gray-500">{submission.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Feedback */}
        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">All Feedback</h2>
            </div>
            
            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
              <div className="divide-y divide-gray-200">
                {feedbackList.map(feedback => (
                  <div key={feedback.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{feedback.studentName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${getGradeColor(feedback.grade)}`}>
                            {feedback.grade}
                          </span>
                          {feedback.status === 'new' && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                              NEW
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{feedback.subject} - {feedback.assignment}</p>
                        <p className="text-gray-900 mb-2">{feedback.feedback}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {feedback.date}
                          </span>
                          <span>Teacher: {feedback.teacherName}</span>
                        </div>
                      </div>
                      {feedback.status === 'new' && (
                        <button
                          onClick={() => markAsRead(feedback.id)}
                          className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Mark as Read
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Student Submissions */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Student Submissions</h2>
            </div>
            
            {/* Student Submission Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Submit Question or Response</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSubmission.studentName}
                  onChange={(e) => setNewSubmission({...newSubmission, studentName: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSubmission.subject}
                  onChange={(e) => setNewSubmission({...newSubmission, subject: e.target.value})}
                />
              </div>
              <div className="mb-4">
                <select
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newSubmission.type}
                  onChange={(e) => setNewSubmission({...newSubmission, type: e.target.value})}
                >
                  <option value="question">Question</option>
                  <option value="response">Response</option>
                  <option value="clarification">Clarification Request</option>
                </select>
              </div>
              <textarea
                placeholder="Enter your question or response..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                value={newSubmission.query}
                onChange={(e) => setNewSubmission({...newSubmission, query: e.target.value})}
              />
              <button
                onClick={submitQuery}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Submit</span>
              </button>
            </div>
            
            {/* Submissions List */}
            <div className="bg-white shadow-sm rounded-lg border overflow-hidden">
              <div className="divide-y divide-gray-200">
                {submissions.map(submission => (
                  <div key={submission.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{submission.studentName}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {submission.status.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded">
                            {submission.type.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{submission.subject}</p>
                        <p className="text-gray-900 mb-2">{submission.query}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {submission.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Feedback */}
        {activeTab === 'add-feedback' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Add New Feedback</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Student Name"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newFeedback.studentName}
                  onChange={(e) => setNewFeedback({...newFeedback, studentName: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Subject"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newFeedback.subject}
                  onChange={(e) => setNewFeedback({...newFeedback, subject: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Assignment"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newFeedback.assignment}
                  onChange={(e) => setNewFeedback({...newFeedback, assignment: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Grade (e.g., A-, B+)"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newFeedback.grade}
                  onChange={(e) => setNewFeedback({...newFeedback, grade: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Teacher Name"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newFeedback.teacherName}
                  onChange={(e) => setNewFeedback({...newFeedback, teacherName: e.target.value})}
                />
              </div>
              <textarea
                placeholder="Enter detailed feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="6"
                value={newFeedback.feedback}
                onChange={(e) => setNewFeedback({...newFeedback, feedback: e.target.value})}
              />
              <button
                onClick={addFeedback}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Feedback</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFeedbackSystem;