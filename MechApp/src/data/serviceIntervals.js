/**
 * Service interval configurations
 * Defines recommended maintenance intervals for different services
 */

export const serviceIntervals = {
  'oil-change': {
    serviceName: 'Oil Change',
    timeInterval: 3, // months
    mileageInterval: 3000, // miles
    priority: 'high',
    description: 'Regular engine oil replacement and filter change'
  },
  'tire-rotation': {
    serviceName: 'Tire Rotation',
    timeInterval: 6, // months
    mileageInterval: 6000, // miles
    priority: 'medium',
    description: 'Rotate tires for even wear and extend tire life'
  },
  'brake-inspection': {
    serviceName: 'Brake Inspection',
    timeInterval: 12, // months
    mileageInterval: 12000, // miles
    priority: 'high',
    description: 'Complete brake system check and pad replacement'
  },
  'wheel-alignment': {
    serviceName: 'Wheel Alignment',
    timeInterval: 12, // months
    mileageInterval: 12000, // miles
    priority: 'medium',
    description: 'Precise wheel alignment for optimal handling and tire wear'
  },
  'flat-tire-repair': {
    serviceName: 'Tire Inspection',
    timeInterval: 6, // months
    mileageInterval: 6000, // miles
    priority: 'low',
    description: 'Professional tire inspection and repair services'
  },
  'seasonal-tire-change': {
    serviceName: 'Seasonal Tire Change',
    timeInterval: 6, // months (seasonal)
    mileageInterval: null, // not mileage-based
    priority: 'medium',
    description: 'Switch between summer and winter tires seasonally'
  }
}

/**
 * Get service interval configuration by service type
 */
export const getServiceInterval = (serviceType) => {
  return serviceIntervals[serviceType] || null
}

/**
 * Get all service intervals
 */
export const getAllServiceIntervals = () => {
  return serviceIntervals
}

