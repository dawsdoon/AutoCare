document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('autocare_user');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices'));
    if (!selectedServices || selectedServices.length === 0) {
        window.location.href = 'home.html';
        return;
    }
    
    initializePage(selectedServices);
    setupEventListeners();
});

function initializePage(services) {
    if (services.length === 1) {
        document.getElementById('serviceTitle').textContent = services[0].title;
        document.getElementById('serviceDescription').textContent = services[0].info;
    } else {
        document.getElementById('serviceTitle').textContent = `${services.length} Services Selected`;
        document.getElementById('serviceDescription').textContent = services.map(s => s.title).join(', ');
    }
    
    const totalDuration = calculateTotalDuration(services);
    document.getElementById('serviceDuration').textContent = totalDuration;
    
    populateUserInfo();
    
    loadTimeSlots('2024-01-15');
}

function getServiceDuration(serviceType) {
    const durations = {
        'oil-change': '30-45 min',
        'brake-inspection': '1-2 hours',
        'tire-rotation': '20-30 min',
        'flat-tire-repair': '30-45 min',
        'wheel-alignment': '45-60 min',
        'seasonal-tire-change': '30-45 min'
    };
    return durations[serviceType] || '30 min';
}

function calculateTotalDuration(services) {
    // For multiple services, show estimated total time
    if (services.length === 1) {
        return getServiceDuration(services[0].type);
    } else {
        return `~${services.length * 45} min (estimated)`;
    }
}

function populateUserInfo() {
    const user = JSON.parse(localStorage.getItem('autocare_user'));
    if (user) {
        // Pre-populate the form fields with user data
        document.getElementById('customerName').value = user.name || '';
        document.getElementById('customerEmail').value = user.email || '';
        document.getElementById('customerPhone').value = user.phone || '';
        
        // Make name and email read-only since user is logged in
        document.getElementById('customerName').readOnly = true;
        document.getElementById('customerEmail').readOnly = true;
        
        document.getElementById('customerName').style.backgroundColor = '#f5f5f5';
        document.getElementById('customerEmail').style.backgroundColor = '#f5f5f5';
    }
}

function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'home.html';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', async function() {
        try {
            await AuthService.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        }
        localStorage.removeItem('autocare_user');
        localStorage.removeItem('selectedServices');
        window.location.href = 'index.html';
    });
    
    setupNavigation();
    
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const selectedDate = this.dataset.date;
            loadTimeSlots(selectedDate);
            
            document.getElementById('bookingSection').style.display = 'none';
        });
    });
    
    document.getElementById('confirmBooking').addEventListener('click', function() {
        confirmBooking();
    });
    
    document.getElementById('changeTime').addEventListener('click', function() {
        document.getElementById('bookingSection').style.display = 'none';
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });
    });
}

async function loadTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedDateText = document.getElementById('selectedDateText');
    
    const dateObj = new Date(date);
    selectedDateText.textContent = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices'));
    const serviceType = selectedServices[0].type; // Use first service for time slot generation
    const timeSlots = generateTimeSlots(serviceType);
    
    const bookedSlotsResult = await AppointmentService.getAvailableTimeSlots(date);
    const bookedSlots = bookedSlotsResult.success ? bookedSlotsResult.data : [];
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(slot => {
        const slotElement = document.createElement('button');
        const isBooked = bookedSlots.includes(slot);
        
        slotElement.className = isBooked ? 'time-slot booked' : 'time-slot';
        slotElement.textContent = slot;
        slotElement.dataset.time = slot;
        slotElement.dataset.date = date;
        slotElement.disabled = isBooked;
        
        if (isBooked) {
            slotElement.title = 'This time slot is already booked';
        }
        
        slotElement.addEventListener('click', function() {
            if (!isBooked) {
                document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
                showBookingSection(date, slot);
            }
        });
        
        timeSlotsContainer.appendChild(slotElement);
    });
}
function generateTimeSlots(serviceType) {
    const slotConfigs = {
        'oil-change': ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'],
        'brake-inspection': ['9:00 AM', '1:00 PM', '3:00 PM'],
        'tire-rotation': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
        'flat-tire-repair': ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'],
        'wheel-alignment': ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
        'seasonal-tire-change': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
    };
    
    return slotConfigs[serviceType] || ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
}


function showBookingSection(date, time) {
    const bookingSection = document.getElementById('bookingSection');
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices'));
    
    if (selectedServices.length === 1) {
        document.getElementById('summaryService').textContent = selectedServices[0].title;
    } else {
        document.getElementById('summaryService').textContent = `${selectedServices.length} Services: ${selectedServices.map(s => s.title).join(', ')}`;
    }
    
    document.getElementById('summaryDate').textContent = new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    document.getElementById('summaryTime').textContent = time;
    
    bookingSection.style.display = 'block';
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

async function confirmBooking() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const appointmentNotes = document.getElementById('appointmentNotes').value;
    
    if (!customerPhone) {
        alert('Please provide your phone number.');
        return;
    }
    
    const selectedSlot = document.querySelector('.time-slot.selected');
    if (!selectedSlot) {
        alert('Please select a time slot.');
        return;
    }
    
    const selectedDate = selectedSlot.dataset.date;
    const selectedTime = selectedSlot.dataset.time;
    const selectedServices = JSON.parse(localStorage.getItem('selectedServices'));
    const userData = JSON.parse(localStorage.getItem('autocare_user'));
    
    const confirmBtn = document.getElementById('confirmBooking');
    const originalText = confirmBtn.innerHTML;
    confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...';
    confirmBtn.disabled = true;
    
    try {
        const serviceNames = selectedServices.map(s => s.title).join(', ');
        const serviceDescriptions = selectedServices.map(s => s.info).join('; ');
        
        const appointmentData = {
            userId: userData.id,
            serviceName: serviceNames,
            serviceDescription: serviceDescriptions,
            date: selectedDate,
            time: selectedTime,
            customerName: customerName,
            customerEmail: customerEmail,
            customerPhone: customerPhone,
            notes: appointmentNotes || selectedServices[0]?.notes || ''
        };
        
        const result = await AppointmentService.createAppointment(appointmentData);
        
        if (result.success) {
            const notesText = appointmentData.notes ? `\nNotes: ${appointmentData.notes}` : '';
            const servicesText = selectedServices.length === 1 ? 
                `Service: ${serviceNames}` : 
                `Services: ${serviceNames}`;
            
            alert(`Appointment confirmed!\n\n${servicesText}\nDate: ${new Date(selectedDate).toLocaleDateString()}\nTime: ${selectedTime}${notesText}\n\nWe'll contact you at ${customerPhone} to confirm.`);
            
            localStorage.removeItem('selectedServices');
            window.location.href = 'home.html';
        } else {
            alert(`Error creating appointment: ${result.error}`);
        }
    } catch (error) {
        console.error('Booking error:', error);
        alert('An error occurred while booking your appointment. Please try again.');
    } finally {
        confirmBtn.innerHTML = originalText;
        confirmBtn.disabled = false;
    }
}

