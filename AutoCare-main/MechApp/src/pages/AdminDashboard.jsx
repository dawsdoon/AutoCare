import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService } from '../services/supabase'
import AdminNavbar from '../components/AdminNavbar'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all') // all, pending, approved
  const { user } = useAuth()

  useEffect(() => {
    fetchAppointments()
  }, [])

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      console.log('🔍 Fetching appointments from Supabase...')
      const result = await AppointmentService.getAllAppointments()
      console.log('📊 Appointments result:', result)
      
      if (result.success) {
        console.log('✅ Appointments fetched successfully:', result.data)
        setAppointments(result.data || [])
      } else {
        console.error('❌ Error fetching appointments:', result.error)
        alert('Error fetching appointments: ' + result.error)
      }
    } catch (error) {
      console.error('❌ Exception fetching appointments:', error)
      alert('Error fetching appointments: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveAppointment = async (appointmentId) => {
    try {
      const result = await AppointmentService.updateAppointmentStatus(appointmentId, 'approved')
      if (result.success) {
        alert('Appointment approved successfully!')
        fetchAppointments() // Refresh the list
      } else {
        alert('Error approving appointment: ' + result.error)
      }
    } catch (error) {
      console.error('Error approving appointment:', error)
      alert('Error approving appointment')
    }
  }

  const handleRejectAppointment = async (appointmentId) => {
    try {
      const result = await AppointmentService.updateAppointmentStatus(appointmentId, 'rejected')
      if (result.success) {
        alert('Appointment rejected successfully!')
        fetchAppointments() // Refresh the list
      } else {
        alert('Error rejecting appointment: ' + result.error)
      }
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      alert('Error rejecting appointment')
    }
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true
    return appointment.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'status-pending'
      case 'approved': return 'status-approved'
      case 'rejected': return 'status-rejected'
      default: return 'status-pending'
    }
  }

  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      
      <main className="main-content">
        <div className="container">
          <div className="admin-header">
            <h2>Admin Dashboard</h2>
            <p>Manage appointment requests</p>
          </div>
          
          <div className="admin-controls">
            <div className="filter-buttons">
              <button 
                className={filter === 'all' ? 'active' : ''} 
                onClick={() => setFilter('all')}
              >
                All Appointments ({appointments.length})
              </button>
              <button 
                className={filter === 'pending' ? 'active' : ''} 
                onClick={() => setFilter('pending')}
              >
                Pending ({appointments.filter(a => a.status === 'pending').length})
              </button>
              <button 
                className={filter === 'approved' ? 'active' : ''} 
                onClick={() => setFilter('approved')}
              >
                Approved ({appointments.filter(a => a.status === 'approved').length})
              </button>
            </div>
            <button onClick={fetchAppointments} className="refresh-btn" disabled={loading}>
              {loading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-sync-alt"></i>
              )}
              Refresh
            </button>
          </div>
          
          {loading ? (
            <div className="loading-state">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading appointments...</p>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="no-appointments">
              <i className="fas fa-calendar-times"></i>
              <p>No appointments found</p>
              <p>{filter === 'all' ? 'No appointments have been created yet' : `No ${filter} appointments found`}</p>
            </div>
          ) : (
            <div className="appointments-list">
              {filteredAppointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <h4>{appointment.service_name}</h4>
                    <span className={`status ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                  <div className="appointment-details">
                    <div className="detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{appointment.appointment_time}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-user"></i>
                      <span>{appointment.customer_name}</span>
                    </div>
                    <div className="detail-item">
                      <i className="fas fa-envelope"></i>
                      <span>{appointment.customer_email}</span>
                    </div>
                    {appointment.customer_phone && (
                      <div className="detail-item">
                        <i className="fas fa-phone"></i>
                        <span>{appointment.customer_phone}</span>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="detail-item notes">
                        <i className="fas fa-sticky-note"></i>
                        <span>{appointment.notes}</span>
                      </div>
                    )}
                  </div>
                  {appointment.status === 'pending' && (
                    <div className="appointment-actions">
                      <button 
                        onClick={() => handleApproveAppointment(appointment.id)}
                        className="btn-approve"
                      >
                        <i className="fas fa-check"></i>
                        Approve
                      </button>
                      <button 
                        onClick={() => handleRejectAppointment(appointment.id)}
                        className="btn-reject"
                      >
                        <i className="fas fa-times"></i>
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
