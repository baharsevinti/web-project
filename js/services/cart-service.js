export class CartService {
    constructor() {
        this.storageKey = 'bili_cart';
        this.cart = this.loadCart();
    }

    loadCart() {
        const savedCart = localStorage.getItem(this.storageKey);
        return savedCart ? JSON.parse(savedCart) : {
            items: [],
            subtotal: 0,
            shipping: 0,
            discount: 0,
            total: 0
        };
    }

    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
        this.notifyListeners();
    }

    // Event handling for cart updates
    listeners = new Set();

    subscribe(callback) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    notifyListeners() {
        this.listeners.forEach(callback => callback(this.cart));
    }

    // Cart operations
    addItem(book) {
        const existingItem = this.cart.items.find(item => item.id === book.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.items.push({
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                cover: book.cover,
                quantity: 1
            });
        }

        this.updateTotals();
        this.saveCart();
    }

    removeItem(bookId) {
        this.cart.items = this.cart.items.filter(item => item.id !== bookId);
        this.updateTotals();
        this.saveCart();
    }

    updateQuantity(bookId, quantity) {
        const item = this.cart.items.find(item => item.id === bookId);
        if (item) {
            item.quantity = Math.max(1, quantity); // Ensure minimum quantity is 1
            this.updateTotals();
            this.saveCart();
        }
    }

    clearCart() {
        this.cart.items = [];
        this.updateTotals();
        this.saveCart();
    }

    applyDiscount(code) {
        // Simple discount logic - can be expanded based on requirements
        if (code === 'WELCOME10') {
            this.cart.discount = this.cart.subtotal * 0.1;
            this.updateTotals();
            this.saveCart();
            return true;
        }
        return false;
    }

    removeDiscount() {
        this.cart.discount = 0;
        this.updateTotals();
        this.saveCart();
    }

    updateTotals() {
        // Calculate subtotal
        this.cart.subtotal = this.cart.items.reduce(
            (sum, item) => sum + (item.price * item.quantity),
            0
        );

        // Calculate shipping (free shipping over 200 TL)
        this.cart.shipping = this.cart.subtotal > 200 ? 0 : 29.90;

        // Calculate total
        this.cart.total = this.cart.subtotal + this.cart.shipping - this.cart.discount;
    }

    getCartSummary() {
        return {
            itemCount: this.cart.items.reduce((sum, item) => sum + item.quantity, 0),
            subtotal: this.cart.subtotal,
            shipping: this.cart.shipping,
            discount: this.cart.discount,
            total: this.cart.total
        };
    }

    getItems() {
        return [...this.cart.items];
    }
} 