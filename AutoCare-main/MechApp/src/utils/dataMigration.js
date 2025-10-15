// Helper functions for data migration and conversion

export const convertVehicleDataFromSupabase = (user) => {
  // Convert Supabase vehicle data to component format
  return {
    make: user.vehicle?.make || '',
    model: user.vehicle?.model || '',
    year: user.vehicle?.year ? user.vehicle.year.toString() : ''
  }
}

export const convertVehicleDataToSupabase = (vehicleData) => {
  // Convert component vehicle data to Supabase format
  return {
    vehicleMake: vehicleData.make || null,
    vehicleModel: vehicleData.model || null,
    vehicleYear: vehicleData.year ? parseInt(vehicleData.year) : null
  }
}

export const validateVehicleData = (vehicleData) => {
  // Validate that vehicle data is properly formatted
  return {
    hasMake: !!vehicleData.make,
    hasModel: !!vehicleData.model,
    hasYear: !!vehicleData.year,
    isValidYear: vehicleData.year ? !isNaN(parseInt(vehicleData.year)) : true
  }
}
