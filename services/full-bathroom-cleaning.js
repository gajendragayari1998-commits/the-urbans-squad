/**
 * Full Bathroom Cleaning Service Page JavaScript
 * Handles navigation, FAQ accordion, animations, and bathroom-specific functionality
 */

// Main Bathroom Service Page Class
class BathroomServicePage {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeComponents();
        this.setupAnimations();
        this.setupPerformanceOptimizations();
    }

    setupEventListeners() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
            });
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        // Navigation events
        this.setupNavigation();
        
        // FAQ events
        this.setupFAQ();
        
        // Smooth scrolling for anchor links
        this.setupSmoothScrolling();
        
        // Form handling if any
        this.setupFormHandling();
        
        // Resize events
        window.addEventListener('resize', Utils.debounce(() => {
            this.handleResize();
        }, 250));
    }

    initializeComponents() {
        // Initialize service features
        this.serviceFeatures = new BathroomServiceFeatures();
        
        // Initialize pricing cards
        this.pricingCards = new PricingCards();
        
        // Initialize analytics
        this.analytics = new Analytics();
        
        // Initialize error handler
        this.errorHandler = new ErrorHandler();
    }

    setupAnimations() {
        // Initialize intersection observer for animations
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in');
        animatedElements.forEach(el => {
            this.animationObserver.observe(el);
        });
    }

    setupNavigation() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileNav = document.querySelector('.mobile-nav');
        const navDropdownBtns = document.querySelectorAll('.nav-dropdown-btn');
        const mobileNavDropdownBtns = document.querySelectorAll('.mobile-nav-dropdown-btn');

        // Mobile menu toggle
        if (mobileMenuBtn && mobileNav) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenuBtn.classList.toggle('active');
                mobileNav.classList.toggle('active');
                document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            });

            // Close mobile menu when clicking outside
            mobileNav.addEventListener('click', (e) => {
                if (e.target === mobileNav) {
                    mobileMenuBtn.classList.remove('active');
                    mobileNav.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Desktop dropdown navigation
        navDropdownBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', !isExpanded);
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!btn.closest('.nav-dropdown').contains(e.target)) {
                    btn.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Mobile dropdown navigation
        mobileNavDropdownBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const dropdown = btn.closest('.mobile-nav-dropdown');
                dropdown.classList.toggle('active');
            });
        });
    }

    setupFAQ() {
        const faqItems = document.querySelectorAll('.faq-item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            if (question) {
                question.addEventListener('click', () => {
                    const isExpanded = question.getAttribute('aria-expanded') === 'true';
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            const otherQuestion = otherItem.querySelector('.faq-question');
                            otherQuestion.setAttribute('aria-expanded', 'false');
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    question.setAttribute('aria-expanded', !isExpanded);
                    item.classList.toggle('active');
                    
                    // Track FAQ interaction
                    this.analytics.trackEvent('FAQ', 'toggle', question.textContent.trim());
                });
            }
        });
    }

    setupSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupFormHandling() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });
    }

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Track form submission
        this.analytics.trackEvent('Form', 'submit', form.id || 'unknown');
        
        // Here you would typically send the data to your server
        console.log('Form submitted:', data);
    }

    setupPerformanceOptimizations() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    handleResize() {
        // Handle responsive behavior on resize
        const mobileNav = document.querySelector('.mobile-nav');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth >= 1024) {
            // Desktop view - close mobile menu if open
            if (mobileNav && mobileNav.classList.contains('active')) {
                mobileNav.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }
}

// Bathroom Service Features Class
class BathroomServiceFeatures {
    constructor() {
        this.features = document.querySelectorAll('.feature-item');
        this.init();
    }

    init() {
        this.setupFeatureInteractions();
        this.setupFeatureAnimations();
    }

    setupFeatureInteractions() {
        this.features.forEach((feature, index) => {
            feature.addEventListener('mouseenter', () => {
                this.highlightFeature(feature, index);
            });

            feature.addEventListener('mouseleave', () => {
                this.unhighlightFeature(feature);
            });
        });
    }

    setupFeatureAnimations() {
        // Stagger animation for features
        this.features.forEach((feature, index) => {
            feature.style.animationDelay = `${index * 0.1}s`;
            feature.classList.add('fade-in');
        });
    }

    highlightFeature(feature, index) {
        feature.style.transform = 'translateY(-2px)';
        feature.style.boxShadow = '0 4px 12px rgba(34, 197, 94, 0.15)';
        
        // Track feature interaction
        const analytics = new Analytics();
        analytics.trackEvent('Feature', 'hover', `bathroom-feature-${index + 1}`);
    }

    unhighlightFeature(feature) {
        feature.style.transform = '';
        feature.style.boxShadow = '';
    }
}

// Pricing Cards Class
class PricingCards {
    constructor() {
        this.cards = document.querySelectorAll('.pricing-card');
        this.init();
    }

    init() {
        this.setupCardInteractions();
        this.setupCardAnimations();
    }

    setupCardInteractions() {
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.handleCardClick(card, index);
            });

            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });

            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
        });
    }

    setupCardAnimations() {
        // Stagger animation for pricing cards
        this.cards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
            card.classList.add('scale-in');
        });
    }

    handleCardClick(card, index) {
        const cardTitle = card.querySelector('.card-title').textContent;
        
        // Track card click
        const analytics = new Analytics();
        analytics.trackEvent('Pricing', 'click', cardTitle);
        
        console.log(`Clicked on ${cardTitle} pricing card`);
    }

    animateCardHover(card, isHovering) {
        if (isHovering) {
            card.style.transform = 'translateY(-4px)';
            card.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        } else {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        }
    }
}

// Bathroom Cleaning Calculator Class
class BathroomCleaningCalculator {
    constructor() {
        this.createCalculatorModal();
        this.setupCalculator();
    }

    createCalculatorModal() {
        const modal = document.createElement('div');
        modal.className = 'bathroom-calculator-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Bathroom Cleaning Cost Calculator</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="calculator-form">
                            <div class="form-group">
                                <label for="bathroom-type">Bathroom Type:</label>
                                <select id="bathroom-type">
                                    <option value="standard">Standard Bathroom</option>
                                    <option value="master">Master Bathroom</option>
                                    <option value="powder">Powder Room</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="cleaning-type">Cleaning Type:</label>
                                <select id="cleaning-type">
                                    <option value="basic">Basic Clean - ₹799</option>
                                    <option value="deep">Deep Clean - ₹999</option>
                                    <option value="premium">Premium Clean - ₹1299</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="frequency">Frequency:</label>
                                <select id="frequency">
                                    <option value="one-time">One-time</option>
                                    <option value="weekly">Weekly (10% discount)</option>
                                    <option value="bi-weekly">Bi-weekly (5% discount)</option>
                                    <option value="monthly">Monthly</option>
                                </select>
                            </div>
                            <div class="calculator-result">
                                <div class="total-cost">
                                    <span class="cost-label">Estimated Cost:</span>
                                    <span class="cost-amount" id="total-cost">₹999</span>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-full" id="book-service">Book This Service</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .bathroom-calculator-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: none;
                align-items: center;
                justify-content: center;
                z-index: 2000;
            }
            .modal-overlay {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .modal-content {
                background: white;
                border-radius: 12px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
            }
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
            }
            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #6b7280;
            }
            .modal-body {
                padding: 20px;
            }
            .calculator-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            .form-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .form-group label {
                font-weight: 600;
                color: #374151;
            }
            .form-group select {
                padding: 12px;
                border: 1px solid #d1d5db;
                border-radius: 8px;
                font-size: 16px;
            }
            .calculator-result {
                background: #dcfce7;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
            }
            .total-cost {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            .cost-amount {
                font-size: 24px;
                font-weight: 700;
                color: #22c55e;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
    }

    setupCalculator() {
        const modal = document.querySelector('.bathroom-calculator-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const bathroomType = modal.querySelector('#bathroom-type');
        const cleaningType = modal.querySelector('#cleaning-type');
        const frequency = modal.querySelector('#frequency');
        const totalCost = modal.querySelector('#total-cost');
        const bookBtn = modal.querySelector('#book-service');

        // Close modal
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        // Update calculation
        const updateCost = () => {
            let baseCost = 999; // Default deep clean
            
            if (cleaningType.value === 'basic') baseCost = 799;
            else if (cleaningType.value === 'premium') baseCost = 1299;

            // Bathroom type multiplier
            if (bathroomType.value === 'master') baseCost *= 1.3;
            else if (bathroomType.value === 'powder') baseCost *= 0.7;

            // Frequency discount
            if (frequency.value === 'weekly') baseCost *= 0.9;
            else if (frequency.value === 'bi-weekly') baseCost *= 0.95;

            totalCost.textContent = `₹${Math.round(baseCost)}`;
        };

        [bathroomType, cleaningType, frequency].forEach(element => {
            element.addEventListener('change', updateCost);
        });

        // Book service
        bookBtn.addEventListener('click', () => {
            window.location.href = '../contact-us.html';
        });

        // Initial calculation
        updateCost();
    }

    show() {
        const modal = document.querySelector('.bathroom-calculator-modal');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static formatCurrency(amount, currency = 'INR') {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 0
        }).format(amount);
    }

    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 24px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease'
        });

        const colors = {
            info: '#3b82f6',
            success: '#22c55e',
            warning: '#f59e0b',
            error: '#ef4444'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Analytics Class
class Analytics {
    constructor() {
        this.events = [];
        this.sessionStart = Date.now();
    }

    trackEvent(category, action, label = '', value = 0) {
        const event = {
            category,
            action,
            label,
            value,
            timestamp: Date.now(),
            sessionTime: Date.now() - this.sessionStart
        };

        this.events.push(event);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }

        console.log('Analytics Event:', event);
    }

    trackPageView(page = window.location.pathname) {
        this.trackEvent('Page', 'view', page);
    }

    trackUserEngagement() {
        let maxScroll = 0;
        window.addEventListener('scroll', Utils.throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) {
                    this.trackEvent('Engagement', 'scroll', `${maxScroll}%`);
                }
            }
        }, 1000));

        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.sessionStart) / 1000);
            this.trackEvent('Engagement', 'time_on_page', '', timeOnPage);
        });
    }
}

// Error Handler Class
class ErrorHandler {
    constructor() {
        this.setupGlobalErrorHandling();
    }

    setupGlobalErrorHandling() {
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason);
        });
    }

    logError(type, error) {
        const errorInfo = {
            type,
            message: error.message || error,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        console.error('Error logged:', errorInfo);
    }

    handleAsyncError(promise) {
        return promise.catch(error => {
            this.logError('Async Operation Error', error);
            throw error;
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize main application
        const app = new BathroomServicePage();
        
        // Track initial page view
        const analytics = new Analytics();
        analytics.trackPageView();
        analytics.trackUserEngagement();
        
        console.log('Bathroom Cleaning Service page initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        const errorHandler = new ErrorHandler();
        errorHandler.logError('Initialization Error', error);
    }
});

// Export classes for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        BathroomServicePage,
        BathroomServiceFeatures,
        PricingCards,
        Utils,
        Analytics,
        ErrorHandler
    };
}
