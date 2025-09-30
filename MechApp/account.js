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
    
    const memberSince = userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Unknown';
    document.getElementById('memberSince').textContent = memberSince;
    
    if (userData.vehicle) {
        document.getElementById('vehicleMake').textContent = userData.vehicle.make || 'Not specified';
        document.getElementById('vehicleModel').textContent = userData.vehicle.model || 'Not specified';
        document.getElementById('vehicleYear').textContent = userData.vehicle.year || 'Not specified';
    }
    
    loadAppointments();
}

function loadAppointments() {
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="no-appointments">No appointments found</p>';
        return;
    }
    
    appointments.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
        const appointmentElement = document.createElement('div');
        appointmentElement.className = 'appointment-item';
        
        const appointmentDate = new Date(appointment.date).toLocaleDateString();
        const statusClass = appointment.status === 'confirmed' ? 'status-confirmed' : 'status-pending';
        
        appointmentElement.innerHTML = `
            <div class="appointment-header">
                <h4>${appointment.service.title}</h4>
                <span class="appointment-status ${statusClass}">${appointment.status}</span>
            </div>
            <div class="appointment-details">
                <p><i class="fas fa-calendar"></i> ${appointmentDate}</p>
                <p><i class="fas fa-clock"></i> ${appointment.time}</p>
                ${appointment.notes ? `<p><i class="fas fa-sticky-note"></i> ${appointment.notes}</p>` : ''}
            </div>
        `;
        
        appointmentsList.appendChild(appointmentElement);
    });
}

function setupEventListeners() {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }
    
    const accountBtn = document.getElementById('accountBtn');
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.remove('show');
        });
    }
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
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
                </div>
                
                <div class="form-section">
                    <h4>Vehicle Information</h4>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="editVehicleMake">Make:</label>
                            <input type="text" id="editVehicleMake" value="${userData.vehicle?.make || ''}" class="form-input" placeholder="e.g., Toyota">
                        </div>
                        <div class="form-group">
                            <label for="editVehicleModel">Model:</label>
                            <input type="text" id="editVehicleModel" value="${userData.vehicle?.model || ''}" class="form-input" placeholder="e.g., Camry">
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

function saveAccountChanges() {
    const name = document.getElementById('editName').value;
    const email = document.getElementById('editEmail').value;
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
    
    userData.name = name;
    userData.email = email;
    userData.vehicle = {
        make: vehicleMake || null,
        model: vehicleModel || null,
        year: vehicleYear || null
    };
    
    localStorage.setItem('autocare_user', JSON.stringify(userData));
    
    const existingUsers = JSON.parse(localStorage.getItem('autocare_users') || '[]');
    const userIndex = existingUsers.findIndex(u => u.email === userData.email);
    if (userIndex !== -1) {
        existingUsers[userIndex] = userData;
        localStorage.setItem('autocare_users', JSON.stringify(existingUsers));
    }
    
    alert('Account updated successfully!');
    
    hideEditForm();
    loadAccountData(userData);
}
