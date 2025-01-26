import { BookSlider } from './components/slider.js';
import { CartUI } from './components/cart.js';
import './components/search.js';

// Initialize components when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider if on home page
    if (document.querySelector('.book-slider')) {
        const bookSlider = new BookSlider({
            autoPlay: true,
            autoPlayInterval: 5000
        });
        bookSlider.init();
    }

    // Initialize cart functionality
    const cart = new CartUI();
}); 