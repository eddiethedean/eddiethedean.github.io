document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        showPage(page);
    });
});

window.addEventListener('DOMContentLoaded', () => {
    showPage('home');
    // set up filters
    document.querySelectorAll('#accommodations .filters input[type=checkbox]').forEach(chk => chk.addEventListener('change', filterAccommodationResults));
    document.getElementById('activityTypeFilter').addEventListener('change', filterActivityResults);
    // form handlers
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    document.getElementById('contactForm').addEventListener('submit', handleContactSubmit);
    document.getElementById('bookingForm').addEventListener('submit', handleBookingSubmit);
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function filterAccommodationResults() {
    const showFamily = document.querySelector('#accommodations input[value="Family"]').checked;
    const showPool = document.querySelector('#accommodations input[value="Pool"]').checked;
    document.querySelectorAll('#accommodations .card.hotel').forEach(card => {
        const amenities = card.dataset.amenities.split(',');
        const passFamily = !showFamily || amenities.includes('Family');
        const passPool = !showPool || amenities.includes('Pool');
        card.style.display = (passFamily && passPool) ? 'block' : 'none';
    });
}

function filterActivityResults() {
    const type = document.getElementById('activityTypeFilter').value;
    document.querySelectorAll('#activities .card.activity').forEach(card => {
        card.style.display = (type === 'All' || card.dataset.type === type) ? 'block' : 'none';
    });
}

function handleSearch(e) {
    e.preventDefault();
    // for demo, navigate to accommodations and show defaults
    showPage('accommodations');
    filterAccommodationResults();
}

function handleContactSubmit(e) {
    e.preventDefault();
    document.getElementById('contactConfirmation').style.display = 'block';
    e.target.reset();
}

function handleBookingSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('bookingName').value;
    const email = document.getElementById('bookingEmail').value;
    const dates = document.getElementById('bookingDates').value;
    const guests = document.getElementById('bookingGuests').value;
    const summary = document.getElementById('bookingSummary');

    summary.innerHTML = `
    <h3>Booking Summary</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Dates:</strong> ${dates}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    <p><strong>Total:</strong> $${guests * 100} (est.)</p>
  `;
}