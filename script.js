document.addEventListener('DOMContentLoaded', () => {
    // --- Confetti Celebration on Page Entry ---
    function triggerCelebration() {
        if (typeof confetti !== 'function') return;

        const colors = ['#9c4b8b', '#ffd700', '#ff1493', '#00e5ff', '#ffffff', '#ff4500', '#8a2be2'];

        // Big initial double burst from left & right
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.2, y: 0.6 },
            colors: colors,
            zIndex: 99999
        });
        confetti({
            particleCount: 100,
            spread: 100,
            origin: { x: 0.8, y: 0.6 },
            colors: colors,
            zIndex: 99999
        });

        // Mid-way booster fireworks at 1.2 seconds
        setTimeout(() => {
            confetti({
                particleCount: 120,
                spread: 120,
                origin: { x: 0.5, y: 0.5 },
                colors: colors,
                zIndex: 99999
            });
        }, 1200);

        // Continuous rich side cannons for 3.5 seconds
        const duration = 3.5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({
                particleCount: 6,
                angle: 60,
                spread: 70,
                origin: { x: 0, y: 0.6 },
                colors: colors,
                zIndex: 99999
            });
            confetti({
                particleCount: 6,
                angle: 120,
                spread: 70,
                origin: { x: 1, y: 0.6 },
                colors: colors,
                zIndex: 99999
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Reliable launcher with retry if CDN script loads with slight delay
    let celebrationAttempts = 0;
    function initCelebration() {
        if (typeof confetti === 'function') {
            triggerCelebration();
        } else if (celebrationAttempts < 15) {
            celebrationAttempts++;
            setTimeout(initCelebration, 150);
        }
    }

    initCelebration();

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // --- Intersection Observer for Fade-in Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Offset for fixed navbar
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Catalog Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'tout' || category.includes(filterValue)) {
                    card.style.display = 'block';
                    // Re-trigger animation
                    card.classList.remove('visible');
                    setTimeout(() => card.classList.add('visible'), 50);
                } else {
                    card.style.display = 'none';
                    card.classList.remove('visible');
                }
            });
        });
    });

    // --- Lightbox Gallery Logic ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const lightboxCounter = document.querySelector('.lightbox-counter');

    let currentImages = [];
    let currentIndex = 0;
    let lightboxInterval = null;

    function stopLightboxAutoplay() {
        if (lightboxInterval) {
            clearInterval(lightboxInterval);
            lightboxInterval = null;
        }
    }

    function startLightboxAutoplay() {
        stopLightboxAutoplay();
        if (currentImages.length > 1) {
            lightboxInterval = setInterval(() => {
                nextImage();
            }, 3500);
        }
    }

    function updateLightbox() {
        if (!lightbox || currentImages.length === 0) return;
        
        // Hide arrows if only 1 image
        if (currentImages.length <= 1) {
            if (lightboxPrev) lightboxPrev.style.display = 'none';
            if (lightboxNext) lightboxNext.style.display = 'none';
        } else {
            if (lightboxPrev) lightboxPrev.style.display = 'flex';
            if (lightboxNext) lightboxNext.style.display = 'flex';
        }
        
        // Show counter
        if (lightboxCounter) {
            lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        }
        
        // Set image source
        if (lightboxImg) {
            lightboxImg.src = currentImages[currentIndex];
        }
    }

    function nextImage() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    }

    function prevImage() {
        if (currentImages.length <= 1) return;
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    }

    function openLightbox(imagesStr, startIndex = 0) {
        if (!lightbox || !imagesStr) return;
        const rawList = Array.isArray(imagesStr) ? imagesStr : imagesStr.replace(/\|/g, ',').split(',');
        currentImages = rawList.map(s => s.trim()).filter(Boolean);
        if (currentImages.length === 0) return;

        currentIndex = Math.max(0, Math.min(startIndex, currentImages.length - 1));
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        startLightboxAutoplay();
    }
    window.openLightbox = openLightbox;

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        stopLightboxAutoplay();
        setTimeout(() => {
            if (lightboxImg) lightboxImg.src = '';
        }, 300);
    }
    window.closeLightbox = closeLightbox;

    // Attach click events to Aperçu buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const imagesAttr = btn.getAttribute('data-images');
            openLightbox(imagesAttr);
        });
    });

    if (lightbox) {
        // Close on click outside, close button, or ESC key
        if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });

        // Click on left/right part of lightbox image to navigate manually
        if (lightboxImg) {
            lightboxImg.addEventListener('click', (e) => {
                e.stopPropagation();
                stopLightboxAutoplay();
                const rect = lightboxImg.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                if (clickX < rect.width * 0.35) {
                    prevImage();
                } else {
                    nextImage();
                }
            });
        }

        // Mobile Touch Swipe for Lightbox
        let lbTouchStartX = 0;
        let lbTouchStartY = 0;
        lightbox.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                lbTouchStartX = e.touches[0].clientX;
                lbTouchStartY = e.touches[0].clientY;
            }
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            if (e.changedTouches.length === 0) return;
            const diffX = e.changedTouches[0].clientX - lbTouchStartX;
            const diffY = e.changedTouches[0].clientY - lbTouchStartY;
            if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
                stopLightboxAutoplay();
                if (diffX < 0) {
                    nextImage();
                } else {
                    prevImage();
                }
            }
        }, { passive: true });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') { stopLightboxAutoplay(); nextImage(); }
            if (e.key === 'ArrowLeft') { stopLightboxAutoplay(); prevImage(); }
        });

        if (lightboxPrev) {
            lightboxPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                stopLightboxAutoplay();
                prevImage();
            });
        }

        if (lightboxNext) {
            lightboxNext.addEventListener('click', (e) => {
                e.stopPropagation();
                stopLightboxAutoplay();
                nextImage();
            });
        }
    }

    // --- Universal Manual & Auto Image Carousel Helper ---
    function setupImageCarousel(container, options = {}) {
        if (!container) return null;
        const imgs = container.querySelectorAll('img');
        if (imgs.length <= 1) return null;

        let currentIndex = 0;
        let autoPlayTimer = null;
        const count = imgs.length;

        function showImage(index) {
            currentIndex = (index + count) % count;
            imgs.forEach((img, i) => {
                img.style.opacity = (i === currentIndex) ? '1' : '0';
                img.style.pointerEvents = (i === currentIndex) ? 'auto' : 'none';
            });

            const dots = container.querySelectorAll('.carousel-dot, .carousel-dots > div');
            dots.forEach((dot, i) => {
                if (i === currentIndex) {
                    dot.classList.add('active');
                    dot.style.background = '#9c4b8b';
                } else {
                    dot.classList.remove('active');
                    dot.style.background = 'rgba(255,255,255,0.7)';
                }
            });
        }

        function resetAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            if (!options.disableAutoPlay) {
                autoPlayTimer = setInterval(() => {
                    showImage(currentIndex + 1);
                }, 3000);
            }
        }

        function pauseAutoPlay() {
            if (autoPlayTimer) clearInterval(autoPlayTimer);
            setTimeout(resetAutoPlay, 8000);
        }

        function next(e) {
            if (e) { e.stopPropagation(); e.preventDefault(); }
            pauseAutoPlay();
            showImage(currentIndex + 1);
        }

        function prev(e) {
            if (e) { e.stopPropagation(); e.preventDefault(); }
            pauseAutoPlay();
            showImage(currentIndex - 1);
        }

        // Add navigation buttons if not present
        let prevBtn = container.querySelector('.card-carousel-prev');
        if (!prevBtn) {
            prevBtn = document.createElement('button');
            prevBtn.type = 'button';
            prevBtn.className = 'card-carousel-nav card-carousel-prev';
            prevBtn.setAttribute('aria-label', 'Photo précédente');
            prevBtn.innerHTML = '<i class="ph ph-caret-left"></i>';
            container.appendChild(prevBtn);
        }
        prevBtn.onclick = prev;

        let nextBtn = container.querySelector('.card-carousel-next');
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.className = 'card-carousel-nav card-carousel-next';
            nextBtn.setAttribute('aria-label', 'Photo suivante');
            nextBtn.innerHTML = '<i class="ph ph-caret-right"></i>';
            container.appendChild(nextBtn);
        }
        nextBtn.onclick = next;

        // Dots setup
        let dotsContainer = container.querySelector('.carousel-dots');
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.className = 'carousel-dots';
            container.appendChild(dotsContainer);
        }
        if (dotsContainer.children.length !== count) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < count; i++) {
                const dot = document.createElement('div');
                dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
                dot.setAttribute('data-index', i);
                dotsContainer.appendChild(dot);
            }
        }

        dotsContainer.querySelectorAll('.carousel-dot, div').forEach((dot, i) => {
            dot.classList.add('carousel-dot');
            dot.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                pauseAutoPlay();
                showImage(i);
            };
        });

        // Touch Swipe Gestures
        let touchStartX = 0;
        let touchStartY = 0;
        let isSwiping = false;

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
                isSwiping = true;
            }
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            if (!isSwiping || e.changedTouches.length === 0) return;
            isSwiping = false;
            const diffX = e.changedTouches[0].clientX - touchStartX;
            const diffY = e.changedTouches[0].clientY - touchStartY;
            if (Math.abs(diffX) > 30 && Math.abs(diffX) > Math.abs(diffY)) {
                if (diffX < 0) {
                    next(e);
                } else {
                    prev(e);
                }
            }
        }, { passive: true });

        showImage(0);
        resetAutoPlay();

        return {
            next,
            prev,
            showImage,
            getCurrentIndex: () => currentIndex
        };
    }
    window.setupImageCarousel = setupImageCarousel;


    // --- Ecommerce Modals Logic ---
    const galleryModal = document.getElementById('category-gallery-modal');
    const productModal = document.getElementById('product-detail-modal');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryTitle = document.getElementById('gallery-title');
    const detailImg = document.getElementById('detail-img');
    const detailPrev = document.getElementById('detail-prev');
    const detailNext = document.getElementById('detail-next');
    const btnAddCart = document.getElementById('btn-add-cart');
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.remove('show');
    }
    
    let currentDetailImages = [];
    let currentDetailIndex = 0;
    let currentDetailPrice = '';
    
    // Close functionality
    document.querySelectorAll('.close-modal, .custom-modal-overlay').forEach(el => {
        el.addEventListener('click', (e) => {
            const modal = e.target.closest('.custom-modal');
            if(modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // Attach click events to open catalog modal (clicks on image, titles, or button)
    document.querySelectorAll('.product-card').forEach(card => {
        const btn = card.querySelector('.btn-icon');
        const clickables = card.querySelectorAll('.product-category, h3, .product-image img, .btn-icon');
        
        clickables.forEach(el => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryId = card.getAttribute('data-category');
                if (categoryId) {
                    window.location.href = categoryId + '.html';
                }
            });
            // Make them look clickable
            if (el.tagName !== 'BUTTON') {
                el.style.cursor = 'pointer';
            }
        });
    });

    function openGalleryModal(title, basePrice, imageGroups) {
        galleryTitle.textContent = title;
        galleryGrid.innerHTML = '';
        
        // Stop any previous intervals
        if (window.carouselIntervals) {
            window.carouselIntervals.forEach(clearInterval);
        }
        window.carouselIntervals = [];
        
        imageGroups.forEach((groupStr, index) => {
            const srcs = groupStr.split(',');
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            let imagesHtml = srcs.map((src, i) => 
                `<img src="${src}" alt="Modèle ${index + 1} - ${i+1}" loading="lazy" style="${i===0 ? 'opacity:1;' : 'opacity:0;'} position: absolute; top:0; left:0; transition: opacity 0.5s ease-in-out;">`
            ).join('');
            
            item.innerHTML = `
                <div class="gallery-image" style="position: relative;">
                    ${imagesHtml}
                    ${srcs.length > 1 ? `<div class="carousel-dots" style="position: absolute; bottom: 10px; width: 100%; display: flex; justify-content: center; gap: 5px; z-index: 2;">
                        ${srcs.map((_, i) => `<div style="width: 6px; height: 6px; border-radius: 50%; background: ${i===0 ? 'var(--magenta)' : 'rgba(255,255,255,0.7)'};"></div>`).join('')}
                    </div>` : ''}
                </div>
                <div class="gallery-info" style="text-align: center; margin-top: 10px;">
                    <button class="btn-primary" style="width: 100%; padding: 10px; font-size: 0.9rem;">Voir</button>
                </div>
            `;
            
            // Auto slide logic
            if (srcs.length > 1) {
                let currentIndex = 0;
                const imgs = item.querySelectorAll('.gallery-image img');
                const dots = item.querySelectorAll('.carousel-dots div');
                
                const interval = setInterval(() => {
                    imgs[currentIndex].style.opacity = '0';
                    dots[currentIndex].style.background = 'rgba(255,255,255,0.7)';
                    
                    currentIndex = (currentIndex + 1) % srcs.length;
                    
                    imgs[currentIndex].style.opacity = '1';
                    dots[currentIndex].style.background = 'var(--magenta)';
                }, 2500);
                window.carouselIntervals.push(interval);
            }
            
            item.addEventListener('click', () => {
                openProductModal(srcs, 0, basePrice);
            });
            
            galleryGrid.appendChild(item);
        });
        
        galleryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openProductModal(images, index, price) {
        currentDetailImages = images;
        currentDetailIndex = index;
        currentDetailPrice = price;
        updateProductModalView();
        
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function updateProductModalView() {
        document.getElementById('detail-title').textContent = `Modèle ${currentDetailIndex + 1}`;
        document.getElementById('detail-price').textContent = currentDetailPrice;
        detailImg.src = currentDetailImages[currentDetailIndex];
        
        // Hide arrows if only 1 image
        if (currentDetailImages.length <= 1) {
            detailPrev.style.display = 'none';
            detailNext.style.display = 'none';
        } else {
            detailPrev.style.display = 'flex';
            detailNext.style.display = 'flex';
        }
    }

    // Prev/Next in Product Modal
    detailPrev.addEventListener('click', () => {
        currentDetailIndex = (currentDetailIndex - 1 + currentDetailImages.length) % currentDetailImages.length;
        updateProductModalView();
    });
    
    detailNext.addEventListener('click', () => {
        currentDetailIndex = (currentDetailIndex + 1) % currentDetailImages.length;
        updateProductModalView();
    });
    
    // Zoom in on image click (open Lightbox)
    detailImg.addEventListener('click', () => {
        // We reuse the original openLightbox (which has been modified to support autoplay)
        // Pass only the current image so it opens fullscreen
        openLightbox(currentDetailImages[currentDetailIndex]);
        // Put lightbox above product modal by setting z-index higher dynamically
        document.getElementById('lightbox').style.zIndex = '100000';
    });
    
    // Add to cart Toast
    if (btnAddCart) {
        btnAddCart.addEventListener('click', () => {
            const size = document.getElementById('size-select').value;
            toast.textContent = `Toge (Taille ${size.split(' ')[0]}) ajoutée au panier !`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }


    // --- Dynamic Form Logic ---
    const quantityInput = document.getElementById('toga-quantity');
    const formsWrapper = document.getElementById('toga-forms-wrapper');
    
    function generateTogaForms() {
        if (!quantityInput || !formsWrapper) return;
        
        let qty = parseInt(quantityInput.value);
        if (isNaN(qty) || qty < 1) qty = 1;
        if (qty > 100) qty = 100;
        
        let html = '';
        for (let i = 1; i <= qty; i++) {
            html += `
                <div class="toga-form-block fade-in-up" style="animation-delay: ${Math.min(i*0.05, 0.5)}s">
                    <div class="toga-form-header" id="header-toga-${i}">Toge ${i}</div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tour de poitrine (cm)</label>
                            <input type="number" placeholder="Ex: 95" class="toga-measure" data-toga="${i}" data-field="poitrine">
                        </div>
                        <div class="form-group">
                            <label>Hauteur totale (cm)</label>
                            <input type="number" placeholder="Ex: 175" class="toga-measure" data-toga="${i}" data-field="hauteur">
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label>Tour de tête (cm)</label>
                            <input type="number" placeholder="Ex: 58" class="toga-measure" data-toga="${i}" data-field="tete">
                        </div>
                        <div class="form-group">
                            <label>Long. manches (cm)</label>
                            <input type="number" placeholder="Ex: 60" class="toga-measure" data-toga="${i}" data-field="manches">
                        </div>
                    </div>
                    <div class="form-row" style="margin-bottom: 0;">
                        <div class="form-group" style="flex: 1 1 100%;">
                            <label>Nom pour broderie (Optionnel)</label>
                            <input type="text" placeholder="Ex: Jean Dupont" class="toga-measure" data-toga="${i}" data-field="broderie" oninput="document.getElementById('header-toga-${i}').textContent = this.value ? 'Toge ${i} (' + this.value + ')' : 'Toge ${i}'">
                        </div>
                    </div>
                </div>
            `;
        }
        formsWrapper.innerHTML = html;
        
        // Ensure fade-in-up class renders since it doesn't have an observer
        const newBlocks = formsWrapper.querySelectorAll('.toga-form-block.fade-in-up');
        newBlocks.forEach(block => {
            // we force it visible, or change CSS. 
            // Better: just add visible class.
            setTimeout(() => block.classList.add('visible'), 50);
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('input', generateTogaForms);
    }
    
    // We need to override the updateProductModalView to also generate the form initially
    const originalUpdateProductModalView = updateProductModalView;
    updateProductModalView = function() {
        originalUpdateProductModalView();
        // Reset quantity to 1 when opening a new product
        if (quantityInput) {
            quantityInput.value = 1;
            generateTogaForms();
        }
    };
    
    // Update the Toast message for Cart
    if (btnAddCart) {
        // Clone and replace to remove old listener
        const newBtnAddCart = btnAddCart.cloneNode(true);
        btnAddCart.parentNode.replaceChild(newBtnAddCart, btnAddCart);
        
        newBtnAddCart.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value) || 1;
            toast.textContent = `${qty} Toge(s) ajoutée(s) au panier avec les mesures !`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }


    // --- Shopping Cart Logic (localStorage) ---
    const whatsappNumber = "2250501696060"; // Numéro de l'entreprise
    
    const floatingCart = document.getElementById('floating-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartBadge = document.getElementById('cart-badge');
    const btnCheckoutWhatsapp = document.getElementById('btn-checkout-whatsapp');
    
    let cart = JSON.parse(localStorage.getItem('ose_cart')) || [];
    
    function saveCart() {
        localStorage.setItem('ose_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    }
    
    function updateCartBadge() {
        if(cartBadge) {
            cartBadge.textContent = cart.length;
            if(cart.length > 0) {
                cartBadge.style.display = 'flex';
                floatingCart.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
                // Optional: hide floating cart when empty
                // floatingCart.style.display = 'none'; 
            }
        }
    }
    
    function renderCart() {
        if(!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="text-align:center; color:#999; margin-top:50px;">Votre panier est vide.</p>';
            return;
        }
        
        cart.forEach((item, itemIndex) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            
            let togasHtml = '';
            item.togas.forEach((toga, i) => {
                const title = toga.broderie ? `Toge ${i+1} (${toga.broderie})` : `Toge ${i+1}`;
                togasHtml += `
                    <div class="cart-item-toga">
                        <strong>${title}</strong><br>
                        Poitrine: ${toga.poitrine || 'N/A'}cm | Hauteur: ${toga.hauteur || 'N/A'}cm<br>
                        Tête: ${toga.tete || 'N/A'}cm | Manches: ${toga.manches || 'N/A'}cm
                    </div>
                `;
            });
            
            itemDiv.innerHTML = `
                <h4>${item.category} - ${item.modelName}</h4>
                <p><strong>Prix Base:</strong> ${item.price}</p>
                <p><strong>Quantité:</strong> ${item.quantity} toge(s)</p>
                <button class="remove-item" onclick="removeFromCart(${itemIndex})"><i class="ph ph-trash"></i></button>
                <div style="margin-top:10px;">${togasHtml}</div>
            `;
            cartItemsContainer.appendChild(itemDiv);
        });
    }
    
    // Make remove function global
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        saveCart();
    };
    
    // UI Interactions
    if(floatingCart) {
        floatingCart.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
        });
    }
    
    window.openCartSidebar = function() {
        cartSidebar.classList.add('active');
        cartOverlay.classList.add('active');
        toast.classList.remove('show');
    };
    
    function closeCartSidebar() {
        cartSidebar.classList.remove('active');
        cartOverlay.classList.remove('active');
    }
    
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCartSidebar);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCartSidebar);
    
    // Replace old Add to Cart logic to actually save to Cart
    const currentBtnAddCart = document.getElementById('btn-add-cart');
    if (currentBtnAddCart) {
        const newBtnAddCart = currentBtnAddCart.cloneNode(true);
        currentBtnAddCart.parentNode.replaceChild(newBtnAddCart, currentBtnAddCart);
        
        newBtnAddCart.addEventListener('click', () => {
            let qty = parseInt(quantityInput.value) || 1;
            
            // Gather all toga measurements
            let togasData = [];
            for (let i = 1; i <= qty; i++) {
                const poitrine = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="poitrine"]`)?.value || '';
                const hauteur = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="hauteur"]`)?.value || '';
                const tete = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="tete"]`)?.value || '';
                const manches = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="manches"]`)?.value || '';
                const broderie = document.querySelector(`.toga-measure[data-toga="${i}"][data-field="broderie"]`)?.value || '';
                
                togasData.push({ poitrine, hauteur, tete, manches, broderie });
            }
            
            // Get product info from Modal titles
            const categoryTitle = document.getElementById('gallery-title').textContent;
            const modelName = document.getElementById('detail-title').textContent;
            const price = document.getElementById('detail-price').textContent;
            const imageSrc = document.getElementById('detail-img').src;
            
            const cartItem = {
                category: categoryTitle,
                modelName: modelName,
                price: price,
                image: imageSrc,
                quantity: qty,
                togas: togasData
            };
            
            cart.push(cartItem);
            saveCart();
            
            // Show toast
            toast.innerHTML = `${qty} Toge(s) ajoutée(s) au panier ! <button onclick="openCartSidebar()" style="margin-left: 15px; background: white; color: var(--primary); border: none; padding: 5px 12px; border-radius: 5px; cursor: pointer; font-weight: bold;">Voir le panier</button>`;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
            
            // Automatically open cart for better UX
            setTimeout(() => {
                cartSidebar.classList.add('active');
                cartOverlay.classList.add('active');
                // Close product modal
                document.getElementById('product-detail-modal').classList.remove('active');
                // document.getElementById('category-gallery-modal').classList.remove('active');
            }, 1000);
        });
    }
    
    // WhatsApp Checkout
    if(btnCheckoutWhatsapp) {
        btnCheckoutWhatsapp.addEventListener('click', () => {
            if(cart.length === 0) return;
            
            let message = "Bonjour OSE Production ! Je souhaite passer une commande :\n\n";
            
            cart.forEach((item, index) => {
                message += `*--- ARTICLE ${index + 1} ---*\n`;
                message += `Catégorie: ${item.category}\n`;
                message += `Modèle: ${item.modelName}\n`;
                // If it's a full URL, it will be clickable in WhatsApp
                if (item.image) {
                    message += `Image: ${item.image}\n`;
                }
                message += `Quantité: ${item.quantity}\n`;
                message += `Prix Base: ${item.price}\n\n`;
                
                message += `*Détails des mesures :*\n`;
                item.togas.forEach((toga, i) => {
                    const title = toga.broderie ? `Toge ${i+1} (${toga.broderie})` : `Toge ${i+1}`;
                    message += `- ${title} : Poitrine ${toga.poitrine||'X'}cm, Hauteur ${toga.hauteur||'X'}cm, Tête ${toga.tete||'X'}cm, Manches ${toga.manches||'X'}cm\n`;
                });
                message += `\n`;
            });
            
            message += `Merci de m'indiquer la suite de la procédure.`;
            
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
        });
    }
    
    // Initial call
    updateCartBadge();
    renderCart();

    // Initialize carousels for category pages
    function initCategoryItemCarousels() {
        if (!document.getElementById('category-grid')) return;
        document.querySelectorAll('.gallery-item').forEach((item) => {
            const rawImages = item.getAttribute('data-images') || '';
            const srcs = rawImages.split(',').map(s => s.trim()).filter(Boolean);
            const imageWrapper = item.querySelector('.gallery-image');

            let carousel = null;
            if (imageWrapper && srcs.length > 1) {
                carousel = setupImageCarousel(imageWrapper);
            }

            if (imageWrapper) {
                imageWrapper.style.cursor = 'zoom-in';
                imageWrapper.title = 'Cliquez pour agrandir les photos';
                imageWrapper.addEventListener('click', (e) => {
                    if (e.target.closest('.card-carousel-nav') || e.target.closest('.carousel-dot') || e.target.closest('.btn-favorite')) {
                        return;
                    }
                    e.stopPropagation();
                    const activeIdx = carousel ? carousel.getCurrentIndex() : 0;
                    if (window.openLightbox && srcs.length > 0) {
                        window.openLightbox(srcs.join(','), activeIdx);
                    }
                });
            }

            const expandSection = item.querySelector('.expandable-section');
            const qtyInput = item.querySelector('.toga-quantity-input');
            const formsWrapper = item.querySelector('.toga-forms-wrapper');
            const submitBtn = item.querySelector('.btn-submit-whatsapp');
            const modelName = item.querySelector('h3') ? item.querySelector('h3').textContent : '';
            const priceEl = item.querySelector('.item-price');
            const modelPrice = priceEl ? priceEl.textContent : '';

            // Toggle form expansion
            function toggleForm() {
                if (!expandSection) return;
                const isActive = expandSection.classList.contains('active');
                
                // Collapse all other sections
                document.querySelectorAll('.expandable-section').forEach(sec => {
                    if (sec !== expandSection) {
                        sec.classList.remove('active');
                        sec.style.gridTemplateRows = '0fr';
                    }
                });
                
                if (isActive) {
                    expandSection.classList.remove('active');
                    expandSection.style.gridTemplateRows = '0fr';
                } else {
                    expandSection.classList.add('active');
                    expandSection.style.gridTemplateRows = '1fr';
                    if (formsWrapper && formsWrapper.children.length === 0 && qtyInput) {
                        generateLocalTogaForms();
                    }
                }
            }

            // Click to toggle
            const btnDesc = item.querySelector('.btn-description');
            if (btnDesc) {
                btnDesc.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleForm();
                });
            }

            const btnCommander = item.querySelector('.btn-commander');
            if (btnCommander) {
                btnCommander.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleForm();
                });
            }

            // Prevent propagation from form container
            if (expandSection) {
                expandSection.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            }

            // Generate dynamic forms locally
            function generateLocalTogaForms() {
                if (!qtyInput || !formsWrapper) return;
                let qty = parseInt(qtyInput.value);
                if (isNaN(qty) || qty < 1) qty = 1;
                if (qty > 100) qty = 100;
                
                let html = '';
                for (let i = 1; i <= qty; i++) {
                    html += `
                        <div class="toga-form-block" style="background: #f9f9f9; border: 1px solid #eee; border-radius: 12px; padding: 15px;">
                            <div class="toga-form-header" style="font-weight: 700; font-size: 1.1rem; color: var(--magenta); margin-bottom: 12px; border-bottom: 2px solid #eee; padding-bottom: 5px;">Toge ${i}</div>
                            <div class="form-row" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                                <div class="form-group" style="flex: 1 1 calc(50% - 10px); display: flex; flex-direction: column;">
                                    <label style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Tour de poitrine (cm)</label>
                                    <input type="number" placeholder="Ex: 95" class="toga-measure" data-toga="${i}" data-field="poitrine" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                                </div>
                                <div class="form-group" style="flex: 1 1 calc(50% - 10px); display: flex; flex-direction: column;">
                                    <label style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Hauteur totale (cm)</label>
                                    <input type="number" placeholder="Ex: 175" class="toga-measure" data-toga="${i}" data-field="hauteur" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                                </div>
                            </div>
                            <div class="form-row" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 10px;">
                                <div class="form-group" style="flex: 1 1 calc(50% - 10px); display: flex; flex-direction: column;">
                                    <label style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Tour de tête (cm)</label>
                                    <input type="number" placeholder="Ex: 58" class="toga-measure" data-toga="${i}" data-field="tete" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                                </div>
                                <div class="form-group" style="flex: 1 1 calc(50% - 10px); display: flex; flex-direction: column;">
                                    <label style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Long. manches (cm)</label>
                                    <input type="number" placeholder="Ex: 60" class="toga-measure" data-toga="${i}" data-field="manches" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                                </div>
                            </div>
                            <div class="form-row" style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 0;">
                                <div class="form-group" style="flex: 1 1 100%; display: flex; flex-direction: column;">
                                    <label style="font-size: 0.85rem; color: #666; margin-bottom: 5px;">Nom pour broderie (Optionnel)</label>
                                    <input type="text" placeholder="Ex: Jean Dupont" class="toga-measure" data-toga="${i}" data-field="broderie" style="padding: 8px; border: 1px solid #ddd; border-radius: 6px;">
                                </div>
                            </div>
                        </div>
                    `;
                }
                formsWrapper.innerHTML = html;
            }

            if (qtyInput) {
                qtyInput.addEventListener('input', generateLocalTogaForms);
            }

            // WhatsApp direct checkout
            if (submitBtn) {
                submitBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    let qty = qtyInput ? (parseInt(qtyInput.value) || 1) : 1;
                    const categoryTitle = item.getAttribute('data-category') || 'Toges';
                    const imagesAttr = item.getAttribute('data-images');
                    const firstImage = imagesAttr ? imagesAttr.split(',')[0] : '';
                    const imageURL = firstImage ? window.location.origin + '/' + encodeURI(firstImage) : '';
                    
                    let message = `🎓 *NOUVELLE COMMANDE DIRECTE* 🎓\n\n`;
                    message += `📁 *Catégorie* : ${categoryTitle}\n`;
                    message += `👕 *Modèle* : ${modelName}\n`;
                    if (imageURL) {
                        message += `🖼️ *Image de référence* : ${imageURL}\n`;
                    }
                    message += `📦 *Quantité* : ${qty}\n`;
                    message += `💵 *Prix unitaire* : ${modelPrice}\n\n`;
                    message += `*Détails des mesures :*\n`;
                
                    for (let i = 1; i <= qty; i++) {
                        const poitrine = formsWrapper.querySelector(`.toga-measure[data-toga="${i}"][data-field="poitrine"]`)?.value || 'Non renseigné';
                        const hauteur = formsWrapper.querySelector(`.toga-measure[data-toga="${i}"][data-field="hauteur"]`)?.value || 'Non renseigné';
                        const tete = formsWrapper.querySelector(`.toga-measure[data-toga="${i}"][data-field="tete"]`)?.value || 'Non renseigné';
                        const manches = formsWrapper.querySelector(`.toga-measure[data-toga="${i}"][data-field="manches"]`)?.value || 'Non renseigné';
                        const broderie = formsWrapper.querySelector(`.toga-measure[data-toga="${i}"][data-field="broderie"]`)?.value || 'Aucune';
                        
                        message += `*Toge ${i}* :\n`;
                        message += `  - Poitrine : ${poitrine} cm\n`;
                        message += `  - Hauteur : ${hauteur} cm\n`;
                        message += `  - Tête : ${tete} cm\n`;
                        message += `  - Manches : ${manches} cm\n`;
                        message += `  - Broderie : ${broderie}\n\n`;
                    }
                    
                    message += `Merci de valider ma commande.`;
                    
                    const whatsappUrl = `https://wa.me/2250501696060?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                });
            }
        });
    }
    window.initCategoryItemCarousels = initCategoryItemCarousels;
    initCategoryItemCarousels();

    // --- Favorites (Wishlist) Logic ---
    const btnFavorites = document.getElementById('floating-favorites');
    const favoritesSidebar = document.getElementById('favorites-sidebar');
    const closeFavoritesBtn = document.getElementById('close-favorites');
    const favoritesItemsContainer = document.getElementById('favorites-items');
    const favoritesBadge = document.getElementById('favorites-badge');
    
    let favorites = JSON.parse(localStorage.getItem('ose_favorites')) || [];

    function saveFavorites() {
        localStorage.setItem('ose_favorites', JSON.stringify(favorites));
        updateFavoritesBadge();
        renderFavorites();
    }

    function updateFavoritesBadge() {
        if(favoritesBadge) {
            favoritesBadge.textContent = favorites.length;
            if(favorites.length > 0) {
                favoritesBadge.style.display = 'flex';
            } else {
                favoritesBadge.style.display = 'none';
            }
        }
    }

    function toggleFavorite(itemData) {
        const idx = favorites.findIndex(f => f.id === itemData.id);
        if (idx > -1) {
            favorites.splice(idx, 1);
        } else {
            favorites.push(itemData);
        }
        saveFavorites();
        updateFavoritesUI();
    }

    function updateFavoritesUI() {
        document.querySelectorAll('.gallery-item').forEach(card => {
            const id = card.getAttribute('data-id');
            const heartIcon = card.querySelector('.btn-favorite i');
            if (id && heartIcon) {
                const isFav = favorites.some(f => f.id === id);
                if (isFav) {
                    heartIcon.className = 'ph-fill ph-heart';
                    heartIcon.style.color = 'var(--magenta)';
                } else {
                    heartIcon.className = 'ph ph-heart';
                    heartIcon.style.color = '#333';
                }
            }
        });
    }

    function renderFavorites() {
        if (!favoritesItemsContainer) return;
        favoritesItemsContainer.innerHTML = '';
        
        if (favorites.length === 0) {
            favoritesItemsContainer.innerHTML = `
                <div style="text-align: center; color: #666; margin-top: 50px;">
                    <i class="ph ph-heart-break" style="font-size: 3rem; color: #ccc; margin-bottom: 10px;"></i>
                    <p>Aucun modèle favori pour le moment.</p>
                </div>
            `;
            return;
        }
        
        favorites.forEach(item => {
            const div = document.createElement('div');
            div.style.cssText = "display: flex; gap: 15px; background: #fafafa; border: 1px solid #eee; padding: 15px; border-radius: 12px; align-items: center; position: relative;";
            
            const firstImg = item.images.split(',')[0];
            
            div.innerHTML = `
                <img src="${firstImg}" alt="${item.modelName}" style="width: 70px; height: 90px; object-fit: cover; border-radius: 8px;">
                <div style="flex: 1;">
                    <h4 style="font-size: 1.1rem; font-weight: 700; color: #111; margin: 0 0 5px 0;">${item.modelName}</h4>
                    <p style="font-size: 0.9rem; color: #666; margin: 0 0 10px 0;">${item.category}</p>
                    <div style="display: flex; gap: 10px; align-items: center;">
                        <button class="btn-primary btn-go-favorite" style="padding: 6px 12px; font-size: 0.8rem; border-radius: 20px;" data-id="${item.id}">Commander</button>
                        <button class="btn-remove-favorite" style="background: none; border: none; color: #999; cursor: pointer; font-size: 1.2rem; display: flex; align-items: center;" data-id="${item.id}">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>
                <div style="font-weight: 700; color: #d00000; font-size: 1.1rem; align-self: flex-start;">${item.price}</div>
            `;
            
            // Delete action
            div.querySelector('.btn-remove-favorite').addEventListener('click', (e) => {
                e.stopPropagation();
                toggleFavorite(item);
            });
            
            // Commander action
            div.querySelector('.btn-go-favorite').addEventListener('click', (e) => {
                e.stopPropagation();
                favoritesSidebar.classList.remove('active');
                if (cartOverlay) cartOverlay.classList.remove('active');
                
                // Get page name from item.id (e.g. enfant-model-1 -> enfant.html)
                const pageName = item.id.split('-model-')[0] + '.html';
                
                if (window.location.pathname.endsWith(pageName)) {
                    // Already on the page, scroll to it
                    const targetEl = document.querySelector(`.gallery-item[data-id="${item.id}"]`);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        // Toggle it open
                        const expandSection = targetEl.querySelector('.expandable-section');
                        if (expandSection && !expandSection.classList.contains('active')) {
                            const btnCommander = targetEl.querySelector('.btn-commander');
                            if (btnCommander) btnCommander.click();
                        }
                    }
                } else {
                    // Redirect and scroll
                    window.location.href = `${pageName}?scroll=${item.id}`;
                }
            });
            
            favoritesItemsContainer.appendChild(div);
        });
    }

    // Toggle favorites sidebar
    if (btnFavorites) {
        btnFavorites.addEventListener('click', () => {
            favoritesSidebar.classList.add('active');
            if (cartOverlay) cartOverlay.classList.add('active');
        });
    }
    
    if (closeFavoritesBtn) {
        closeFavoritesBtn.addEventListener('click', () => {
            favoritesSidebar.classList.remove('active');
            if (cartOverlay) cartOverlay.classList.remove('active');
        });
    }
    
    // Clicking overlay closes favorites sidebar too
    if (cartOverlay) {
        cartOverlay.addEventListener('click', () => {
            favoritesSidebar.classList.remove('active');
        });
    }

    // Initial setup on category grid
    if (document.getElementById('category-grid')) {
        updateFavoritesUI();
        
        // Add click listener on all heart buttons
        document.querySelectorAll('.btn-favorite').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = btn.closest('.gallery-item');
                const id = card.getAttribute('data-id');
                const modelName = card.getAttribute('data-model');
                const category = card.getAttribute('data-category');
                const price = card.getAttribute('data-price');
                const images = card.getAttribute('data-images');
                
                toggleFavorite({ id, modelName, category, price, images });
            });
        });
    }

    // Check if redirect query param exists
    const urlParams = new URLSearchParams(window.location.search);
    const scrollToId = urlParams.get('scroll');
    if (scrollToId) {
        setTimeout(() => {
            const targetEl = document.querySelector(`.gallery-item[data-id="${scrollToId}"]`);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                const btnCommander = targetEl.querySelector('.btn-commander');
                if (btnCommander) btnCommander.click();
            }
        }, 500);
    }

    // Init favorites display
    saveFavorites();

    // --- Mobile Menu Toggle ---
    const mobileMenu = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const mobileMenuIcon = mobileMenu ? mobileMenu.querySelector('i') : null;

    if (mobileMenu && navLinks) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Toggle icon list vs X
            if (mobileMenuIcon) {
                if (navLinks.classList.contains('active')) {
                    mobileMenuIcon.className = 'ph ph-x';
                } else {
                    mobileMenuIcon.className = 'ph ph-list';
                }
            }
        });
        
        // Close menu when clicking nav links
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                navLinks.classList.remove('active');
                if (mobileMenuIcon) {
                    mobileMenuIcon.className = 'ph ph-list';
                }
            });
        });
    }

    // --- Party Emoji Confetti Celebration ---
    const emojiClickCounts = new Map();

    document.addEventListener('click', (e) => {
        const emoji = e.target.closest('.party-emoji');
        if (!emoji) return;

        if (typeof confetti !== 'function') return;

        let clicks = emojiClickCounts.get(emoji) || 0;

        if (clicks < 2) {
            confetti({
                particleCount: 60,
                spread: 50,
                origin: { y: 0.85 },
                zIndex: 99999
            });

            emojiClickCounts.set(emoji, clicks + 1);

            // Pop scale animation
            emoji.style.transform = 'scale(1.4)';
            setTimeout(() => {
                emoji.style.transform = '';
            }, 200);
        } else {
            // Shake slightly to indicate locked state
            emoji.style.transform = 'scale(0.9) rotate(-10deg)';
            setTimeout(() => {
                emoji.style.transform = '';
            }, 150);
        }
    });

    // Animate and reset every 5 seconds
    setInterval(() => {
        document.querySelectorAll('.party-emoji').forEach(emoji => {
            emojiClickCounts.set(emoji, 0); // reset limit
            emoji.classList.remove('shake');
            void emoji.offsetWidth; // trigger reflow
            emoji.classList.add('shake');
        });
    }, 5000);

    // Logo click confirmation
    document.querySelectorAll('.navbar .logo').forEach(logo => {
        logo.style.cursor = 'pointer';
        logo.addEventListener('click', () => {
            if (confirm("Voulez-vous retourner à la page d'accueil ?")) {
                window.location.href = 'index.html';
            }
        });
    });

});


// --- Quote Modal Logic ---
function openQuoteModal() {
    const quoteModal = document.getElementById('quote-modal');
    if(quoteModal) {
        quoteModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeQuoteModal() {
    const quoteModal = document.getElementById('quote-modal');
    if(quoteModal) {
        quoteModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('custom-modal-overlay') && e.target.parentElement.id === 'quote-modal') {
        closeQuoteModal();
    }
});

function toggleOtherType() {
    const typeSelect = document.getElementById('quote-type');
    const otherInput = document.getElementById('quote-type-other');
    if (typeSelect.value === 'Autre') {
        otherInput.style.display = 'block';
        otherInput.required = true;
    } else {
        otherInput.style.display = 'none';
        otherInput.required = false;
        otherInput.value = '';
    }
}

function submitQuoteForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('quote-name').value;
    const school = document.getElementById('quote-school').value;
    const phone = document.getElementById('quote-phone').value;
    const email = document.getElementById('quote-email').value;
    let type = document.getElementById('quote-type').value;
    if (type === 'Autre') {
        type = "Autre (" + document.getElementById('quote-type-other').value + ")";
    }
    const quantity = document.getElementById('quote-quantity').value;
    const date = document.getElementById('quote-date').value;
    const message = document.getElementById('quote-message').value;
    
    // Get checked options
    const options = [];
    if(document.getElementById('opt-embroidery').checked) options.push("Broderie du logo");
    if(document.getElementById('opt-sash').checked) options.push("Écharpes personnalisées");
    if(document.getElementById('opt-cap').checked) options.push("Toques avec pompons");
    
    const optionsText = options.length > 0 ? options.join(", ") : "Aucune option spécifique";
    const dateText = date ? date : "Non définie";
    const msgText = message ? `\n📝 *Précisions* : ${message}` : "";

    // WhatsApp Message formatting
    const waText = `🎓 *NOUVELLE DEMANDE DE DEVIS (GROUPE)* 🎓\n\n` +
                   `👤 *Responsable* : ${name}\n` +
                   `🏫 *Établissement* : ${school}\n` +
                   `📞 *Contact* : ${phone}\n` +
                   `✉️ *Email* : ${email}\n\n` +
                   `👕 *Type de toge* : ${type}\n` +
                   `📦 *Quantité* : ${quantity}\n` +
                   `📅 *Date prévue* : ${dateText}\n\n` +
                   `✨ *Options souhaitées* : ${optionsText}` +
                   msgText;
                   
    // Using the same WhatsApp number variable if it exists in scope, otherwise use a placeholder
    const phoneNumber = typeof whatsappNumber !== 'undefined' ? whatsappNumber : "2250501696060";
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(waText)}`;
    
    closeQuoteModal();
    window.open(waUrl, '_blank');
}

// ==========================================
// DYNAMIC CATALOG & ADMIN DASHBOARD ENGINE
// ==========================================

const DEFAULT_CATALOG = {
    "enfant": [
        { 
            id: "enfant-model-1", 
            model: "Modèle 1", 
            categoryTitle: "Collection Toges Enfant", 
            price: "25 000 FCFA", 
            images: [
                "assets/toge-enfant/model 1/PHOTO-2026-07-03-21-31-05 2.jpg", 
                "assets/toge-enfant/model 1/PHOTO-2026-07-03-21-31-04.jpg", 
                "assets/toge-enfant/model 1/PHOTO-2026-07-03-21-31-04 2.jpg", 
                "assets/toge-enfant/model 1/PHOTO-2026-07-03-21-31-04 3.jpg", 
                "assets/toge-enfant/model 1/PHOTO-2026-07-03-21-31-05.jpg"
            ] 
        },
        { 
            id: "enfant-model-2", 
            model: "Modèle 2", 
            categoryTitle: "Collection Toges Enfant", 
            price: "25 000 FCFA", 
            images: [
                "assets/toge-enfant/model 2/PHOTO-2026-07-03-21-31-06 3.jpg", 
                "assets/toge-enfant/model 2/PHOTO-2026-07-03-21-31-06.jpg", 
                "assets/toge-enfant/model 2/PHOTO-2026-07-03-21-31-06 2.jpg"
            ] 
        },
        { 
            id: "enfant-model-3", 
            model: "Modèle 3 - Couverture Spéciale Noël", 
            categoryTitle: "Collection Toges Enfant", 
            price: "25 000 FCFA", 
            images: [
                "assets/toge-enfant/PHOTO-2026-07-03-21-31-05 3.jpg"
            ] 
        },
        { 
            id: "enfant-model-4", 
            model: "Modèle 4 - Affiches & Couvertures", 
            categoryTitle: "Collection Toges Enfant", 
            price: "25 000 FCFA", 
            images: [
                "assets/toge-enfant/PHOTO-2026-07-03-21-31-06 5.jpg", 
                "assets/toge-enfant/PHOTO-2026-07-03-21-31-06 4.jpg"
            ] 
        },
        { 
            id: "enfant-model-5", 
            model: "Modèle 5", 
            categoryTitle: "Collection Toges Enfant", 
            price: "25 000 FCFA", 
            images: [
                "assets/toge-enfant/model 3/PHOTO-2026-07-27-23-26-10.jpg", 
                "assets/toge-enfant/model 3/PHOTO-2026-07-27-23-26-10 2.jpg", 
                "assets/toge-enfant/model 3/PHOTO-2026-07-27-23-26-11.jpg"
            ] 
        }
    ],
    "licence-master": [
        { id: "licence-master-model-1", model: "Modèle 1", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 1/PHOTO-2026-07-03-21-35-30 2.jpg", "assets/toge-licence-master/Model 1/PHOTO-2026-07-03-21-35-32 4.jpg", "assets/toge-licence-master/Model 1/PHOTO-2026-07-03-21-35-30.jpg", "assets/toge-licence-master/Model 1/PHOTO-2026-07-03-21-35-31.jpg"] },
        { id: "licence-master-model-2", model: "Modèle 2", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/model 2/PHOTO-2026-07-03-21-35-28 3.jpg", "assets/toge-licence-master/model 2/PHOTO-2026-07-03-21-35-28 2.jpg"] },
        { id: "licence-master-model-3", model: "Modèle 3", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 3/PHOTO-2026-07-03-21-35-29 3.jpg", "assets/toge-licence-master/Model 3/PHOTO-2026-07-03-21-35-29 2.jpg"] },
        { id: "licence-master-model-4", model: "Modèle 4", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 4/PHOTO-2026-07-03-21-35-32 3.jpg", "assets/toge-licence-master/Model 4/PHOTO-2026-07-03-21-35-32 2.jpg"] },
        { id: "licence-master-model-5", model: "Modèle 5", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 4/PHOTO-2026-07-03-21-35-31 2.jpg", "assets/toge-licence-master/Model 4/PHOTO-2026-07-03-21-35-31 3.jpg"] },
        { id: "licence-master-model-6", model: "Modèle 6", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 5/PHOTO-2026-07-03-21-35-33 2.jpg", "assets/toge-licence-master/Model 5/PHOTO-2026-07-03-21-35-33.jpg"] },
        { id: "licence-master-model-7", model: "Modèle 7", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 6/PHOTO-2026-07-03-21-35-32.jpg"] },
        { id: "licence-master-model-8", model: "Modèle 8", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 7/PHOTO-2026-07-03-21-35-29.jpg"] },
        { id: "licence-master-model-9", model: "Modèle 9", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/Model 8/PHOTO-2026-07-03-21-35-28.jpg"] },
        { id: "licence-master-model-10", model: "Modèle 10", categoryTitle: "Collection Toges Licence & Master", price: "60 000 FCFA", images: ["assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-13.jpg", "assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-13 2.jpg", "assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-14.jpg", "assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-14 2.jpg", "assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-14 3.jpg", "assets/toge-licence-master/model 9/PHOTO-2026-07-27-23-26-15.jpg"] }
    ],
    "doctorat": [
        { id: "doctorat-model-1", model: "Modèle Doctorat 1", categoryTitle: "Collection Toges Doctorat", price: "125 000 FCFA", images: ["assets/toges-doctorants/PHOTO-2026-07-03-21-46-00.jpg", "assets/toges-doctorants/PHOTO-2026-07-03-21-46-00 2.jpg", "assets/toges-doctorants/PHOTO-2026-07-03-21-46-00 3.jpg", "assets/toges-doctorants/PHOTO-2026-07-03-21-45-59.jpg"] }
    ],
    "international": [
        { id: "international-model-1", model: "Modèle International 1", categoryTitle: "Universités Privées", price: "200 000 FCFA", images: ["assets/toges-international/PHOTO-2026-07-03-22-03-42 2.jpg", "assets/toges-international/PHOTO-2026-07-03-22-03-41.jpg", "assets/toges-international/PHOTO-2026-07-03-22-03-42.jpg"] }
    ],
    "enseignants": [
        { id: "enseignants-model-1", model: "Modèle Enseignant 1", categoryTitle: "Collection Toges Enseignants", price: "150 000 FCFA", images: ["assets/toges-enseignants/PHOTO-2026-07-27-23-26-13 3.jpg", "assets/toges-enseignants/PHOTO-2026-07-27-23-26-15 2.jpg"] }
    ]
};

function getStoredCatalog() {
    try {
        const saved = localStorage.getItem('ose_catalog_data_v4');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
                return parsed;
            }
        }

        // Migrate from old storage or merge defaults
        const oldSaved = localStorage.getItem('ose_catalog_data');
        if (oldSaved) {
            const oldParsed = JSON.parse(oldSaved);
            const merged = JSON.parse(JSON.stringify(DEFAULT_CATALOG));
            Object.keys(oldParsed).forEach(cat => {
                if (!merged[cat]) {
                    merged[cat] = oldParsed[cat];
                } else {
                    oldParsed[cat].forEach(oldItem => {
                        const existingIdx = merged[cat].findIndex(m => m.id === oldItem.id);
                        if (existingIdx >= 0) {
                            merged[cat][existingIdx] = oldItem;
                        } else {
                            merged[cat].push(oldItem);
                        }
                    });
                }
            });
            localStorage.setItem('ose_catalog_data_v4', JSON.stringify(merged));
            return merged;
        }
    } catch (e) {
        console.error('Error reading saved catalog:', e);
    }
    const def = JSON.parse(JSON.stringify(DEFAULT_CATALOG));
    try {
        localStorage.setItem('ose_catalog_data_v4', JSON.stringify(def));
    } catch(e){}
    return def;
}

function saveStoredCatalog(catalog) {
    try {
        localStorage.setItem('ose_catalog_data_v4', JSON.stringify(catalog));
        localStorage.setItem('ose_catalog_data', JSON.stringify(catalog));
    } catch (e) {
        console.error('Error saving catalog to localStorage:', e);
    }
}

// Global Category titles mapping
const DEFAULT_CATEGORY_TITLES = {
    'enfant': 'Collection Toges Enfant',
    'licence-master': 'Collection Toges Licence & Master',
    'doctorat': 'Collection Toges Doctorat',
    'international': 'Universités Privées',
    'enseignants': 'Collection Toges Enseignants'
};

function getCategoryTitles() {
    try {
        const saved = localStorage.getItem('ose_category_titles');
        if (saved) {
            return { ...DEFAULT_CATEGORY_TITLES, ...JSON.parse(saved) };
        }
    } catch (e) {
        console.error('Error loading category titles:', e);
    }
    return { ...DEFAULT_CATEGORY_TITLES };
}

function saveCategoryTitle(key, title) {
    try {
        const titles = getCategoryTitles();
        titles[key] = title;
        localStorage.setItem('ose_category_titles', JSON.stringify(titles));
    } catch (e) {
        console.error('Error saving category title:', e);
    }
}

function slugify(text) {
    return text.toString().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

// --- ADMIN AUTH & CREDENTIALS ENGINE (SECURED) ---

// Hash function (SHA-256) - never store plain text passwords
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '_ose_salt_2026');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Pre-computed hash of default password 'ose' with salt
const DEFAULT_PASS_HASH = ''; // Will be computed on first run

const DEFAULT_ADMIN_CREDENTIALS = {
    username: 'admin',
    passwordHash: '' // computed at runtime
};

// Initialize default hash on load
(async function initDefaultHash() {
    const h = await hashPassword('ose');
    DEFAULT_ADMIN_CREDENTIALS.passwordHash = h;
})();

function getAdminCredentials() {
    try {
        const saved = localStorage.getItem('ose_admin_credentials_v2');
        if (saved) return JSON.parse(saved);
    } catch (e) {
        console.error('Error reading admin credentials:', e);
    }
    return { ...DEFAULT_ADMIN_CREDENTIALS };
}

async function saveAdminCredentials(username, plainPassword) {
    try {
        const hashed = await hashPassword(plainPassword);
        const creds = { username: username || 'admin', passwordHash: hashed };
        localStorage.setItem('ose_admin_credentials_v2', JSON.stringify(creds));
        return creds;
    } catch (e) {
        console.error('Error saving admin credentials:', e);
    }
}

// --- Brute-Force Protection ---
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30000; // 30 seconds

function getLoginAttempts() {
    try {
        const data = JSON.parse(sessionStorage.getItem('ose_login_attempts') || '{}');
        return data;
    } catch (e) { return {}; }
}

function recordFailedAttempt() {
    const data = getLoginAttempts();
    data.count = (data.count || 0) + 1;
    data.lastAttempt = Date.now();
    if (data.count >= MAX_LOGIN_ATTEMPTS) {
        data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }
    sessionStorage.setItem('ose_login_attempts', JSON.stringify(data));
    return data;
}

function clearLoginAttempts() {
    sessionStorage.removeItem('ose_login_attempts');
}

function isLoginLocked() {
    const data = getLoginAttempts();
    if (data.lockedUntil && Date.now() < data.lockedUntil) {
        return Math.ceil((data.lockedUntil - Date.now()) / 1000);
    }
    if (data.lockedUntil && Date.now() >= data.lockedUntil) {
        clearLoginAttempts();
    }
    return 0;
}

// --- Session Auth ---
function isSessionAuthenticated() {
    return sessionStorage.getItem('ose_admin_logged_in') === 'true';
}

function setSessionAuthenticated(isAuth) {
    if (isAuth) {
        sessionStorage.setItem('ose_admin_logged_in', 'true');
        clearLoginAttempts();
    } else {
        sessionStorage.removeItem('ose_admin_logged_in');
    }
}

// Toggle Password Visibility Handler
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-toggle-pwd');
    if (!btn) return;

    e.preventDefault();
    e.stopPropagation();

    const wrapper = btn.closest('.pwd-input-wrapper');
    if (!wrapper) return;

    const input = wrapper.querySelector('input');
    if (!input) return;

    if (input.type === 'password') {
        input.type = 'text';
        btn.innerHTML = '<i class="ph ph-eye-slash"></i>';
        btn.setAttribute('aria-label', 'Masquer le mot de passe');
    } else {
        input.type = 'password';
        btn.innerHTML = '<i class="ph ph-eye"></i>';
        btn.setAttribute('aria-label', 'Afficher le mot de passe');
    }
});

// Admin UI Initialization
let currentModalImages = [];

function initAdminPage() {
    const adminGrid = document.getElementById('admin-products-grid');
    if (!adminGrid) return; // Not on admin page

    const tabsContainer = document.getElementById('admin-category-tabs');
    const modal = document.getElementById('admin-model-modal');
    const btnOpenModal = document.getElementById('btn-open-add-modal');
    const btnCloseModal = document.getElementById('close-admin-modal');
    const adminForm = document.getElementById('admin-model-form');
    const dropzone = document.getElementById('upload-dropzone');
    const fileInput = document.getElementById('admin-file-input');
    const addUrlBtn = document.getElementById('btn-add-url-img');
    const urlInput = document.getElementById('admin-image-url-input');
    const previewGrid = document.getElementById('admin-preview-grid');
    const btnReset = document.getElementById('btn-reset-catalog');
    const categorySelect = document.getElementById('admin-model-category');
    const newCategoryWrapper = document.getElementById('admin-new-category-wrapper');
    const newCategoryInput = document.getElementById('admin-new-category-input');

    // --- Authentication Elements ---
    const loginModal = document.getElementById('admin-login-modal');
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('admin-login-error');
    const headerBar = document.getElementById('admin-header-bar');
    const mainContent = document.getElementById('admin-main-content');

    // Credentials Modal Elements
    const btnChangeCreds = document.getElementById('btn-change-credentials');
    const credsModal = document.getElementById('admin-credentials-modal');
    const closeCredsModal = document.getElementById('close-credentials-modal');
    const credsForm = document.getElementById('admin-credentials-form');
    const credsMsg = document.getElementById('credentials-msg');

    // --- Authentication Guard ---
    function checkAuthentication() {
        if (isSessionAuthenticated()) {
            // Logged in: show admin, hide login
            if (headerBar) headerBar.style.display = 'flex';
            if (mainContent) mainContent.style.display = 'block';
            if (loginModal) {
                loginModal.style.display = 'none';
                loginModal.classList.remove('active');
            }
            renderAdminGrid();
        } else {
            // Not logged in: hide admin, show login
            if (headerBar) headerBar.style.display = 'none';
            if (mainContent) mainContent.style.display = 'none';
            if (loginModal) {
                loginModal.style.display = 'flex';
                loginModal.classList.add('active');
            }
        }
    }

    // --- Login Handler (secured with hash + brute-force protection) ---
    async function performAdminLogin() {
        // Check lockout
        const lockSeconds = isLoginLocked();
        if (lockSeconds > 0) {
            if (loginError) {
                loginError.textContent = `Trop de tentatives. Réessayez dans ${lockSeconds} secondes.`;
                loginError.style.display = 'block';
            }
            return;
        }

        const uInput = document.getElementById('admin-login-username');
        const pInput = document.getElementById('admin-login-password');
        const u = uInput ? uInput.value.trim() : '';
        const p = pInput ? pInput.value.trim() : '';

        if (!p) {
            if (loginError) {
                loginError.textContent = 'Veuillez saisir votre mot de passe.';
                loginError.style.display = 'block';
            }
            if (pInput) pInput.focus();
            return;
        }

        const currentCreds = getAdminCredentials();
        const inputHash = await hashPassword(p);

        const isUserValid = !u || u.toLowerCase() === 'admin' || u.toLowerCase() === (currentCreds.username || 'admin').toLowerCase();
        const isPassValid = inputHash === currentCreds.passwordHash;

        if (isUserValid && isPassValid) {
            setSessionAuthenticated(true);
            if (loginError) loginError.style.display = 'none';
            if (pInput) pInput.value = '';
            checkAuthentication();
        } else {
            const attempts = recordFailedAttempt();
            const remaining = MAX_LOGIN_ATTEMPTS - attempts.count;
            if (remaining > 0) {
                loginError.textContent = `Identifiant ou mot de passe incorrect. ${remaining} tentative${remaining > 1 ? 's' : ''} restante${remaining > 1 ? 's' : ''}.`;
            } else {
                loginError.textContent = `Compte bloqué pendant 30 secondes.`;
            }
            if (loginError) loginError.style.display = 'block';
        }
    }

    // Login form submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            performAdminLogin();
        });
    }

    // --- Logout Handler ---
    const btnLogout = document.getElementById('btn-admin-logout');
    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            setSessionAuthenticated(false);
            window.location.href = 'index.html';
        });
    }

    // --- Credentials Modal ---
    if (btnChangeCreds && credsModal) {
        btnChangeCreds.addEventListener('click', () => {
            const creds = getAdminCredentials();
            document.getElementById('admin-new-username').value = creds.username;
            document.getElementById('admin-current-password').value = '';
            document.getElementById('admin-new-password').value = '';
            document.getElementById('admin-confirm-password').value = '';
            if (credsMsg) credsMsg.style.display = 'none';
            credsModal.classList.add('active');
        });
    }

    if (closeCredsModal && credsModal) {
        closeCredsModal.addEventListener('click', () => {
            credsModal.classList.remove('active');
        });
    }

    if (credsForm) {
        credsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newU = document.getElementById('admin-new-username').value.trim();
            const currentP = document.getElementById('admin-current-password').value;
            const newP = document.getElementById('admin-new-password').value;
            const confirmP = document.getElementById('admin-confirm-password').value;
            const creds = getAdminCredentials();

            if (currentP !== creds.password && currentP !== 'ose') {
                if (credsMsg) {
                    credsMsg.style.color = '#e53e3e';
                    credsMsg.textContent = 'Le mot de passe actuel est incorrect.';
                    credsMsg.style.display = 'block';
                }
                return;
            }

            if (newP !== confirmP) {
                if (credsMsg) {
                    credsMsg.style.color = '#e53e3e';
                    credsMsg.textContent = 'Les nouveaux mots de passe ne correspondent pas.';
                    credsMsg.style.display = 'block';
                }
                return;
            }

            saveAdminCredentials({ username: newU || 'admin', password: newP });
            if (credsMsg) {
                credsMsg.style.color = '#38a169';
                credsMsg.textContent = 'Identifiants mis à jour avec succès !';
                credsMsg.style.display = 'block';
            }
            setTimeout(() => {
                if (credsModal) credsModal.classList.remove('active');
            }, 1200);
        });
    }

    let activeCategory = 'all';

    function populateCategorySelect() {
        if (!categorySelect) return;
        const titles = getCategoryTitles();
        let optionsHtml = '';
        Object.keys(titles).forEach(catKey => {
            optionsHtml += `<option value="${catKey}">${titles[catKey]}</option>`;
        });
        optionsHtml += `<option value="__NEW__">+ Créer une nouvelle catégorie...</option>`;
        categorySelect.innerHTML = optionsHtml;
    }

    if (categorySelect && newCategoryWrapper) {
        categorySelect.addEventListener('change', (e) => {
            if (e.target.value === '__NEW__') {
                newCategoryWrapper.style.display = 'block';
                if (newCategoryInput) newCategoryInput.focus();
            } else {
                newCategoryWrapper.style.display = 'none';
            }
        });
    }

    function renderAdminTabs() {
        if (!tabsContainer) return;
        const catalog = getStoredCatalog();
        const titles = getCategoryTitles();
        const activeKeys = Object.keys(catalog);

        let tabsHtml = `<button class="admin-tab ${activeCategory === 'all' ? 'active' : ''}" data-cat="all">Toutes les catégories</button>`;
        activeKeys.forEach(key => {
            const label = titles[key] || key;
            tabsHtml += `<button class="admin-tab ${activeCategory === key ? 'active' : ''}" data-cat="${key}">${label}</button>`;
        });
        tabsContainer.innerHTML = tabsHtml;
    }

    function renderAdminGrid() {
        renderAdminTabs();
        populateCategorySelect();
        const catalog = getStoredCatalog();
        const titles = getCategoryTitles();
        adminGrid.innerHTML = '';

        let itemsToRender = [];
        if (activeCategory === 'all') {
            Object.keys(catalog).forEach(cat => {
                catalog[cat].forEach(item => {
                    itemsToRender.push({ ...item, categoryKey: cat });
                });
            });
        } else if (catalog[activeCategory]) {
            catalog[activeCategory].forEach(item => {
                itemsToRender.push({ ...item, categoryKey: activeCategory });
            });
        }

        if (itemsToRender.length === 0) {
            adminGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; background: white; border-radius: 16px; color: #718096;">Aucun modèle trouvé dans cette catégorie. Cliquez sur <strong>+ Ajouter un modèle</strong>.</div>`;
            return;
        }

        itemsToRender.forEach(item => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            const srcs = item.images && item.images.length > 0 ? item.images : ['assets/toge1.jpg'];
            const imgCount = srcs.length;

            let imagesHtml = '';
            srcs.forEach((src, j) => {
                const opacity = j === 0 ? '1' : '0';
                imagesHtml += `<img src="${src}" alt="${item.model} - ${j + 1}" loading="lazy" style="opacity:${opacity}; position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.4s ease-in-out;">\n`;
            });

            let dotsHtml = '';
            let navHtml = '';
            if (srcs.length > 1) {
                let dots = '';
                srcs.forEach((_, j) => {
                    dots += `<div class="carousel-dot ${j === 0 ? 'active' : ''}" data-index="${j}"></div>`;
                });
                dotsHtml = `<div class="carousel-dots">${dots}</div>`;
                navHtml = `
                    <button type="button" class="card-carousel-nav card-carousel-prev" aria-label="Photo précédente"><i class="ph ph-caret-left"></i></button>
                    <button type="button" class="card-carousel-nav card-carousel-next" aria-label="Photo suivante"><i class="ph ph-caret-right"></i></button>
                `;
            }

            card.innerHTML = `
                <div class="admin-card-img" style="cursor: zoom-in;" title="Cliquez pour agrandir les photos">
                    ${imagesHtml}
                    ${navHtml}
                    ${dotsHtml}
                    <div class="admin-card-badge">${imgCount} photo${imgCount > 1 ? 's' : ''}</div>
                </div>
                <div class="admin-card-body">
                    <div class="admin-card-category">${item.categoryTitle || titles[item.categoryKey] || item.categoryKey}</div>
                    <div class="admin-card-title">${item.model}</div>
                    <div class="admin-card-price">${item.price}</div>
                    <div class="admin-card-actions">
                        <button class="btn-admin-edit" data-id="${item.id}" data-cat="${item.categoryKey}">
                            <i class="ph ph-pencil-simple"></i> Modifier
                        </button>
                        <button class="btn-admin-delete" data-id="${item.id}" data-cat="${item.categoryKey}">
                            <i class="ph ph-trash"></i>
                        </button>
                    </div>
                </div>
            `;
            adminGrid.appendChild(card);

            const imgContainer = card.querySelector('.admin-card-img');
            let carousel = null;
            if (imgContainer && srcs.length > 1) {
                carousel = setupImageCarousel(imgContainer);
            }

            if (imgContainer) {
                imgContainer.addEventListener('click', (e) => {
                    if (e.target.closest('.card-carousel-nav') || e.target.closest('.carousel-dot')) {
                        return;
                    }
                    const activeIdx = carousel ? carousel.getCurrentIndex() : 0;
                    if (window.openLightbox && srcs.length > 0) {
                        window.openLightbox(srcs.join(','), activeIdx);
                    }
                });
            }
        });

        // Add event listeners for edit and delete buttons
        adminGrid.querySelectorAll('.btn-admin-edit').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const cat = btn.getAttribute('data-cat');
                openEditModal(cat, id);
            });
        });

        adminGrid.querySelectorAll('.btn-admin-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const cat = btn.getAttribute('data-cat');
                if (confirm('Voulez-vous vraiment supprimer ce modèle ?')) {
                    deleteModel(cat, id);
                }
            });
        });
    }

    // Category Tabs click listener
    if (tabsContainer) {
        tabsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('admin-tab')) {
                tabsContainer.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                activeCategory = e.target.getAttribute('data-cat');
                renderAdminGrid();
            }
        });
    }

    // Render Preview Thumbnails in Modal
    function renderPreviewThumbs() {
        previewGrid.innerHTML = '';
        currentModalImages.forEach((imgSrc, index) => {
            const item = document.createElement('div');
            item.className = 'preview-thumb-item';
            item.innerHTML = `
                <img src="${imgSrc}" alt="Miniature ${index + 1}">
                <button type="button" class="preview-thumb-remove" data-index="${index}">&times;</button>
            `;
            previewGrid.appendChild(item);
        });

        previewGrid.querySelectorAll('.preview-thumb-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                currentModalImages.splice(idx, 1);
                renderPreviewThumbs();
            });
        });
    }

    // Upload Dropzone Click & File handling
    if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            let loaded = 0;
            files.forEach(file => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    currentModalImages.push(event.target.result);
                    loaded++;
                    if (loaded === files.length) {
                        renderPreviewThumbs();
                    }
                };
                reader.readAsDataURL(file);
            });
            fileInput.value = ''; // Reset input
        });
    }

    // Add Image from URL
    if (addUrlBtn && urlInput) {
        addUrlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (url) {
                currentModalImages.push(url);
                urlInput.value = '';
                renderPreviewThumbs();
            }
        });
    }

    // Open Modal for Add
    if (btnOpenModal) {
        btnOpenModal.addEventListener('click', () => {
            populateCategorySelect();
            const modalTitle = document.getElementById('admin-modal-title');
            if (modalTitle) modalTitle.textContent = "Ajouter un nouveau modèle";
            const modalIcon = document.getElementById('admin-modal-icon');
            if (modalIcon) modalIcon.className = "ph ph-plus-circle";
            const saveBtn = document.getElementById('btn-save-model');
            if (saveBtn) saveBtn.innerHTML = '<i class="ph ph-check-circle" style="font-size: 1.2rem;"></i> Enregistrer le modèle';
            document.getElementById('edit-model-id').value = "";
            adminForm.reset();
            if (newCategoryWrapper) newCategoryWrapper.style.display = 'none';
            currentModalImages = [];
            renderPreviewThumbs();
            const modalBody = modal.querySelector('.admin-modal-body');
            if (modalBody) modalBody.scrollTop = 0;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close Modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        if (newCategoryWrapper) newCategoryWrapper.style.display = 'none';
    }
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    const btnCancelModal = document.getElementById('btn-cancel-admin-modal');
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // Open Modal for Edit
    function openEditModal(categoryKey, modelId) {
        populateCategorySelect();
        const catalog = getStoredCatalog();
        const models = catalog[categoryKey] || [];
        const item = models.find(m => m.id === modelId);
        if (!item) return;

        const modalTitle = document.getElementById('admin-modal-title');
        if (modalTitle) modalTitle.textContent = "Modifier le modèle";
        const modalIcon = document.getElementById('admin-modal-icon');
        if (modalIcon) modalIcon.className = "ph ph-pencil-simple";
        const saveBtn = document.getElementById('btn-save-model');
        if (saveBtn) saveBtn.innerHTML = '<i class="ph ph-check-circle" style="font-size: 1.2rem;"></i> Mettre à jour';

        document.getElementById('edit-model-id').value = item.id;
        document.getElementById('admin-model-category').value = categoryKey;
        if (newCategoryWrapper) newCategoryWrapper.style.display = 'none';
        document.getElementById('admin-model-title').value = item.model;
        document.getElementById('admin-model-price').value = item.price;
        currentModalImages = [...(item.images || [])];
        renderPreviewThumbs();
        const modalBody = modal.querySelector('.admin-modal-body');
        if (modalBody) modalBody.scrollTop = 0;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Delete Model
    function deleteModel(categoryKey, modelId) {
        const catalog = getStoredCatalog();
        if (catalog[categoryKey]) {
            catalog[categoryKey] = catalog[categoryKey].filter(m => m.id !== modelId);
            if (catalog[categoryKey].length === 0 && !DEFAULT_CATALOG[categoryKey]) {
                delete catalog[categoryKey]; // Remove custom category if empty
            }
            saveStoredCatalog(catalog);
            renderAdminGrid();
            refreshShopPagesIfActive();
        }
    }

    // Save/Submit Form
    if (adminForm) {
        adminForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const editId = document.getElementById('edit-model-id').value;
            let categoryKey = document.getElementById('admin-model-category').value;
            const title = document.getElementById('admin-model-title').value.trim();
            const price = document.getElementById('admin-model-price').value.trim();

            if (categoryKey === '__NEW__') {
                const newCatTitle = newCategoryInput ? newCategoryInput.value.trim() : '';
                if (!newCatTitle) {
                    alert('Veuillez saisir le nom de la nouvelle catégorie.');
                    return;
                }
                categoryKey = slugify(newCatTitle);
                saveCategoryTitle(categoryKey, newCatTitle);
            }

            if (currentModalImages.length === 0) {
                alert('Veuillez ajouter au moins une photo pour ce modèle.');
                return;
            }

            const catalog = getStoredCatalog();
            const titles = getCategoryTitles();
            if (!catalog[categoryKey]) catalog[categoryKey] = [];

            const catTitleName = titles[categoryKey] || title;

            if (editId) {
                // Edit existing
                const idx = catalog[categoryKey].findIndex(m => m.id === editId);
                if (idx !== -1) {
                    catalog[categoryKey][idx] = {
                        id: editId,
                        model: title,
                        categoryTitle: catTitleName,
                        price: price,
                        images: currentModalImages
                    };
                }
            } else {
                // Add new model
                const newId = `${categoryKey}-model-${Date.now()}`;
                catalog[categoryKey].push({
                    id: newId,
                    model: title,
                    categoryTitle: catTitleName,
                    price: price,
                    images: currentModalImages
                });
            }

            saveStoredCatalog(catalog);
            closeModal();
            renderAdminGrid();
            refreshShopPagesIfActive();
        });
    }

    // Reset Catalog
    if (btnReset) {
        btnReset.addEventListener('click', () => {
            if (confirm('Voulez-vous réinitialiser l\'ensemble du catalogue aux modèles par défaut ?')) {
                localStorage.removeItem('ose_catalog_data');
                localStorage.removeItem('ose_category_titles');
                activeCategory = 'all';
                renderAdminGrid();
                refreshShopPagesIfActive();
            }
        });
    }

    // Run auth check on page load
    checkAuthentication();
}

// Function to dynamically update shop category pages when custom items exist
function renderDynamicCategoryPage() {
    const categoryGrid = document.getElementById('category-grid');
    if (!categoryGrid) return; // Not on a category page

    // Determine current category from URL filename (e.g. enfant.html -> enfant)
    const pageName = window.location.pathname.split('/').pop().replace('.html', '');
    if (!pageName || pageName === 'index') return;

    const catalog = getStoredCatalog();
    const items = catalog[pageName];
    if (!items || items.length === 0) return;

    const titles = getCategoryTitles();
    const catTitle = titles[pageName] || 'Collection Toges';

    let gridHtml = '';
    items.forEach((item, i) => {
        const srcs = item.images && item.images.length > 0 ? item.images : ['assets/toge1.jpg'];
        const groupStr = srcs.join(',');

        let imagesHtml = '';
        srcs.forEach((src, j) => {
            const opacity = j === 0 ? '1' : '0';
            imagesHtml += `<img src="${src}" alt="${item.model} - ${j + 1}" loading="lazy" style="opacity:${opacity}; position: absolute; top:0; left:0; width: 100%; height: 100%; object-fit: cover; transition: opacity 0.5s ease-in-out;">\n`;
        });

        let dotsHtml = '';
        let navHtml = '';
        if (srcs.length > 1) {
            let dots = '';
            srcs.forEach((_, j) => {
                dots += `<div class="carousel-dot ${j === 0 ? 'active' : ''}" data-index="${j}"></div>`;
            });
            dotsHtml = `<div class="carousel-dots">${dots}</div>`;
            navHtml = `
                <button type="button" class="card-carousel-nav card-carousel-prev" aria-label="Photo précédente"><i class="ph ph-caret-left"></i></button>
                <button type="button" class="card-carousel-nav card-carousel-next" aria-label="Photo suivante"><i class="ph ph-caret-right"></i></button>
            `;
        }

        gridHtml += `
        <div class="gallery-item" data-images="${groupStr}" data-id="${item.id}" data-model="${item.model}" data-category="${catTitle}" data-price="${item.price}" style="margin-bottom: 40px; cursor: pointer;">
            <div class="gallery-image" style="position: relative; width: 100%; padding-bottom: 125%; background: #f5f5f5; overflow: hidden; cursor: zoom-in;" title="Cliquez pour agrandir les photos">
                ${imagesHtml}
                ${navHtml}
                ${dotsHtml}
                <div class="btn-favorite" style="position: absolute; top: 15px; right: 15px; z-index: 10; background: rgba(255,255,255,0.85); border: none; font-size: 20px; color: #333; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.15); cursor: pointer; transition: transform 0.2s;">
                    <i class="ph ph-heart"></i>
                </div>
            </div>
            <div class="gallery-info" style="text-align: left; padding: 15px 0; display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <div style="font-size: 0.85rem; color: #666; margin-bottom: 10px;">Couleur : <strong>Assortie</strong></div>
                    <div style="display: inline-block; background: #9c4b8b; color: white; padding: 2px 8px; font-size: 0.75rem; font-weight: bold; margin-bottom: 10px; text-transform: uppercase;">PREMIUM</div>
                    
                    <h3 style="font-family: 'Oswald', sans-serif; font-size: 1.8rem; font-weight: 700; color: #111; margin: 0 0 5px 0;">${catTitle}</h3>
                    <p style="font-size: 1.05rem; font-weight: 400; color: #666; margin-bottom: 10px;">${item.model}</p>
                    <div class="btn-description" style="text-decoration: underline; font-size: 0.9rem; color: #555; margin-bottom: 15px; cursor: pointer;">Description détaillée</div>
                    
                    <div class="item-price" style="font-size: 1.4rem; font-weight: 700; color: #d00000;">${item.price}</div>
                </div>
                <div style="margin-left: 15px; margin-top: 55px; display: flex; flex-direction: column; align-items: center; gap: 8px;">
                    <button class="btn-primary btn-commander" style="padding: 10px 20px; font-size: 0.9rem; border-radius: 30px; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                        <i class="ph ph-shopping-bag" style="font-size: 1.2rem;"></i>
                        Commander
                    </button>
                    <div class="party-emoji" style="font-size: 1.8rem; cursor: pointer; user-select: none; transition: transform 0.2s;">🎉</div>
                </div>
            </div>
            
            <div class="expandable-section" style="display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s cubic-bezier(0.25, 1, 0.5, 1); overflow: hidden; background: #fbfbfb; border-radius: 12px; margin-top: 15px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.05);">
                <div class="expandable-content" style="min-height: 0; padding: 0 20px;">
                    <div style="padding: 25px 0;">
                        <h4 style="font-family: 'Outfit', sans-serif; font-size: 1.2rem; font-weight: 700; margin-bottom: 15px; color: #111;">Formulaire de Commande</h4>
                        <div class="quantity-wrapper" style="margin-bottom: 20px;">
                            <label style="font-weight: 600; display: block; margin-bottom: 8px; font-size: 0.95rem;">Nombre de toges :</label>
                            <input type="number" class="toga-quantity-input" min="1" max="100" value="1" style="width: 80px; padding: 10px; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; font-weight: 600; text-align: center;">
                        </div>
                        <div class="toga-forms-wrapper" style="display: flex; flex-direction: column; gap: 15px;">
                        </div>
                        <button class="btn-primary btn-submit-whatsapp" style="width: 100%; margin-top: 25px; padding: 14px; font-size: 1rem; border-radius: 30px; display: flex; align-items: center; justify-content: center; gap: 10px; box-shadow: 0 4px 12px rgba(156,75,139,0.25);">
                            <i class="ph ph-whatsapp-logo" style="font-size: 1.4rem;"></i>
                            Commander sur WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    });

    categoryGrid.innerHTML = gridHtml;
    if (window.initCategoryItemCarousels) {
        window.initCategoryItemCarousels();
    }
}

function refreshShopPagesIfActive() {
    renderDynamicCategoryPage();
}

// Call Admin & Dynamic Page hooks when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initAdminPage();
    renderDynamicCategoryPage();
});
