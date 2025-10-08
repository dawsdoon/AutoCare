import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Navbar = () => {
  const { signOut } = useAuth()
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
      <div className="nav-logo">
        <i className="fas fa-car"></i>
        <h1>AutoCare</h1>
      </div>
      <div className="nav-actions">
        <button className="menu-toggle" onClick={toggleMenu}>
          <i className="fas fa-bars"></i>
        </button>
        <div className={`dropdown-menu ${isMenuOpen ? 'show' : ''}`}>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/account'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-user"></i>
            My Account
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-home"></i>
            Services
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/faq'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-question-circle"></i>
            FAQ
          </a>
          <a href="#" onClick={(e) => { e.preventDefault(); navigate('/contact'); closeMenu(); }} className="dropdown-item">
            <i className="fas fa-phone"></i>
            Contact
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

export default Navbar
