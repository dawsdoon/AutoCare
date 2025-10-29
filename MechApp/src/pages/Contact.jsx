import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './Contact.css'

const Contact = () => {
const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
})

const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
    ...prev,
    [name]: value
    }))
}

const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your message! We will get back to you soon.')
    setFormData({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
    })
}

return (
    <div className="contact-page">
    <Navbar />
    
    <main className="contact-main">
        <div className="contact-container">
        <div className="contact-header">
            <h1>Contact Us</h1>
            <p>Get in touch with our AutoCare team for support, questions, or feedback</p>
        </div>
        
        <div className="contact-content">
            <div className="contact-info">
            <div className="info-section">
                <h3>Get in Touch</h3>
                <div className="contact-details">
                <div className="contact-item">
                    <i className="fas fa-phone"></i>
                    <div>
                    <strong>Phone</strong>
                    <p>111-111-1111</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                    <strong>Email</strong>
                    <p>support@autocare.com</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <i className="fas fa-clock"></i>
                    <div>
                    <strong>Business Hours</strong>
                    <p>Monday - Friday: 8:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 4:00 PM<br />
                    Sunday: Closed</p>
                    </div>
                </div>
                
                <div className="contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                    <strong>Address</strong>
                    <p>123 AutoCare Street<br />
                    Service City, SC 12345</p>
                    </div>
                </div>
                </div>
            </div>
            <div className="info-section">
                <h3>Quick Support</h3>
                <p>For immediate assistance with your vehicle service needs, our support team is available during business hours.</p>
                <div className="support-links">
                <Link to="/faq" className="support-link">
                    <i className="fas fa-question-circle"></i>
                    View FAQ
                </Link>
                <Link to="/dashboard" className="support-link">
                    <i className="fas fa-calendar"></i>
                    Schedule Service
                </Link>
                </div>
            </div>
            </div>
            
            <div className="contact-form-section">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="name">Full Name *</label>
                    <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    />
                </div>
                </div>
                
                <div className="form-row">
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="subject">Subject *</label>
                    <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="service">Service Question</option>
                    <option value="appointment">Appointment Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                    </select>
                </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Please describe your question or concern in detail..."
                    required
                ></textarea>
                </div>
                
                <button type="submit" className="submit-btn">
                <i className="fas fa-paper-plane"></i>
                Send Message
                </button>
            </form>
            </div>
        </div>
        </div>
    </main>
    </div>
)
}

export default Contact
