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
    document.getElementById('servicePrice').textContent = service.price;
    
    const duration = getServiceDuration(service.type);
    document.getElementById('serviceDuration').textContent = duration;
    
    loadTimeSlots('2024-01-15');
}

function getServiceDuration(serviceType) {
    const durations = {
        'oil-change': '30-45 min',
        'brake-inspection': '1-2 hours',
        'tire-rotation': '20-30 min'
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
    
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const selectedDate = this.dataset.date;
            loadTimeSlots(selectedDate);
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
    
    timeSlotsContainer.innerHTML = '';
    
    timeSlots.forEach(slot => {
        const slotElement = document.createElement('button');
        slotElement.className = 'time-slot';
        slotElement.textContent = slot;
        slotElement.dataset.time = slot;
        slotElement.dataset.date = date;
        
        slotElement.addEventListener('click', function() {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('selected'));
            this.classList.add('selected');
            showBookingSection(date, slot);
        });
        
        timeSlotsContainer.appendChild(slotElement);
    });
}
// change to dynamic time slots eventually
function generateTimeSlots(serviceType) {
    const slotConfigs = {
        'oil-change': ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'],
        'brake-inspection': ['9:00 AM', '1:00 PM', '3:00 PM'],
        'tire-rotation': ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
    };
    
    return slotConfigs[serviceType] || ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
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
    document.getElementById('summaryPrice').textContent = selectedService.price;
    
    bookingSection.style.display = 'block';
    bookingSection.scrollIntoView({ behavior: 'smooth' });
}

function confirmBooking() {
    const customerName = document.getElementById('customerName').value;
    const customerPhone = document.getElementById('customerPhone').value;
    const customerEmail = document.getElementById('customerEmail').value;
    
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
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };
    
    let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push(appointment);
    localStorage.setItem('appointments', JSON.stringify(appointments));
    
    alert(`Appointment confirmed!\n\nService: ${selectedService.title}\nDate: ${new Date(selectedDate).toLocaleDateString()}\nTime: ${selectedTime}\nPrice: ${selectedService.price}\n\nWe'll contact you at ${customerPhone} to confirm.`);
    
    localStorage.removeItem('selectedService');
    window.location.href = 'home.html';
}
