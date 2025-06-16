# Poll Automation

A modern web application for creating, managing, and participating in polls. This project features a React-based frontend and a Node.js/Express backend.

## 🚀 Features

- Create and manage polls
- Real-time poll updates
- User authentication
- Responsive and modern UI
- Secure session management
- MongoDB database integration

## 🛠️ Tech Stack

### Frontend
- React 18
- Vite
- Material-UI (MUI)
- TailwindCSS
- React Query
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Passport.js for authentication
- JWT for session management
- Socket.IO for real-time features

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/poll-automation.git
cd poll-automation
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=3000
```

## 🚀 Running the Application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development

- Frontend development server runs on port 5173
- Backend server runs on port 3000
- MongoDB connection is required for full functionality

## 📝 Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## 🔐 Authentication

The application uses JWT-based authentication. Make sure to:
1. Set up your JWT secret in the environment variables
2. Configure proper authentication middleware
3. Implement secure session management

## 📄 License

This project is licensed under the ISC License.

## 👥 Authors

Mande.Dheeraj
Lakshmi Manasa
Thirumalesh
Vamsi

## 🙏 Acknowledgments

- Material-UI for the component library
- MongoDB for the database
- All other open-source contributors 