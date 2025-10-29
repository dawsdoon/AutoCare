import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppointmentService } from '../services/supabase'
import AdminNavbar from '../components/AdminNavbar'
import './AdminHome.css'

const AdminHome = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const result = await AppointmentService.getAllAppointments()
      if (result.success) {
        const appointments = result.data || []
        setStats({
          total: appointments.length,
          pending: appointments.filter(a => a.status === 'pending').length,
          approved: appointments.filter(a => a.status === 'approved').length,
          rejected: appointments.filter(a => a.status === 'rejected').length
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-home">
      <AdminNavbar />
      
      <main className="main-content">
        <div className="container">
          <div className="admin-welcome">
            <h1>Admin Dashboard</h1>
            <p>Manage your appointment requests and system overview</p>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-calendar-alt"></i>
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : stats.total}</h3>
                <p>Total Appointments</p>
              </div>
            </div>
            
            <div className="stat-card pending">
              <div className="stat-icon">
                <i className="fas fa-clock"></i>
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : stats.pending}</h3>
                <p>Pending Review</p>
              </div>
            </div>
            
            <div className="stat-card approved">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : stats.approved}</h3>
                <p>Approved</p>
              </div>
            </div>
            
            <div className="stat-card rejected">
              <div className="stat-icon">
                <i className="fas fa-times-circle"></i>
              </div>
              <div className="stat-content">
                <h3>{loading ? '...' : stats.rejected}</h3>
                <p>Rejected</p>
              </div>
            </div>
          </div>
          
          <div className="quick-actions">
            <h2>Quick Actions</h2>
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/admin/appointments')}
                className="action-btn primary"
              >
                <i className="fas fa-list"></i>
                Manage Appointments
              </button>
              <button 
                onClick={fetchStats}
                className="action-btn secondary"
                disabled={loading}
              >
                <i className="fas fa-sync-alt"></i>
                Refresh Stats
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminHome
