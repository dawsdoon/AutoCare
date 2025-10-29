import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService } from '../services/supabase'
import Navbar from '../components/Navbar'
import './ServiceHistory.css'

const ServiceHistory = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const result = await AppointmentService.getUserAppointments(user.id)
      
      if (result.success) {
        setAppointments(result.data || [])
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('Failed to load service history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed'
      case 'in-progress': return 'status-in-progress'
      case 'pending': return 'status-pending'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'pending': return 'Scheduled'
      case 'cancelled': return 'Cancelled'
      default: return 'Scheduled'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const filteredAppointments = appointments.filter(appointment => {
    if (filterStatus === 'all') return true
    return appointment.status === filterStatus
  })

  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase()
    if (name.includes('oil')) return 'fa-oil-can'
    if (name.includes('brake')) return 'fa-circle-notch'
    if (name.includes('tire')) return 'fa-tools'
    if (name.includes('alignment')) return 'fa-cog'
    if (name.includes('seasonal')) return 'fa-snowflake'
    return 'fa-wrench'
  }

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading service history...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          <div className="service-history-header">
            <h2>Service History</h2>
            <p>View your past and upcoming appointments</p>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <h3>No Service History</h3>
              <p>You haven't booked any appointments yet.</p>
              <a href="/dashboard" className="btn-primary">Book Your First Service</a>
            </div>
          ) : (
            <>
              <div className="filter-controls">
                <div className="filter-buttons">
                  <button 
                    className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('all')}
                  >
                    All ({appointments.length})
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('pending')}
                  >
                    Scheduled ({appointments.filter(a => a.status === 'pending').length})
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('in-progress')}
                  >
                    In Progress ({appointments.filter(a => a.status === 'in-progress').length})
                  </button>
                  <button 
                    className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                    onClick={() => setFilterStatus('completed')}
                  >
                    Completed ({appointments.filter(a => a.status === 'completed').length})
                  </button>
                </div>
              </div>

              <div className="appointments-list">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <div className="appointment-date">
                        <i className="fas fa-calendar-alt"></i>
                        <div>
                          <span className="date">{formatDate(appointment.appointment_date)}</span>
                          <span className="time">{formatTime(appointment.appointment_time)}</span>
                        </div>
                      </div>
                      <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </div>
                    </div>

                    <div className="appointment-content">
                      <div className="service-info">
                        <div className="service-icon">
                          <i className={`fas ${getServiceIcon(appointment.service_name)}`}></i>
                        </div>
                        <div className="service-details">
                          <h4>{appointment.service_name}</h4>
                          <p className="service-description">{appointment.service_description}</p>
                        </div>
                      </div>

                      {appointment.notes && (
                        <div className="appointment-notes">
                          <h5>Notes:</h5>
                          <p>{appointment.notes}</p>
                        </div>
                      )}

                      <div className="appointment-meta">
                        <div className="meta-item">
                          <i className="fas fa-user"></i>
                          <span>{appointment.customer_name}</span>
                        </div>
                        <div className="meta-item">
                          <i className="fas fa-envelope"></i>
                          <span>{appointment.customer_email}</span>
                        </div>
                        {appointment.customer_phone && (
                          <div className="meta-item">
                            <i className="fas fa-phone"></i>
                            <span>{appointment.customer_phone}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {appointment.status === 'completed' && (
                      <div className="appointment-actions">
                        <button className="btn-secondary">
                          <i className="fas fa-download"></i>
                          Download Receipt
                        </button>
                        <button className="btn-secondary">
                          <i className="fas fa-star"></i>
                          Rate Service
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default ServiceHistory
