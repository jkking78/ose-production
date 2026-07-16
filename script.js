document.addEventListener('DOMContentLoaded', () => {
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
        currentImages = imagesStr.split(',');
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
                const images = imagesAttr.split(',');
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
            
            // Add click listener to open product detail
            item.addEventListener('click', () => {
                const priceEl = item.querySelector('.item-price');
                const basePrice = priceEl ? priceEl.textContent : '';

                openProductModal(srcs, 0, basePrice);
            });
        });
    }

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
