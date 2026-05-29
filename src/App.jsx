import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Portfolio />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminLogin />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
