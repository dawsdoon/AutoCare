import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService, ServicePriceService } from '../services/supabase'
import Navbar from '../components/Navbar'
import './Dashboard.css'
import CostCalculator from '../components/CostCalculator'

const Dashboard = () => {
  const [selectedServices, setSelectedServices] = useState([])
  const [notes, setNotes] = useState('')
  const [upcomingAppointments, setUpcomingAppointments] = useState([])
  const [loadingReminders, setLoadingReminders] = useState(true)
  const [servicePrices, setServicePrices] = useState([])
  const [pricesLoading, setPricesLoading] = useState(true)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchUpcomingAppointments()
    }
  }, [user])

  useEffect(() => {
    // Async function: Fetches prices from database
    const fetchPrices = async () => {
      try {
        setPricesLoading(true)
        // Await: Pauses execution until Promise resolves
        const result = await ServicePriceService.getAllPrices()
        
        // State update: Triggers component re-render
        if (result.success) {
          setServicePrices(result.data || [])
        } else {
          console.error('Failed to fetch prices:', result.error)
        }
      } catch (error) {
        console.error('Error fetching prices:', error)
      } finally {
        setPricesLoading(false)
      }
    }
    
    fetchPrices()
  }, [])

  const fetchUpcomingAppointments = async () => {
    if (!user) return
    
    try {
      setLoadingReminders(true)
      const result = await AppointmentService.getUserAppointments(user.id)
      if (result.success) {
        const appointments = result.data || []
        const now = new Date()
        const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
        
        // Filter appointments that are pending/in-progress and within 48 hours
        const upcoming = appointments.filter(apt => {
          if (apt.status === 'completed' || apt.status === 'cancelled') return false
          
          const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`)
          return appointmentDateTime >= now && appointmentDateTime <= in48Hours
        })
        
        // Sort by date/time
        upcoming.sort((a, b) => {
          const dateA = new Date(`${a.appointment_date}T${a.appointment_time}`)
          const dateB = new Date(`${b.appointment_date}T${b.appointment_time}`)
          return dateA - dateB
        })
        
        setUpcomingAppointments(upcoming)
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
    } finally {
      setLoadingReminders(false)
    }
  }

  const formatAppointmentDateTime = (date, time) => {
    const appointmentDate = new Date(`${date}T${time}`)
    const now = new Date()
    const hoursUntil = Math.floor((appointmentDate - now) / (1000 * 60 * 60))
    
    if (hoursUntil < 1) {
      const minutesUntil = Math.floor((appointmentDate - now) / (1000 * 60))
      return `in ${minutesUntil} minute${minutesUntil !== 1 ? 's' : ''}`
    } else if (hoursUntil < 24) {
      return `in ${hoursUntil} hour${hoursUntil !== 1 ? 's' : ''}`
    } else {
      const daysUntil = Math.floor(hoursUntil / 24)
      return `in ${daysUntil} day${daysUntil !== 1 ? 's' : ''}`
    }
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const serviceData = {
    'oil-change': { title: 'Oil Change', info: 'Regular engine oil replacement and filter change', duration: '30-45 min', price: 29.99 },
    'brake-inspection': { title: 'Brake Inspection', info: 'Complete brake system check and pad replacement', duration: '1-2 hours', price: 49.99 },
    'tire-rotation': { title: 'Tire Rotation', info: 'Rotate tires for even wear and extend tire life', duration: '20-30 min', price: 39.99 },
    'flat-tire-repair': { title: 'Flat Tire Repair', info: 'Professional tire patching and repair services', duration: '30-45 min', price: 79.99 },
    'wheel-alignment': { title: 'Wheel Alignment', info: 'Precise wheel alignment for optimal handling and tire wear', duration: '45-60 min', price: 19.99 },
    'seasonal-tire-change': { title: 'Seasonal Tire Change', info: 'Switch between summer and winter tires seasonally', duration: '30-45 min', price: 99.99 }
  }

  // Array.reduce() method: Transforms array into object
  const getServiceDataWithPrices = () => {
    // Spread operator: Creates shallow copy of serviceData object
    const data = { ...serviceData }
    
    // Array.forEach() method: Iterates through each price from database
    servicePrices.forEach(priceData => {
      // Optional chaining: Safely accesses nested property
      if (data[priceData.service_type]) {
        // parseFloat(): Converts string to number
        data[priceData.service_type].price = parseFloat(priceData.base_price)
      }
    })
    
    return data
  }

  // Use merged data instead of hardcoded serviceData
  const currentServiceData = getServiceDataWithPrices()

  const handleServiceToggle = (serviceType) => {
    setSelectedServices(prev => {
      if (prev.some(service => service.type === serviceType)) {
        return prev.filter(service => service.type !== serviceType)
      } else {
        const service = {
          type: serviceType,
          title: currentServiceData[serviceType].title,
          info: currentServiceData[serviceType].info,
          duration: currentServiceData[serviceType].duration,
          price: currentServiceData[serviceType].price
        }
        return [...prev, service]
      }
    })
  }

  const handleBookAppointment = () => {
    if (selectedServices.length === 0) {
      toast.warning('Please select at least one service first')
      return
    }

    const servicesToStore = selectedServices.map(service => ({
      ...service,
      notes: notes
    }))
    
    localStorage.setItem('selectedServices', JSON.stringify(servicesToStore))
    navigate('/schedule')
  }

  const handleChangeServices = () => {
    setSelectedServices([])
    setNotes('')
  }


  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          {/* Upcoming Appointment Reminder */}
          {!loadingReminders && upcomingAppointments.length > 0 && (
            <div className="appointment-reminder-banner">
              <div className="reminder-icon">
                <i className="fas fa-bell"></i>
              </div>
              <div className="reminder-content">
                <h3>Upcoming Appointment{upcomingAppointments.length > 1 ? 's' : ''}</h3>
                <div className="reminder-appointments">
                  {upcomingAppointments.map((apt, index) => (
                    <div key={apt.id || index} className="reminder-appointment-item">
                      <div className="reminder-appointment-info">
                        <strong>{apt.service_name}</strong>
                        <span className="reminder-time">
                          {formatDate(apt.appointment_date)} at {formatTime(apt.appointment_time)}
                        </span>
                        <span className="reminder-countdown">
                          {formatAppointmentDateTime(apt.appointment_date, apt.appointment_time)}
                        </span>
                      </div>
                      <button 
                        className="reminder-view-btn"
                        onClick={() => navigate('/service-history')}
                      >
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <button 
                className="reminder-close-btn"
                onClick={() => setUpcomingAppointments([])}
                title="Dismiss reminder"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <div className="welcome-section">
            <h2>Choose Your Service</h2>
            <p>Select the type of appointment you need for your vehicle</p>
          </div>
          
          <div className="services-grid">
            {Object.entries(currentServiceData).map(([serviceType, service]) => (
              <div key={serviceType} className="service-card" data-service={serviceType}>
                <div className="service-checkbox">
                  <input 
                    type="checkbox" 
                    id={serviceType} 
                    className="service-checkbox-input"
                    checked={selectedServices.some(s => s.type === serviceType)}
                    onChange={() => handleServiceToggle(serviceType)}
                  />
                  <label htmlFor={serviceType} className="service-checkbox-label"></label>
                </div>
                <div className="service-icon">
                  <i className={`fas ${
                    serviceType === 'oil-change' ? 'fa-oil-can' :
                    serviceType === 'brake-inspection' ? 'fa-circle-notch' :
                    serviceType === 'tire-rotation' ? 'fa-sync-alt' :
                    serviceType === 'flat-tire-repair' ? 'fa-tools' :
                    serviceType === 'wheel-alignment' ? 'fa-cog' :
                    'fa-snowflake'
                  }`}></i>
                </div>
                <h3>{service.title}</h3>
                <p className="service-desc">{service.info}</p>
                <p className="service-price">${service.price.toFixed(2)}</p>
                <div className="service-details">
                  <span className="duration">{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
          
          {selectedServices.length > 0 && (
            <div className="selected-services">
              <div className="summary-card">
                <h3>Selected Services</h3>
                <div className="summary-content">
                  <div className="services-list">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="service-item">
                        <span className="service-item-name">{service.title}</span>
                        <span className="service-item-duration">{service.duration}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* CostCalculator shows total cost of all selected services */}
                  <CostCalculator services={selectedServices} />
                  
                  <div className="notes-section">
                    <label htmlFor="serviceNotes" className="notes-label">Additional Notes (Optional)</label>
                    <textarea 
                      id="serviceNotes" 
                      className="notes-input" 
                      placeholder="Any specific requirements, concerns, or additional information about your vehicle..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <div className="summary-actions">
                    <button onClick={handleBookAppointment} className="btn-primary">Book Appointment</button>
                    <button onClick={handleChangeServices} className="btn-secondary">Change Services</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="dashboard-footer">
        <div className="footer-content">
          <p>Need help? Check out our <a href="/faq" onClick={(e) => { e.preventDefault(); navigate('/faq'); }}>FAQ page</a> for answers to common questions.</p>
        </div>
      </footer>
    </div>
  )
}

export default Dashboard
