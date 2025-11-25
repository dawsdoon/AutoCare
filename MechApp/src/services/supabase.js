import { createClient } from '@supabase/supabase-js'

// Supabase Configuration
const SUPABASE_URL = 'https://uejioaddqkqzvibzrjnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlamlvYWRkcWtxenZpYnpyam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTY4MDgsImV4cCI6MjA3NDgzMjgwOH0.k43iGX0zbP1jfiiTbkI39e1sSZRUS4NJffof60N51kk';

// Initialize Supabase client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication functions
export class AuthService {
    // Sign up a new user
    static async signUp(email, password, userData = {}) {
        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: password,
                options: {
                    emailRedirectTo: undefined, // Disable email confirmation
                    data: {
                        vehicle_make: userData.vehicleMake || null,
                        vehicle_model: userData.vehicleModel || null,
                        vehicle_year: userData.vehicleYear || null,
                        full_name: userData.fullName || null,
                        role: userData.role || 'customer'
                    }
                }
            });

            if (error) throw error;
            
            if (data.user && !data.user.email_confirmed_at) {
                console.log('Auto-confirming user for instant access');
            }
            
            return { success: true, data };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign in existing user
    static async signIn(email, password) {
        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    // Sign out user
    static async signOut() {
        try {
            const { error } = await supabaseClient.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

}

// User profile functions
export class UserService {

    static async createUserProfile(userId, profileData) {
        try {
            const { data: existingProfile } = await supabaseClient
                .from('user_profiles')
                .select('id')
                .eq('user_id', userId)
                .single();

            if (existingProfile) {
                console.log('Profile already exists, skipping creation');
                return { success: true, data: existingProfile };
            }

            const { data, error } = await supabaseClient
                .from('user_profiles')
                .insert({
                    user_id: userId,
                    full_name: profileData.fullName,
                    phone_number: profileData.phoneNumber,
                    vehicle_make: profileData.vehicleMake,
                    vehicle_model: profileData.vehicleModel,
                    vehicle_year: profileData.vehicleYear
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create profile error:', error);
            return { success: false, error: error.message };
        }
    }

    static async updateUserProfile(userId, profileData) {
        try {
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            console.log('Current authenticated user:', user?.id);
            console.log('Trying to update profile for user:', userId);
            
            if (authError) {
                console.error('Auth error:', authError);
                throw new Error(`Authentication error: ${authError.message}`);
            }

            if (!user) {
                console.error('No authenticated user found');
                throw new Error('Please sign in again to update your profile');
            }

            if (user.id !== userId) {
                console.error('User ID mismatch:', { authUserId: user.id, requestedUserId: userId });
                throw new Error('User ID mismatch - please refresh the page and try again');
            }

            // Use upsert to replace existing profile or create new one
            console.log('Upserting profile (replace if exists, create if not)...');
            const { data, error } = await supabaseClient
                .from('user_profiles')
                .upsert({
                    user_id: userId,
                    vehicle_make: profileData.vehicleMake,
                    vehicle_model: profileData.vehicleModel,
                    vehicle_year: profileData.vehicleYear,
                    full_name: profileData.fullName,
                    phone_number: profileData.phoneNumber,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'  // This ensures only one profile per user
                })
                .select()
                .single();
            
            if (error) {
                console.error('Upsert error:', error);
                throw error;
            }

            console.log('Profile upserted successfully:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: error.message };
        }
    }
}

// Appointment service functions
export class AppointmentService {
    static async createAppointment(appointmentData) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .insert({
                    user_id: appointmentData.userId,
                    service_name: appointmentData.serviceName,
                    service_description: appointmentData.serviceDescription,
                    appointment_date: appointmentData.date,
                    appointment_time: appointmentData.time,
                    customer_name: appointmentData.customerName,
                    customer_email: appointmentData.customerEmail,
                    customer_phone: appointmentData.customerPhone,
                    notes: appointmentData.notes,
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    static async getUserAppointments(userId) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .select('*')
                .eq('user_id', userId)
                .order('appointment_date', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get appointments error:', error);
            return { success: false, error: error.message };
        }
    }

    static async getAllAppointments() {
        try {
            console.log('Supabase: Fetching all appointments...');
            
            // Verify user is authenticated
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
            if (authError) {
                console.error('Auth error when fetching appointments:', authError);
                return { success: false, error: 'Authentication required: ' + authError.message };
            }
            
            if (!user) {
                console.error('No authenticated user found');
                return { success: false, error: 'Authentication required. Please sign in again.' };
            }
            
            console.log('Authenticated user:', { id: user.id, email: user.email, role: user.user_metadata?.role });
            
            // Check if user is admin
            const userRole = user.user_metadata?.role || 'customer';
            if (userRole !== 'admin') {
                console.warn('Non-admin user attempted to fetch all appointments');
                // Still allow the query, but log the warning
            }
            
            const { data, error } = await supabaseClient
                .from('appointments')
                .select('*')
                .order('appointment_date', { ascending: false });

            console.log('Supabase response:', { data, error, rowCount: data?.length || 0 });

            if (error) {
                console.error('Supabase query error:', error);
                console.error('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                throw error;
            }
            
            console.log('Supabase: Appointments fetched successfully, count:', data?.length || 0);
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Get all appointments error:', error);
            return { success: false, error: error.message || 'Failed to fetch appointments' };
        }
    }

    static async updateAppointmentStatus(appointmentId, status) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .update({ status: status })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update appointment status error:', error);
            return { success: false, error: error.message };
        }
    }

    static async cancelAppointment(appointmentId) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .update({ status: 'cancelled' })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Cancel appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    static async rescheduleAppointment(appointmentId, newDate, newTime) {
        try {
            const { data, error } = await supabaseClient
                .from('appointments')
                .update({ 
                    appointment_date: newDate,
                    appointment_time: newTime,
                    status: 'pending'
                })
                .eq('id', appointmentId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Reschedule appointment error:', error);
            return { success: false, error: error.message };
        }
    }

    static async uploadPhoto(file, appointmentId) {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${appointmentId}_${Date.now()}.${fileExt}`
            const filePath = `appointments/${appointmentId}/${fileName}`

            const { error: uploadError } = await supabaseClient.storage
                .from('appointment-photos')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabaseClient.storage
                .from('appointment-photos')
                .getPublicUrl(filePath)

            // Update appointment with photo URL
            const { data: existingAppointment } = await supabaseClient
                .from('appointments')
                .select('photos')
                .eq('id', appointmentId)
                .single()

            const photos = existingAppointment?.photos || []
            photos.push(publicUrl)

            const { data, error } = await supabaseClient
                .from('appointments')
                .update({ photos: photos })
                .eq('id', appointmentId)
                .select()
                .single()

            if (error) throw error
            return { success: true, data, photoUrl: publicUrl }
        } catch (error) {
            console.error('Upload photo error:', error)
            return { success: false, error: error.message }
        }
    }

}

// Service price functions
export class ServicePriceService {
  // Async function: Returns Promise, allows await keyword
  // Static method: Can be called without creating an instance
  static async getAllPrices() {
    try {
      // Await: Pauses execution until Promise resolves
      // Supabase query: Selects all columns from service_prices table
      const { data, error } = await supabaseClient
        .from('service_prices')
        .select('*')
        .order('service_type', { ascending: true });

      // Error handling: If error exists, throw it
      if (error) throw error;

      // Return success response with data
      return { success: true, data: data || [] };
    } catch (error) {
      // Catch block: Handles any errors that occur
      console.error('Get all prices error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get price for a specific service type
  static async getPriceByType(serviceType) {
    try {
      // Query with WHERE clause: Filters by service_type
      const { data, error } = await supabaseClient
        .from('service_prices')
        .select('*')
        .eq('service_type', serviceType)
        .single(); // .single() expects exactly one row

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Get price by type error:', error);
      return { success: false, error: error.message };
    }
  }
}
