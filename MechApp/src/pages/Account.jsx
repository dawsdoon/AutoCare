import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { UserService, AppointmentService } from '../services/supabase'
import Navbar from '../components/Navbar'
import VehicleSelector from '../components/VehicleSelector'
import { convertVehicleDataFromSupabase, convertVehicleDataToSupabase } from '../utils/dataMigration'
import './Account.css'

const Account = () => {
  const [loading, setLoading] = useState(false)
  const [appointmentsLoading, setAppointmentsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: ''
  })
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: ''
  })
  const [appointments, setAppointments] = useState([])
  const [errors, setErrors] = useState({})
  
  const { user, updateUser } = useAuth()

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.name || '',
        phoneNumber: user.phone || ''
      })
      setVehicleData(convertVehicleDataFromSupabase(user))
      fetchAppointments()
    }
  }, [user])

  const fetchAppointments = async () => {
    if (!user) return
    
    setAppointmentsLoading(true)
    try {
      const result = await AppointmentService.getUserAppointments(user.id)
      if (result.success) {
        setAppointments(result.data || [])
      } else {
        console.error('Error fetching appointments:', result.error)
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setAppointmentsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleVehicleChange = (vehicle) => {
    setVehicleData(vehicle)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const result = await UserService.updateUserProfile(user.id, {
        ...profileData,
        ...convertVehicleDataToSupabase(vehicleData)
      })
      
      if (result.success) {
        // Update local user data with vehicle information
        const updatedUser = {
          ...user,
          name: profileData.fullName,
          phone: profileData.phoneNumber,
          vehicle: {
            make: vehicleData.make,
            model: vehicleData.model,
            year: vehicleData.year ? parseInt(vehicleData.year) : null
          }
        }
        
        // Update the AuthContext with new user data
        updateUser(updatedUser)
        
        alert('Profile updated successfully!')
      } else {
        setErrors({ general: result.error })
      }
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          <div className="account-header">
            <h2>My Account</h2>
            <p>Manage your profile and vehicle information</p>
          </div>
          
          <div className="account-card">
            <form onSubmit={handleSave}>
              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Vehicle Information</h3>
                {user.vehicle && (user.vehicle.make || user.vehicle.model || user.vehicle.year) && (
                  <div className="current-vehicle-info">
                    <p><strong>Current Vehicle:</strong> {user.vehicle.year} {user.vehicle.make} {user.vehicle.model}</p>
                  </div>
                )}
                <VehicleSelector
                  selectedMake={vehicleData.make}
                  selectedModel={vehicleData.model}
                  selectedYear={vehicleData.year}
                  onSelectionChange={handleVehicleChange}
                  className="account-vehicle-selector"
                />
              </div>
              
              {errors.general && (
                <div className="error-message show">{errors.general}</div>
              )}
              
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Appointments Section */}
          <div className="appointments-section">
            <div className="appointments-header">
              <h3>My Appointments</h3>
              <button onClick={fetchAppointments} className="refresh-btn" disabled={appointmentsLoading}>
                {appointmentsLoading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-sync-alt"></i>
                )}
                Refresh
              </button>
            </div>
            
            {appointmentsLoading ? (
              <div className="loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading appointments...</p>
              </div>
            ) : appointments.length === 0 ? (
              <div className="no-appointments">
                <i className="fas fa-calendar-times"></i>
                <p>No appointments found</p>
                <p>Book your first service to see appointments here</p>
              </div>
            ) : (
              <div className="appointments-list">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="appointment-card">
                    <div className="appointment-header">
                      <h4>{appointment.service_name}</h4>
                      <span className={`status status-${appointment.status}`}>
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
                      {appointment.notes && (
                        <div className="detail-item notes">
                          <i className="fas fa-sticky-note"></i>
                          <span>{appointment.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Account
