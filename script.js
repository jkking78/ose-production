document.addEventListener('DOMContentLoaded', () => {
    // --- Confetti Celebration on Homepage Entry ---
    if (document.getElementById('accueil') && typeof confetti === 'function') {
        const duration = 2.5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            // launch a few confetti from the left edge
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                zIndex: 99999
            });
            // and launch a few confetti from the right edge
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                zIndex: 99999
            });

            // keep going until we are out of time
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

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

    function openLightbox(imagesStr) {
        if (!imagesStr) return;
        currentImages = imagesStr.replace(/\|/g, ',').split(',');
        currentIndex = 0;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
        }, 300); // Wait for transition
    }

    function updateLightbox() {
        if (currentImages.length === 0) return;
        
        // Hide arrows if only 1 image
        if (currentImages.length <= 1) {
            lightboxPrev.style.display = 'none';
            lightboxNext.style.display = 'none';
        } else {
            lightboxPrev.style.display = 'flex';
            lightboxNext.style.display = 'flex';
        }
        
        // Show counter
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        
        // Set image source
        lightboxImg.src = currentImages[currentIndex];
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightbox();
    }

    // Attach click events to Aperçu buttons
    document.querySelectorAll('.btn-icon').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent other clicks
            const imagesAttr = btn.getAttribute('data-images');
            openLightbox(imagesAttr);
        });
    });

    // Close on click outside, close button, or ESC key
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            closeLightbox();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    lightboxPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    
    lightboxNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });


    // --- Thumbnail Auto-Cycle Logic ---
    const productCardsList = document.querySelectorAll('.product-card');
    productCardsList.forEach(card => {
        const btn = card.querySelector('.btn-icon');
        const img = card.querySelector('.product-image img');
        if (btn && img) {
            const imagesAttr = btn.getAttribute('data-images');
            if (imagesAttr) {
                const images = imagesAttr.replace(/\|/g, ',').split(',');
                if (images.length > 1) {
                    let thumbIndex = 0;
                    // Preload images
                    images.forEach(src => {
                        const preloader = new Image();
                        preloader.src = src;
                    });
                    
                    // Auto cycle every 3 seconds
                    setInterval(() => {
                        // Only cycle if not hovered, to prevent annoying user who wants to click Aperçu
                        if (!card.matches(':hover')) {
                            thumbIndex = (thumbIndex + 1) % images.length;
                            // Add a small fade effect
                            img.style.opacity = 0;
                            setTimeout(() => {
                                img.src = images[thumbIndex];
                                img.style.opacity = 1;
                            }, 300);
                        }
                    }, 3000 + Math.random() * 1000); // Stagger intervals slightly
                }
            }
        }
    });

    // --- Lightbox Auto-Play Logic ---
    let lightboxInterval;

    function startLightboxAutoplay() {
        stopLightboxAutoplay();
        if (currentImages.length > 1) {
            lightboxInterval = setInterval(() => {
                nextImage();
            }, 3000);
        }
    }

    function stopLightboxAutoplay() {
        if (lightboxInterval) {
            clearInterval(lightboxInterval);
            lightboxInterval = null;
        }
    }

    // Modify openLightbox to start autoplay
    const originalOpenLightbox = openLightbox;
    openLightbox = function(imagesStr) {
        originalOpenLightbox(imagesStr);
        startLightboxAutoplay();
    };

    // Modify closeLightbox to stop autoplay
    const originalCloseLightbox = closeLightbox;
    closeLightbox = function() {
        originalCloseLightbox();
        stopLightboxAutoplay();
    };
    
    // Stop autoplay when user manually navigates
    lightboxPrev.addEventListener('click', stopLightboxAutoplay);
    lightboxNext.addEventListener('click', stopLightboxAutoplay);
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active') && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
            stopLightboxAutoplay();
        }
    });


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
    if (document.getElementById('category-grid')) {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            const srcs = item.getAttribute('data-images').split(',');
            if (srcs.length > 1) {
                let currentIndex = 0;
                const imgs = item.querySelectorAll('.gallery-image img');
                const dots = item.querySelectorAll('.carousel-dots div');
                
                if (imgs.length > 1) {
                    setInterval(() => {
                        imgs[currentIndex].style.opacity = '0';
                        if(dots[currentIndex]) dots[currentIndex].style.background = 'rgba(255,255,255,0.7)';
                        
                        currentIndex = (currentIndex + 1) % imgs.length;
                        
                        imgs[currentIndex].style.opacity = '1';
                        if(dots[currentIndex]) dots[currentIndex].style.background = 'var(--magenta)';
                    }, 2500);
                }
            }
            
            const expandSection = item.querySelector('.expandable-section');
            const qtyInput = item.querySelector('.toga-quantity-input');
            const formsWrapper = item.querySelector('.toga-forms-wrapper');
            const submitBtn = item.querySelector('.btn-submit-whatsapp');
            const modelName = item.querySelector('h3').textContent;
            
            const priceEl = item.querySelector('.item-price');
            const modelPrice = priceEl ? priceEl.textContent : '';

            // Toggle form expansion
            function toggleForm() {
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
                    if (formsWrapper.children.length === 0) {
                        generateLocalTogaForms();
                    }
                }
            }

            // Click to toggle
            const clickables = item.querySelectorAll('.gallery-image, .gallery-info');
            clickables.forEach(clickable => {
                clickable.addEventListener('click', (e) => {
                    if (e.target.closest('.expandable-section')) {
                        return;
                    }
                    e.preventDefault();
                    toggleForm();
                });
            });

            // Prevent propagation from form container
            expandSection.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Generate dynamic forms locally
            function generateLocalTogaForms() {
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

            qtyInput.addEventListener('input', generateLocalTogaForms);

            // WhatsApp direct checkout
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                let qty = parseInt(qtyInput.value) || 1;
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
        });
    }

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
