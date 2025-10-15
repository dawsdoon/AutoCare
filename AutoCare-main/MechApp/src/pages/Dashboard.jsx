import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Dashboard.css'

const Dashboard = () => {
  const [selectedServices, setSelectedServices] = useState([])
  const [notes, setNotes] = useState('')
  const navigate = useNavigate()

  const serviceData = {
    'oil-change': { title: 'Oil Change', info: 'Regular engine oil replacement and filter change', duration: '30-45 min' },
    'brake-inspection': { title: 'Brake Inspection', info: 'Complete brake system check and pad replacement', duration: '1-2 hours' },
    'tire-rotation': { title: 'Tire Rotation', info: 'Rotate tires for even wear and extend tire life', duration: '20-30 min' },
    'flat-tire-repair': { title: 'Flat Tire Repair', info: 'Professional tire patching and repair services', duration: '30-45 min' },
    'wheel-alignment': { title: 'Wheel Alignment', info: 'Precise wheel alignment for optimal handling and tire wear', duration: '45-60 min' },
    'seasonal-tire-change': { title: 'Seasonal Tire Change', info: 'Switch between summer and winter tires seasonally', duration: '30-45 min' }
  }

  const handleServiceToggle = (serviceType) => {
    setSelectedServices(prev => {
      if (prev.some(service => service.type === serviceType)) {
        return prev.filter(service => service.type !== serviceType)
      } else {
        const service = {
          type: serviceType,
          title: serviceData[serviceType].title,
          info: serviceData[serviceType].info,
          duration: serviceData[serviceType].duration
        }
        return [...prev, service]
      }
    })
  }

  const handleBookAppointment = () => {
    if (selectedServices.length === 0) {
      alert('Please select at least one service first')
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
          <div className="welcome-section">
            <h2>Choose Your Service</h2>
            <p>Select the type of appointment you need for your vehicle</p>
          </div>
          
          <div className="services-grid">
            {Object.entries(serviceData).map(([serviceType, service]) => (
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
