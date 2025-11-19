/**
 * Utility functions for calculating maintenance schedule
 */

/**
 * Calculate days between two dates
 */
const daysBetween = (date1, date2) => {
  const oneDay = 24 * 60 * 60 * 1000 // hours*minutes*seconds*milliseconds
  const firstDate = new Date(date1)
  const secondDate = new Date(date2)
  return Math.round(Math.abs((firstDate - secondDate) / oneDay))
}

/**
 * Calculate months between two dates
 */
const monthsBetween = (date1, date2) => {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const years = d2.getFullYear() - d1.getFullYear()
  const months = d2.getMonth() - d1.getMonth()
  return years * 12 + months
}

/**
 * Calculate next due date based on time interval
 * @param {Date|string} lastServiceDate - Date of last service
 * @param {number} monthsInterval - Number of months between services
 * @returns {Date} Next due date
 */
export const calculateTimeBasedDueDate = (lastServiceDate, monthsInterval) => {
  if (!lastServiceDate) return null
  
  const lastDate = new Date(lastServiceDate)
  const dueDate = new Date(lastDate)
  dueDate.setMonth(dueDate.getMonth() + monthsInterval)
  return dueDate
}

/**
 * Calculate next due mileage based on mileage interval
 * @param {number} lastServiceMileage - Mileage at last service
 * @param {number} mileageInterval - Miles between services
 * @returns {number} Next due mileage
 */
export const calculateMileageBasedDueMileage = (lastServiceMileage, mileageInterval) => {
  if (!lastServiceMileage || !mileageInterval) return null
  return lastServiceMileage + mileageInterval
}

/**
 * Check if service is due based on time
 * @param {Date|string} lastServiceDate - Date of last service
 * @param {number} monthsInterval - Number of months between services
 * @returns {Object} Status information
 */
export const checkTimeBasedStatus = (lastServiceDate, monthsInterval) => {
  if (!lastServiceDate || !monthsInterval) {
    return { isDue: false, status: 'unknown', daysUntil: null }
  }

  const dueDate = calculateTimeBasedDueDate(lastServiceDate, monthsInterval)
  const today = new Date()
  const daysUntil = daysBetween(today, dueDate)
  
  let status = 'upcoming'
  let isDue = false

  if (daysUntil <= 0) {
    status = 'overdue'
    isDue = true
  } else if (daysUntil <= 30) {
    status = 'due-soon'
    isDue = true
  } else if (daysUntil <= 60) {
    status = 'approaching'
  }

  return {
    isDue,
    status,
    daysUntil: Math.abs(daysUntil),
    dueDate
  }
}

/**
 * Check if service is due based on mileage
 * @param {number} lastServiceMileage - Mileage at last service
 * @param {number} currentMileage - Current vehicle mileage
 * @param {number} mileageInterval - Miles between services
 * @returns {Object} Status information
 */
export const checkMileageBasedStatus = (lastServiceMileage, currentMileage, mileageInterval) => {
  if (!lastServiceMileage || !currentMileage || !mileageInterval) {
    return { isDue: false, status: 'unknown', milesUntil: null }
  }

  const dueMileage = calculateMileageBasedDueMileage(lastServiceMileage, mileageInterval)
  const milesUntil = dueMileage - currentMileage
  
  let status = 'upcoming'
  let isDue = false

  if (milesUntil <= 0) {
    status = 'overdue'
    isDue = true
  } else if (milesUntil <= 500) {
    status = 'due-soon'
    isDue = true
  } else if (milesUntil <= 1000) {
    status = 'approaching'
  }

  return {
    isDue,
    status,
    milesUntil: Math.abs(milesUntil),
    dueMileage
  }
}

/**
 * Get overall status for a service (combines time and mileage)
 * @param {Object} serviceInterval - Service interval configuration
 * @param {Date|string} lastServiceDate - Date of last service
 * @param {number} lastServiceMileage - Mileage at last service
 * @param {number} currentMileage - Current vehicle mileage
 * @returns {Object} Combined status information
 */
export const getServiceStatus = (serviceInterval, lastServiceDate, lastServiceMileage, currentMileage) => {
  const timeStatus = serviceInterval.timeInterval 
    ? checkTimeBasedStatus(lastServiceDate, serviceInterval.timeInterval)
    : { isDue: false, status: 'unknown', daysUntil: null, dueDate: null }

  const mileageStatus = serviceInterval.mileageInterval && lastServiceMileage && currentMileage
    ? checkMileageBasedStatus(lastServiceMileage, currentMileage, serviceInterval.mileageInterval)
    : { isDue: false, status: 'unknown', milesUntil: null, dueMileage: null }

  // Determine overall status (if either time or mileage says it's due, it's due)
  const isDue = timeStatus.isDue || mileageStatus.isDue
  
  // Priority: overdue > due-soon > approaching > upcoming
  let overallStatus = 'upcoming'
  if (timeStatus.status === 'overdue' || mileageStatus.status === 'overdue') {
    overallStatus = 'overdue'
  } else if (timeStatus.status === 'due-soon' || mileageStatus.status === 'due-soon') {
    overallStatus = 'due-soon'
  } else if (timeStatus.status === 'approaching' || mileageStatus.status === 'approaching') {
    overallStatus = 'approaching'
  }

  return {
    isDue,
    status: overallStatus,
    timeStatus,
    mileageStatus,
    priority: serviceInterval.priority
  }
}

/**
 * Format date for display
 */
export const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

/**
 * Format relative date (e.g., "in 15 days" or "15 days ago")
 */
export const formatRelativeDate = (days) => {
  if (days === null || days === undefined) return 'N/A'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days === -1) return 'Yesterday'
  if (days > 0) return `in ${days} days`
  return `${Math.abs(days)} days ago`
}

