// Supabase Configuration
const SUPABASE_URL = 'https://uejioaddqkqzvibzrjnb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlamlvYWRkcWtxenZpYnpyam5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNTY4MDgsImV4cCI6MjA3NDgzMjgwOH0.k43iGX0zbP1jfiiTbkI39e1sSZRUS4NJffof60N51kk';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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
                        full_name: userData.fullName || null
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

}
