/* script.js */
document.querySelectorAll('[data-page]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const page = link.getAttribute('data-page');
    document.querySelectorAll('.page').forEach(sec => sec.classList.remove('active'));
    document.getElementById(page).classList.add('active');
  });
});

// Initialize default page
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('home').classList.add('active');
});