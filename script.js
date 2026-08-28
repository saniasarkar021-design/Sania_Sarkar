document.addEventListener('DOMContentLoaded', () => {

    // CART STATE MANAGEMENT
    let cart = JSON.parse(localStorage.getItem('chapterOneCart')) || [];

    // LOADER INITIALIZATION
    initTypingEffect();
    updateCartUI();

    // STICKY NAVBAR & SCROLL PROGRESS
    const navbar = document.getElementById('navbar');
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        progressBar.style.width = scrolled + '%';

        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        handleParallax();
    });

    // HERO TYPING ANIMATION
    function initTypingEffect() {
        const textToType = "Where Every Cup Begins a Story.";
        const typingElement = document.getElementById('typingText');
        let index = 0;

        function type() {
            if (index < textToType.length) {
                typingElement.textContent += textToType.charAt(index);
                index++;
                setTimeout(type, 80);
            }
        }
        type();
    }

    // MOBILE NAVIGATION TOGGLE
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // SCROLL REVEAL OBSERVER
    const revealElements = document.querySelectorAll('.scroll-reveal, .fade-in-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // PARALLAX EFFECT FOR STORY IMAGE
    function handleParallax() {
        const parallaxImg = document.querySelector('.parallax-img');
        if (parallaxImg) {
            const rect = parallaxImg.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const shift = (window.innerHeight - rect.top) * 0.05;
                parallaxImg.style.transform = `translateY(${shift}px) scale(1.05)`;
            }
        }
    }

    // TESTIMONIAL SLIDER
    const track = document.getElementById('testimonialTrack');
    const dots = document.querySelectorAll('.slider-dots .dot');
    let currentSlide = 0;

    function goToSlide(index) {
        currentSlide = index;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-slide'));
            goToSlide(index);
        });
    });

    setInterval(() => {
        currentSlide = (currentSlide + 1) % dots.length;
        goToSlide(currentSlide);
    }, 6000);

    // BUTTON RIPPLE EFFECT
    const rippleButtons = document.querySelectorAll('.ripple-btn');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const circle = document.createElement('span');
            circle.classList.add('ripple');
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';

            this.appendChild(circle);
            setTimeout(() => circle.remove(), 600);
        });
    });

    // BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById('backToTop');
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- 1. PRODUCT DETAIL MODAL ---
    const productModal = document.getElementById('productModal');
    const closeProductModal = document.getElementById('closeProductModal');
    let currentActiveItem = null;

    document.querySelectorAll('.btn-view-details').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('[data-id]');
            currentActiveItem = {
                id: card.dataset.id,
                title: card.dataset.title,
                price: parseFloat(card.dataset.price),
                img: card.dataset.img,
                desc: card.dataset.desc,
                notes: card.dataset.notes
            };

            document.getElementById('modalTitle').textContent = currentActiveItem.title;
            document.getElementById('modalPrice').textContent = `₹${currentActiveItem.price}`;
            document.getElementById('modalDesc').textContent = currentActiveItem.desc;
            document.getElementById('modalNotes').textContent = currentActiveItem.notes;
            document.getElementById('modalImg').src = currentActiveItem.img;

            productModal.classList.add('active');
        });
    });

    closeProductModal.addEventListener('click', () => productModal.classList.remove('active'));

    document.getElementById('modalAddToCartBtn').addEventListener('click', () => {
        if (currentActiveItem) {
            addToCart(currentActiveItem);
            productModal.classList.remove('active');
        }
    });

    // --- 2. CART DRAWER & LOGIC ---
    const cartTrigger = document.getElementById('cartTrigger');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartClose = document.getElementById('cartClose');

    function toggleCart() {
        cartDrawer.classList.toggle('active');
        cartOverlay.classList.toggle('active');
    }

    cartTrigger.addEventListener('click', toggleCart);
    cartClose.addEventListener('click', toggleCart);
    cartOverlay.addEventListener('click', toggleCart);

    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('[data-id]');
            const item = {
                id: card.dataset.id,
                title: card.dataset.title,
                price: parseFloat(card.dataset.price)
            };
            addToCart(item);
        });
    });

    function addToCart(item) {
        const existing = cart.find(i => i.id === item.id);
        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({ ...item, qty: 1 });
        }
        saveAndUpdateCart();
        showToast(`Added ${item.title} to order.`);
    }

    function saveAndUpdateCart() {
        localStorage.setItem('chapterOneCart', JSON.stringify(cart));
        updateCartUI();
    }

    function updateCartUI() {
        const cartBadge = document.getElementById('cartBadge');
        const cartItemsContainer = document.getElementById('cartItemsContainer');
        const cartTotal = document.getElementById('cartTotal');

        const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        cartBadge.textContent = totalCount;
        cartTotal.textContent = `₹${subtotal}`;

        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="text-muted">Your sensory library is empty.</p>';
            return;
        }

        cart.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title}</h4>
                    <p>₹${item.price} x ${item.qty}</p>
                </div>
                <div class="cart-item-qty">
                    <button class="btn-qty-minus" data-id="${item.id}">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty-plus" data-id="${item.id}">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });

        // Add quantity listeners
        document.querySelectorAll('.btn-qty-minus').forEach(b => {
            b.addEventListener('click', (e) => updateQty(e.target.dataset.id, -1));
        });
        document.querySelectorAll('.btn-qty-plus').forEach(b => {
            b.addEventListener('click', (e) => updateQty(e.target.dataset.id, 1));
        });
    }

    function updateQty(id, change) {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
            saveAndUpdateCart();
        }
    }

    // --- 3. CHECKOUT WORKFLOW ---
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const proceedCheckoutBtn = document.getElementById('proceedCheckoutBtn');

    proceedCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showToast('Your order is empty!');
            return;
        }
        toggleCart();
        renderCheckoutSummary();
        checkoutModal.classList.add('active');
    });

    closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.remove('active'));

    function renderCheckoutSummary() {
        const summaryContainer = document.getElementById('checkoutItemsSummary');
        const checkoutTotal = document.getElementById('checkoutTotal');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        summaryContainer.innerHTML = cart.map(i => `<div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom: 5px;"><span>${i.title} (x${i.qty})</span><span>₹${i.price * i.qty}</span></div>`).join('');
        checkoutTotal.textContent = `₹${subtotal}`;
    }

    document.getElementById('checkoutForm').addEventListener('submit', (e) => {
        e.preventDefault();
        checkoutModal.classList.remove('active');
        cart = [];
        saveAndUpdateCart();
        showToast('Order placed successfully! Welcome to Chapter One.');
    });

    // --- 4. RESERVATION FORM WORKFLOW ---
    document.getElementById('reservationForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const date = document.getElementById('resDate').value;
        const time = document.getElementById('resTime').value;
        showToast(`Table reserved for ${date} at ${time}.`);
        e.target.reset();
    });

    // GLOBAL TOAST NOTIFICATION
    function showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
});