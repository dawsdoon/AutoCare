import React, { useState, useEffect } from 'react'
import { vehicleMakes, getModelsForMake, vehicleYears } from '../data/vehicleData'
import './VehicleSelector.css'

const VehicleSelector = ({ 
  selectedMake = '', 
  selectedModel = '', 
  selectedYear = '', 
  onSelectionChange,
  required = false,
  className = ''
}) => {
  const [availableModels, setAvailableModels] = useState([])

  // Update available models when make changes
  useEffect(() => {
    if (selectedMake) {
      const models = getModelsForMake(selectedMake)
      setAvailableModels(models)
    } else {
      setAvailableModels([])
    }
  }, [selectedMake])

  const handleMakeChange = (e) => {
    const newMake = e.target.value
    onSelectionChange({
      make: newMake,
      model: '', // Reset model when make changes
      year: ''  // Reset year when make changes
    })
  }

  const handleModelChange = (e) => {
    const newModel = e.target.value
    onSelectionChange({
      make: selectedMake,
      model: newModel,
      year: '' // Reset year when model changes
    })
  }

  const handleYearChange = (e) => {
    const newYear = e.target.value
    onSelectionChange({
      make: selectedMake,
      model: selectedModel,
      year: newYear
    })
  }

  return (
    <div className={`vehicle-selector ${className}`}>
      <div className="vehicle-selector-row">
        <div className="vehicle-selector-group">
          <label htmlFor="vehicle-make" className="vehicle-selector-label">
            Make {required && <span className="required">*</span>}
          </label>
          <select
            id="vehicle-make"
            value={selectedMake}
            onChange={handleMakeChange}
            className="vehicle-selector-select"
            required={required}
          >
            <option value="">Select Make</option>
            {vehicleMakes.map(makeOption => (
              <option key={makeOption} value={makeOption}>
                {makeOption}
              </option>
            ))}
          </select>
        </div>

        <div className="vehicle-selector-group">
          <label htmlFor="vehicle-model" className="vehicle-selector-label">
            Model {required && <span className="required">*</span>}
          </label>
          <select
            id="vehicle-model"
            value={selectedModel}
            onChange={handleModelChange}
            className="vehicle-selector-select"
            disabled={!selectedMake}
            required={required}
          >
            <option value="">Select Model</option>
            {availableModels.map(modelOption => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>

        <div className="vehicle-selector-group">
          <label htmlFor="vehicle-year" className="vehicle-selector-label">
            Year {required && <span className="required">*</span>}
          </label>
          <select
            id="vehicle-year"
            value={selectedYear}
            onChange={handleYearChange}
            className="vehicle-selector-select"
            disabled={!selectedModel}
            required={required}
          >
            <option value="">Select Year</option>
            {vehicleYears.map(yearOption => (
              <option key={yearOption} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export default VehicleSelector
