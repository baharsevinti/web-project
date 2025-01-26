// Search service to handle book search functionality
class SearchService {
    constructor() {
        // Mock data for local search - in a real app, this would come from an API
        this.books = [
            {
                id: 1,
                title: "Hilkat Garibesi",
                author: "Serdar Uslu",
                price: 138.25,
                image: "images/hilkat.jpeg"
            },
            {
                id: 2,
                title: "Küvette Bulunan Günce",
                author: "Stanislaw Lem",
                price: 193.55,
                image: "images/küvet.jpeg"
            },
            {
                id: 3,
                title: "Goebbels'in Propaganda",
                author: "Demian Lienhard",
                price: 180.91,
                image: "images/orkestra.jpeg"
            },
            {
                id: 4,
                title: "Al Capone",
                author: "S. Meralli",
                price: 315.00,
                image: "images/AlCapone.jpg"
            },
            {
                id: 5,
                title: "Beyaz Mitolojiler",
                author: "Robert J.C Young",
                price: 276.50,
                image: "images/beyaz.jpg"
            },
            {
                id: 6,
                title: "Bilim ve Din",
                author: "Thomas Dixon, Adam R. Shapiro",
                price: 59.06,
                image: "images/bilim-ve-din.webp"
            },
            {
                id: 7,
                title: "Metafizik",
                author: "Aristoteles",
                price: 474.00,
                image: "images/metafizik1.jpeg"
            },
            {
                id: 8,
                title: "Moskova Yanıyor",
                author: "Grigori Petroviç Danilevski",
                price: 126.40,
                image: "images/moskova.jpeg"
            },
            {
                id: 9,
                title: "Kolera Günlerinde Aşk",
                author: "Gabriel García Márquez",
                price: 310.00,
                image: "images/kolera.jpeg"
            },
            {
                id: 10,
                title: "Yüzyıllık Yalnızlık",
                author: "Gabriel García Márquez",
                price: 286.75,
                image: "images/yalnızlık.jpeg"
            },
            {
                id: 11,
                title: "Doğu Avrupa'da Yolculuk",
                author: "Gabriel García Márquez",
                price: 151.13,
                image: "images/doğu.jpeg"
            },
            {
                id: 12,
                title: "Deliye Övgü",
                author: "Erasmus",
                price: 125.00,
                image: "images/deli.jpeg"
            }
        ];
    }

    search(query) {
        if (!query) return [];
        
        query = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(query) ||
            book.author.toLowerCase().includes(query)
        );
    }

    formatPrice(price) {
        return price.toFixed(2) + " TL";
    }

    generateSearchResultHTML(book) {
        return `
            <div class="search-result-item" data-book-id="${book.id}">
                <img src="/${book.image}" alt="${book.title}" class="search-result-image">
                <div class="search-result-info">
                    <h3>${book.title}</h3>
                    <p class="author">${book.author}</p>
                    <div class="search-result-bottom">
                        <p class="price">${this.formatPrice(book.price)}</p>
                        <button class="add-to-cart-btn" onclick="window.handleAddToCart(${book.id})">
                            <span class="cart-icon">🛒</span>
                            Sepete Ekle
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

export const searchService = new SearchService(); 