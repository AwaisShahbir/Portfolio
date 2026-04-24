import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/AdminDashboard'; // We will create this

function App() {
    return (
        <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
    );
}

export default App;
