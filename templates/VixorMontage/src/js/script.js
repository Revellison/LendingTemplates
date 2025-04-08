window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 10) {
        header.classList.add('sticky');
    } else {
        header.classList.remove('sticky');
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    burgerMenu.addEventListener('click', function() {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Закрываем меню при клике на ссылку
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Закрываем меню при клике вне меню
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.burger-menu') && !e.target.closest('.nav-links') && navLinks.classList.contains('active')) {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });
});
