// Глобальные переменные для калькулятора
let bottlesCount = 0;
let bagsCount = 0;
let transportValue = 0;

// Ждем загрузки DOM перед выполнением скрипта
document.addEventListener('DOMContentLoaded', function() {
    console.log('EcoBox scripts loaded');
    
    // Таймер обратного отсчета (если на странице есть элемент #timer)
    if (document.getElementById('timer')) {
        startTimer();
    }
    
    // Наблюдатель за прокруткой для навигации
    window.addEventListener('scroll', function() {
        const nav = document.querySelector('.sticky');
        
        if (window.scrollY > 50) {
            nav.style.padding = '10px 0';
            nav.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.padding = '15px 0';
            nav.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Таймер обратного отсчета
function startTimer() {
    let time = 1800; // 30 минут
    const timer = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById('timer').innerHTML = 
            `Осталось ${minutes}:${seconds < 10 ? '0' + seconds : seconds} для спеццены!`;
        if (time-- <= 0) clearInterval(timer);
    }, 1000);
}

// Функция перехода к следующему шагу калькулятора
function nextStep(currentStep) {
    // Скрываем текущий шаг
    const currentStepEl = document.getElementById('step' + currentStep);
    currentStepEl.classList.remove('active');
    
    // Сохраняем введенные данные
    if (currentStep === 1) {
        bottlesCount = parseInt(document.getElementById('bottles').value) || 0;
    } else if (currentStep === 2) {
        bagsCount = parseInt(document.getElementById('bags').value) || 0;
    }
    
    // Показываем следующий шаг
    const nextStepEl = document.getElementById('step' + (currentStep + 1));
    nextStepEl.classList.add('active');
}

// Функция возврата к предыдущему шагу
function prevStep(currentStep) {
    // Скрываем текущий шаг
    const currentStepEl = document.getElementById('step' + currentStep);
    currentStepEl.classList.remove('active');
    
    // Показываем предыдущий шаг
    const prevStepEl = document.getElementById('step' + (currentStep - 1));
    prevStepEl.classList.add('active');
}

// Функция расчета результатов калькулятора
function calculateResults() {
    // Получаем значение транспорта
    transportValue = parseInt(document.getElementById('transport').value) || 0;
    
    // Скрываем текущий шаг
    document.getElementById('step3').classList.remove('active');
    
    // Расчет "экологического следа" (упрощенная формула для демонстрации)
    let ecoScore = 100 - (bottlesCount * 5) - (bagsCount * 3) + (transportValue * 10);
    
    // Ограничиваем значение от 0 до 100
    ecoScore = Math.max(0, Math.min(100, ecoScore));
    
    // Отображаем результат с анимацией
    const resultEl = document.getElementById('results');
    resultEl.classList.add('active');
    
    const scoreEl = document.querySelector('.result-score');
    let currentScore = 0;
    const targetScore = ecoScore;
    
    // Анимируем счетчик
    const countInterval = setInterval(() => {
        currentScore++;
        scoreEl.textContent = currentScore;
        
        if (currentScore >= targetScore) {
            clearInterval(countInterval);
        }
    }, 20);
    
    // Текст рекомендации в зависимости от результата
    const recommendationText = document.querySelector('.result-box p');
    const improvementPercent = Math.round(30 + Math.random() * 20); // Случайное значение между 30% и 50%
    
    if (ecoScore < 40) {
        recommendationText.innerHTML = `Ваш след значительно выше среднего. Подписка на EcoBox поможет снизить его на <span class="highlight">${improvementPercent}%</span>`;
    } else if (ecoScore < 70) {
        recommendationText.innerHTML = `Ваш след на среднем уровне. Подписка на EcoBox поможет снизить его на <span class="highlight">${improvementPercent}%</span>`;
    } else {
        recommendationText.innerHTML = `Отличный результат! Подписка на EcoBox поможет вам стать еще экологичнее и снизить след на <span class="highlight">${improvementPercent}%</span>`;
    }
}