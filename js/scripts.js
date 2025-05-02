document.addEventListener('DOMContentLoaded', () => {
    // Add animation order to grid items
    const gridItems = document.querySelectorAll('.grid-modern > *');
    gridItems.forEach((item, index) => {
        item.style.setProperty('--order', index);
    });

    // Intersection Observer for fade-in elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });

    // Enhance carousel behavior
    const carousel = document.getElementById('skillsCarousel');
    if (carousel) {
        const carouselInstance = new bootstrap.Carousel(carousel, {
            interval: 5000,
            touch: true
        });

        // Pause carousel on hover
        carousel.addEventListener('mouseenter', () => {
            carouselInstance.pause();
        });

        carousel.addEventListener('mouseleave', () => {
            carouselInstance.cycle();
        });

        // Add smooth transitions for carousel items
        carousel.addEventListener('slide.bs.carousel', (e) => {
            const activeItem = e.relatedTarget;
            const items = document.querySelectorAll('.carousel-item');
            
            items.forEach(item => {
                item.style.transition = 'transform 0.6s ease-in-out';
            });
        });
    }
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});