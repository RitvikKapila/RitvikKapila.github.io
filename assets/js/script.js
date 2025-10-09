// Centralized Content Configuration
const SITE_CONFIG = {
    title: "Ritvik Kapila",
    subtitle: "Building something new",
    description: "Former head of data research at Essential AI, where I built large scale data pipelines and evaluations for pre-training large language models. IIT Delhi and UCSD graduate. Prior experience includes data research atAmazon, and high frequency trading firms.",
    organization: "Stealth Startup",
    url: "https://ritvikkapila.github.io/"
};

// Function to update all description references
function updateSiteContent() {
    // Update meta tags
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', SITE_CONFIG.description);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', SITE_CONFIG.description);
    }
    
    const twitterDescription = document.querySelector('meta[property="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', SITE_CONFIG.description);
    }
    
    // Update JSON-LD structured data
    const jsonLdScript = document.querySelector('script[type="application/ld+json"]');
    if (jsonLdScript) {
        try {
            const jsonLd = JSON.parse(jsonLdScript.textContent);
            jsonLd.description = SITE_CONFIG.description;
            jsonLd.jobTitle = SITE_CONFIG.subtitle;
            jsonLd.worksFor.name = SITE_CONFIG.organization;
            jsonLdScript.textContent = JSON.stringify(jsonLd, null, 4);
        } catch (e) {
            console.error('Error updating JSON-LD:', e);
        }
    }
    
    // Update hero section
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.textContent = SITE_CONFIG.subtitle;
    }
    
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.textContent = SITE_CONFIG.description;
    }
}

// Initialize content updates when DOM is loaded
document.addEventListener('DOMContentLoaded', updateSiteContent);

// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar hide/show and background change on scroll
let lastScrollTop = 0;
let ticking = false;

function updateNavbar() {
    const navbar = document.querySelector('.navbar');
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Background change
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
    
    // Hide/show navbar based on scroll direction
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down - hide navbar
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up - show navbar
        navbar.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateNavbar);
        ticking = true;
    }
}

window.addEventListener('scroll', requestTick);

// Active navigation link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.news-item, .publication-item, .teaching-item, .scholarship-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Typing effect for hero title (optional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing effect on page load
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        // Uncomment the line below to enable typing effect
        // typeWriter(heroTitle, originalText, 50);
    }
});

// Email obfuscation (basic protection)
document.addEventListener('DOMContentLoaded', () => {
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Add click tracking or other functionality here if needed
            console.log('Email link clicked');
        });
    });
});

// External link handling
document.addEventListener('DOMContentLoaded', () => {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
});

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Add scroll to top button
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #3498db;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        opacity: 0;
        visibility: hidden;
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Hover effects
    scrollToTopBtn.addEventListener('mouseenter', () => {
        scrollToTopBtn.style.transform = 'translateY(-3px)';
        scrollToTopBtn.style.boxShadow = '0 6px 20px rgba(52, 152, 219, 0.4)';
    });
    
    scrollToTopBtn.addEventListener('mouseleave', () => {
        scrollToTopBtn.style.transform = 'translateY(0)';
        scrollToTopBtn.style.boxShadow = '0 4px 12px rgba(52, 152, 219, 0.3)';
    });
});

// Performance optimization: Lazy loading for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// Year filtering for news section
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for DOM to be fully loaded
    setTimeout(() => {
        const yearSelector = document.getElementById('yearSelector');
        const newsItems = document.querySelectorAll('.news-item');
        
        console.log('Year selector found:', !!yearSelector);
        console.log('News items found:', newsItems.length);
        
        if (yearSelector && newsItems.length > 0) {
            // Filter news items function
            const filterNews = (selectedYear) => {
                console.log('Filtering for year:', selectedYear);
                let visibleCount = 0;
                
                newsItems.forEach((item, index) => {
                    const itemYear = item.getAttribute('data-year');
                    console.log(`Item ${index}: year=${itemYear}, selected=${selectedYear}`);
                    
                    if (selectedYear === 'all' || itemYear === selectedYear) {
                        item.style.display = 'block';
                        item.style.visibility = 'visible';
                        item.classList.remove('hidden');
                        visibleCount++;
                        console.log(`Showing item ${index} for year ${itemYear}`);
                    } else {
                        item.style.display = 'none';
                        item.style.visibility = 'hidden';
                        item.classList.add('hidden');
                        console.log(`Hiding item ${index} for year ${itemYear}`);
                    }
                });
                
                console.log(`Total visible items: ${visibleCount}`);
            };
            
            // Set default to 2025 and filter on page load
            yearSelector.value = '2025';
            filterNews('2025');
            
            // Add event listener for year changes
            yearSelector.addEventListener('change', (e) => {
                const selectedYear = e.target.value;
                console.log('Year changed to:', selectedYear);
                filterNews(selectedYear);
            });
        } else {
            console.error('Year selector or news items not found!');
        }
    }, 100);
});

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        // Let the form submit naturally to Formspree
        contactForm.addEventListener('submit', (e) => {
            // Show loading state
            formStatus.textContent = 'Sending message...';
            formStatus.className = 'form-status success';
            formStatus.style.display = 'block';
        });
        
        // Handle form submission success/error
        contactForm.addEventListener('formspree', (e) => {
            if (e.detail.success) {
                formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                formStatus.className = 'form-status success';
                contactForm.reset();
            } else {
                formStatus.textContent = 'Sorry, there was an error sending your message. Please try again or email me directly.';
                formStatus.className = 'form-status error';
            }
            
            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }
});

// Test function for debugging
function testFilter() {
    const newsItems = document.querySelectorAll('.news-item');
    console.log('Total news items:', newsItems.length);
    newsItems.forEach((item, index) => {
        const year = item.getAttribute('data-year');
        const display = item.style.display;
        console.log(`Item ${index}: year=${year}, display=${display}`);
    });
}



// Console welcome message
console.log('%c👋 Welcome to Ritvik Kapila\'s Website!', 'color: #3498db; font-size: 16px; font-weight: bold;');
console.log('%cBuilt with ❤️ for the academic community', 'color: #666; font-size: 12px;');
