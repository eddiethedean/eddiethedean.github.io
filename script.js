// script.js

window.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Homepage search
  document.getElementById('searchForm')
    ?.addEventListener('submit', handleSearch);

  // Accommodation filters
  document.querySelectorAll('#accommodations .filters input[type="checkbox"]')
    .forEach(chk => chk.addEventListener('change', filterAccommodationResults));
  document.getElementById('destFilterAccommodations')
    ?.addEventListener('change', filterAccommodationResults);

  // Activity filters
  document.getElementById('activityTypeFilter')
    ?.addEventListener('change', filterActivityResults);
  document.getElementById('destFilterActivities')
    ?.addEventListener('change', filterActivityResults);

  // 'Book' buttons
  document.querySelectorAll('.card button').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const card = e.target.closest('.card');
      const name = card.dataset.name;
      const dest = card.dataset.destination;
      document.getElementById('bookingItemTitle').textContent =
        `Booking: ${name} (${capitalize(dest)})`;
      document.getElementById('bookingDestination').value = dest;
      showPage('booking');
    });
  });

  // Booking form
  document.getElementById('bookingForm')
    ?.addEventListener('submit', handleBookingSubmit);

  // Contact form
  document.getElementById('contactForm')
    ?.addEventListener('submit', handleContactSubmit);
});

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');
}

function handleSearch(e) {
  e.preventDefault();
  const dest = document.getElementById('searchDestination').value;
  const start = document.getElementById('searchStartDate').value;
  const end = document.getElementById('searchEndDate').value;
  const guests = parseInt(document.getElementById('searchGuests').value, 10);
  const err = document.getElementById('searchError');
  err.textContent = '';

  if (!dest) {
    err.textContent = 'Please select a destination.';
    return;
  }
  if (!start || !end) {
    err.textContent = 'Please select both start and end dates.';
    return;
  }
  if (start > end) {
    err.textContent = 'Start date cannot be after end date.';
    return;
  }
  if (!guests || guests < 1) {
    err.textContent = 'Please enter at least 1 guest.';
    return;
  }

  // pre-set the filter dropdown to the searched destination
  const destFilter = document.getElementById('destFilterAccommodations');
  if (destFilter) destFilter.value = dest;

  showPage('accommodations');
  filterAccommodationResults();
}

function filterAccommodationResults() {
  const showFamily = document.querySelector('#accommodations input[value="Family"]')?.checked;
  const showPool = document.querySelector('#accommodations input[value="Pool"]')?.checked;
  const destSelect = document.getElementById('destFilterAccommodations');
  // if user has chosen "All", fall back to homepage search value
  const searchDest = document.getElementById('searchDestination').value;
  const dest = destSelect
    ? (destSelect.value || searchDest)
    : searchDest;

  document.querySelectorAll('#accommodations .card.hotel').forEach(card => {
    const amenities = card.dataset.amenities.split(',');
    const matchFamily = !showFamily || amenities.includes('Family');
    const matchPool = !showPool || amenities.includes('Pool');
    const matchDest = !dest || card.dataset.destination === dest;
    card.style.display = (matchFamily && matchPool && matchDest) ? 'block' : 'none';
  });
}

function filterActivityResults() {
  const typeSelect = document.getElementById('activityTypeFilter');
  const destSelect = document.getElementById('destFilterActivities');
  const type = typeSelect ? typeSelect.value : 'All';
  const searchDest = document.getElementById('searchDestination').value;
  const dest = destSelect
    ? (destSelect.value || searchDest)
    : searchDest;

  document.querySelectorAll('#activities .card.activity').forEach(card => {
    const matchType = (type === 'All' || card.dataset.type === type);
    const matchDest = !dest || card.dataset.destination === dest;
    card.style.display = (matchType && matchDest) ? 'block' : 'none';
  });
}

function handleBookingSubmit(e) {
  e.preventDefault();
  const err = document.getElementById('bookingError');
  err.textContent = '';

  const name = document.getElementById('bookingName').value.trim();
  const email = document.getElementById('bookingEmail').value.trim();
  const startDate = document.getElementById('bookingStartDate').value;
  const endDate = document.getElementById('bookingEndDate').value;
  const guests = parseInt(document.getElementById('bookingGuests').value, 10);
  const destRaw = document.getElementById('bookingDestination').value;
  const destText = titleCase(destRaw);

  if (!name) {
    err.textContent = 'Please enter your name.';
    return;
  }
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    err.textContent = 'Please enter a valid email address.';
    return;
  }
  if (!startDate || !endDate) {
    err.textContent = 'Please select both start and end booking dates.';
    return;
  }
  if (startDate > endDate) {
    err.textContent = 'Start date cannot be after end date.';
    return;
  }
  if (!guests || guests < 1) {
    err.textContent = 'Please enter at least one guest.';
    return;
  }

  const summary = document.getElementById('bookingSummary');
  summary.innerHTML = `
    <h3>Booking Summary</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Start Date:</strong> ${startDate}</p>
    <p><strong>End Date:</strong> ${endDate}</p>
    <p><strong>Guests:</strong> ${guests}</p>
    <p><strong>Destination:</strong> ${destText}</p>
    <p><strong>Total:</strong> $${guests * 100} (est.)</p>
    <button type="button" id="editBooking">Edit Booking</button>
  `;
  document.getElementById('editBooking')
    .addEventListener('click', () => showPage('booking'));
}

function handleContactSubmit(e) {
  e.preventDefault();
  document.getElementById('contactConfirmation').style.display = 'block';
  e.target.reset();
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function titleCase(str) {
  return str.split(' ').map(capitalize).join(' ');
}
