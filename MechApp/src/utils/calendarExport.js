/**
 * Calendar Export Utility
 * Generates .ics files for appointment calendar sync
 */

/**
 * Format date to iCalendar format (YYYYMMDDTHHMMSS)
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
const formatICSDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
};

/**
 * Escape special characters for iCalendar format
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
const escapeICSText = (text) => {
  if (!text) return '';
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
};

/**
 * Generate a unique identifier for the event
 * @param {string} appointmentId - Appointment ID
 * @returns {string} Unique identifier
 */
const generateUID = (appointmentId) => {
  return `appointment-${appointmentId}@autocare.app`;
};

/**
 * Create an iCalendar (.ics) file content for a single appointment
 * @param {Object} appointment - Appointment data
 * @param {Object} options - Additional options
 * @returns {string} ICS file content
 */
export const createSingleAppointmentICS = (appointment, options = {}) => {
  const {
    id,
    appointment_date,
    appointment_time,
    service_name,
    service_description,
    customer_name,
    notes
  } = appointment;

  // Parse date and time
  const [hours, minutes] = appointment_time.split(':').map(Number);
  const startDate = new Date(appointment_date);
  startDate.setHours(hours, minutes, 0, 0);
  
  // Default appointment duration: 1 hour
  const endDate = new Date(startDate.getTime() + (options.duration || 60) * 60000);
  
  // Current timestamp for DTSTAMP
  const now = new Date();
  
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AutoCare//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID(id)}`,
    `DTSTAMP:${formatICSDate(now)}`,
    `DTSTART:${formatICSDate(startDate)}`,
    `DTEND:${formatICSDate(endDate)}`,
    `SUMMARY:${escapeICSText(`AutoCare: ${service_name}`)}`,
    `DESCRIPTION:${escapeICSText(buildDescription(appointment))}`,
    `LOCATION:${escapeICSText(options.location || 'AutoCare Service Center')}`,
    'STATUS:CONFIRMED',
    // Add reminder 24 hours before
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICSText(service_name)} appointment tomorrow`,
    'END:VALARM',
    // Add reminder 1 hour before
    'BEGIN:VALARM',
    'TRIGGER:-PT1H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: ${escapeICSText(service_name)} appointment in 1 hour`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR'
  ];

  return lines.join('\r\n');
};

/**
 * Build description text for calendar event
 * @param {Object} appointment - Appointment data
 * @returns {string} Description text
 */
const buildDescription = (appointment) => {
  const parts = [
    `Service: ${appointment.service_name}`,
    '',
    'Details:',
    appointment.service_description || 'Vehicle maintenance service'
  ];
  
  if (appointment.notes) {
    parts.push('', 'Notes:', appointment.notes);
  }
  
  if (appointment.customer_name) {
    parts.push('', `Customer: ${appointment.customer_name}`);
  }
  
  if (appointment.vehicle_info) {
    parts.push(`Vehicle: ${appointment.vehicle_info}`);
  }
  
  parts.push('', 'Booked via AutoCare App');
  
  return parts.join('\\n');
};

/**
 * Create an iCalendar (.ics) file content for multiple appointments
 * @param {Array} appointments - Array of appointment data
 * @param {Object} options - Additional options
 * @returns {string} ICS file content
 */
export const createMultipleAppointmentsICS = (appointments, options = {}) => {
  const now = new Date();
  
  const eventLines = appointments.map(appointment => {
    const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
    const startDate = new Date(appointment.appointment_date);
    startDate.setHours(hours, minutes, 0, 0);
    const endDate = new Date(startDate.getTime() + (options.duration || 60) * 60000);
    
    return [
      'BEGIN:VEVENT',
      `UID:${generateUID(appointment.id)}`,
      `DTSTAMP:${formatICSDate(now)}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${escapeICSText(`AutoCare: ${appointment.service_name}`)}`,
      `DESCRIPTION:${escapeICSText(buildDescription(appointment))}`,
      `LOCATION:${escapeICSText(options.location || 'AutoCare Service Center')}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-P1D',
      'ACTION:DISPLAY',
      `DESCRIPTION:Reminder: ${escapeICSText(appointment.service_name)} appointment tomorrow`,
      'END:VALARM',
      'END:VEVENT'
    ].join('\r\n');
  });

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//AutoCare//Appointment Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:AutoCare Appointments',
    ...eventLines,
    'END:VCALENDAR'
  ];

  return lines.join('\r\n');
};

/**
 * Download an ICS file
 * @param {string} content - ICS file content
 * @param {string} filename - File name without extension
 */
export const downloadICSFile = (content, filename = 'appointment') => {
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Export a single appointment to calendar
 * @param {Object} appointment - Appointment data
 */
export const exportAppointmentToCalendar = (appointment) => {
  const icsContent = createSingleAppointmentICS(appointment);
  const serviceName = appointment.service_name.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  const date = appointment.appointment_date;
  downloadICSFile(icsContent, `autocare-${serviceName}-${date}`);
};

/**
 * Export multiple appointments to calendar
 * @param {Array} appointments - Array of appointments
 */
export const exportAllAppointmentsToCalendar = (appointments) => {
  if (appointments.length === 0) return;
  
  const icsContent = createMultipleAppointmentsICS(appointments);
  const date = new Date().toISOString().split('T')[0];
  downloadICSFile(icsContent, `autocare-appointments-${date}`);
};

/**
 * Generate Google Calendar URL for an appointment
 * @param {Object} appointment - Appointment data
 * @returns {string} Google Calendar URL
 */
export const generateGoogleCalendarURL = (appointment) => {
  const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
  const startDate = new Date(appointment.appointment_date);
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60000);
  
  const formatGoogleDate = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `AutoCare: ${appointment.service_name}`,
    dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
    details: buildDescription(appointment).replace(/\\n/g, '\n'),
    location: 'AutoCare Service Center'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generate Outlook Calendar URL for an appointment
 * @param {Object} appointment - Appointment data
 * @returns {string} Outlook Calendar URL
 */
export const generateOutlookCalendarURL = (appointment) => {
  const [hours, minutes] = appointment.appointment_time.split(':').map(Number);
  const startDate = new Date(appointment.appointment_date);
  startDate.setHours(hours, minutes, 0, 0);
  const endDate = new Date(startDate.getTime() + 60 * 60000);
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: `AutoCare: ${appointment.service_name}`,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: buildDescription(appointment).replace(/\\n/g, '\n'),
    location: 'AutoCare Service Center'
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

