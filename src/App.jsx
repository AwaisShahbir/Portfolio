import React, { Suspense, useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import LoadingSpinner from './components/LoadingSpinner';

const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));

// Lazy wrapper that dynamically imports AuthProvider only when an admin route is visited
const AdminWrapper = ({ children }) => {
    const [Provider, setProvider] = useState(null);

    useEffect(() => {
        import('./context/AuthContext').then(m => {
            setProvider(() => m.AuthProvider);
        });
    }, []);

    if (!Provider) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                <LoadingSpinner text="Initializing secure session..." />
            </div>
        );
    }

    return <Provider>{children}</Provider>;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route 
                path="/admin" 
                element={
                    <AdminWrapper>
                        <Suspense fallback={
                            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                                <LoadingSpinner text="Loading admin services..." />
                            </div>
                        }>
                            <AdminDashboard />
                        </Suspense>
                    </AdminWrapper>
                } 
            />
            <Route 
                path="/admin/login" 
                element={
                    <AdminWrapper>
                        <Suspense fallback={
                            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
                                <LoadingSpinner text="Loading login services..." />
                            </div>
                        }>
                            <AdminLogin />
                        </Suspense>
                    </AdminWrapper>
                } 
            />
        </Routes>
    );
}

export default App;
