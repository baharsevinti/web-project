export const animationUtils = {
    transformSlide(container, currentSlide) {
        if (container) {
            container.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
    },

    fadeInContent(element) {
        if (element) {
            // Reset animation
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = 'fadeIn 0.5s ease-out forwards';
        }
    },

    // Additional animation utilities can be added here
    slideIn(element, direction = 'left') {
        if (element) {
            const animations = {
                left: 'slideInLeft',
                right: 'slideInRight',
                up: 'slideInUp',
                down: 'slideInDown'
            };
            
            element.style.animation = `${animations[direction]} 0.5s ease-out forwards`;
        }
    },

    fadeOut(element, callback) {
        if (element) {
            element.style.animation = 'fadeOut 0.3s ease-out forwards';
            if (callback) {
                element.addEventListener('animationend', callback, { once: true });
            }
        }
    }
}; 