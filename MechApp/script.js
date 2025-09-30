document.addEventListener('DOMContentLoaded', function() {
    setupAuth();
    setupNavigation();
    
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('autocare_user');
            window.location.href = 'index.html';
        });
    }

    const serviceCards = document.querySelectorAll('.service-card');
    const selectedService = document.getElementById('selectedService');
    const serviceName = document.getElementById('serviceName');
    const bookBtn = document.getElementById('bookBtn');
    const changeBtn = document.getElementById('changeBtn');

    let selectedServiceData = null;

    serviceCards.forEach(card => {
        const selectBtn = card.querySelector('.select-btn');
        selectBtn.addEventListener('click', function() {
            serviceCards.forEach(c => c.style.border = 'none');
            card.style.border = '2px solid #007bff';
            
            const serviceType = card.getAttribute('data-service');
            const serviceTitle = card.querySelector('h3').textContent;
            const serviceInfo = card.querySelector('p').textContent;
            
            selectedServiceData = {
                type: serviceType,
                title: serviceTitle,
                info: serviceInfo,
                notes: ''
            };
            
            serviceName.textContent = serviceTitle;
            selectedService.style.display = 'block';
        });
    });

    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (selectedServiceData) {
                const notesTextarea = document.getElementById('serviceNotes');
                if (notesTextarea) {
                    selectedServiceData.notes = notesTextarea.value;
                }
                localStorage.setItem('selectedService', JSON.stringify(selectedServiceData));
                window.location.href = 'schedule.html';
            } else {
                alert('Please select a service first');
            }
        });
    }

    if (changeBtn) {
        changeBtn.addEventListener('click', function() {
            selectedService.style.display = 'none';
            serviceCards.forEach(c => c.style.border = 'none');
            selectedServiceData = null;
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
        signinBtn.addEventListener('click', function() {
            const email = document.getElementById('signinEmail').value;
            const password = document.getElementById('signinPassword').value;
            
            clearErrors();
            
            if (!email || !password) {
                showError('signinError', 'Please enter both email and password');
                return;
            }
            
            if (!isValidEmail(email)) {
                showError('signinError', 'Please enter a valid email address');
                return;
            }
            
            const existingUsers = JSON.parse(localStorage.getItem('autocare_users') || '[]');
            const user = existingUsers.find(u => u.email === email);
            
            if (!user) {
                showError('signinError', 'User not found. Please create an account first.');
                return;
            }
            
            if (user.password !== password) {
                showError('signinError', 'Incorrect password. Please try again.');
                return;
            }
            
            localStorage.setItem('autocare_user', JSON.stringify({
                name: user.name,
                email: user.email,
                vehicle: user.vehicle,
                loginTime: new Date().toISOString()
            }));
            
            window.location.href = 'home.html';
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const vehicleMake = document.getElementById('vehicleMake').value;
            const vehicleModel = document.getElementById('vehicleModel').value;
            const vehicleYear = document.getElementById('vehicleYear').value;

            clearErrors();

            if (!isValidEmail(email)) {
                showError('emailError', 'Please enter a valid email address');
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

            const existingUsers = JSON.parse(localStorage.getItem('autocare_users') || '[]');
            if (existingUsers.find(u => u.email === email)) {
                showError('emailError', 'An account with this email already exists');
                return;
            }

            const userData = {
                name: email.split('@')[0],
                email: email,
                password: password,
                vehicle: {
                    make: vehicleMake || null,
                    model: vehicleModel || null,
                    year: vehicleYear || null
                },
                createdAt: new Date().toISOString()
            };

            existingUsers.push(userData);
            localStorage.setItem('autocare_users', JSON.stringify(existingUsers));
            
            localStorage.setItem('autocare_user', JSON.stringify({
                name: userData.name,
                email: userData.email,
                vehicle: userData.vehicle,
                loginTime: new Date().toISOString()
            }));
            
            alert('Account created successfully! Welcome to AutoCare!');
            window.location.href = 'home.html';
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

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
