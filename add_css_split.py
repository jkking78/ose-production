css = """
/* --- Split Layout for Features Section --- */
.features.split-layout {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
    align-items: stretch;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 5%;
}

.features-image-container {
    flex: 1;
    min-width: 300px;
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-lg);
}

.features-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    min-height: 400px;
}

.features-content {
    flex: 1;
    min-width: 300px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.features-content .section-header {
    margin-bottom: 30px;
}

.features-grid.stacked {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.features-grid.stacked .feature-card {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    text-align: left;
    padding: 25px;
}

.features-grid.stacked .feature-icon {
    margin-bottom: 0;
    flex-shrink: 0;
}

.features-grid.stacked h3 {
    margin-top: 5px;
    margin-bottom: 8px;
}

@media (max-width: 768px) {
    .features.split-layout {
        flex-direction: column;
    }
    .features-img {
        min-height: 300px;
    }
}
"""

with open('style.css', 'a', encoding='utf-8') as f:
    f.write('\n' + css)

print("CSS appended.")
