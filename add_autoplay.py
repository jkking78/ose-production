with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

autoplay_js = """
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
"""

# Insert CSS for transition
with open('style.css', 'a', encoding='utf-8') as f:
    f.write("\n.product-image img { transition: opacity 0.3s ease; }\n")

# Inject JS before the end of the file (before last }); )
last_bracket = content.rfind('});')
if last_bracket != -1:
    new_content = content[:last_bracket] + autoplay_js + '\n});\n'
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("JS and CSS Updated.")
else:
    print("Could not find end of script.")
