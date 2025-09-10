// Full Home Deep Cleaning Service Page JavaScript

class HomeServicePage {
    constructor() {
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initPricingTabs();
        this.initAccordion();
        this.initScrollAnimations();
        this.initSmoothScrolling();
        this.initCTAButtons();
    }

    // Mobile Menu Functionality
    initMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close mobile menu when clicking on nav links
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!mobileToggle.contains(e.target) && !navMenu.contains(e.target)) {
                    mobileToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        }
    }

    // Accordion Functionality
    initAccordion() {
        const accordionHeaders = document.querySelectorAll('.accordion-header');
        
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                // Toggle active class on the clicked header
                header.classList.toggle('active');
                
                // Toggle show class on the content
                const content = header.nextElementSibling;
                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                } else {
                    // Close other open accordions
                    const allContents = document.querySelectorAll('.accordion-content');
                    const allHeaders = document.querySelectorAll('.accordion-header');
                    
                    allContents.forEach(item => item.classList.remove('show'));
                    allHeaders.forEach(item => item.classList.remove('active'));
                    
                    // Open clicked accordion
                    header.classList.add('active');
                    content.classList.add('show');
                }
            });
        });

        // Open first accordion by default
        const firstHeader = accordionHeaders[0];
        if (firstHeader) {
            firstHeader.classList.add('active');
            firstHeader.nextElementSibling.classList.add('show');
        }
    }

    // Pricing Tabs Functionality
    initPricingTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const pricingCards = document.querySelectorAll('.pricing-card');

        if (tabButtons.length > 0) {
            tabButtons.forEach(button => {
                button.addEventListener('click', () => {
                    // Remove active class from all buttons
                    tabButtons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');

                    // Get the target tab
                    const targetTab = button.getAttribute('data-tab');
                    
                    // Show/hide pricing cards based on tab
                    if (targetTab === 'furnished') {
                        this.updatePricingForFurnished();
                    } else {
                        this.updatePricingForNonFurnished();
                    }
                });
            });
        }
    }

    updatePricingForFurnished() {
        const classicPrice = document.querySelector('.pricing-card:first-child .plan-price');
        const platinumPrice = document.querySelector('.pricing-card:last-child .plan-price');
        
        if (classicPrice) classicPrice.textContent = '₹3,999';
        if (platinumPrice) platinumPrice.textContent = '₹4,999';
    }

    updatePricingForNonFurnished() {
        const classicPrice = document.querySelector('.pricing-card:first-child .plan-price');
        const platinumPrice = document.querySelector('.pricing-card:last-child .plan-price');
        
        if (classicPrice) classicPrice.textContent = '₹8/sq ft';
        if (platinumPrice) platinumPrice.textContent = '₹10/sq ft';
    }

    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.feature-item, .pricing-card, .process-step');
        animateElements.forEach(el => observer.observe(el));

        // Staggered animation for feature items
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });

        // Staggered animation for process steps
        const processSteps = document.querySelectorAll('.process-step');
        processSteps.forEach((step, index) => {
            step.style.animationDelay = `${index * 0.2}s`;
        });
    }

    // Smooth Scrolling
    initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // CTA Button Functionality
    initCTAButtons() {
        const ctaButtons = document.querySelectorAll('.cta-button, .plan-button');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // Add click animation
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);

                // Handle different button types
                if (button.classList.contains('plan-button')) {
                    this.handlePlanSelection(button);
                } else if (button.href && button.href.includes('tel:')) {
                    // Phone call button
                    this.trackEvent('phone_call', 'home_service_page');
                } else if (button.href && button.href.includes('contact')) {
                    // Contact page button
                    this.trackEvent('contact_page', 'home_service_page');
                }
            });
        });
    }

    handlePlanSelection(button) {
        const planCard = button.closest('.pricing-card');
        const planName = planCard.querySelector('.plan-name').textContent;
        const planPrice = planCard.querySelector('.plan-price').textContent;
        
        // Track plan selection
        this.trackEvent('plan_selected', 'home_service_page', planName);
        
        // Redirect to contact page with service parameter
        window.location.href = '../contact-us.html?service=full-home-deep-cleaning';
    }

    // Event Tracking
    trackEvent(action, category, label = '') {
        // Google Analytics or other tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                event_category: category,
                event_label: label
            });
        }
        
        // Console log for development
        console.log(`Event tracked: ${action} - ${category} - ${label}`);
    }
}

// Removed Home Cleaning Calculator

// Home Cleaning FAQ Section
class HomeFAQSection {
    constructor() {
        this.createFAQSection();
    }

    createFAQSection() {
        const faqData = [
            {
                question: "How long does full home deep cleaning take?",
                answer: "Typically 4-8 hours depending on the size of your home and level of cleaning required. Our team works efficiently while maintaining high quality standards."
            },
            {
                question: "What's the difference between furnished and non-furnished cleaning?",
                answer: "Furnished home cleaning involves working around furniture and belongings, while non-furnished cleaning is for empty homes or construction cleanup with pricing per square foot."
            },
            {
                question: "Do I need to be present during the cleaning?",
                answer: "While not mandatory, we recommend being present for the initial walkthrough. You can leave during the cleaning process if you prefer."
            },
            {
                question: "What cleaning products do you use?",
                answer: "We use eco-friendly, non-toxic cleaning products that are safe for your family and pets. All products are professional-grade and highly effective."
            },
            {
                question: "How often should I book deep cleaning?",
                answer: "We recommend deep cleaning every 3-6 months, depending on your lifestyle, family size, and personal preferences."
            }
        ];

        const faqSection = document.createElement('section');
        faqSection.className = 'home-faq-section';
        faqSection.innerHTML = `
            <div class="faq-container">
                <h2 class="section-title">Home Cleaning FAQ</h2>
                <div class="faq-list">
                    ${faqData.map((faq, index) => `
                        <div class="faq-item">
                            <button class="faq-question">
                                <span>${faq.question}</span>
                                <span class="faq-icon">+</span>
                            </button>
                            <div class="faq-answer">
                                <p>${faq.answer}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Add FAQ styles
        const style = document.createElement('style');
        style.textContent = `
            .home-faq-section {
                padding: 4rem 0;
                background: #f8fafc;
            }
            .faq-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 20px;
            }
            .faq-list {
                margin-top: 3rem;
            }
            .faq-item {
                background: white;
                border-radius: 8px;
                margin-bottom: 1rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .faq-question {
                width: 100%;
                padding: 1.5rem;
                background: none;
                border: none;
                text-align: left;
                font-size: 1.1rem;
                font-weight: 600;
                color: #1e293b;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
                transition: background 0.3s ease;
            }
            .faq-question:hover {
                background: #f8fafc;
            }
            .faq-icon {
                font-size: 1.5rem;
                color: #22c55e;
                transition: transform 0.3s ease;
            }
            .faq-item.active .faq-icon {
                transform: rotate(45deg);
            }
            .faq-answer {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            .faq-item.active .faq-answer {
                max-height: 200px;
            }
            .faq-answer p {
                padding: 0 1.5rem 1.5rem;
                color: #64748b;
                line-height: 1.6;
                margin: 0;
            }
        `;
        document.head.appendChild(style);

        // Insert FAQ section before footer
        const footer = document.querySelector('.footer');
        footer.parentNode.insertBefore(faqSection, footer);

        // Initialize FAQ functionality
        this.initFAQEvents();
    }

    initFAQEvents() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const faqItem = question.parentElement;
                const isActive = faqItem.classList.contains('active');
                
                // Close all FAQ items
                document.querySelectorAll('.faq-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    faqItem.classList.add('active');
                }
            });
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new HomeServicePage();
    new HomeFAQSection();
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#ffffff';
        header.style.backdropFilter = 'none';
    }
});
