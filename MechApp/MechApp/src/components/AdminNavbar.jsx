import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './AdminNavbar.css'

const AdminNavbar = () => {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  // Close menu when clicking outside
  React.useEffect(() => {
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
    <nav className="admin-navbar">
      <div 
        className="nav-logo" 
        role="button" 
        tabIndex={0}
        onClick={() => navigate('/admin')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            navigate('/admin')
          }
        }}
        style={{ cursor: 'pointer' }}
      >
        <i className="fas fa-cog"></i>
        <h1>Admin Panel</h1>
      </div>
      <div className="nav-actions">
        <div className="admin-user-info">
          <span className="admin-welcome">Welcome, {user?.name || 'Admin'}</span>
        </div>
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-tachometer-alt"></i>
            Dashboard
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/admin/appointments'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-calendar-check"></i>
            Appointments
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </a>
        </div>
      </div>
    </nav>
  )
}

export default AdminNavbar
