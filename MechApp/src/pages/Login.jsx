import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'
import { UserService } from '../services/supabase'
import VehicleSelector from '../components/VehicleSelector'
import { convertVehicleDataToSupabase } from '../utils/dataMigration'
import './Login.css'

const Login = () => {
  const [activeTab, setActiveTab] = useState('signin')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Sign in form state
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  })
  
  // Sign up form state
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    year: ''
  })

  const { signIn, signUp, updateUser } = useAuth()
  const navigate = useNavigate()

  const validatePassword = (password) => {
    if (password.length < 8) {
      return { isValid: false, message: 'Password must be at least 8 characters long' }
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: 'Password must contain at least 1 capital letter' }
    }
    
    if (!/\d/.test(password)) {
      return { isValid: false, message: 'Password must contain at least 1 number' }
    }
    
    return { isValid: true, message: '' }
  }

  const showError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }))
  }

  const clearErrors = () => {
    setErrors({})
  }

  const handleVehicleChange = (vehicle) => {
    setVehicleData(vehicle)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    clearErrors()
    
    if (!signinData.email || !signinData.password) {
      showError('signinError', 'Please enter both email and password')
      return
    }
    
    setLoading(true)
    
    try {
      const result = await signIn(signinData.email, signinData.password)
      
      if (result.success) {
        // Check if user is admin and redirect accordingly
        const userRole = result.data?.user?.user_metadata?.role || 'customer'
        if (userRole === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      } else {
        showError('signinError', result.error)
      }
    } catch (error) {
      showError('signinError', 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    clearErrors()

    // Validate name fields
    if (!signupData.firstName.trim()) {
      showError('firstNameError', 'Please enter your first name')
      return
    }

    if (!signupData.lastName.trim()) {
      showError('lastNameError', 'Please enter your last name')
      return
    }

    const passwordValidation = validatePassword(signupData.password)
    if (!passwordValidation.isValid) {
      showError('passwordError', passwordValidation.message)
      return
    }

    if (signupData.password !== signupData.confirmPassword) {
      showError('confirmPasswordError', 'Passwords do not match')
      return
    }

    setLoading(true)

    try {
      const fullName = `${signupData.firstName.trim()} ${signupData.lastName.trim()}`
      const userData = {
        ...convertVehicleDataToSupabase(vehicleData),
        fullName: fullName
      }

      const result = await signUp(signupData.email, signupData.password, userData)
      
      if (result.success) {
        // Create user profile
        try {
          await UserService.createUserProfile(result.data.user.id, {
            fullName: fullName,
            phoneNumber: null,
            vehicleMake: userData.vehicleMake,
            vehicleModel: userData.vehicleModel,
            vehicleYear: userData.vehicleYear
          })
        } catch (error) {
          console.error('Error creating user profile:', error)
          // Continue anyway - profile can be created later
        }
        
        toast.success('Account created successfully! Welcome to AutoCare!')
        navigate('/dashboard')
      } else {
        showError('emailError', result.error)
      }
    } catch (error) {
      showError('emailError', 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className="container">
      <div className="auth-card">
        <div className="logo">
          <i className="fas fa-car"></i>
          <h1>AutoCare</h1>
        </div>
        <p className="subtitle">Your vehicle service management platform</p>
        
        {/* Toggle between Sign In and Sign Up */}
        <div className="auth-toggle">
          <button 
            className={`auth-tab ${activeTab === 'signin' ? 'active' : ''}`}
            onClick={() => setActiveTab('signin')}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'signup' ? 'active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>
        
        {/* Sign In Form */}
        {activeTab === 'signin' && (
          <form className="auth-form" onSubmit={handleSignIn}>
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="form-input"
                  value={signinData.email}
                  onChange={(e) => setSigninData({...signinData, email: e.target.value})}
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="form-input"
                  value={signinData.password}
                  onChange={(e) => setSigninData({...signinData, password: e.target.value})}
                />
              </div>
              {errors.signinError && (
                <div className="error-message show">{errors.signinError}</div>
              )}
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Signing In...
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <i className="fas fa-arrow-right"></i>
                </>
              )}
            </button>
          </form>
        )}
        
        {/* Sign Up Form */}
        {activeTab === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="form-row">
              <div className="form-group">
                <div className="input-container">
                  <i className="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="First Name" 
                    className="form-input" 
                    required
                    value={signupData.firstName}
                    onChange={(e) => setSignupData({...signupData, firstName: e.target.value})}
                  />
                </div>
                {errors.firstNameError && (
                  <div className="error-message show">{errors.firstNameError}</div>
                )}
              </div>
              
              <div className="form-group">
                <div className="input-container">
                  <i className="fas fa-user input-icon"></i>
                  <input 
                    type="text" 
                    placeholder="Last Name" 
                    className="form-input" 
                    required
                    value={signupData.lastName}
                    onChange={(e) => setSignupData({...signupData, lastName: e.target.value})}
                  />
                </div>
                {errors.lastNameError && (
                  <div className="error-message show">{errors.lastNameError}</div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-envelope input-icon"></i>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="form-input" 
                  required
                  value={signupData.email}
                  onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                />
              </div>
              {errors.emailError && (
                <div className="error-message show">{errors.emailError}</div>
              )}
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="form-input" 
                  required
                  value={signupData.password}
                  onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                />
              </div>
              {errors.passwordError && (
                <div className="error-message show">{errors.passwordError}</div>
              )}
            </div>
            
            <div className="form-group">
              <div className="input-container">
                <i className="fas fa-lock input-icon"></i>
                <input 
                  type="password" 
                  placeholder="Confirm Password" 
                  className="form-input" 
                  required
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                />
              </div>
              {errors.confirmPasswordError && (
                <div className="error-message show">{errors.confirmPasswordError}</div>
              )}
            </div>
            
            {/* Vehicle Information (Optional) */}
            <div className="vehicle-section">
              <h4>Vehicle Information (Optional)</h4>
              <VehicleSelector
                selectedMake={vehicleData.make}
                selectedModel={vehicleData.model}
                selectedYear={vehicleData.year}
                onSelectionChange={handleVehicleChange}
                className="signup-vehicle-selector"
              />
            </div>
            
            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <i className="fas fa-user-plus"></i>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default Login
