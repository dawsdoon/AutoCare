import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService } from '../services/supabase'

const Navbar = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [upcomingCount, setUpcomingCount] = useState(0)

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
      navigate('/')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Fetch upcoming appointments for notification badge
  useEffect(() => {
    if (user) {
      fetchUpcomingCount()
      // Refresh every 5 minutes
      const interval = setInterval(fetchUpcomingCount, 5 * 60 * 1000)
      return () => clearInterval(interval)
    }
  }, [user])

  const fetchUpcomingCount = async () => {
    if (!user) return
    
    try {
      const result = await AppointmentService.getUserAppointments(user.id)
      if (result.success) {
        const appointments = result.data || []
        const now = new Date()
        const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000)
        
        // Count appointments that are pending/in-progress and within 48 hours
        const upcoming = appointments.filter(apt => {
          if (apt.status === 'completed' || apt.status === 'cancelled') return false
          
          const appointmentDateTime = new Date(`${apt.appointment_date}T${apt.appointment_time}`)
          return appointmentDateTime >= now && appointmentDateTime <= in48Hours
        })
        
        setUpcomingCount(upcoming.length)
      }
    } catch (error) {
      console.error('Error fetching upcoming appointments:', error)
    }
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.nav-actions')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <nav className="navbar">
      <div 
        className="nav-logo" 
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
      <div className="nav-actions">
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
          {upcomingCount > 0 && (
            <span className="notification-badge">{upcomingCount}</span>
          )}
        </button>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
          {user && (
            <>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account'); closeMenu(); }} className="dropdown-item">
                <i className="fas fa-user"></i>
                My Account
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); closeMenu(); }} className="dropdown-item">
                <i className="fas fa-home"></i>
                Services
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/service-history'); closeMenu(); }} className="dropdown-item">
                <i className="fas fa-history"></i>
                Service History
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate('/maintenance-schedule'); closeMenu(); }} className="dropdown-item">
                <i className="fas fa-calendar-check"></i>
                Maintenance Schedule
              </a>
            </>
          )}
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/faq'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-question-circle"></i>
            FAQ
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-phone"></i>
            Contact
          </a>
          {user && user.role === 'admin' && (
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); closeMenu(); }} className="dropdown-item">
              <i className="fas fa-cog"></i>
              Admin Panel
            </a>
          )}
          {user ? (
            <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); closeMenu(); }} className="dropdown-item">
              <i className="fas fa-sign-out-alt"></i>
              Logout
            </a>
          ) : (
            <a href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); closeMenu(); }} className="dropdown-item">
              <i className="fas fa-sign-in-alt"></i>
              Login / Sign Up
            </a>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
