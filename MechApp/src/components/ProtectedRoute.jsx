import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  // Check role-based access
  if (requireRole && user.role !== requireRole) {
    return (
      <div className="access-denied">
        <div className="access-denied-content">
          <i className="fas fa-lock"></i>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
          <button onClick={() => window.history.back()} className="btn-primary">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return children
}

export { ProtectedRoute }
