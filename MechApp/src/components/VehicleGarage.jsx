import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import VehicleSelector from './VehicleSelector'
import './VehicleGarage.css'

const VehicleGarage = ({ userId, onVehicleSelect, selectedVehicleId }) => {
  const [vehicles, setVehicles] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingVehicle, setEditingVehicle] = useState(null)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    nickname: '',
    color: '',
    licensePlate: '',
    currentMileage: '',
    tireSize: '',
    oilSpec: '',
    isPrimary: false
  })
  const [saving, setSaving] = useState(false)

  // Load vehicles from localStorage
  useEffect(() => {
    if (userId) {
      loadVehicles()
    }
  }, [userId])

  const getStorageKey = () => `autocare_vehicles_${userId}`

  const loadVehicles = () => {
    try {
      const stored = localStorage.getItem(getStorageKey())
      if (stored) {
        const loadedVehicles = JSON.parse(stored)
        setVehicles(loadedVehicles)
        
        // Auto-select primary vehicle if none selected
        if (!selectedVehicleId && loadedVehicles.length > 0) {
          const primary = loadedVehicles.find(v => v.isPrimary) || loadedVehicles[0]
          onVehicleSelect?.(primary)
        }
      }
    } catch (error) {
      console.error('Error loading vehicles:', error)
    }
  }

  const saveVehicles = (updatedVehicles) => {
    try {
      localStorage.setItem(getStorageKey(), JSON.stringify(updatedVehicles))
      setVehicles(updatedVehicles)
    } catch (error) {
      console.error('Error saving vehicles:', error)
      toast.error('Failed to save vehicles')
    }
  }

  const generateId = () => `vehicle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const resetForm = () => {
    setFormData({
      make: '',
      model: '',
      year: '',
      nickname: '',
      color: '',
      licensePlate: '',
      currentMileage: '',
      tireSize: '',
      oilSpec: '',
      isPrimary: vehicles.length === 0
    })
    setEditingVehicle(null)
    setShowAddForm(false)
  }

  const handleVehicleChange = (vehicle) => {
    setFormData(prev => ({
      ...prev,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year
    }))
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.make || !formData.model || !formData.year) {
      toast.error('Please select make, model, and year')
      return
    }

    setSaving(true)
    
    try {
      let updatedVehicles = [...vehicles]
      
      if (editingVehicle) {
        // Update existing vehicle
        const index = updatedVehicles.findIndex(v => v.id === editingVehicle.id)
        if (index !== -1) {
          updatedVehicles[index] = {
            ...updatedVehicles[index],
            ...formData,
            updatedAt: new Date().toISOString()
          }
        }
        toast.success('Vehicle updated successfully!')
      } else {
        // Add new vehicle
        const newVehicle = {
          id: generateId(),
          ...formData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        // If this is marked as primary, unset others
        if (formData.isPrimary) {
          updatedVehicles = updatedVehicles.map(v => ({ ...v, isPrimary: false }))
        }
        
        updatedVehicles.push(newVehicle)
        toast.success('Vehicle added successfully!')
      }

      // If this vehicle is primary, unset others
      if (formData.isPrimary && editingVehicle) {
        updatedVehicles = updatedVehicles.map(v => ({
          ...v,
          isPrimary: v.id === editingVehicle.id ? true : false
        }))
      }

      saveVehicles(updatedVehicles)
      resetForm()
    } catch (error) {
      console.error('Error saving vehicle:', error)
      toast.error('An error occurred while saving')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (vehicle) => {
    setFormData({
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year?.toString() || '',
      nickname: vehicle.nickname || '',
      color: vehicle.color || '',
      licensePlate: vehicle.licensePlate || '',
      currentMileage: vehicle.currentMileage?.toString() || '',
      tireSize: vehicle.tireSize || '',
      oilSpec: vehicle.oilSpec || '',
      isPrimary: vehicle.isPrimary || false
    })
    setEditingVehicle(vehicle)
    setShowAddForm(true)
  }

  const handleDelete = (vehicleId) => {
    if (!window.confirm('Are you sure you want to remove this vehicle?')) {
      return
    }

    const updatedVehicles = vehicles.filter(v => v.id !== vehicleId)
    saveVehicles(updatedVehicles)
    toast.success('Vehicle removed successfully!')
    
    if (selectedVehicleId === vehicleId) {
      const newPrimary = updatedVehicles.find(v => v.isPrimary) || updatedVehicles[0] || null
      onVehicleSelect?.(newPrimary)
    }
  }

  const handleSetPrimary = (vehicleId) => {
    const updatedVehicles = vehicles.map(v => ({
      ...v,
      isPrimary: v.id === vehicleId
    }))
    saveVehicles(updatedVehicles)
    toast.success('Primary vehicle updated!')
  }

  const getVehicleDisplayName = (vehicle) => {
    if (vehicle.nickname) return vehicle.nickname
    return `${vehicle.year} ${vehicle.make} ${vehicle.model}`
  }

  const colorOptions = [
    'Black', 'White', 'Silver', 'Gray', 'Red', 'Blue', 
    'Green', 'Brown', 'Orange', 'Yellow', 'Purple', 'Gold'
  ]

  const tireSizeOptions = [
    '175/65R14', '185/65R15', '195/65R15', '205/55R16', '205/60R16',
    '215/55R17', '215/60R16', '225/45R17', '225/50R17', '225/55R17',
    '235/45R18', '235/50R18', '245/40R18', '245/45R19', '255/35R19',
    '265/35R20', '275/40R20', '285/35R21'
  ]

  const oilSpecOptions = [
    '0W-16', '0W-20', '5W-20', '5W-30', '5W-40',
    '10W-30', '10W-40', 'Dexos1 Gen 2', 'Dexos1 Gen 3',
    'Full Synthetic', 'Synthetic Blend', 'High Mileage'
  ]

  return (
    <div className="vehicle-garage">
      <div className="garage-header">
        <div className="garage-title">
          <i className="fas fa-car"></i>
          <h3>My Garage</h3>
          <span className="vehicle-count">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''}</span>
        </div>
        {!showAddForm && (
          <button 
            className="btn-add-vehicle"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i>
            Add Vehicle
          </button>
        )}
      </div>

      {/* Add/Edit Vehicle Form */}
      {showAddForm && (
        <div className="vehicle-form-container">
          <div className="vehicle-form-header">
            <h4>{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h4>
            <button className="btn-close" onClick={resetForm}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="vehicle-form">
            <div className="form-section">
              <label className="section-label">Vehicle Details *</label>
              <VehicleSelector
                selectedMake={formData.make}
                selectedModel={formData.model}
                selectedYear={formData.year}
                onSelectionChange={handleVehicleChange}
                className="garage-vehicle-selector"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nickname">Nickname (Optional)</label>
                <input
                  type="text"
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="e.g., Daily Driver, Weekend Car"
                />
              </div>
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <select
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Color</option>
                  {colorOptions.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="licensePlate">License Plate</label>
                <input
                  type="text"
                  id="licensePlate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="ABC-1234"
                />
              </div>
              <div className="form-group">
                <label htmlFor="currentMileage">Current Mileage</label>
                <input
                  type="number"
                  id="currentMileage"
                  name="currentMileage"
                  value={formData.currentMileage}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter mileage"
                  min="0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tireSize">Tire Size</label>
                <select
                  id="tireSize"
                  name="tireSize"
                  value={formData.tireSize}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Tire Size (Optional)</option>
                  {tireSizeOptions.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="oilSpec">Oil Specification</label>
                <select
                  id="oilSpec"
                  name="oilSpec"
                  value={formData.oilSpec}
                  onChange={handleInputChange}
                  className="form-input"
                >
                  <option value="">Select Oil Spec (Optional)</option>
                  {oilSpecOptions.map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isPrimary"
                  checked={formData.isPrimary}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Set as primary vehicle
              </label>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={saving}>
                {saving ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Saving...
                  </>
                ) : (
                  editingVehicle ? 'Update Vehicle' : 'Add Vehicle'
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicle List */}
      {vehicles.length === 0 && !showAddForm ? (
        <div className="empty-garage">
          <i className="fas fa-car-side"></i>
          <h4>No vehicles yet</h4>
          <p>Add your first vehicle to get started with maintenance tracking</p>
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
          >
            <i className="fas fa-plus"></i>
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div className="vehicles-list">
          {vehicles.map(vehicle => (
            <div 
              key={vehicle.id}
              className={`vehicle-card ${selectedVehicleId === vehicle.id ? 'selected' : ''} ${vehicle.isPrimary ? 'primary' : ''}`}
              onClick={() => onVehicleSelect?.(vehicle)}
            >
              <div className="vehicle-card-header">
                <div className="vehicle-icon">
                  <i className="fas fa-car"></i>
                </div>
                <div className="vehicle-info">
                  <h4>{getVehicleDisplayName(vehicle)}</h4>
                  {vehicle.nickname && (
                    <p className="vehicle-full-name">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                  )}
                </div>
                {vehicle.isPrimary && (
                  <span className="primary-badge">
                    <i className="fas fa-star"></i>
                    Primary
                  </span>
                )}
              </div>

              <div className="vehicle-details">
                {vehicle.color && (
                  <div className="detail-item">
                    <i className="fas fa-palette"></i>
                    <span>{vehicle.color}</span>
                  </div>
                )}
                {vehicle.licensePlate && (
                  <div className="detail-item">
                    <i className="fas fa-id-card"></i>
                    <span>{vehicle.licensePlate}</span>
                  </div>
                )}
                {vehicle.currentMileage && (
                  <div className="detail-item">
                    <i className="fas fa-tachometer-alt"></i>
                    <span>{parseInt(vehicle.currentMileage).toLocaleString()} miles</span>
                  </div>
                )}
                {vehicle.tireSize && (
                  <div className="detail-item">
                    <i className="fas fa-circle"></i>
                    <span>{vehicle.tireSize}</span>
                  </div>
                )}
                {vehicle.oilSpec && (
                  <div className="detail-item">
                    <i className="fas fa-oil-can"></i>
                    <span>{vehicle.oilSpec}</span>
                  </div>
                )}
              </div>

              <div className="vehicle-actions" onClick={e => e.stopPropagation()}>
                {!vehicle.isPrimary && (
                  <button
                    className="btn-icon"
                    onClick={() => handleSetPrimary(vehicle.id)}
                    title="Set as primary"
                  >
                    <i className="far fa-star"></i>
                  </button>
                )}
                <button
                  className="btn-icon"
                  onClick={() => handleEdit(vehicle)}
                  title="Edit vehicle"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  className="btn-icon btn-danger-icon"
                  onClick={() => handleDelete(vehicle.id)}
                  title="Remove vehicle"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default VehicleGarage

