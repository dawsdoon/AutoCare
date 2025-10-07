import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService } from '../services/supabase'
import Navbar from '../components/Navbar'
import './Schedule.css'

const Schedule = () => {
  const [selectedServices, setSelectedServices] = useState([])
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Load selected services from localStorage
    const storedServices = localStorage.getItem('selectedServices')
    if (storedServices) {
      try {
        setSelectedServices(JSON.parse(storedServices))
      } catch (error) {
        console.error('Error parsing stored services:', error)
      }
    }

    // Pre-fill customer information from user data
    if (user) {
      setAppointmentData(prev => ({
        ...prev,
        customerName: user.name || '',
        customerEmail: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setAppointmentData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    // Validation
    if (!appointmentData.date || !appointmentData.time) {
      setErrors({ general: 'Please select both date and time' })
      setLoading(false)
      return
    }

    if (!appointmentData.customerName || !appointmentData.customerEmail) {
      setErrors({ general: 'Please fill in all required fields' })
      setLoading(false)
      return
    }

    try {
      const serviceNames = selectedServices.map(service => service.title).join(', ')
      const serviceDescription = selectedServices.map(service => 
        `${service.title}: ${service.info}`
      ).join('\n')

      const appointmentPayload = {
        userId: user.id,
        serviceName: serviceNames,
        serviceDescription: serviceDescription,
        date: appointmentData.date,
        time: appointmentData.time,
        customerName: appointmentData.customerName,
        customerEmail: appointmentData.customerEmail,
        customerPhone: appointmentData.customerPhone,
        notes: selectedServices.map(s => s.notes).filter(Boolean).join('\n')
      }

      const result = await AppointmentService.createAppointment(appointmentPayload)
      
      if (result.success) {
        alert('Appointment booked successfully!')
        localStorage.removeItem('selectedServices')
        navigate('/dashboard')
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
          <div className="schedule-header">
            <h2>Schedule Appointment</h2>
            <p>Complete your service booking</p>
          </div>
          
          <div className="schedule-content">
            <div className="selected-services-summary">
              <h3>Selected Services</h3>
              <div className="services-list">
                {selectedServices.map((service, index) => (
                  <div key={index} className="service-item">
                    <div className="service-info">
                      <h4>{service.title}</h4>
                      <p>{service.info}</p>
                      <span className="duration">{service.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="appointment-form">
              <div className="form-section">
                <h3>Appointment Details</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date">Date *</label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={appointmentData.date}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Time *</label>
                    <select
                      id="time"
                      name="time"
                      value={appointmentData.time}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Select Time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                      <option value="17:00">5:00 PM</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <h3>Contact Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="customerName">Full Name *</label>
                    <input
                      type="text"
                      id="customerName"
                      name="customerName"
                      value={appointmentData.customerName}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="customerEmail">Email *</label>
                    <input
                      type="email"
                      id="customerEmail"
                      name="customerEmail"
                      value={appointmentData.customerEmail}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="customerPhone">Phone Number</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={appointmentData.customerPhone}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              
              {errors.general && (
                <div className="error-message show">{errors.general}</div>
              )}
              
              <div className="form-actions">
                <button type="button" onClick={() => navigate('/dashboard')} className="btn-secondary">
                  Back to Services
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Booking...
                    </>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Schedule
