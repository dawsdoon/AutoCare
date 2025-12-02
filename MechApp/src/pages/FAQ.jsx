import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './FAQ.css'

const FAQ = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.faq-nav-actions')) {
        closeMenu()
      }
    }

    document.addEventListener('click', handleClickOutside)
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])
  const faqs = [
    {
      question: "How do I add my vehicle to the system?",
      answer: "You can add your vehicle by going to the Dashboard and clicking on 'Add Vehicle'. You'll need to provide basic information like make, model, year, and VIN number."
    },
    {
      question: "What types of services can I schedule?",
      answer: "AutoCare supports various services including oil changes, tire rotations, brake inspections, engine diagnostics, transmission service, and general maintenance. You can also request custom services."
    },
    {
      question: "How do I track my vehicle's maintenance history?",
      answer: "Your vehicle's complete maintenance history is automatically tracked in your account. You can view past services, upcoming maintenance reminders, and service records in the Dashboard."
    },
    {
      question: "Is my personal information secure?",
      answer: "Absolutely. AutoCare uses industry-standard encryption and security measures to protect your personal information and vehicle data. We never share your information with third parties."
    },
    {
      question: "Can I manage multiple vehicles?",
      answer: "Yes, AutoCare supports multiple vehicles per account. You can add as many vehicles as needed and manage them all from a single dashboard."
    },
    {
      question: "How do I receive service reminders?",
      answer: "AutoCare automatically calculates service intervals based on your vehicle's mileage and time. You'll receive notifications for upcoming maintenance through the app and email reminders."
    },
    {
      question: "What if I need to cancel or reschedule an appointment?",
      answer: "You can easily cancel or reschedule appointments through the Schedule page. Simply select your appointment and choose to modify or cancel it."
    },
    {
      question: "Do I need to create an account to use AutoCare?",
      answer: "Yes, you need to create a free account to use AutoCare. This allows us to save your vehicle information and provide personalized service recommendations."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can reach our customer support team through the contact information provided in your account settings, or by using the support chat feature available in the app."
    },
    {
      question: "Is AutoCare available on mobile devices?",
      answer: "Yes, AutoCare is fully responsive and works on all devices including smartphones, tablets, and desktop computers. You can access your account from anywhere."
    }
  ]

  return (
    <div className="faq-page">
      <nav className="faq-navbar">
        <div 
          className="faq-nav-logo" 
          role="button" 
          tabIndex={0}
          onClick={() => navigate(user ? '/dashboard' : '/')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              navigate(user ? '/dashboard' : '/')
            }
          }}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-car"></i>
          <h1>AutoCare</h1>
        </div>
        
        <div className="faq-nav-actions">
          <button className="faq-menu-toggle" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </button>
          
          <div className={`faq-dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/'); closeMenu(); }} className="faq-dropdown-item">
              <i className="fas fa-home"></i>
              Home
            </a>
            
            {user && (
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); closeMenu(); }} className="faq-dropdown-item">
                <i className="fas fa-tachometer-alt"></i>
                Dashboard
              </a>
            )}
            
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/faq'); closeMenu(); }} className="faq-dropdown-item active">
              <i className="fas fa-question-circle"></i>
              FAQ
            </a>
            
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); closeMenu(); }} className="faq-dropdown-item">
              <i className="fas fa-phone"></i>
              Contact Us
            </a>
            
            {!user && (
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); closeMenu(); }} className="faq-dropdown-item">
                <i className="fas fa-sign-in-alt"></i>
                Login / Sign Up
              </a>
            )}
          </div>
        </div>
      </nav>

      <div className="faq-container">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about AutoCare</p>
        </div>
      
      <div className="faq-content">
        {faqs.map((faq, index) => (
          <div key={index} className="faq-item">
            <h3 className="faq-question">{faq.question}</h3>
            <p className="faq-answer">{faq.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="faq-footer">
        <p>Still have questions? <Link to="/contact">Contact us</Link> for more help.</p>
        <div className="contact-bar">
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <span>111-111-1111</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@autocare.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Mon-Fri: 8AM-6PM</span>
            </div>
          </div>
          <Link to="/contact" className="contact-btn">
            <i className="fas fa-phone"></i>
            Contact Us
          </Link>
        </div>
        <Link to={user ? "/dashboard" : "/"} className="back-to-dashboard">
          <i className="fas fa-arrow-left"></i>
          {user ? "Back to Dashboard" : "Back to Home"}
        </Link>
      </div>
      </div>
    </div>
  )
}

export default FAQ
