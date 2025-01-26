export const SLIDER_CONFIG = {
    // Animation settings
    animationDuration: 500, // ms
    animationEasing: 'ease-out',
    
    // Autoplay settings
    autoPlay: true,
    autoPlayInterval: 5000, // ms
    
    // Touch settings
    swipeThreshold: 50, // pixels
    
    // Accessibility
    ariaLabels: {
        container: 'Kitap Slaytları',
        prevButton: 'Önceki slayt',
        nextButton: 'Sonraki slayt',
        dots: 'Slayt navigasyonu',
        slide: (index) => `Slayt ${index + 1}`
    },
    
    // Selectors
    selectors: {
        container: '.slider-container',
        slide: '.book-slide',
        prevButton: '.slider-nav.prev',
        nextButton: '.slider-nav.next',
        dots: '.dot',
        content: '.slide-content'
    },
    
    // Classes
    classes: {
        active: 'active',
        hidden: 'hidden',
        current: 'current',
        animated: 'animated'
    }
}; 