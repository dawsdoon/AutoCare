document.addEventListener('DOMContentLoaded', function() {
    setupAuth();
    setupNavigation();
    
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            try {
                await AuthService.signOut();
                localStorage.removeItem('autocare_user');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Logout error:', error);
                // Still redirect even if logout fails
                localStorage.removeItem('autocare_user');
                window.location.href = 'index.html';
            }
        });
    }

    const serviceCards = document.querySelectorAll('.service-card');
    const selectedServices = document.getElementById('selectedServices');
    const servicesList = document.getElementById('servicesList');
    const bookBtn = document.getElementById('bookBtn');
    const changeBtn = document.getElementById('changeBtn');

    let selectedServicesData = [];

    // Service data mapping
    const serviceData = {
        'oil-change': { title: 'Oil Change', info: 'Regular engine oil replacement and filter change', duration: '30-45 min' },
        'brake-inspection': { title: 'Brake Inspection', info: 'Complete brake system check and pad replacement', duration: '1-2 hours' },
        'tire-rotation': { title: 'Tire Rotation', info: 'Rotate tires for even wear and extend tire life', duration: '20-30 min' },
        'flat-tire-repair': { title: 'Flat Tire Repair', info: 'Professional tire patching and repair services', duration: '30-45 min' },
        'wheel-alignment': { title: 'Wheel Alignment', info: 'Precise wheel alignment for optimal handling and tire wear', duration: '45-60 min' },
        'seasonal-tire-change': { title: 'Seasonal Tire Change', info: 'Switch between summer and winter tires seasonally', duration: '30-45 min' }
    };

    serviceCards.forEach(card => {
        const checkbox = card.querySelector('.service-checkbox-input');
        const serviceType = card.getAttribute('data-service');
        
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                const service = {
                    type: serviceType,
                    title: serviceData[serviceType].title,
                    info: serviceData[serviceType].info,
                    duration: serviceData[serviceType].duration
                };
                selectedServicesData.push(service);
            } else {
                selectedServicesData = selectedServicesData.filter(s => s.type !== serviceType);
            }
            
            updateSelectedServicesDisplay();
        });
    });

    function updateSelectedServicesDisplay() {
        if (selectedServicesData.length > 0) {
            servicesList.innerHTML = '';
            selectedServicesData.forEach(service => {
                const serviceItem = document.createElement('div');
                serviceItem.className = 'service-item';
                serviceItem.innerHTML = `
                    <span class="service-item-name">${service.title}</span>
                    <span class="service-item-duration">${service.duration}</span>
                `;
                servicesList.appendChild(serviceItem);
            });
            selectedServices.style.display = 'block';
        } else {
            selectedServices.style.display = 'none';
        }
    }

    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (selectedServicesData.length > 0) {
                const notesTextarea = document.getElementById('serviceNotes');
                const notes = notesTextarea ? notesTextarea.value : '';
                
                const servicesToStore = selectedServicesData.map(service => ({
                    ...service,
                    notes: notes
                }));
                
                localStorage.setItem('selectedServices', JSON.stringify(servicesToStore));
                window.location.href = 'schedule.html';
            } else {
                alert('Please select at least one service first');
            }
        });
    }

    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            selectedServices.style.display = 'none';
            // Uncheck all checkboxes
            document.querySelectorAll('.service-checkbox-input').forEach(checkbox => {
                checkbox.checked = false;
            });
            selectedServicesData = [];
        });
    }

    if (document.querySelector('.dashboard')) {
        const user = localStorage.getItem('autocare_user');
        if (!user) {
            window.location.href = 'index.html';
        }
    }
});

function setupAuth() {
    const signinTab = document.getElementById('signinTab');
    const signupTab = document.getElementById('signupTab');
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const signinBtn = document.getElementById('signinBtn');
    const signupBtn = document.getElementById('signupBtn');

    if (signinTab && signupTab) {
        signinTab.addEventListener('click', function() {
            signinTab.classList.add('active');
            signupTab.classList.remove('active');
            signinForm.style.display = 'block';
            signupForm.style.display = 'none';
        });

        signupTab.addEventListener('click', function() {
            signupTab.classList.add('active');
            signinTab.classList.remove('active');
            signinForm.style.display = 'none';
            signupForm.style.display = 'block';
        });
    }

    if (signinBtn) {
        signinBtn.addEventListener('click', async function() {
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            clearErrors();
            
            if (!email || !password) {
                showError('signinError', 'Please enter both email and password');
                return;
            }
            
            // Email validation removed for testing
            
            signinBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            signinBtn.disabled = true;
            
            try {
                const result = await AuthService.signIn(email, password);
                
                if (result.success) {
                    const user = result.data.user;
                    localStorage.setItem('autocare_user', JSON.stringify({
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || 'User',
                        vehicle: {
                            make: user.user_metadata?.vehicle_make || null,
                            model: user.user_metadata?.vehicle_model || null,
                            year: user.user_metadata?.vehicle_year || null
                        }
                    }));
                    
                    window.location.href = 'home.html';
                } else {
                    showError('signinError', result.error);
                }
            } catch (error) {
                showError('signinError', 'An error occurred. Please try again.');
            } finally {
                signinBtn.innerHTML = '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
                signinBtn.disabled = false;
            }
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', async function() {
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const vehicleMake = document.getElementById('vehicleMake').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            const vehicleYear = document.getElementById('vehicleYear').value;

            clearErrors();

            // Validate name fields
            if (!firstName.trim()) {
                showError('firstNameError', 'Please enter your first name');
                return;
            }

            if (!lastName.trim()) {
                showError('lastNameError', 'Please enter your last name');
                return;
            }

            const passwordValidation = validatePassword(password);
            if (!passwordValidation.isValid) {
                showError('passwordError', passwordValidation.message);
                return;
            }

            if (password !== confirmPassword) {
                showError('confirmPasswordError', 'Passwords do not match');
                return;
            }

            signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            signupBtn.disabled = true;

            try {
                const fullName = `${firstName.trim()} ${lastName.trim()}`;
                const userData = {
                    vehicleMake: vehicleMake || null,
                    vehicleModel: vehicleModel || null,
                    vehicleYear: vehicleYear ? parseInt(vehicleYear) : null,
                    fullName: fullName
                };

                const result = await AuthService.signUp(email, password, userData);
                
                if (result.success) {
                    const user = result.data.user;
                    const userData = {
                        id: user.id,
                        email: user.email,
                        name: user.user_metadata?.full_name || fullName,
                        phone: null,
                        vehicle: {
                            make: user.user_metadata?.vehicle_make || null,
                            model: user.user_metadata?.vehicle_model || null,
                            year: user.user_metadata?.vehicle_year || null
                        }
                    };
                    
                    localStorage.setItem('autocare_user', JSON.stringify(userData));
                    
                    try {
                        await UserService.createUserProfile(user.id, {
                            fullName: userData.name,
                            phoneNumber: null,
                            vehicleMake: userData.vehicle.make,
                            vehicleModel: userData.vehicle.model,
                            vehicleYear: userData.vehicle.year
                        });
                    } catch (error) {
                        console.error('Error creating user profile:', error);
                        // Continue anyway - profile can be created later
                    }
                    
                    alert('Account created successfully! Welcome to AutoCare!');
                    window.location.href = 'home.html';
                } else {
                    showError('emailError', result.error);
                }
            } catch (error) {
                showError('emailError', 'An error occurred. Please try again.');
            } finally {
                signupBtn.innerHTML = '<span>Create Account</span><i class="fas fa-user-plus"></i>';
                signupBtn.disabled = false;
            }
        });
    }
}

// Email validation function removed for testing

function validatePassword(password) {
    if (password.length < 8) {
        return { isValid: false, message: 'Password must be at least 8 characters long' };
    }
    
    if (!/[A-Z]/.test(password)) {
        return { isValid: false, message: 'Password must contain at least 1 capital letter' };
    }
    
    if (!/\d/.test(password)) {
        return { isValid: false, message: 'Password must contain at least 1 number' };
    }
    
    return { isValid: true, message: '' };
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.classList.remove('show');
        element.textContent = '';
    });
}

function setupNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const accountBtn = document.getElementById('accountBtn');
    
    if (menuToggle && dropdownMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', function() {
            dropdownMenu.classList.remove('show');
        });
    }
    
    if (accountBtn) {
        accountBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdownMenu.classList.remove('show');
            window.location.href = 'account.html';
        });
    }
}


