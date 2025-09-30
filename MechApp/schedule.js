document.addEventListener('DOMContentLoaded', function() {
    const user = localStorage.getItem('autocare_user');
    if (!user) {
        window.location.href = 'index.html';
        return;
    }
    
    const selectedService = JSON.parse(localStorage.getItem('selectedService'));
    if (!selectedService) {
        window.location.href = 'home.html';
        return;
    }
    
    initializePage(selectedService);
    setupEventListeners();
});

function initializePage(service) {
    document.getElementById('serviceTitle').textContent = service.title;
    document.getElementById('serviceDescription').textContent = service.info;
    
    const duration = getServiceDuration(service.type);
    document.getElementById('serviceDuration').textContent = duration;
    
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

function setupEventListeners() {
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'home.html';
    });
    
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('autocare_user');
        localStorage.removeItem('selectedService');
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

function loadTimeSlots(date) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const selectedDateText = document.getElementById('selectedDateText');
    
    const dateObj = new Date(date);
    selectedDateText.textContent = dateObj.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const serviceType = JSON.parse(localStorage.getItem('selectedService')).type;
    const timeSlots = generateTimeSlots(serviceType);
    
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const bookedSlots = getBookedSlotsForDate(date, existingAppointments);
    
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

function getBookedSlotsForDate(date, appointments) {
    return appointments
        .filter(appointment => appointment.date === date && appointment.status !== 'cancelled')
        .map(appointment => appointment.time);
}

function showBookingSection(date, time) {
    const bookingSection = document.getElementById('bookingSection');
    const selectedService = JSON.parse(localStorage.getItem('selectedService'));
    
    document.getElementById('summaryService').textContent = selectedService.title;
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

function confirmBooking() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    const appointmentNotes = document.getElementById('appointmentNotes').value;
    
    if (!customerName || !customerPhone) {
        alert('Please fill in your name and phone number.');
        return;
    }
    
    const selectedSlot = document.querySelector('.time-slot.selected');
    if (!selectedSlot) {
        alert('Please select a time slot.');
        return;
    }
    
    const selectedDate = selectedSlot.dataset.date;
    const selectedTime = selectedSlot.dataset.time;
    const selectedService = JSON.parse(localStorage.getItem('selectedService'));
    
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const conflict = existingAppointments.find(appointment => 
        appointment.date === selectedDate && 
        appointment.time === selectedTime && 
        appointment.status !== 'cancelled'
    );
    
    if (conflict) {
        alert('This time slot has just been booked by another customer. Please select a different time.');
        loadTimeSlots(selectedDate);
        return;
    }
    
    const appointment = {
        id: Date.now().toString(),
        service: selectedService,
        date: selectedDate,
        time: selectedTime,
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail
        },
        notes: appointmentNotes || selectedService.notes || '',
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    const notesText = appointment.notes ? `\nNotes: ${appointment.notes}` : '';
    alert(`Appointment confirmed!\n\nService: ${selectedService.title}\nDate: ${new Date(selectedDate).toLocaleDateString()}\nTime: ${selectedTime}${notesText}\n\nWe'll contact you at ${customerPhone} to confirm.`);
    
    localStorage.removeItem('selectedService');
    window.location.href = 'home.html';
}

function setupNavigation() {
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
}
