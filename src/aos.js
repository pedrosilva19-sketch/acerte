AOS.init({
    once: true,
    duration: 1000,
    easing: 'ease-out-cubic'
});

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});