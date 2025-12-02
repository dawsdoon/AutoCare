import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useAuth } from '../contexts/AuthContext'
import { AppointmentService, ServicePriceService } from '../services/supabase'
import Navbar from '../components/Navbar'
import './ServiceHistory.css'

const ServiceHistory = () => {
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [viewMode, setViewMode] = useState('list') // 'list' or 'calendar'
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [rescheduleModal, setRescheduleModal] = useState(null)
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [servicePrices, setServicePrices] = useState([])
  
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchAppointments()
      fetchServicePrices()
    }
  }, [user])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      const result = await AppointmentService.getUserAppointments(user.id)
      
      if (result.success) {
        setAppointments(result.data || [])
      } else {
        setError(result.error)
        toast.error('Failed to load service history')
      }
    } catch (err) {
      setError('Failed to load service history')
      toast.error('Failed to load service history')
    } finally {
      setLoading(false)
    }
  }

  const fetchServicePrices = async () => {
    try {
      const result = await ServicePriceService.getAllPrices()
      if (result.success) {
        setServicePrices(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching service prices:', error)
    }
  }

  // Calculate total price for an appointment based on service names
  const calculateAppointmentPrice = (appointment) => {
    // Default prices (fallback if database prices not available)
    const defaultPrices = {
      'Oil Change': 29.99,
      'Brake Inspection': 49.99,
      'Tire Rotation': 39.99,
      'Flat Tire Repair': 79.99,
      'Wheel Alignment': 19.99,
      'Seasonal Tire Change': 99.99
    }

    // Service name mapping to service types
    const serviceNameToType = {
      'Oil Change': 'oil-change',
      'Brake Inspection': 'brake-inspection',
      'Tire Rotation': 'tire-rotation',
      'Flat Tire Repair': 'flat-tire-repair',
      'Wheel Alignment': 'wheel-alignment',
      'Seasonal Tire Change': 'seasonal-tire-change'
    }

    if (!appointment.service_name) return 0

    // Parse service names (they might be comma-separated)
    const serviceNames = appointment.service_name.split(',').map(s => s.trim())
    let total = 0

    serviceNames.forEach(serviceName => {
      // Try to find price from database first
      const serviceType = serviceNameToType[serviceName]
      if (serviceType) {
        const priceData = servicePrices.find(p => p.service_type === serviceType)
        if (priceData) {
          total += parseFloat(priceData.base_price)
        } else if (defaultPrices[serviceName]) {
          total += defaultPrices[serviceName]
        }
      } else if (defaultPrices[serviceName]) {
        total += defaultPrices[serviceName]
      }
    })

    return total
  }

  const handleDownloadPDF = (appointment) => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(18)
    doc.text('Service History Receipt', 105, 20, { align: 'center' })
    
    // Company Info
    doc.setFontSize(12)
    doc.text('AutoCare', 105, 30, { align: 'center' })
    doc.setFontSize(10)
    doc.text('123 AutoCare Street, Service City, SC 12345', 105, 36, { align: 'center' })
    doc.text('Phone: 111-111-1111 | Email: support@autocare.com', 105, 42, { align: 'center' })
    
    // Appointment Details
    const appointmentData = [
      ['Appointment ID', appointment.id],
      ['Date', formatDate(appointment.appointment_date)],
      ['Time', formatTime(appointment.appointment_time)],
      ['Service', appointment.service_name],
      ['Status', getStatusText(appointment.status)],
      ['Total Amount', `$${calculateAppointmentPrice(appointment).toFixed(2)}`],
      ['Customer Name', appointment.customer_name],
      ['Email', appointment.customer_email],
      ['Phone', appointment.customer_phone || 'N/A']
    ]
    
    autoTable(doc, {
      startY: 50,
      head: [['Detail', 'Information']],
      body: appointmentData,
      theme: 'striped',
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 10 }
    })
    
    // Service Description
    if (appointment.service_description) {
      doc.setFontSize(12)
      doc.text('Service Description:', 14, doc.lastAutoTable.finalY + 15)
      doc.setFontSize(10)
      const splitDescription = doc.splitTextToSize(appointment.service_description, 180)
      doc.text(splitDescription, 14, doc.lastAutoTable.finalY + 22)
    }
    
    // Notes
    if (appointment.notes) {
      doc.setFontSize(12)
      doc.text('Notes:', 14, doc.lastAutoTable.finalY + (appointment.service_description ? 35 : 22))
      doc.setFontSize(10)
      const splitNotes = doc.splitTextToSize(appointment.notes, 180)
      doc.text(splitNotes, 14, doc.lastAutoTable.finalY + (appointment.service_description ? 42 : 29))
    }
    
    // Footer
    const pageHeight = doc.internal.pageSize.height
    doc.setFontSize(8)
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, pageHeight - 10, { align: 'center' })
    
    doc.save(`service-history-${appointment.id}.pdf`)
    toast.success('PDF downloaded successfully!')
  }

  const handleDownloadAllPDF = () => {
    const appointmentsToDownload = filteredAppointments.length > 0 ? filteredAppointments : appointments
    
    if (appointmentsToDownload.length === 0) {
      toast.warning('No appointments to download')
      return
    }

    const doc = new jsPDF()
    let startY = 20

    // Title
    doc.setFontSize(18)
    doc.text(filteredAppointments.length !== appointments.length ? 'Filtered Service History' : 'Complete Service History', 105, startY, { align: 'center' })
    startY += 10

    // Company Info
    doc.setFontSize(12)
    doc.text('AutoCare', 105, startY, { align: 'center' })
    startY += 6
    doc.setFontSize(10)
    doc.text('123 AutoCare Street, Service City, SC 12345', 105, startY, { align: 'center' })
    startY += 6
    doc.text('Phone: 111-111-1111 | Email: support@autocare.com', 105, startY, { align: 'center' })
    startY += 10

    // Summary
    doc.setFontSize(12)
    doc.text(`Total Appointments: ${appointmentsToDownload.length}`, 14, startY)
    if (filteredAppointments.length !== appointments.length) {
      startY += 6
      doc.setFontSize(10)
      doc.text(`(Filtered from ${appointments.length} total appointments)`, 14, startY)
    }
    startY += 10

    // Loop through appointments
    appointmentsToDownload.forEach((appointment, index) => {
      // Check if we need a new page
      if (startY > 250) {
        doc.addPage()
        startY = 20
      }

      // Appointment Header
      doc.setFontSize(14)
      doc.text(`Appointment ${index + 1}`, 14, startY)
      startY += 8

      // Appointment Details Table
      const appointmentData = [
        ['ID', appointment.id],
        ['Date', formatDate(appointment.appointment_date)],
        ['Time', formatTime(appointment.appointment_time)],
        ['Service', appointment.service_name],
        ['Status', getStatusText(appointment.status)],
        ['Total Amount', `$${calculateAppointmentPrice(appointment).toFixed(2)}`],
        ['Customer', appointment.customer_name],
        ['Email', appointment.customer_email],
        ['Phone', appointment.customer_phone || 'N/A']
      ]

      autoTable(doc, {
        startY: startY,
        head: [['Detail', 'Information']],
        body: appointmentData,
        theme: 'striped',
        headStyles: { fillColor: [52, 152, 219] },
        styles: { fontSize: 9 },
        margin: { left: 14, right: 14 }
      })

      startY = doc.lastAutoTable.finalY + 10

      // Service Description
      if (appointment.service_description) {
        if (startY > 250) {
          doc.addPage()
          startY = 20
        }
        doc.setFontSize(11)
        doc.text('Service Description:', 14, startY)
        startY += 6
        doc.setFontSize(9)
        const splitDescription = doc.splitTextToSize(appointment.service_description, 180)
        doc.text(splitDescription, 14, startY)
        startY += splitDescription.length * 5 + 5
      }

      // Notes
      if (appointment.notes) {
        if (startY > 250) {
          doc.addPage()
          startY = 20
        }
        doc.setFontSize(11)
        doc.text('Notes:', 14, startY)
        startY += 6
        doc.setFontSize(9)
        const splitNotes = doc.splitTextToSize(appointment.notes, 180)
        doc.text(splitNotes, 14, startY)
        startY += splitNotes.length * 5 + 10
      }

      // Separator
      if (index < appointmentsToDownload.length - 1) {
        if (startY > 250) {
          doc.addPage()
          startY = 20
        } else {
          startY += 5
          doc.setLineWidth(0.5)
          doc.setDrawColor(200, 200, 200)
          doc.line(14, startY, 196, startY)
          startY += 10
        }
      }
    })

    // Footer on last page
    const pageCount = doc.internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      const pageHeight = doc.internal.pageSize.height
      doc.setFontSize(8)
      doc.text(`Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleString()}`, 105, pageHeight - 10, { align: 'center' })
    }

    doc.save(`complete-service-history-${new Date().toISOString().split('T')[0]}.pdf`)
    toast.success('Complete service history PDF downloaded successfully!')
  }

  const handleCancelAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return
    }

    try {
      const result = await AppointmentService.cancelAppointment(appointmentId)
      if (result.success) {
        toast.success('Appointment cancelled successfully')
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to cancel appointment')
      }
    } catch (error) {
      toast.error('Failed to cancel appointment')
    }
  }

  const handleRescheduleAppointment = async () => {
    if (!rescheduleData.date || !rescheduleData.time) {
      toast.error('Please select both date and time')
      return
    }

    try {
      const result = await AppointmentService.rescheduleAppointment(
        rescheduleModal.id,
        rescheduleData.date,
        rescheduleData.time
      )
      if (result.success) {
        toast.success('Appointment rescheduled successfully')
        setRescheduleModal(null)
        setRescheduleData({ date: '', time: '' })
        fetchAppointments()
      } else {
        toast.error(result.error || 'Failed to reschedule appointment')
      }
    } catch (error) {
      toast.error('Failed to reschedule appointment')
    }
  }

  const openRescheduleModal = (appointment) => {
    setRescheduleModal(appointment)
    setRescheduleData({
      date: appointment.appointment_date,
      time: appointment.appointment_time
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'status-completed'
      case 'in-progress': return 'status-in-progress'
      case 'pending': return 'status-pending'
      case 'cancelled': return 'status-cancelled'
      default: return 'status-pending'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'in-progress': return 'In Progress'
      case 'pending': return 'Scheduled'
      case 'cancelled': return 'Cancelled'
      default: return 'Scheduled'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const filteredAppointments = appointments.filter(appointment => {
    // Status filter
    if (filterStatus !== 'all' && appointment.status !== filterStatus) {
      return false
    }
    
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const serviceName = appointment.service_name?.toLowerCase() || ''
      const serviceDesc = appointment.service_description?.toLowerCase() || ''
      const customerName = appointment.customer_name?.toLowerCase() || ''
      const notes = appointment.notes?.toLowerCase() || ''
      
      if (!serviceName.includes(query) && 
          !serviceDesc.includes(query) && 
          !customerName.includes(query) &&
          !notes.includes(query)) {
        return false
      }
    }
    
    // Date range filter
    if (dateRange.start || dateRange.end) {
      const appointmentDate = new Date(appointment.appointment_date)
      appointmentDate.setHours(0, 0, 0, 0)
      
      if (dateRange.start) {
        const startDate = new Date(dateRange.start)
        startDate.setHours(0, 0, 0, 0)
        if (appointmentDate < startDate) {
          return false
        }
      }
      
      if (dateRange.end) {
        const endDate = new Date(dateRange.end)
        endDate.setHours(23, 59, 59, 999)
        if (appointmentDate > endDate) {
          return false
        }
      }
    }
    
    return true
  })
  
  const clearFilters = () => {
    setSearchQuery('')
    setDateRange({ start: '', end: '' })
    setFilterStatus('all')
  }

  const getServiceIcon = (serviceName) => {
    const name = serviceName.toLowerCase()
    if (name.includes('oil')) return 'fa-oil-can'
    if (name.includes('brake')) return 'fa-circle-notch'
    if (name.includes('tire')) return 'fa-tools'
    if (name.includes('alignment')) return 'fa-cog'
    if (name.includes('seasonal')) return 'fa-snowflake'
    return 'fa-wrench'
  }

  const getAppointmentsForDate = (date) => {
    return filteredAppointments.filter(apt => {
      const aptDate = new Date(apt.appointment_date)
      return aptDate.toDateString() === date.toDateString()
    })
  }

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate.toDateString() === date.toDateString()
      })
      if (dayAppointments.length > 0) {
        return (
          <div className="calendar-appointment-indicator">
            <span className="indicator-dot"></span>
            <span className="indicator-count">{dayAppointments.length}</span>
          </div>
        )
      }
    }
    return null
  }

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const dayAppointments = filteredAppointments.filter(apt => {
        const aptDate = new Date(apt.appointment_date)
        return aptDate.toDateString() === date.toDateString()
      })
      if (dayAppointments.length > 0) {
        return 'has-appointments'
      }
    }
    return null
  }

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <main className="main-content">
          <div className="container">
            <div className="loading-container">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading service history...</p>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <Navbar />
      
      <main className="main-content">
        <div className="container">
          <div className="service-history-header">
            <div className="header-content">
              <div>
                <h2>Service History</h2>
                <p>View your past and upcoming appointments</p>
              </div>
              {appointments.length > 0 && (
                <button 
                  className="btn-download-all"
                  onClick={handleDownloadAllPDF}
                  title="Download all service history as PDF"
                >
                  <i className="fas fa-file-pdf"></i>
                  Download All PDF
                </button>
              )}
            </div>
          </div>

          {/* Search and Filter Section */}
          {appointments.length > 0 && (
            <div className="search-filter-section">
              <div className="search-bar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search by service name, description, or notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="clear-search-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              
              <div className="date-range-filters">
                <div className="date-filter-group">
                  <label htmlFor="start-date">
                    <i className="fas fa-calendar-alt"></i>
                    From Date
                  </label>
                  <input
                    type="date"
                    id="start-date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="date-input"
                  />
                </div>
                <div className="date-filter-group">
                  <label htmlFor="end-date">
                    <i className="fas fa-calendar-alt"></i>
                    To Date
                  </label>
                  <input
                    type="date"
                    id="end-date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="date-input"
                  />
                </div>
                {(searchQuery || dateRange.start || dateRange.end || filterStatus !== 'all') && (
                  <button 
                    className="clear-filters-btn"
                    onClick={clearFilters}
                    title="Clear all filters"
                  >
                    <i className="fas fa-times-circle"></i>
                    Clear Filters
                  </button>
                )}
              </div>
              
              {filteredAppointments.length !== appointments.length && (
                <div className="filter-results-info">
                  Showing {filteredAppointments.length} of {appointments.length} appointments
                </div>
              )}
            </div>
          )}

          <div className="view-toggle">
            <button 
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
              List View
            </button>
            <button 
              className={`view-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <i className="fas fa-calendar"></i>
              Calendar View
            </button>
          </div>

          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-triangle"></i>
              {error}
            </div>
          )}

          {appointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-calendar-times"></i>
              <h3>No Service History</h3>
              <p>You haven't booked any appointments yet.</p>
              <a href="/dashboard" className="btn-primary">Book Your First Service</a>
            </div>
          ) : filteredAppointments.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-search"></i>
              <h3>No Appointments Found</h3>
              <p>No appointments match your search or filter criteria.</p>
              <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
            </div>
          ) : (
            <>
              {viewMode === 'calendar' ? (
                <div className="calendar-view">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    tileClassName={tileClassName}
                    className="appointment-calendar"
                  />
                  <div className="calendar-appointments">
                    <h3>Appointments on {selectedDate.toLocaleDateString()}</h3>
                    {getAppointmentsForDate(selectedDate).length === 0 ? (
                      <p>No appointments on this date</p>
                    ) : (
                      <div className="appointments-list">
                        {getAppointmentsForDate(selectedDate).map((appointment) => (
                          <div key={appointment.id} className="appointment-card">
                            <div className="appointment-header">
                              <div className="appointment-date">
                                <i className="fas fa-clock"></i>
                                <span>{formatTime(appointment.appointment_time)}</span>
                              </div>
                              <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                                {getStatusText(appointment.status)}
                              </div>
                            </div>
                            <div className="appointment-content">
                              <h4>{appointment.service_name}</h4>
                              <p>{appointment.service_description}</p>
                              <div className="appointment-price-calendar">
                                <i className="fas fa-dollar-sign"></i>
                                <span>${calculateAppointmentPrice(appointment).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="filter-controls">
                    <div className="filter-buttons">
                      <button 
                        className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('all')}
                      >
                        All ({appointments.length})
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('pending')}
                      >
                        Scheduled ({appointments.filter(a => a.status === 'pending').length})
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'in-progress' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('in-progress')}
                      >
                        In Progress ({appointments.filter(a => a.status === 'in-progress').length})
                      </button>
                      <button 
                        className={`filter-btn ${filterStatus === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilterStatus('completed')}
                      >
                        Completed ({appointments.filter(a => a.status === 'completed').length})
                      </button>
                    </div>
                  </div>

                  <div className="appointments-list">
                    {filteredAppointments.map((appointment) => (
                      <div key={appointment.id} className="appointment-card">
                        <div className="appointment-header">
                          <div className="appointment-date">
                            <i className="fas fa-calendar-alt"></i>
                            <div>
                              <span className="date">{formatDate(appointment.appointment_date)}</span>
                              <span className="time">{formatTime(appointment.appointment_time)}</span>
                            </div>
                          </div>
                          <div className={`appointment-status ${getStatusColor(appointment.status)}`}>
                            {getStatusText(appointment.status)}
                          </div>
                        </div>

                        <div className="appointment-content">
                          <div className="service-info">
                            <div className="service-icon">
                              <i className={`fas ${getServiceIcon(appointment.service_name)}`}></i>
                            </div>
                            <div className="service-details">
                              <h4>{appointment.service_name}</h4>
                              <p className="service-description">{appointment.service_description}</p>
                            </div>
                          </div>

                          {appointment.notes && (
                            <div className="appointment-notes">
                              <h5>Notes:</h5>
                              <p>{appointment.notes}</p>
                            </div>
                          )}

                          <div className="appointment-meta">
                            <div className="meta-item">
                              <i className="fas fa-user"></i>
                              <span>{appointment.customer_name}</span>
                            </div>
                            <div className="meta-item">
                              <i className="fas fa-envelope"></i>
                              <span>{appointment.customer_email}</span>
                            </div>
                            {appointment.customer_phone && (
                              <div className="meta-item">
                                <i className="fas fa-phone"></i>
                                <span>{appointment.customer_phone}</span>
                              </div>
                            )}
                            <div className="meta-item appointment-price">
                              <i className="fas fa-dollar-sign"></i>
                              <span>${calculateAppointmentPrice(appointment).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="appointment-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => handleDownloadPDF(appointment)}
                            title="Download this appointment as PDF"
                          >
                            <i className="fas fa-file-pdf"></i>
                            Download PDF
                          </button>
                          {(appointment.status === 'pending' || appointment.status === 'in-progress') && (
                            <>
                              <button 
                                className="btn-secondary"
                                onClick={() => openRescheduleModal(appointment)}
                              >
                                <i className="fas fa-calendar-alt"></i>
                                Reschedule
                              </button>
                              <button 
                                className="btn-danger"
                                onClick={() => handleCancelAppointment(appointment.id)}
                              >
                                <i className="fas fa-times"></i>
                                Cancel
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Reschedule Modal */}
      {rescheduleModal && (
        <div className="modal-overlay" onClick={() => setRescheduleModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reschedule Appointment</h3>
              <button className="modal-close" onClick={() => setRescheduleModal(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="reschedule-date">New Date *</label>
                <input
                  type="date"
                  id="reschedule-date"
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reschedule-time">New Time *</label>
                <select
                  id="reschedule-time"
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
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
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setRescheduleModal(null)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleRescheduleAppointment}>
                  Reschedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceHistory
