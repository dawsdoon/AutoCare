// Comprehensive vehicle data for dropdowns
export const vehicleMakes = [
  'Acura', 'Audi', 'BMW', 'Buick', 'Cadillac', 'Chevrolet', 'Chrysler', 'Dodge', 'Ford', 'GMC',
  'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'Lincoln', 'Mazda',
  'Mercedes-Benz', 'MINI', 'Mitsubishi', 'Nissan', 'Porsche', 'Ram', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen', 'Volvo'
]

export const vehicleModels = {
  'Acura': ['ILX', 'TLX', 'RDX', 'MDX', 'NSX'],
  'Audi': ['A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'Q3', 'Q5', 'Q7', 'Q8', 'TT', 'R8'],
  'BMW': ['2 Series', '3 Series', '4 Series', '5 Series', '6 Series', '7 Series', '8 Series', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'Z4', 'i3', 'i8'],
  'Buick': ['Encore', 'Envision', 'Enclave', 'LaCrosse', 'Regal'],
  'Cadillac': ['ATS', 'CT4', 'CT5', 'CT6', 'Escalade', 'XT4', 'XT5', 'XT6'],
  'Chevrolet': ['Camaro', 'Corvette', 'Cruze', 'Equinox', 'Impala', 'Malibu', 'Silverado', 'Suburban', 'Tahoe', 'Traverse', 'Trax', 'Volt', 'Bolt'],
  'Chrysler': ['300', 'Pacifica', 'Voyager'],
  'Dodge': ['Challenger', 'Charger', 'Durango', 'Grand Caravan', 'Journey'],
  'Ford': ['Bronco', 'EcoSport', 'Edge', 'Escape', 'Expedition', 'Explorer', 'F-150', 'F-250', 'F-350', 'Fiesta', 'Focus', 'Fusion', 'Mustang', 'Ranger', 'Transit'],
  'GMC': ['Acadia', 'Canyon', 'Sierra', 'Terrain', 'Yukon'],
  'Honda': ['Accord', 'Civic', 'CR-V', 'HR-V', 'Insight', 'Odyssey', 'Passport', 'Pilot', 'Ridgeline'],
  'Hyundai': ['Accent', 'Elantra', 'Ioniq', 'Kona', 'Palisade', 'Santa Fe', 'Sonata', 'Tucson', 'Veloster', 'Venue'],
  'Infiniti': ['Q50', 'Q60', 'QX50', 'QX60', 'QX80'],
  'Jaguar': ['E-PACE', 'F-PACE', 'I-PACE', 'XE', 'XF', 'XJ'],
  'Jeep': ['Cherokee', 'Compass', 'Gladiator', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  'Kia': ['Forte', 'K5', 'Niro', 'Optima', 'Seltos', 'Sorento', 'Soul', 'Sportage', 'Stinger', 'Telluride'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  'Lexus': ['ES', 'GS', 'GX', 'IS', 'LC', 'LS', 'LX', 'NX', 'RC', 'RX', 'UX'],
  'Lincoln': ['Aviator', 'Corsair', 'Continental', 'MKZ', 'Nautilus', 'Navigator'],
  'Mazda': ['CX-3', 'CX-5', 'CX-9', 'Mazda3', 'Mazda6', 'MX-5 Miata'],
  'Mercedes-Benz': ['A-Class', 'C-Class', 'CLA', 'CLS', 'E-Class', 'G-Class', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Class', 'SL', 'SLC'],
  'MINI': ['Clubman', 'Convertible', 'Countryman', 'Hardtop'],
  'Mitsubishi': ['Eclipse Cross', 'Mirage', 'Outlander', 'Outlander Sport'],
  'Nissan': ['370Z', 'Altima', 'Armada', 'Frontier', 'GT-R', 'Kicks', 'Leaf', 'Maxima', 'Murano', 'Pathfinder', 'Rogue', 'Sentra', 'Titan', 'Versa'],
  'Porsche': ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  'Ram': ['1500', '2500', '3500', 'ProMaster'],
  'Subaru': ['Ascent', 'BRZ', 'Crosstrek', 'Forester', 'Impreza', 'Legacy', 'Outback', 'WRX'],
  'Tesla': ['Model 3', 'Model S', 'Model X', 'Model Y'],
  'Toyota': ['4Runner', 'Avalon', 'Camry', 'Corolla', 'Highlander', 'Land Cruiser', 'Prius', 'RAV4', 'Sequoia', 'Sienna', 'Tacoma', 'Tundra', 'Venza'],
  'Volkswagen': ['Arteon', 'Atlas', 'Beetle', 'Golf', 'Jetta', 'Passat', 'Tiguan'],
  'Volvo': ['S60', 'S90', 'V60', 'V90', 'XC40', 'XC60', 'XC90']
}

export const vehicleYears = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i)

// Helper function to get models for a specific make
export const getModelsForMake = (make) => {
  return vehicleModels[make] || []
}

// Helper function to validate vehicle selection
export const validateVehicleSelection = (make, model, year) => {
  if (!make || !model || !year) return false
  const models = getModelsForMake(make)
  return models.includes(model) && vehicleYears.includes(year)
}
