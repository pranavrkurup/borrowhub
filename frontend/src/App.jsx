import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#FFEFB3] text-[#013E37]">
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;