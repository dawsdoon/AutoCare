import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './Home.css'

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()
  
  const handleGetStarted = () => {
    navigate('/login')
  }

  const handleNavigateToFAQ = () => {
    navigate('/faq')
  }

  const handleNavigateToContact = () => {
    navigate('/contact')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.home-nav-actions')) {
        closeMenu()
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className="home-page">
      <nav className="home-navbar">
        <div 
          className="home-nav-logo" 
          role="button" 
          tabIndex={0}
          onClick={() => navigate('/')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate('/')
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-car"></i>
          <h1>AutoCare</h1>
        </div>
        
        <div className="home-nav-actions">
          <button className="home-menu-toggle" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
          
          <div className={`home-dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-home"></i>
              Home
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToFAQ(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-question-circle"></i>
              FAQ
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToContact(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-phone"></i>
              Contact Us
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); handleGetStarted(); closeMenu(); }} className="home-dropdown-item">
              <i className="fas fa-sign-in-alt"></i>
              Login / Sign Up
            </a>
          </div>
        </div>
      </nav>
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Professional Auto Care
            <span className="highlight"> Made Simple</span>
          </h1>
          
          <p className="hero-subtitle">
            Schedule appointments, track maintenance, and keep your vehicle running smoothly. 
            All in one convenient platform.
          </p>
          
          <button className="cta-button" onClick={handleGetStarted}>
            Get Started
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <section className="services-preview">
        <div className="container">
          <h2 className="section-title">Our Services</h2>
          
          <p className="section-subtitle">Comprehensive automotive care for your vehicle</p>
          
          <div className="services-grid">
            
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-oil-can"></i>
              </div>
              <h3>Oil Change</h3>
              <p>Regular engine oil replacement and filter change</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-circle-notch"></i>
              </div>
              <h3>Brake Inspection</h3>
              <p>Complete brake system check and pad replacement</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-sync-alt"></i>
              </div>
              <h3>Tire Rotation</h3>
              <p>Rotate tires for even wear and extend tire life</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h3>Flat Tire Repair</h3>
              <p>Professional tire patching and repair services</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-cog"></i>
              </div>
              <h3>Wheel Alignment</h3>
              <p>Precise wheel alignment for optimal handling and tire wear</p>
            </div>

            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-snowflake"></i>
              </div>
              <h3>Seasonal Tire Change</h3>
              <p>Switch between summer and winter tires seasonally</p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose AutoCare?</h2>
          
          <div className="features-grid">
            
            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Easy Scheduling</h3>
              <p>Book appointments online at your convenience</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-history"></i>
              </div>
              <h3>Service History</h3>
              <p>Keep track of all your vehicle's maintenance records</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-bell"></i>
              </div>
              <h3>Reminders</h3>
              <p>Never miss an appointment with timely notifications</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Trusted Service</h3>
              <p>Professional mechanics you can rely on</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          
          <p>Join thousands of satisfied customers who trust AutoCare</p>
          
          <button className="cta-button-large" onClick={handleGetStarted}>
            Login or Sign Up
            <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container">
          <div className="footer-links">
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToFAQ(); }} className="footer-link">
              <i className="fas fa-question-circle"></i>
              FAQ
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); handleNavigateToContact(); }} className="footer-link">
              <i className="fas fa-phone"></i>
              Contact Us
            </a>
          </div>
          
          <p className="footer-copyright">&copy; 2025 AutoCare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
