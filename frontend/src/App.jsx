import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/navbar';
import CommandPalette from './components/CommandPalette';
import Home from './pages/Home';
import Feed from './pages/Feed';
import Login from './pages/Login';
import Register from './pages/Register';
import AddItem from './pages/AddItem';
import Dashboard from './pages/Dashboard';
import BorrowRequests from './pages/BorrowRequests';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-accent selection:text-white">
        <Navbar />
        <CommandPalette />
        <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/add-item" element={<AddItem />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/requests" element={<BorrowRequests />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;