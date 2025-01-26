import { SLIDER_CONFIG } from '../config/slider-config.js';
import { animationUtils } from '../utils/animation-utils.js';

export class BookSlider {
    constructor(options = {}) {
        this.container = document.querySelector(options.containerSelector || '.slider-container');
        this.slides = document.querySelectorAll(options.slideSelector || '.book-slide');
        this.prevBtn = document.querySelector(options.prevBtnSelector || '.slider-nav.prev');
        this.nextBtn = document.querySelector(options.nextBtnSelector || '.slider-nav.next');
        this.dots = document.querySelectorAll(options.dotSelector || '.dot');
        this.currentSlide = 0;
        this.slideCount = this.slides.length;
        this.autoPlayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.config = { ...SLIDER_CONFIG, ...options };
    }

    init() {
        this.updateSlides();
        this.bindEvents();
        this.startAutoPlay();
        this.setupAccessibility();
    }

    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.navigate('prev'));
        this.nextBtn?.addEventListener('click', () => this.navigate('next'));

        // Dot navigation
        this.dots?.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate('prev');
            if (e.key === 'ArrowRight') this.navigate('next');
        });

        // Touch events
        this.setupTouchEvents();

        // Pause autoplay on hover/focus
        this.setupAutoPlayPause();
    }

    setupTouchEvents() {
        this.container?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
        });

        this.container?.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
        });
    }

    setupAutoPlayPause() {
        this.container?.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container?.addEventListener('mouseleave', () => this.startAutoPlay());
        this.container?.addEventListener('focusin', () => this.stopAutoPlay());
        this.container?.addEventListener('focusout', () => this.startAutoPlay());
    }

    navigate(direction) {
        this.currentSlide = direction === 'next' 
            ? (this.currentSlide + 1) % this.slideCount
            : (this.currentSlide - 1 + this.slideCount) % this.slideCount;
        
        this.updateSlides();
    }

    goToSlide(index) {
        if (index >= 0 && index < this.slideCount) {
            this.currentSlide = index;
            this.updateSlides();
        }
    }

    updateSlides() {
        // Update transform with animation utility
        animationUtils.transformSlide(this.container, this.currentSlide);

        // Update active states and accessibility
        this.updateActiveStates();
        this.updateDots();
        this.animateContent();
    }

    updateActiveStates() {
        this.slides?.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
            slide.setAttribute('aria-hidden', index !== this.currentSlide);
            slide.setAttribute('tabindex', index === this.currentSlide ? '0' : '-1');
        });
    }

    updateDots() {
        this.dots?.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
            dot.setAttribute('aria-current', index === this.currentSlide);
            dot.setAttribute('aria-selected', index === this.currentSlide);
        });
    }

    animateContent() {
        const activeSlide = this.slides[this.currentSlide];
        const content = activeSlide?.querySelector('.slide-content');
        if (content) {
            animationUtils.fadeInContent(content);
        }
    }

    handleSwipe() {
        const diff = this.touchEndX - this.touchStartX;
        if (Math.abs(diff) > this.config.swipeThreshold) {
            this.navigate(diff > 0 ? 'prev' : 'next');
        }
    }

    startAutoPlay() {
        if (this.config.autoPlay && !this.autoPlayInterval) {
            this.autoPlayInterval = setInterval(
                () => this.navigate('next'), 
                this.config.autoPlayInterval
            );
        }
    }

    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    setupAccessibility() {
        // Container accessibility
        this.container?.setAttribute('role', 'region');
        this.container?.setAttribute('aria-label', 'Kitap Slaytları');

        // Slides accessibility
        this.slides?.forEach((slide, index) => {
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-label', `Slayt ${index + 1}`);
        });

        // Navigation buttons accessibility
        this.setupNavigationAccessibility();

        // Dots accessibility
        this.setupDotsAccessibility();
    }

    setupNavigationAccessibility() {
        this.prevBtn?.setAttribute('aria-label', 'Önceki slayt');
        this.nextBtn?.setAttribute('aria-label', 'Sonraki slayt');
    }

    setupDotsAccessibility() {
        const dotsContainer = document.querySelector('.slider-dots');
        if (dotsContainer) {
            dotsContainer.setAttribute('role', 'tablist');
            dotsContainer.setAttribute('aria-label', 'Slayt navigasyonu');

            this.dots?.forEach((dot, index) => {
                dot.setAttribute('role', 'tab');
                dot.setAttribute('aria-label', `Slayt ${index + 1}'e git`);
            });
        }
    }
} 