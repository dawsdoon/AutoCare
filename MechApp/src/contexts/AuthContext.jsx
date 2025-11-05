import React, { createContext, useContext, useState, useEffect } from 'react'
import { AuthService } from '../services/supabase'
import { supabaseClient } from '../services/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check Supabase session first to ensure it's valid
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
          setLoading(false)
          return
        }

        if (session?.user) {
          // Session exists, use it
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 'User',
            role: session.user.user_metadata?.role || 'customer',
            vehicle: {
              make: session.user.user_metadata?.vehicle_make || null,
              model: session.user.user_metadata?.vehicle_model || null,
              year: session.user.user_metadata?.vehicle_year || null
            }
          }
          setUser(userData)
          localStorage.setItem('autocare_user', JSON.stringify(userData))
        } else {
          // No session, check localStorage as fallback
          const storedUser = localStorage.getItem('autocare_user')
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser))
            } catch (error) {
              console.error('Error parsing stored user:', error)
              localStorage.removeItem('autocare_user')
            }
          }
        }
      } catch (error) {
        console.error('Error checking session:', error)
        // Fallback to localStorage
        const storedUser = localStorage.getItem('autocare_user')
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser))
          } catch (parseError) {
            console.error('Error parsing stored user:', parseError)
            localStorage.removeItem('autocare_user')
          }
        }
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userData = {
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || 'User',
          role: session.user.user_metadata?.role || 'customer',
          vehicle: {
            make: session.user.user_metadata?.vehicle_make || null,
            model: session.user.user_metadata?.vehicle_model || null,
            year: session.user.user_metadata?.vehicle_year || null
          }
        }
        setUser(userData)
        localStorage.setItem('autocare_user', JSON.stringify(userData))
      } else {
        setUser(null)
        localStorage.removeItem('autocare_user')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password)
      if (result.success) {
        const userData = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.user_metadata?.full_name || 'User',
          role: result.data.user.user_metadata?.role || 'customer',
          vehicle: {
            make: result.data.user.user_metadata?.vehicle_make || null,
            model: result.data.user.user_metadata?.vehicle_model || null,
            year: result.data.user.user_metadata?.vehicle_year || null
          }
        }
        setUser(userData)
        localStorage.setItem('autocare_user', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' }
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      const result = await AuthService.signUp(email, password, userData)
      if (result.success) {
        const newUserData = {
          id: result.data.user.id,
          email: result.data.user.email,
          name: result.data.user.user_metadata?.full_name || userData.fullName,
          role: result.data.user.user_metadata?.role || 'customer',
          vehicle: {
            make: result.data.user.user_metadata?.vehicle_make || null,
            model: result.data.user.user_metadata?.vehicle_model || null,
            year: result.data.user.user_metadata?.vehicle_year || null
          }
        }
        setUser(userData)
        localStorage.setItem('autocare_user', JSON.stringify(userData))
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'An error occurred. Please try again.' }
    }
  }

  const signOut = async () => {
    try {
      await AuthService.signOut()
      setUser(null)
      localStorage.removeItem('autocare_user')
      return { success: true }
    } catch (error) {
      // Still clear local state even if logout fails
      setUser(null)
      localStorage.removeItem('autocare_user')
      return { success: true }
    }
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('autocare_user', JSON.stringify(updatedUserData))
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
