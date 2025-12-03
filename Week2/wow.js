// Mobile menu toggle
const menuButton = document.getElementById('menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isExpanded = navLinks.classList.contains('open');
    menuButton.setAttribute('aria-expanded', isExpanded);
    menuButton.innerHTML = isExpanded ? '✕' : '☰';
});

// Form submission handling
const contactForm = document.getElementById('contact-form');
const messageDiv = document.getElementById('form-message');
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    if (!name || !email) {
        messageDiv.textContent = 'Please fill out all required fields.';
        messageDiv.style.color = 'red';
    } else {
        messageDiv.textContent = 'Thank you for your message! I will be in touch shortly.';
        messageDiv.style.color = 'green';
        contactForm.reset();
    }
});