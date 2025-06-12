
        // Dados dos produtos
        const products = [
            {
                id: 1,
                name: "Paracetamol 750mg",
                price: 15.90,
                oldPrice: 19.90,
                category: "medicamentos",
                image: "fas fa-pills",
                badge: "sale"
            },
            {
                id: 2,
                name: "Protetor Solar FPS 70",
                price: 89.90,
                category: "cosmeticos",
                image: "fas fa-sun",
                badge: "new"
            },
            {
                id: 3,
                name: "Multivitamínico Centrum",
                price: 65.50,
                oldPrice: 79.90,
                category: "bemestar",
                image: "fas fa-capsules",
                badge: "sale"
            },
            {
                id: 4,
                name: "Xarope para Tosse Infantil",
                price: 32.75,
                category: "infantil",
                image: "fas fa-baby",
                badge: ""
            },
            {
                id: 5,
                name: "Omeprazol 20mg",
                price: 28.40,
                category: "medicamentos",
                image: "fas fa-prescription-bottle",
                badge: ""
            },
            {
                id: 6,
                name: "Hidratante Corporal",
                price: 42.90,
                oldPrice: 49.90,
                category: "cosmeticos",
                image: "fas fa-hand-holding-water",
                badge: "sale"
            },
            {
                id: 7,
                name: "Colágeno Verisol",
                price: 119.90,
                category: "bemestar",
                image: "fas fa-heart",
                badge: "new"
            },
            {
                id: 8,
                name: "Fralda Pampers Confort",
                price: 68.90,
                category: "infantil",
                image: "fas fa-baby-carriage",
                badge: ""
            },
            {
                id: 9,
                name: "Dipirona Sódica 500mg",
                price: 12.90,
                category: "medicamentos",
                image: "fas fa-tablets",
                badge: ""
            },
            {
                id: 10,
                name: "Shampoo Anticaspa",
                price: 35.60,
                category: "cosmeticos",
                image: "fas fa-pump-soap",
                badge: ""
            },
            {
                id: 11,
                name: "Vitamina D 2000UI",
                price: 45.25,
                category: "bemestar",
                image: "fas fa-capsules",
                badge: "new"
            },
            {
                id: 12,
                name: "Lenço Umedecido Huggies",
                price: 24.90,
                category: "infantil",
                image: "fas fa-baby",
                badge: ""
            }
        ];

        // Estado do carrinho
        let cart = [];
        let cartCount = 0;
        let cartTotal = 0;

        // Elementos DOM
        const cartButton = document.getElementById('cart-button');
        const cartSidebar = document.getElementById('cart-sidebar');
        const closeCartButton = document.getElementById('close-cart');
        const cartOverlay = document.getElementById('cart-overlay');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartCountElement = document.getElementById('cart-count');
        const cartTotalElement = document.getElementById('cart-total');
        const checkoutButton = document.getElementById('checkout-btn');
        const productsGrid = document.getElementById('products-grid');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const header = document.getElementById('header');

        // Funções
        function toggleCart() {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            document.body.style.overflow = cartSidebar.classList.contains('open') ? 'hidden' : '';
        }

        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            
            // Verifica se o produto já está no carrinho
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            // Atualiza contador e total
            cartCount++;
            cartCountElement.textContent = cartCount;
            
            updateCartTotal();
            updateCartItems();
            
            // Mostra notificação
            showToast('Produto adicionado ao carrinho!');
        }

        function updateCartItems() {
            cartItemsContainer.innerHTML = '';
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p style="text-align: center; padding: 40px 0;">Seu carrinho está vazio</p>';
                return;
            }
            
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-image">
                        <i class="${item.image}"></i>
                    </div>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}">Remover</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
            });
            
            // Adiciona event listeners para os novos botões
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => removeItem(parseInt(btn.dataset.id)));
            });
        }

        function updateQuantity(productId, change) {
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                cart[itemIndex].quantity += change;
                
                if (cart[itemIndex].quantity <= 0) {
                    cart.splice(itemIndex, 1);
                }
                
                // Atualiza contador
                cartCount += change;
                cartCountElement.textContent = cartCount;
                
                updateCartTotal();
                updateCartItems();
            }
        }

        function removeItem(productId) {
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex !== -1) {
                // Atualiza contador
                cartCount -= cart[itemIndex].quantity;
                cartCountElement.textContent = cartCount;
                
                cart.splice(itemIndex, 1);
                
                updateCartTotal();
                updateCartItems();
                
                showToast('Produto removido do carrinho');
            }
        }

        function updateCartTotal() {
            cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
            cartTotalElement.textContent = `R$ ${cartTotal.toFixed(2)}`;
        }

        function showToast(message) {
            toastMessage.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        function renderProducts(productsToRender) {
            productsGrid.innerHTML = '';
            
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card fade-in';
                productCard.innerHTML = `
                    <div class="product-image">
                        <i class="${product.image}"></i>
                        ${product.badge ? `<span class="product-badge ${product.badge}">${product.badge === 'new' ? 'Novo' : 'Oferta'}</span>` : ''}
                        <div class="product-actions">
                            <button class="action-btn"><i class="fas fa-heart"></i></button>
                            <button class="action-btn"><i class="fas fa-eye"></i></button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3>${product.name}</h3>
                        <div class="product-price">
                            R$ ${product.price.toFixed(2)}
                            ${product.oldPrice ? `<span class="old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                        <button class="add-to-cart-btn" data-id="${product.id}">
                            <i class="fas fa-shopping-cart"></i> Adicionar
                        </button>
                    </div>
                `;
                productsGrid.appendChild(productCard);
            });
            
            // Adiciona event listeners para os botões de adicionar ao carrinho
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const productId = parseInt(btn.dataset.id);
                    addToCart(productId);
                });
            });
        }

        function filterProducts(category) {
            if (category === 'all') {
                renderProducts(products);
                return;
            }
            
            const filteredProducts = products.filter(product => product.category === category);
            renderProducts(filteredProducts);
        }

        function searchProducts() {
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (!searchTerm) {
                renderProducts(products);
                return;
            }
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTerm)
            );
            
            renderProducts(filteredProducts);
        }

        function toggleMobileMenu() {
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        }

        function handleScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Animação de fade-in para elementos
            document.querySelectorAll('.fade-in').forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0)";
                }
            });
        }

        // Event Listeners
        cartButton.addEventListener('click', toggleCart);
        closeCartButton.addEventListener('click', toggleCart);
        cartOverlay.addEventListener('click', toggleCart);
        checkoutButton.addEventListener('click', () => {
            if (cart.length > 0) {
                showToast('Compra finalizada com sucesso!');
                cart = [];
                cartCount = 0;
                cartCountElement.textContent = cartCount;
                updateCartItems();
                updateCartTotal();
                toggleCart();
            } else {
                showToast('Adicione produtos ao carrinho primeiro');
            }
        });

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterProducts(button.dataset.filter);
            });
        });

        searchButton.addEventListener('click', searchProducts);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });

        mobileMenuToggle.addEventListener('click', toggleMobileMenu);

        // Fechar menu mobile ao clicar em um link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Newsletter form
        document.querySelector('.newsletter-form').addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('E-mail cadastrado com sucesso!');
            e.target.reset();
        });

        // Inicialização
        document.addEventListener('DOMContentLoaded', () => {
            renderProducts(products);
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Executa uma vez para verificar a posição inicial
        });
