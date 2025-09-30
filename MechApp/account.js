document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('autocare_user');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const userData = JSON.parse(user);
    loadAccountData(userData);
    setupEventListeners();
});

function loadAccountData(userData) {
    document.getElementById('userName').textContent = userData.name || 'Not specified';
    document.getElementById('userEmail').textContent = userData.email || 'Not specified';
    document.getElementById('userPhone').textContent = userData.phone || 'Not specified';
    
    if (userData.vehicle) {
        document.getElementById('vehicleMake').textContent = userData.vehicle.make || 'Not specified';
        document.getElementById('vehicleModel').textContent = userData.vehicle.model || 'Not specified';
        document.getElementById('vehicleYear').textContent = userData.vehicle.year || 'Not specified';
    }
    
    loadAppointments();
}

async function loadAppointments() {
    const userData = JSON.parse(localStorage.getItem('autocare_user'));
    const appointmentsList = document.getElementById('appointmentsList');
    
    try {
        const result = await AppointmentService.getUserAppointments(userData.id);
        
        if (result.success) {
            const appointments = result.data;
            
            if (appointments.length === 0) {
                appointmentsList.innerHTML = '<p class="no-appointments">No appointments found</p>';
                return;
            }
            
            appointments.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
            
            appointmentsList.innerHTML = '';
            
            appointments.forEach(appointment => {
                const appointmentElement = document.createElement('div');
                appointmentElement.className = 'appointment-item';
                
                const appointmentDate = new Date(appointment.appointment_date).toLocaleDateString();
                const statusClass = appointment.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
                
                appointmentElement.innerHTML = `
                    <div class="appointment-header">
                        <h4>${appointment.service_name}</h4>
                        <span class="appointment-status ${statusClass}">${appointment.status}</span>
                    </div>
                    <div class="appointment-details">
                        <p><i class="fas fa-calendar"></i> ${appointmentDate}</p>
                        <p><i class="fas fa-clock"></i> ${appointment.appointment_time}</p>
                        ${appointment.notes ? `<p><i class="fas fa-sticky-note"></i> ${appointment.notes}</p>` : ''}
                    </div>
                `;
                
                appointmentsList.appendChild(appointmentElement);
            });
        } else {
            console.error('Error loading appointments:', result.error);
            appointmentsList.innerHTML = '<p class="no-appointments">Error loading appointments</p>';
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        appointmentsList.innerHTML = '<p class="no-appointments">Error loading appointments</p>';
    }
}

function setupEventListeners() {
    // Menu functionality is handled by script.js setupNavigation()
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            try {
                await AuthService.signOut();
            } catch (error) {
                console.error('Logout error:', error);
            }
            localStorage.removeItem('autocare_user');
            localStorage.removeItem('selectedService');
            window.location.href = 'index.html';
        });
    }
    
    const backToServicesBtn = document.getElementById('backToServicesBtn');
    if (backToServicesBtn) {
        backToServicesBtn.addEventListener('click', function() {
            window.location.href = 'home.html';
        });
    }
    
    const editAccountBtn = document.getElementById('editAccountBtn');
    if (editAccountBtn) {
        editAccountBtn.addEventListener('click', function() {
            showEditForm();
        });
    }
    
    const saveChangesBtn = document.getElementById('saveChangesBtn');
    if (saveChangesBtn) {
        saveChangesBtn.addEventListener('click', function() {
            saveAccountChanges();
        });
    }
    
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            hideEditForm();
        });
    }
    
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            showDeleteConfirmation();
        });
    }
}

function showEditForm() {
    const accountSection = document.querySelector('.account-section');
    const editForm = document.getElementById('editForm');
    
    if (editForm) {
        editForm.style.display = 'block';
        accountSection.style.display = 'none';
    } else {
        createEditForm();
    }
}

function hideEditForm() {
    const accountSection = document.querySelector('.account-section');
    const editForm = document.getElementById('editForm');
    
    if (editForm) {
        editForm.style.display = 'none';
        accountSection.style.display = 'grid';
    }
}

function createEditForm() {
    const userData = JSON.parse(localStorage.getItem('autocare_user'));
    
    const editFormHTML = `
        <div id="editForm" class="edit-form">
            <div class="edit-form-header">
                <h3>Edit Account Information</h3>
                <p>Update your personal and vehicle information</p>
            </div>
            
            <form class="edit-form-content">
                <div class="form-section">
                    <h4>Personal Information</h4>
                    <div class="form-group">
                        <label for="editName">Name:</label>
                        <input type="text" id="editName" value="${userData.name || ''}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="editEmail">Email:</label>
                        <input type="email" id="editEmail" value="${userData.email || ''}" class="form-input">
                    </div>
                    <div class="form-group">
                        <label for="editPhone">Phone:</label>
                        <input type="tel" id="editPhone" value="${userData.phone || ''}" class="form-input" placeholder="e.g. (555) 123-4567">
                    </div>
                </div>
                
                <div class="form-section">
                    <h4>Vehicle Information</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editVehicleMake">Make:</label>
                            <input type="text" id="editVehicleMake" value="${userData.vehicle?.make || ''}" class="form-input" placeholder="e.g. Toyota">
                        </div>
                        <div class="form-group">
                            <label for="editVehicleModel">Model:</label>
                            <input type="text" id="editVehicleModel" value="${userData.vehicle?.model || ''}" class="form-input" placeholder="e.g. Camry">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="editVehicleYear">Year:</label>
                        <input type="number" id="editVehicleYear" value="${userData.vehicle?.year || ''}" class="form-input" placeholder="e.g., 2020" min="1900" max="2025">
                    </div>
                </div>
                
                <div class="edit-form-actions">
                    <button type="button" id="saveChangesBtn" class="btn-primary">
                        <i class="fas fa-save"></i>
                        Save Changes
                    </button>
                    <button type="button" id="cancelEditBtn" class="btn-secondary">
                        <i class="fas fa-times"></i>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    `;
    
    const container = document.querySelector('.container');
    const welcomeSection = document.querySelector('.welcome-section');
    welcomeSection.insertAdjacentHTML('afterend', editFormHTML);
    
    const accountSection = document.querySelector('.account-section');
    accountSection.style.display = 'none';
    
    setupEventListeners();
}

async function saveAccountChanges() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
    const phone = document.getElementById('editPhone').value;
    const vehicleMake = document.getElementById('editVehicleMake').value;
    const vehicleModel = document.getElementById('editVehicleModel').value;
    const vehicleYear = document.getElementById('editVehicleYear').value;
    
    if (!name || !email) {
        alert('Please fill in your name and email address.');
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('autocare_user'));
    
    const saveBtn = document.getElementById('saveChangesBtn');
    const originalText = saveBtn.innerHTML;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    try {
        // First, try to refresh the session if needed
        const refreshResult = await AuthService.refreshSession();
        if (!refreshResult.success) {
            console.warn('Session refresh failed, continuing anyway...');
        }

        const profileData = {
            fullName: name,
            phoneNumber: phone || null,
            vehicleMake: vehicleMake || null,
            vehicleModel: vehicleModel || null,
            vehicleYear: vehicleYear ? parseInt(vehicleYear) : null
        };
        
        const result = await UserService.updateUserProfile(userData.id, profileData);
        
        if (result.success) {
            userData.name = name;
            userData.email = email;
            userData.phone = phone;
            userData.vehicle = {
                make: vehicleMake || null,
                model: vehicleModel || null,
                year: vehicleYear || null
            };
            
            localStorage.setItem('autocare_user', JSON.stringify(userData));
            
            alert('Account updated successfully!');
            
            hideEditForm();
            loadAccountData(userData);
        } else {
            if (result.error.includes('not authenticated') || result.error.includes('Authentication error')) {
                alert('Your session has expired. Please sign out and sign in again.');
                // Optionally redirect to login
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            } else {
                alert(`Error updating profile: ${result.error}`);
            }
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        if (error.message.includes('not authenticated') || error.message.includes('Authentication error')) {
            alert('Your session has expired. Please sign out and sign in again.');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            alert('An error occurred while updating your profile. Please try again.');
        }
    } finally {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
    }
}

function showDeleteConfirmation() {
    const confirmed = confirm(
        'WARNING: This will permanently delete your account and all data!\n\n' +
        'This action cannot be undone. Are you sure you want to delete your account?\n\n' +
        'Type "DELETE" to confirm:'
    );
    
    if (confirmed) {
        const deleteText = prompt('Type "DELETE" to confirm account deletion:');
        if (deleteText === 'DELETE') {
            deleteAccount();
        } else {
            alert('Account deletion cancelled.');
        }
    }
}

async function deleteAccount() {
    const userData = JSON.parse(localStorage.getItem('autocare_user'));
    
    const deleteBtn = document.getElementById('deleteAccountBtn');
    const originalText = deleteBtn.innerHTML;
    deleteBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Deleting...';
    deleteBtn.disabled = true;
    
    try {
        // Delete user profile from Supabase
        const profileResult = await UserService.deleteUserProfile(userData.id);
        if (!profileResult.success) {
            console.warn('Error deleting profile:', profileResult.error);
        }
        
        // Delete user appointments from Supabase
        const appointmentsResult = await AppointmentService.deleteUserAppointments(userData.id);
        if (!appointmentsResult.success) {
            console.warn('Error deleting appointments:', appointmentsResult.error);
        }
        
        const accountResult = await AuthService.deleteUserAccount(userData.id);
        if (!accountResult.success) {
            console.warn('Cannot delete user account:', accountResult.error);
            alert('IMPORTANT: Your data has been deleted, but the account still exists.\n\n' +
                  'To completely delete the account, please contact support or use the Supabase dashboard.\n\n' +
                  'Your profile and appointments have been removed from the system.');
        } else {
            alert('Account completely deleted from the system.');
        }
        
        // Sign out from Supabase
        await AuthService.signOut();
        
        localStorage.removeItem('autocare_user');
        localStorage.removeItem('selectedService');
        localStorage.removeItem('appointments');
        localStorage.removeItem('autocare_users');
        
        alert('Account deleted successfully. You will be redirected to the login page.');
        
        // Redirect to login page
        window.location.href = 'index.html';
        
    } catch (error) {
        console.error('Error deleting account:', error);
        alert('Error deleting account. Please try again or contact support.');
    } finally {
        deleteBtn.innerHTML = originalText;
        deleteBtn.disabled = false;
    }
}
