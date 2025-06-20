
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Achievements from './pages/Achievements';
import Learning from './pages/Learning';
import Profile from './pages/Profile';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ProgressProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="achievements" element={<Achievements />} />
                <Route path="learning" element={<Learning />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Router>
        </ProgressProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;