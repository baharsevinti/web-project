import { searchService } from '../services/search-service.js';
import { CartUI } from './cart.js';

class SearchComponent {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchContainer = document.querySelector('.search-container');
        this.cart = new CartUI();
        this.setupSearchResults();
        this.bindEvents();
        this.setupCartHandler();
    }

    setupSearchResults() {
        // Create search results container
        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.searchResults.style.display = 'none';
        this.searchContainer.appendChild(this.searchResults);
    }

    setupCartHandler() {
        // Add global handler for cart functionality
        window.handleAddToCart = (bookId) => {
            const book = searchService.books.find(b => b.id === bookId);
            if (book) {
                // Create a book object in the format CartUI expects
                const bookData = {
                    id: book.id.toString(),
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    cover: '/' + book.image
                };

                // Show feedback
                const button = document.querySelector(`[data-book-id="${bookId}"] .add-to-cart-btn`);
                button.innerHTML = '✓ Eklendi';
                button.disabled = true;
                button.classList.add('added');

                // Add to cart using CartUI's method
                this.cart.handleAddToCart({
                    closest: () => ({
                        dataset: { bookId: bookData.id },
                        querySelector: selector => {
                            switch(selector) {
                                case 'h3': return { textContent: bookData.title };
                                case '.author': return { textContent: bookData.author };
                                case '.price': return { textContent: bookData.price + ' TL' };
                                case 'img': return { src: bookData.cover };
                                default: return null;
                            }
                        }
                    })
                });
            }
        };
    }

    bindEvents() {
        // Debounce search input
        let debounceTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 300);
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.searchContainer.contains(e.target)) {
                this.searchResults.style.display = 'none';
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchResults.style.display = 'none';
            }
        });

        // Handle click on search result item
        this.searchResults.addEventListener('click', (e) => {
            const resultItem = e.target.closest('.search-result-item');
            if (resultItem && !e.target.closest('.add-to-cart-btn')) {
                const bookId = parseInt(resultItem.dataset.bookId);
                const book = searchService.books.find(b => b.id === bookId);
                if (book) {
                    window.location.href = `/book/${book.id}`;
                }
            }
        });
    }

    handleSearch(query) {
        const results = searchService.search(query);
        
        if (query && results.length > 0) {
            this.searchResults.innerHTML = results
                .map(book => searchService.generateSearchResultHTML(book))
                .join('');
            this.searchResults.style.display = 'block';
        } else {
            this.searchResults.style.display = 'none';
        }
    }
}

// Initialize search component
document.addEventListener('DOMContentLoaded', () => {
    new SearchComponent();
}); 