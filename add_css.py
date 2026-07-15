css = """
/* Lightbox Styles */
.lightbox {
    display: none;
    position: fixed;
    z-index: 9999;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(5px);
    opacity: 0;
    transition: opacity 0.3s ease;
}

.lightbox.active {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
}

.lightbox-content {
    max-width: 90%;
    max-height: 90%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lightbox-content img {
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    user-select: none;
}

.lightbox-close {
    position: absolute;
    top: 20px;
    right: 30px;
    color: white;
    font-size: 40px;
    font-weight: 300;
    cursor: pointer;
    z-index: 10000;
    transition: color 0.2s;
}

.lightbox-close:hover {
    color: var(--primary);
}

.lightbox-prev, .lightbox-next {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    transition: background 0.2s, transform 0.2s;
    z-index: 10000;
}

.lightbox-prev:hover, .lightbox-next:hover {
    background: var(--primary);
    transform: translateY(-50%) scale(1.1);
}

.lightbox-prev {
    left: 30px;
}

.lightbox-next {
    right: 30px;
}

.lightbox-counter {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    color: white;
    font-family: var(--font-primary);
    font-size: 1rem;
    background: rgba(0,0,0,0.5);
    padding: 5px 15px;
    border-radius: 20px;
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write(css)

print("CSS Updated.")
