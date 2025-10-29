import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const AdminLayout = ({ children }) => {
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

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return (
    <div className="admin-layout">
      {children}
    </div>
  )
}

export default AdminLayout
