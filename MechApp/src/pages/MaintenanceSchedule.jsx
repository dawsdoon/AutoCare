import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService } from '../services/supabase'
import { getAllServiceIntervals, getServiceInterval } from '../data/serviceIntervals'
import { getServiceStatus, formatDate, formatRelativeDate } from '../utils/maintenanceCalculator'
import Navbar from '../components/Navbar'
import './MaintenanceSchedule.css'

const MaintenanceSchedule = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMileage, setCurrentMileage] = useState('')
  const [maintenanceItems, setMaintenanceItems] = useState([])
  const [filterStatus, setFilterStatus] = useState('all') // all, due, upcoming

  useEffect(() => {
    if (user) {
      fetchAppointments()
      loadCurrentMileage()
    }
  }, [user])

  useEffect(() => {
    if (appointments.length > 0 || currentMileage) {
      calculateMaintenanceSchedule()
    }
  }, [appointments, currentMileage])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const result = await AppointmentService.getUserAppointments(user.id)
      if (result.success) {
        setAppointments(result.data || [])
      } else {
        toast.error('Failed to load service history')
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
      toast.error('Failed to load service history')
    } finally {
      setLoading(false)
    }
  }

  const loadCurrentMileage = () => {
    try {
      const mileageKey = `autocare_current_mileage_${user.id}`
      const stored = localStorage.getItem(mileageKey)
      if (stored) {
        setCurrentMileage(stored)
      }
    } catch (error) {
      console.error('Error loading mileage:', error)
    }
  }

  const saveCurrentMileage = (mileage) => {
    try {
      const mileageKey = `autocare_current_mileage_${user.id}`
      localStorage.setItem(mileageKey, mileage)
      setCurrentMileage(mileage)
      toast.success('Mileage updated successfully!')
    } catch (error) {
      console.error('Error saving mileage:', error)
      toast.error('Failed to save mileage')
    }
  }

  const handleMileageSubmit = (e) => {
    e.preventDefault()
    const mileage = parseInt(currentMileage)
    if (isNaN(mileage) || mileage < 0) {
      toast.error('Please enter a valid mileage')
      return
    }
    saveCurrentMileage(mileage.toString())
  }

  const calculateMaintenanceSchedule = () => {
    const intervals = getAllServiceIntervals()
    const items = []

    Object.keys(intervals).forEach(serviceType => {
      const interval = intervals[serviceType]
      
      // Find last service of this type
      const lastService = appointments
        .filter(apt => {
          const serviceName = apt.service_name.toLowerCase()
          return serviceName.includes(interval.serviceName.toLowerCase()) ||
                 serviceName.includes(serviceType.replace('-', ' '))
        })
        .filter(apt => apt.status === 'completed')
        .sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date))[0]

      const lastServiceDate = lastService ? lastService.appointment_date : null
      const lastServiceMileage = lastService ? (lastService.mileage_at_service || null) : null
      const currentMileageNum = currentMileage ? parseInt(currentMileage) : null

      const status = getServiceStatus(
        interval,
        lastServiceDate,
        lastServiceMileage,
        currentMileageNum
      )

      items.push({
        serviceType,
        serviceName: interval.serviceName,
        description: interval.description,
        lastServiceDate,
        lastServiceMileage,
        status,
        interval
      })
    })

    // Sort by priority: overdue first, then due-soon, then approaching, then upcoming
    items.sort((a, b) => {
      const statusOrder = { overdue: 0, 'due-soon': 1, approaching: 2, upcoming: 3, unknown: 4 }
      const statusDiff = statusOrder[a.status.status] - statusOrder[b.status.status]
      if (statusDiff !== 0) return statusDiff
      
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.status.priority] - priorityOrder[b.status.priority]
    })

    setMaintenanceItems(items)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'overdue': return 'status-overdue'
      case 'due-soon': return 'status-due-soon'
      case 'approaching': return 'status-approaching'
      case 'upcoming': return 'status-upcoming'
      default: return 'status-unknown'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'overdue': return 'Overdue'
      case 'due-soon': return 'Due Soon'
      case 'approaching': return 'Approaching'
      case 'upcoming': return 'Upcoming'
      default: return 'Unknown'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'overdue': return 'fa-exclamation-circle'
      case 'due-soon': return 'fa-exclamation-triangle'
      case 'approaching': return 'fa-clock'
      case 'upcoming': return 'fa-check-circle'
      default: return 'fa-question-circle'
    }
  }

  const filteredItems = maintenanceItems.filter(item => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'due') return item.status.isDue
    if (filterStatus === 'upcoming') return !item.status.isDue
    return true
  })

  const getLastServiceText = (item) => {
    if (!item.lastServiceDate) {
      return 'No previous service recorded'
    }
    return `Last service: ${formatDate(item.lastServiceDate)}`
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          <div className="maintenance-header">
            <div>
              <h2>Maintenance Schedule</h2>
              <p>Track recommended service intervals for your vehicle</p>
            </div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="btn-primary"
            >
              <i className="fas fa-calendar-plus"></i>
              Book Service
            </button>
          </div>

          {/* Current Mileage Input */}
          <div className="mileage-section">
            <div className="mileage-card">
              <h3>
                <i className="fas fa-tachometer-alt"></i>
                Current Vehicle Mileage
              </h3>
              <form onSubmit={handleMileageSubmit} className="mileage-form">
                <div className="mileage-input-group">
                  <input
                    type="number"
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(e.target.value)}
                    placeholder="Enter current mileage"
                    className="mileage-input"
                    min="0"
                  />
                  <span className="mileage-unit">miles</span>
                </div>
                <button type="submit" className="btn-secondary">
                  <i className="fas fa-save"></i>
                  Update Mileage
                </button>
              </form>
              {user?.vehicle && (
                <p className="vehicle-info">
                  Vehicle: {user.vehicle.year} {user.vehicle.make} {user.vehicle.model}
                </p>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="filter-controls">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All Services ({maintenanceItems.length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'due' ? 'active' : ''}`}
                onClick={() => setFilterStatus('due')}
              >
                Due Now ({maintenanceItems.filter(i => i.status.isDue).length})
              </button>
              <button 
                className={`filter-btn ${filterStatus === 'upcoming' ? 'active' : ''}`}
                onClick={() => setFilterStatus('upcoming')}
              >
                Upcoming ({maintenanceItems.filter(i => !i.status.isDue).length})
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading maintenance schedule...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-check"></i>
              <h3>No Maintenance Items</h3>
              <p>No maintenance items found for the selected filter.</p>
            </div>
          ) : (
            <div className="maintenance-grid">
              {filteredItems.map((item) => (
                <div key={item.serviceType} className={`maintenance-card ${getStatusColor(item.status.status)}`}>
                  <div className="maintenance-card-header">
                    <div className="service-title">
                      <h3>{item.serviceName}</h3>
                      <span className={`status-badge ${getStatusColor(item.status.status)}`}>
                        <i className={`fas ${getStatusIcon(item.status.status)}`}></i>
                        {getStatusText(item.status.status)}
                      </span>
                    </div>
                  </div>

                  <div className="maintenance-card-body">
                    <p className="service-description">{item.description}</p>
                    
                    <div className="maintenance-details">
                      <div className="detail-row">
                        <span className="detail-label">
                          <i className="fas fa-calendar"></i>
                          Recommended Interval:
                        </span>
                        <span className="detail-value">
                          {item.interval.timeInterval && `${item.interval.timeInterval} months`}
                          {item.interval.timeInterval && item.interval.mileageInterval && ' or '}
                          {item.interval.mileageInterval && `${item.interval.mileageInterval.toLocaleString()} miles`}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="detail-label">
                          <i className="fas fa-history"></i>
                          Last Service:
                        </span>
                        <span className="detail-value">
                          {getLastServiceText(item)}
                        </span>
                      </div>

                      {item.status.timeStatus.dueDate && (
                        <div className="detail-row">
                          <span className="detail-label">
                            <i className="fas fa-clock"></i>
                            Time-Based Due Date:
                          </span>
                          <span className="detail-value">
                            {formatDate(item.status.timeStatus.dueDate)}
                            {item.status.timeStatus.daysUntil !== null && (
                              <span className="relative-date">
                                {' '}({formatRelativeDate(item.status.timeStatus.daysUntil)})
                              </span>
                            )}
                          </span>
                        </div>
                      )}

                      {item.status.mileageStatus.dueMileage && currentMileage && (
                        <div className="detail-row">
                          <span className="detail-label">
                            <i className="fas fa-tachometer-alt"></i>
                            Mileage-Based Due:
                          </span>
                          <span className="detail-value">
                            {item.status.mileageStatus.dueMileage.toLocaleString()} miles
                            {item.status.mileageStatus.milesUntil !== null && (
                              <span className="relative-date">
                                {' '}({item.status.mileageStatus.milesUntil.toLocaleString()} miles remaining)
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="maintenance-card-footer">
                    <button 
                      onClick={() => {
                        // Store service type in localStorage and navigate to dashboard
                        localStorage.setItem('quickBookService', item.serviceType)
                        navigate('/dashboard')
                      }}
                      className="btn-book-service"
                    >
                      <i className="fas fa-calendar-plus"></i>
                      Book This Service
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MaintenanceSchedule

