let gameActive = false;
let monstersKilled = 0;
let timeLeft = 30;
let gameTimer;
let monsterSpawnInterval;
let isMenuOpen = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('FitQuest scripts loaded');

    setupMobileMenu();
    
    setupSmoothScrolling();
    
    setupVideoPlayer();
    
    setupScrollAnimations();
    
    setupNotifyForm();
    
    setupUserCounter();
    
    setupNavbarScrollEffect();
});

function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    if (!hamburger || !navLinks) return;
    
    hamburger.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            navLinks.classList.add('active');
            hamburger.classList.add('active');
        } else {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function() {
            if (isMenuOpen) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
                isMenuOpen = false;
            }
        });
    });
}

function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const targetPosition = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

function setupVideoPlayer() {
    const videoPlaceholder = document.querySelector('.video-placeholder');
    const playButton = document.querySelector('.play-button');
    
    if (videoPlaceholder && playButton) {
        playButton.addEventListener('click', function() {
            const videoPath = 'assets/video/gameplay.mp4';
            
            const videoElement = document.createElement('video');
            videoElement.setAttribute('width', '100%');
            videoElement.setAttribute('height', '100%');
            videoElement.setAttribute('controls', '');
            videoElement.setAttribute('autoplay', '');
            videoElement.setAttribute('src', videoPath);
            
            videoElement.onerror = function() {
                console.error('Не удалось загрузить видео из: ' + videoPath);
                const youtubeEmbedUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
                
                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '100%');
                iframe.setAttribute('height', '100%');
                iframe.setAttribute('src', youtubeEmbedUrl);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
                iframe.setAttribute('allowfullscreen', '');
                
                videoPlaceholder.innerHTML = '';
                videoPlaceholder.appendChild(iframe);
                iframe.classList.add('fade-in');
            };
            
            videoPlaceholder.innerHTML = '';
            videoPlaceholder.appendChild(videoElement);
            
            videoElement.classList.add('fade-in');
        });
    }
}

function setupScrollAnimations() {
    const stepsElements = document.querySelectorAll('.step');
    const questElements = document.querySelectorAll('.quest');
    const planElements = document.querySelectorAll('.plan');
    const reviewElements = document.querySelectorAll('.review');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                if (entry.target.classList.contains('step') || 
                    entry.target.classList.contains('quest') || 
                    entry.target.classList.contains('plan')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.2}s`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });
    
    stepsElements.forEach(el => observer.observe(el));
    questElements.forEach(el => observer.observe(el));
    planElements.forEach(el => observer.observe(el));
    reviewElements.forEach(el => observer.observe(el));
    
    const appStoreReviews = document.querySelectorAll('.app-store .review');
    const googlePlayReviews = document.querySelectorAll('.google-play .review');
    
    function animateReviews(reviews) {
        reviews.forEach((review, index) => {
            setTimeout(() => {
                review.style.opacity = '1';
                review.style.transform = 'translateY(0)';
            }, 300 * (index + 1));
        });
    }
    
    const reviewsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('app-store')) {
                    animateReviews(appStoreReviews);
                } else if (entry.target.classList.contains('google-play')) {
                    animateReviews(googlePlayReviews);
                }
                reviewsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const storeContainers = document.querySelectorAll('.app-store, .google-play');
    storeContainers.forEach(container => reviewsObserver.observe(container));
}

function setupNotifyForm() {
    const notifyForm = document.querySelector('.notify-form');
    
    if (notifyForm) {
        notifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = notifyForm.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                emailInput.value = '';
                alert('Спасибо! Мы уведомим вас о запуске приложения.');
            } else {
                alert('Пожалуйста, введите корректный email.');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function setupUserCounter() {
    const countElement = document.querySelector('.count-number');
    if (!countElement) return;
    
    const targetCount = 50000;
    let currentCount = 0;
    let animationDuration = 2000;
    let animationStarted = false;
    
    function animateCount() {
        const step = Math.ceil(targetCount / (animationDuration / 16));
        
        function updateCount() {
            if (currentCount < targetCount) {
                currentCount = Math.min(currentCount + step, targetCount);
                countElement.textContent = currentCount.toLocaleString();
                requestAnimationFrame(updateCount);
            }
        }
        
        updateCount();
    }
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animationStarted) {
                animationStarted = true;
                animateCount();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    observer.observe(countElement);
}

function setupNavbarScrollEffect() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

window.addEventListener('scroll', function() {
    const animateElements = document.querySelectorAll('.step, .quest, .plan');
    
    animateElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    const reviewContainers = document.querySelectorAll('.app-store, .google-play');
    
    reviewContainers.forEach(container => {
        const containerPosition = container.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (containerPosition < screenPosition && !container.classList.contains('animated')) {
            container.classList.add('animated');
            
            const reviews = container.querySelectorAll('.review');
            reviews.forEach((review, index) => {
                setTimeout(() => {
                    review.style.opacity = '1';
                    review.style.transform = 'translateY(0)';
                }, 200 * index);
            });
        }
    });
    
    const usersCount = document.querySelector('.users-count');
    if (usersCount) {
        const countPosition = usersCount.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.1;
        
        if (countPosition < screenPosition && !usersCount.classList.contains('counted')) {
            usersCount.classList.add('counted');
            
            const countElement = usersCount.querySelector('.count-number');
            if (countElement) {
                const finalCount = 50000;
                let currentCount = 0;
                const duration = 2000;
                const increment = finalCount / (duration / 30);
                
                const timer = setInterval(() => {
                    currentCount += increment;
                    if (currentCount >= finalCount) {
                        currentCount = finalCount;
                        clearInterval(timer);
                    }
                    
                    countElement.textContent = Math.floor(currentCount).toLocaleString();
                }, 30);
            }
        }
    }
}); 