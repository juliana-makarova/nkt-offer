/**
 * Дорожная карта улучшений сайта кабельного оборудования
 * JavaScript для интерактивных элементов
 */

// ========================================
// Функция для переключения выпадающих блоков
// ========================================

function toggleStep(header) {
    // Получаем элемент содержимого
    const content = header.nextElementSibling;
    const stepItem = header.parentElement;
    
    // Переключаем активное состояние
    const isActive = header.classList.contains('active');
    
    if (isActive) {
        // Закрываем блок
        header.classList.remove('active');
        content.classList.remove('active');
    } else {
        // Открываем блок
        header.classList.add('active');
        content.classList.add('active');
    }
}

// ========================================
// Плавная прокрутка к якорям
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Обработка всех ссылок с якорями
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Проверяем, что это не просто "#"
            if (targetId === '#') return;
            
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Получаем высоту навигации для правильного смещения
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                // Плавная прокрутка
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Обновляем URL без перезагрузки страницы
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // ========================================
    // Подсветка активной навигации при скролле
    // ========================================
    
    const sections = document.querySelectorAll('.content-block[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavigation() {
        let current = '';
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Запускаем при загрузке и при скролле
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();
    
    // ========================================
    // Кнопка "Развернуть все" / "Свернуть все"
    // ========================================
    
    // Функция для создания кнопок управления для каждого блока
    function addExpandCollapseButtons() {
        const contentBlocks = document.querySelectorAll('.content-block:not(.placeholder-block)');
        
        contentBlocks.forEach(block => {
            const blockHeader = block.querySelector('.block-header');
            if (!blockHeader) return;
            
            // Создаём контейнер для кнопок
            const buttonsContainer = document.createElement('div');
            buttonsContainer.className = 'block-controls';
            buttonsContainer.style.cssText = 'margin-left: auto; display: flex; gap: 10px;';
            
            // Кнопка "Развернуть все"
            const expandAllBtn = document.createElement('button');
            expandAllBtn.textContent = 'Развернуть все';
            expandAllBtn.className = 'control-btn expand-btn';
            expandAllBtn.onclick = function() {
                const steps = block.querySelectorAll('.step-item');
                steps.forEach(step => {
                    const header = step.querySelector('.step-header');
                    const content = step.querySelector('.step-content');
                    header.classList.add('active');
                    content.classList.add('active');
                });
            };
            
            // Кнопка "Свернуть все"
            const collapseAllBtn = document.createElement('button');
            collapseAllBtn.textContent = 'Свернуть все';
            collapseAllBtn.className = 'control-btn collapse-btn';
            collapseAllBtn.onclick = function() {
                const steps = block.querySelectorAll('.step-item');
                steps.forEach(step => {
                    const header = step.querySelector('.step-header');
                    const content = step.querySelector('.step-content');
                    header.classList.remove('active');
                    content.classList.remove('active');
                });
            };
            
            buttonsContainer.appendChild(expandAllBtn);
            buttonsContainer.appendChild(collapseAllBtn);
            
            blockHeader.style.display = 'flex';
            blockHeader.style.alignItems = 'center';
            blockHeader.appendChild(buttonsContainer);
        });
    }
    
    // Добавляем стили для кнопок
    const style = document.createElement('style');
    style.textContent = `
        .control-btn {
            padding: 8px 16px;
            border: 2px solid var(--primary-blue);
            background-color: var(--white);
            color: var(--primary-blue);
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            transition: all 0.3s ease;
            font-family: 'Inter', sans-serif;
        }
        
        .control-btn:hover {
            background-color: var(--primary-blue);
            color: var(--white);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 82, 204, 0.3);
        }
        
        .control-btn:active {
            transform: translateY(0);
        }
        
        .nav-link.active {
            background-color: var(--light-blue);
            color: var(--primary-blue);
            border-bottom-color: var(--primary-blue);
            font-weight: 700;
        }
        
        @media (max-width: 768px) {
            .block-controls {
                margin-left: 0 !important;
                margin-top: 15px;
                width: 100%;
            }
            
            .control-btn {
                flex: 1;
                padding: 10px;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Добавляем кнопки управления
    addExpandCollapseButtons();
    
    // ========================================
    // Анимация появления элементов при скролле
    // ========================================
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Наблюдаем за карточками
    const cards = document.querySelectorAll('.intro-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Наблюдаем за блоками контента
    const contentBlocks = document.querySelectorAll('.content-block');
    contentBlocks.forEach(block => {
        block.style.opacity = '0';
        block.style.transform = 'translateY(20px)';
        block.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(block);
    });
    
    // ========================================
    // Обработка хеша в URL при загрузке страницы
    // ========================================
    
    if (window.location.hash) {
        setTimeout(() => {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                const navHeight = document.querySelector('.navigation').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
    
    // ========================================
    // Счётчик шагов в каждом блоке (отключено)
    // ========================================
    
    // function updateStepCounters() {
    //     const subsections = document.querySelectorAll('.subsection');
    //     
    //     subsections.forEach(subsection => {
    //         const steps = subsection.querySelectorAll('.step-item');
    //         const subsectionTitle = subsection.querySelector('.subsection-title');
    //         
    //         if (subsectionTitle && steps.length > 0) {
    //             const currentText = subsectionTitle.textContent;
    //             if (!currentText.includes('(')) {
    //                 subsectionTitle.textContent += ` (${steps.length} ${steps.length === 1 ? 'шаг' : steps.length < 5 ? 'шага' : 'шагов'})`;
    //             }
    //         }
    //     });
    // }
    // 
    // updateStepCounters();
    
    // ========================================
    // Индикатор прогресса чтения
    // ========================================
    
    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, var(--primary-blue) 0%, var(--secondary-blue) 100%);
        z-index: 1000;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    function updateProgressBar() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = progress + '%';
    }
    
    window.addEventListener('scroll', updateProgressBar);
    updateProgressBar();
    
    console.log('🚀 Дорожная карта загружена и готова к работе!');
});

// ========================================
// Дополнительные утилиты
// ========================================

// Функция для печати информации о структуре
function printStructure() {
    const blocks = document.querySelectorAll('.content-block');
    console.log(`📊 Структура дорожной карты:`);
    console.log(`Всего блоков: ${blocks.length}`);
    
    blocks.forEach((block, index) => {
        const title = block.querySelector('.block-title').textContent;
        const steps = block.querySelectorAll('.step-item').length;
        console.log(`  ${index + 1}. ${title} - ${steps} шагов`);
    });
}