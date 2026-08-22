tailwind.config = {
            theme: {
                extend: { 
                    colors: {
                        ice: '#a5d2d3',
                        sky: '#679bac',
                        countdown: '#374057',
                        carols: '#ac6275',
                        celebration: '#d6948b',
                    },
                    fontFamily: {
                        serif: ['Playfair Display', 'serif'],
                        sans: ['Plus Jakarta Sans', 'sans-serif'],
                    }
                }
            }
        }
        
        
        // --- SLIDER FUNCTIONALITY ---
        let currentSlide = 0;
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.slide-indicator');

        function setSlide(index) {
            slides[currentSlide].classList.add('opacity-0');
            slides[currentSlide].classList.remove('opacity-100');
            indicators[currentSlide].classList.add('opacity-40');
            indicators[currentSlide].classList.remove('opacity-100');

            currentSlide = index;

            slides[currentSlide].classList.remove('opacity-0');
            slides[currentSlide].classList.add('opacity-100');
            indicators[currentSlide].classList.remove('opacity-40');
            indicators[currentSlide].classList.add('opacity-100');
        }

        function nextSlide() {
            let next = (currentSlide + 1) % slides.length;
            setSlide(next);
        }

        setInterval(nextSlide, 5000); // Auto-advance slides every 5 seconds

        // --- SHOPPING CART FUNCTIONALITY ---
        let cart = [];
        let discountRate = 0;

        const cartDrawer = document.getElementById('cart-drawer');
        const cartPanel = document.getElementById('cart-panel');
        const cartToggleBtn = document.getElementById('cart-toggle');
        const cartCountEl = document.getElementById('cart-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const subtotalEl = document.getElementById('cart-subtotal');
        const discountEl = document.getElementById('cart-discount');
        const discountRow = document.getElementById('discount-row');
        const totalEl = document.getElementById('cart-total');

        cartToggleBtn.addEventListener('click', () => toggleCart(true));

        function toggleCart(open) {
            if (open) {
                cartDrawer.classList.remove('pointer-events-none', 'opacity-0');
                cartDrawer.classList.add('opacity-100');
                cartPanel.classList.remove('translate-x-full');
            } else {
                cartDrawer.classList.add('pointer-events-none', 'opacity-0');
                cartDrawer.classList.remove('opacity-100');
                cartPanel.classList.add('translate-x-full');
            }
        }

        function addToCart(title, price, image) {
            const existingItem = cart.find(item => item.title === title);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ title, price, image, quantity: 1 });
            }
            updateCartUI();
            toggleCart(true);
        }

        function updateQuantity(title, change) {
            const item = cart.find(i => i.title === title);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    cart = cart.filter(i => i.title !== title);
                }
            }
            updateCartUI();
        }

        function applyPromo() {
            const codeInput = document.getElementById('promo-code').value.trim().toUpperCase();
            const msgEl = document.getElementById('promo-msg');
            
            if (codeInput === 'LUX34') {
                discountRate = 0.30;
                msgEl.innerText = 'Code LUX34 applied! (30% Off)';
                msgEl.className = 'text-[11px] mt-1 font-semibold text-emerald-600';
            } else {
                discountRate = 0;
                msgEl.innerText = 'Invalid code. Try LUX34';
                msgEl.className = 'text-[11px] mt-1 font-semibold text-rose-500';
            }
            updateCartUI();
        }

        function updateCartUI() {
            // Count
            const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountEl.innerText = totalCount;

             // Render Items
             if (cart.length === 0) {
                 cartItemsContainer.innerHTML = `
                     <div class="text-center py-12 text-slate-400">
                         <i class="fa-solid fa-basket-shopping text-4xl mb-3 text-slate-200"></i>
                        <p>Your bag is currently empty.</p>
                     </div>`;
             } else {
                 cartItemsContainer.innerHTML = cart.map(item => `
                     <div class="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                         <img src="${item.image}" alt="${item.title}" class="w-16 h-16 object-cover rounded-lg">
                         <div class="flex-1">
                             <h4 class="font-bold text-xs text-countdown">${item.title}</h4>
                             <span class="text-carols text-xs font-bold">$${item.price.toFixed(2)}</span>
                             <div class="flex items-center space-x-2 mt-2">
                                 <button onclick="updateQuantity('${item.title}', -1)" class="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">-</button>
                                 <span class="text-xs font-bold text-countdown">${item.quantity}</span>
                                 <button onclick="updateQuantity('${item.title}', 1)" class="w-5 h-5 bg-white border border-slate-200 rounded flex items-center justify-center text-xs font-bold text-slate-600 hover:bg-slate-100">+</button>
                             </div>
                         </div>
                         <div class="text-right">
                             <span class="font-bold text-xs text-countdown">$${(item.price * item.quantity).toFixed(2)}</span>
                         </div>
                     </div>
                 `).join('');
             }

             // Price Calculations
             const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
             const discountAmount = subtotal * discountRate;
             const total = subtotal - discountAmount;

             subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
            
             if (discountRate > 0) {
                 discountRow.classList.remove('hidden');
                 discountEl.innerText = `-$${discountAmount.toFixed(2)}`;
             } else {
                 discountRow.classList.add('hidden');
             }

             totalEl.innerText = `$${total.toFixed(2)}`;
         }

         function checkout() {
             if (cart.length === 0) {
                 alert('Your cart is empty!');
                 return;
             }
             alert('Thank you for shopping with LUXEORA BEAUTY! Directing to payment...');
             cart = [];
             discountRate = 0;
             document.getElementById('promo-code').value = '';
             document.getElementById('promo-msg').innerText = '';
             updateCartUI();
             toggleCart(false);
         }

         // --- CATEGORY FILTERING ---
         function filterCategory(category) {
             const productCards = document.querySelectorAll('.product-card');
            
             productCards.forEach(card => {
                 if (category === 'all' || card.dataset.category === category) {
                     card.style.display = 'flex';
                 } else {
                     card.style.display = 'none';
                 }
             });

              // Smooth scroll to best sellers section
              document.getElementById('bestsellers').scrollIntoView({ behavior: 'smooth' });
          }

          // --- NEWSLETTER FORM ---
          function handleSubscribe(e) {
              e.preventDefault();
              const emailInput = document.getElementById('newsletter-email');
              const msgEl = document.getElementById('newsletter-msg');
            
             msgEl.innerText = `Thank you for subscribing with ${emailInput.value}! Check your inbox soon.`;
             msgEl.className = 'text-xs font-semibold mt-3 text-carols block';
            emailInput.value = '';
         }




