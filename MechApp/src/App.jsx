import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Account from './pages/Account'
import Schedule from './pages/Schedule'
import ServiceHistory from './pages/ServiceHistory'
import MaintenanceSchedule from './pages/MaintenanceSchedule'
import FAQ from './pages/FAQ'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import AdminHome from './pages/AdminHome'
import AdminLayout from './pages/AdminLayout'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <Routes>
            {/* LEARNING: Home page route - this is the landing page users see first */}
            {/* LEARNING: The "/" path means this is the default/root route */}
            {/* LEARNING: When users visit the website, they'll see the Home component */}
            <Route path="/" element={<Home />} />
            
            {/* LEARNING: Login page route - users navigate here when they click "Get Started" */}
            {/* LEARNING: The "/login" path is what the Home page navigates to */}
            <Route path="/login" element={<Login />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account" 
              element={
                <ProtectedRoute>
                  <Account />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/schedule" 
              element={
                <ProtectedRoute>
                  <Schedule />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/service-history" 
              element={
                <ProtectedRoute>
                  <ServiceHistory />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenance-schedule" 
              element={
                <ProtectedRoute>
                  <MaintenanceSchedule />
                </ProtectedRoute>
              } 
            />
            {/* LEARNING: FAQ route - accessible without login for landing page visitors */}
            <Route path="/faq" element={<FAQ />} />
            
            {/* LEARNING: Contact route - accessible without login for landing page visitors */}
            <Route path="/contact" element={<Contact />} />
            <Route 
              path="/admin" 
              element={
                <AdminLayout>
                  <AdminHome />
                </AdminLayout>
              } 
            />
            <Route 
              path="/admin/appointments" 
              element={
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
