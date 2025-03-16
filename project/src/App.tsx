import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Coffee, Users, Calendar, MessageSquare, UserCircle } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Schedule from './pages/Schedule';
import Chats from './pages/Chats';
import Discover from './pages/Discover';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/discover" element={<Discover />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </Router>
  );
}

export default App;