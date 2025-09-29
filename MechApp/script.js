document.addEventListener('DOMContentLoaded', function() {
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
    const servicePrice = document.getElementById('servicePrice');
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
            const price = card.querySelector('.price').textContent;
            
            selectedServiceData = {
                type: serviceType,
                title: serviceTitle,
                info: serviceInfo,
                price: price
            };
            
            serviceName.textContent = serviceTitle;
            servicePrice.textContent = `${price} - ${serviceInfo}`;
            selectedService.style.display = 'block';
        });
    });

    if (bookBtn) {
        bookBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (selectedServiceData) {
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