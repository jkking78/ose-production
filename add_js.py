js = """
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
"""

with open('script.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Insert before the last });
last_bracket = content.rfind('});')
if last_bracket != -1:
    new_content = content[:last_bracket] + js + '\n});\n'
    with open('script.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("JS Updated.")
else:
    print("Could not find end of script.")
