import { CartService } from '../services/cart-service.js';

export class CartUI {
    constructor() {
        this.cartService = new CartService();
        this.setupEventListeners();
        this.updateCartUI();
        this.setupKeyboardNavigation();
        this.setupAutoSave();
    }

    setupEventListeners() {
        // Listen for add to cart button clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.add-to-cart-btn')) {
                e.preventDefault();
                this.handleAddToCart(e.target.closest('.add-to-cart-btn'));
            }
        });

        // Update cart UI when cart changes
        this.cartService.subscribe(() => this.updateCartUI());

        // Handle checkout button
        document.addEventListener('click', (e) => {
            if (e.target.matches('.checkout-button')) {
                this.handleCheckout();
            }
        });

        // Add bulk actions
        document.addEventListener('click', (e) => {
            if (e.target.matches('.clear-cart')) {
                this.handleClearCart();
            }
        });

        // Add undo/redo support
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                if (e.shiftKey) {
                    this.cartService.redo();
                } else {
                    this.cartService.undo();
                }
            }
        });
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for cart items
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('.cart-item')) {
                const item = e.target.closest('.cart-item');
                
                switch(e.key) {
                    case 'Delete':
                        this.cartService.removeItem(item.dataset.bookId);
                        break;
                    case 'ArrowUp':
                        if (e.target.matches('.quantity-input')) {
                            e.preventDefault();
                            const newQty = parseInt(e.target.value) + 1;
                            this.cartService.updateQuantity(item.dataset.bookId, newQty);
                        }
                        break;
                    case 'ArrowDown':
                        if (e.target.matches('.quantity-input')) {
                            e.preventDefault();
                            const newQty = Math.max(1, parseInt(e.target.value) - 1);
                            this.cartService.updateQuantity(item.dataset.bookId, newQty);
                        }
                        break;
                }
            }
        });
    }

    setupAutoSave() {
        // Auto-save cart state periodically
        setInterval(() => {
            this.cartService.saveState();
        }, 30000); // Every 30 seconds

        // Save state before page unload
        window.addEventListener('beforeunload', () => {
            this.cartService.saveState();
        });
    }

    handleAddToCart(button) {
        const bookCard = button.closest('.book-card');
        if (!bookCard) return;

        // Check if item already exists in cart
        const bookId = bookCard.dataset.bookId || Date.now().toString();
        const existingItem = this.cartService.getItems().find(item => item.id === bookId);

        if (existingItem) {
            // If item exists, increment quantity instead of adding new
            this.cartService.updateQuantity(bookId, existingItem.quantity + 1);
            this.showFeedback('Ürün miktarı artırıldı!', 'success');
        } else {
            // Add new item
            const book = {
                id: bookId,
                title: bookCard.querySelector('h3').textContent,
                author: bookCard.querySelector('.author').textContent,
                price: parseFloat(bookCard.querySelector('.price').textContent.replace('TL', '').trim()),
                cover: bookCard.querySelector('img').src,
                addedAt: new Date().toISOString()
            };

            try {
                this.cartService.addItem(book);
                this.showAddToCartAnimation(button);
                this.showFeedback('Ürün sepete eklendi!', 'success');
                
                // Smooth transition to cart page
                setTimeout(() => {
                    window.location.href = '/pages/sepetim.html';
                }, 1000);
            } catch (error) {
                this.showFeedback('Ürün eklenirken bir hata oluştu!', 'error');
            }
        }
    }

    showAddToCartAnimation(button) {
        button.classList.add('added');
        button.textContent = 'Sepete Eklendi!';
        setTimeout(() => {
            button.classList.remove('added');
            button.innerHTML = '<span class="cart-icon">🛒</span>Sepete Ekle';
        }, 1000);
    }

    showFeedback(message, type = 'info') {
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);

        // Trigger animation
        requestAnimationFrame(() => {
            feedback.classList.add('show');
            setTimeout(() => {
                feedback.classList.remove('show');
                setTimeout(() => feedback.remove(), 300);
            }, 2000);
        });
    }

    updateCartUI() {
        this.updateCartCount();
        this.updateCartPage();
    }

    updateCartCount() {
        const cartCounts = document.querySelectorAll('.cart-count');
        const summary = this.cartService.getCartSummary();
        
        cartCounts.forEach(cartCount => {
            cartCount.textContent = summary.itemCount;
            cartCount.classList.toggle('hidden', summary.itemCount === 0);
        });
    }

    updateCartPage() {
        const cartContainer = document.querySelector('.cart-items');
        if (!cartContainer) return;

        const items = this.cartService.getItems();
        const summary = this.cartService.getCartSummary();

        // Update cart items
        cartContainer.innerHTML = items.length ? this.generateCartItemsHTML(items) : this.generateEmptyCartHTML();

        // Update summary
        this.updateCartSummary(summary);

        // Setup quantity controls
        this.setupQuantityControls();
    }

    generateCartItemsHTML(items) {
        return items.map(item => `
            <div class="cart-item" data-book-id="${item.id}">
                <img class="cart-item__image" src="${item.cover}" alt="${item.title}">
                <div class="cart-item__details">
                    <h3 class="cart-item__title">${item.title}</h3>
                    <p class="cart-item__author">${item.author}</p>
                </div>
                <div class="cart-item__quantity">
                    <button class="quantity-btn decrease" aria-label="Azalt">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" aria-label="Miktar">
                    <button class="quantity-btn increase" aria-label="Artır">+</button>
                </div>
                <p class="cart-item__price">${(item.price * item.quantity).toFixed(2)} TL</p>
                <button class="cart-item__remove" aria-label="Sil">×</button>
            </div>
        `).join('');
    }

    generateEmptyCartHTML() {
        return `
            <div class="empty-state">
                <img src="../images/empty-cart.svg" alt="Boş sepet">
                <h3>Sepetiniz Boş</h3>
                <p>Sepetinizde ürün bulunmamaktadır.</p>
                <a href="/" class="browse-books">Alışverişe Başla</a>
            </div>
        `;
    }

    updateCartSummary(summary) {
        const summaryContainer = document.querySelector('.order-summary');
        if (!summaryContainer) return;

        summaryContainer.innerHTML = `
            <h2>Sipariş Özeti</h2>
            <div class="summary-row">
                <span>Ara Toplam</span>
                <span>${summary.subtotal.toFixed(2)} TL</span>
            </div>
            <div class="summary-row">
                <span>Kargo</span>
                <span>${summary.shipping.toFixed(2)} TL</span>
            </div>
            ${summary.discount > 0 ? `
                <div class="summary-row discount">
                    <span>İndirim</span>
                    <span>-${summary.discount.toFixed(2)} TL</span>
                </div>
            ` : ''}
            <div class="summary-total">
                <span>Toplam</span>
                <span>${summary.total.toFixed(2)} TL</span>
            </div>
            ${summary.itemCount > 0 ? `
                <button class="checkout-button">Ödemeye Geç</button>
            ` : ''}
        `;
    }

    setupQuantityControls() {
        const cartItems = document.querySelectorAll('.cart-item');
        
        cartItems.forEach(item => {
            const bookId = item.dataset.bookId;
            const decreaseBtn = item.querySelector('.decrease');
            const increaseBtn = item.querySelector('.increase');
            const quantityInput = item.querySelector('.quantity-input');
            const removeBtn = item.querySelector('.cart-item__remove');

            // Improved remove button handling
            removeBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Add removing animation
                item.style.transform = 'translateX(0)';
                item.style.transition = 'transform 0.3s ease-out';
                
                requestAnimationFrame(() => {
                    item.style.transform = 'translateX(100%)';
                    
                    // Wait for animation to complete
                    setTimeout(() => {
                        item.style.height = item.offsetHeight + 'px';
                        item.style.overflow = 'hidden';
                        
                        requestAnimationFrame(() => {
                            item.style.transition = 'height 0.3s ease-out';
                            item.style.height = '0';
                            
                            // Remove item after height animation
                            setTimeout(() => {
                                this.cartService.removeItem(bookId);
                                this.showFeedback('Ürün sepetten çıkarıldı', 'info');
                            }, 300);
                        });
                    }, 300);
                });
            });

            // Improved quantity controls with validation and feedback
            decreaseBtn?.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value);
                if (currentQty <= 1) {
                    this.showFeedback('Minimum miktar 1 olmalıdır', 'error');
                    return;
                }
                
                const newQuantity = currentQty - 1;
                this.updateItemQuantity(bookId, newQuantity, item);
            });

            increaseBtn?.addEventListener('click', () => {
                const currentQty = parseInt(quantityInput.value);
                if (currentQty >= 99) {
                    this.showFeedback('Maksimum miktar 99 olmalıdır', 'error');
                    return;
                }
                
                const newQuantity = currentQty + 1;
                this.updateItemQuantity(bookId, newQuantity, item);
            });

            // Improved quantity input handling
            quantityInput?.addEventListener('change', (e) => {
                let newQuantity = parseInt(e.target.value);
                
                // Validate input
                if (isNaN(newQuantity) || newQuantity < 1) {
                    newQuantity = 1;
                    this.showFeedback('Geçersiz miktar, 1 olarak ayarlandı', 'error');
                } else if (newQuantity > 99) {
                    newQuantity = 99;
                    this.showFeedback('Maksimum miktar 99 olarak ayarlandı', 'error');
                }
                
                this.updateItemQuantity(bookId, newQuantity, item);
            });

            // Add hover effect for remove button
            item.addEventListener('mouseenter', () => {
                const removeBtn = item.querySelector('.cart-item__remove');
                if (removeBtn) {
                    removeBtn.style.opacity = '1';
                }
            });

            item.addEventListener('mouseleave', () => {
                const removeBtn = item.querySelector('.cart-item__remove');
                if (removeBtn) {
                    removeBtn.style.opacity = '0.5';
                }
            });
        });
    }

    updateItemQuantity(bookId, quantity, itemElement) {
        // Save the old quantity for animation
        const oldQuantity = parseInt(itemElement.querySelector('.quantity-input').value);
        
        // Update the service
        this.cartService.updateQuantity(bookId, quantity);
        
        // Animate the quantity change
        const priceElement = itemElement.querySelector('.cart-item__price');
        if (priceElement) {
            priceElement.style.transition = 'transform 0.3s ease-out';
            priceElement.style.transform = quantity > oldQuantity ? 'scale(1.1)' : 'scale(0.9)';
            
            setTimeout(() => {
                priceElement.style.transform = 'scale(1)';
            }, 300);
        }
    }

    handleCheckout() {
        // Here you can add checkout logic
        this.showFeedback('Ödeme sayfasına yönlendiriliyorsunuz...', 'info');
        setTimeout(() => {
            window.location.href = '/pages/payment.html';
        }, 1000);
    }

    handleClearCart() {
        if (confirm('Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz?')) {
            this.cartService.clearCart();
            this.showFeedback('Sepetiniz temizlendi!', 'info');
        }
    }
} 