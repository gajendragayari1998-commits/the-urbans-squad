// Contact Us Page JavaScript

class ContactUsPage {
    constructor() {
        this.selectedServices = [];
        this.serviceMap = {
            'full-home-deep-cleaning': 'Full Home Deep Cleaning',
            'full-kitchen-cleaning': 'Kitchen Cleaning',
            'full-bathroom-cleaning': 'Bathroom Cleaning',
            'sofa-carpet-mattress-cleaning': 'Sofa & Carpet Cleaning',
            'commercial-area-cleaning': 'Commercial Cleaning',
            'parking-area-cleaning': 'Parking Area Cleaning'
        };
        this.init();
    }

    init() {
        this.initMobileMenu();
        this.initServicesDropdown();
        this.initContactForm();
        this.initScrollAnimations();
        this.initSmoothScrolling();
        this.handleURLParameters();
    }

    // Mobile Menu Functionality
    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuClose = document.querySelector('.mobile-menu-close');
        const mobileDropdownToggle = document.querySelector('.mobile-dropdown-toggle');
        const mobileDropdownMenu = document.querySelector('.mobile-dropdown-menu');

        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        if (mobileMenuClose && mobileMenu) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Close mobile menu when clicking outside
        if (mobileMenu) {
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }

        // Mobile dropdown functionality
        if (mobileDropdownToggle && mobileDropdownMenu) {
            mobileDropdownToggle.addEventListener('click', () => {
                mobileDropdownMenu.classList.toggle('active');
                const icon = mobileDropdownToggle.querySelector('.mobile-dropdown-icon');
                if (icon) {
                    icon.style.transform = mobileDropdownMenu.classList.contains('active') 
                        ? 'rotate(180deg)' 
                        : 'rotate(0deg)';
                }
            });
        }
    }

    // Services Dropdown Functionality
    initServicesDropdown() {
        const dropdown = document.querySelector('.dropdown');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        let dropdownTimeout;

        if (dropdown && dropdownMenu) {
            dropdown.addEventListener('mouseenter', () => {
                clearTimeout(dropdownTimeout);
                dropdownMenu.style.opacity = '1';
                dropdownMenu.style.visibility = 'visible';
                dropdownMenu.style.transform = 'translateY(0)';
            });

            dropdown.addEventListener('mouseleave', () => {
                dropdownTimeout = setTimeout(() => {
                    dropdownMenu.style.opacity = '0';
                    dropdownMenu.style.visibility = 'hidden';
                    dropdownMenu.style.transform = 'translateY(-10px)';
                }, 150);
            });
        }
    }

    // Contact Form Functionality
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const formInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
        const submitButton = form.querySelector('.submit-button');
        const serviceSelect = form.querySelector('#service');

        // Add real-time validation
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Handle service selection
        if (serviceSelect) {
            serviceSelect.addEventListener('change', (e) => this.handleServiceSelection(e));
        }

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Phone number formatting
        const phoneInput = form.querySelector('input[name="phone"]');
        if (phoneInput) {
            phoneInput.addEventListener('input', (e) => this.formatPhoneNumber(e));
        }
    }

    // Handle URL Parameters
    handleURLParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam && this.serviceMap[serviceParam]) {
            this.addService(serviceParam);
        }
    }

    // Handle Service Selection
    handleServiceSelection(e) {
        const selectedValue = e.target.value;
        if (selectedValue && !this.selectedServices.includes(selectedValue)) {
            this.addService(selectedValue);
        }
        // Reset the select to show "Add another service"
        e.target.value = '';
    }

    // Add Service
    addService(serviceValue) {
        if (!this.selectedServices.includes(serviceValue)) {
            this.selectedServices.push(serviceValue);
            this.updateSelectedServicesDisplay();
            this.updateServiceOptions();
            this.updateHiddenInput();
            
            // Clear any validation errors
            const servicesContainer = document.querySelector('.services-container');
            if (servicesContainer) {
                this.clearFieldError(servicesContainer);
            }

            // Show confirmation message for manually added services (not URL parameter ones)
            if (window.location.search && !window.location.search.includes(`service=${serviceValue}`)) {
                const serviceName = this.serviceMap[serviceValue];
                this.showTempMessage(`${serviceName} added`, 'success');
            }
        }
    }

    // Show temporary message
    showTempMessage(message, type) {
        // Remove existing temp messages
        const existingTemp = document.querySelectorAll('.temp-message');
        existingTemp.forEach(msg => msg.remove());
        
        // Create new temp message
        const messageElement = document.createElement('div');
        messageElement.className = `temp-message temp-message-${type}`;
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'info' ? '#3b82f6' : '#ef4444'};
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(messageElement);
        
        // Animate in
        setTimeout(() => {
            messageElement.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            messageElement.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 2000);
    }

    // Remove Service
    removeService(serviceValue) {
        const serviceIndex = this.selectedServices.indexOf(serviceValue);
        if (serviceIndex > -1) {
            this.selectedServices.splice(serviceIndex, 1);
            this.updateSelectedServicesDisplay();
            this.updateServiceOptions();
            this.updateHiddenInput();
            
            // Show a brief feedback
            const serviceName = this.serviceMap[serviceValue];
            this.showTempMessage(`${serviceName} removed`, 'info');
        }
    }

    // Update Selected Services Display
    updateSelectedServicesDisplay() {
        const container = document.getElementById('selectedServices');
        if (!container) return;

        container.innerHTML = '';

        if (this.selectedServices.length === 0) {
            container.style.display = 'none';
            return;
        }

        this.selectedServices.forEach(serviceValue => {
            const serviceName = this.serviceMap[serviceValue];
            const tag = document.createElement('div');
            tag.className = 'service-tag';
            tag.innerHTML = `
                <span class="service-tag-text">${serviceName}</span>
                <button type="button" class="service-tag-remove" onclick="contactUsPage.removeService('${serviceValue}')" title="Remove service">
                    ×
                </button>
            `;
            container.appendChild(tag);
        });

        // Show container and add a helpful message
        container.style.display = 'flex';
        
        // Add services count indicator
        const servicesLabel = document.querySelector('label[for="service"]');
        if (servicesLabel) {
            const countText = servicesLabel.querySelector('.services-count') || document.createElement('span');
            countText.className = 'services-count';
            countText.textContent = ` (${this.selectedServices.length} selected)`;
            if (!servicesLabel.querySelector('.services-count')) {
                servicesLabel.appendChild(countText);
            }
        }
    }

    // Update Service Options
    updateServiceOptions() {
        const select = document.getElementById('service');
        if (!select) return;

        // Get all options except the first one (placeholder)
        const options = select.querySelectorAll('option:not(:first-child)');
        
        options.forEach(option => {
            if (this.selectedServices.includes(option.value)) {
                option.style.display = 'none';
                option.disabled = true;
            } else {
                option.style.display = 'block';
                option.disabled = false;
            }
        });

        // Update placeholder text based on selected services
        const placeholder = select.querySelector('option:first-child');
        if (placeholder) {
            placeholder.textContent = this.selectedServices.length > 0 
                ? 'Add another service' 
                : 'Select your service';
        }

        // Hide the select if all services are selected
        const availableOptions = Array.from(options).filter(option => !this.selectedServices.includes(option.value));
        const selectContainer = select.closest('.input-container');
        if (selectContainer) {
            if (availableOptions.length === 0) {
                selectContainer.style.display = 'none';
            } else {
                selectContainer.style.display = 'flex';
            }
        }
    }

    // Update Hidden Input
    updateHiddenInput() {
        const hiddenInput = document.getElementById('selectedServicesInput');
        if (hiddenInput) {
            hiddenInput.value = this.selectedServices.join(',');
        }
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Remove existing error state
        this.clearFieldError(field);

        // Validation rules
        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Name can only contain letters and spaces';
                }
                break;

            case 'selectedServices':
                if (!value || this.selectedServices.length === 0) {
                    isValid = false;
                    errorMessage = 'Please select at least one service';
                }
                break;

            case 'phone':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Phone number is required';
                } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ''))) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number';
                }
                break;
        }

        if (!isValid) {
            this.showFieldError(field, errorMessage);
        }

        return isValid;
    }

    showFieldError(field, message) {
        // Handle special case for services container
        if (field.classList && field.classList.contains('services-container')) {
            field.classList.add('error');
            
            // Create or update error message
            let errorElement = field.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.classList.add('show');
        } else {
            field.classList.add('error');
            
            // Create or update error message
            let errorElement = field.parentNode.querySelector('.error-message');
            if (!errorElement) {
                errorElement = document.createElement('div');
                errorElement.className = 'error-message';
                field.parentNode.appendChild(errorElement);
            }
            
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    clearFieldError(field) {
        // Handle special case for services container
        if (field.classList && field.classList.contains('services-container')) {
            field.classList.remove('error');
            const errorElement = field.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        } else {
            field.classList.remove('error');
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.remove('show');
            }
        }
    }

    formatPhoneNumber(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Add country code if not present
        if (value.length > 0 && !value.startsWith('91')) {
            if (value.length === 10) {
                value = '91' + value;
            }
        }
        
        // Format the number
        if (value.length >= 2) {
            value = '+' + value.substring(0, 2) + ' ' + value.substring(2);
        }
        
        e.target.value = value;
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('.submit-button');
        const submitIcon = submitButton.querySelector('.submit-icon');
        
        // Validate all fields
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;
        
        // Validate services separately
        if (this.selectedServices.length === 0) {
            isFormValid = false;
            const servicesContainer = document.querySelector('.services-container');
            if (servicesContainer) {
                this.showFieldError(servicesContainer, 'Please select at least one service');
            }
        }
        
        requiredFields.forEach(field => {
            // Skip the hidden selectedServices input as we validate it above
            if (field.name !== 'selectedServices' && !this.validateField(field)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showMessage('Please correct the errors above.', 'error');
            return;
        }
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        const originalText = submitButton.textContent;
        submitButton.innerHTML = `
            <svg class="submit-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2V6M10 14V18M18 10H14M6 10H2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            Sending...
        `;
        
        try {
            // Simulate form submission (replace with actual API call)
            await this.submitForm(formData);
            
            // Show success message
            this.showMessage('Thank you! Your message has been sent via WhatsApp. We will contact you soon.', 'success');
            form.reset();
            
            // Reset selected services
            this.selectedServices = [];
            this.updateSelectedServicesDisplay();
            this.updateServiceOptions();
            this.updateHiddenInput();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            // Reset button state
            submitButton.classList.remove('loading');
            submitButton.disabled = false;
            submitButton.innerHTML = `
                Send Me Free Quote Now!
                <svg class="submit-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 2.5L8.75 11.25M17.5 2.5L12.5 17.5L8.75 11.25M17.5 2.5L2.5 7.5L8.75 11.25" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            `;
        }
    }

    async submitForm(formData) {
        // Prepare WhatsApp message
        const name = formData.get('name');
        const phone = formData.get('phone');
        const message = formData.get('message') || 'No additional message';
        const selectedServicesStr = formData.get('selectedServices');
        
        // Convert service values to names
        const selectedServiceNames = selectedServicesStr
            .split(',')
            .map(serviceValue => this.serviceMap[serviceValue])
            .filter(Boolean);
        
        // Create WhatsApp message
        const whatsappMessage = `🏠 *New Service Inquiry from Website*

👤 *Name:* ${name}
📞 *Phone:* ${phone}

🛠️ *Requested Services:*
${selectedServiceNames.map(service => `• ${service}`).join('\n')}

💬 *Message:* ${message}

---
*Sent from UrbanDeepCleanCompany Contact Form*`;

        // WhatsApp business number
        const whatsappNumber = '+918209129975';
        
        // Create WhatsApp URL
        const whatsappURL = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(whatsappMessage)}`;
        
        // Open WhatsApp
        window.open(whatsappURL, '_blank');
        
        // Return success
        return Promise.resolve({ success: true });
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.success-message, .error-message-global');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = type === 'success' ? 'success-message show' : 'error-message-global show';
        messageElement.textContent = message;
        
        // Add styles for error message
        if (type === 'error') {
            messageElement.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
                border: 1px solid #fecaca;
            `;
        }
        
        // Insert message at the top of the form
        const form = document.getElementById('contactForm');
        if (form) {
            form.insertBefore(messageElement, form.firstChild);
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageElement.classList.remove('show');
                setTimeout(() => messageElement.remove(), 300);
            }, 5000);
        }
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
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes and observe elements
        const animatedElements = [
            { selector: '.section-header', animation: 'fade-in' },
            { selector: '.contact-form-container', animation: 'fade-in' },
            { selector: '.contact-info-item', animation: 'fade-in' },
            { selector: '.maps-section', animation: 'fade-in' },
            { selector: '.service-areas', animation: 'fade-in' }
        ];

        animatedElements.forEach(({ selector, animation }) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, index) => {
                element.classList.add(animation);
                element.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(element);
            });
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
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Contact Info Interactions
class ContactInfoEffects {
    constructor() {
        this.init();
    }

    init() {
        this.initHoverEffects();
        this.initClickToCall();
    }

    initHoverEffects() {
        const contactItems = document.querySelectorAll('.contact-info-item');
        
        contactItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const icon = item.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1.1) rotate(5deg)';
                }
            });
            
            item.addEventListener('mouseleave', () => {
                const icon = item.querySelector('.contact-icon');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    initClickToCall() {
        const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
        
        phoneLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Add a subtle animation to indicate the click
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = 'scale(1)';
                }, 150);
            });
        });
    }
}

// Map Interactions
class MapInteractions {
    constructor() {
        this.init();
    }

    init() {
        this.initMapClickHandler();
        this.initMapLoadingState();
    }

    initMapClickHandler() {
        const mapIframes = document.querySelectorAll('.map-iframe, .map-iframe-large');
        
        mapIframes.forEach(iframe => {
            iframe.addEventListener('load', () => {
                // Add a subtle border animation when map loads
                iframe.style.border = '2px solid var(--primary-color)';
                setTimeout(() => {
                    iframe.style.border = 'none';
                }, 2000);
            });
        });
    }

    initMapLoadingState() {
        const mapContainers = document.querySelectorAll('.map-container, .map-container-large');
        
        mapContainers.forEach(container => {
            const iframe = container.querySelector('iframe');
            if (iframe) {
                // Add loading indicator
                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'map-loading';
                loadingDiv.innerHTML = `
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        color: var(--primary-color);
                        font-weight: 500;
                    ">
                        Loading Map...
                    </div>
                `;
                loadingDiv.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--gray-100);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1;
                `;
                
                container.style.position = 'relative';
                container.appendChild(loadingDiv);
                
                iframe.addEventListener('load', () => {
                    setTimeout(() => {
                        loadingDiv.style.opacity = '0';
                        setTimeout(() => loadingDiv.remove(), 300);
                    }, 1000);
                });
            }
        });
    }
}

// Form Enhancement Features
class FormEnhancements {
    constructor() {
        this.init();
    }

    init() {
        this.initFloatingLabels();
        this.initFormProgress();
        this.initAutoSave();
    }

    initFloatingLabels() {
        const formGroups = document.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('.form-input, .form-select, .form-textarea');
            const label = group.querySelector('.form-label');
            
            if (input && label) {
                input.addEventListener('focus', () => {
                    label.style.color = 'var(--primary-color)';
                });
                
                input.addEventListener('blur', () => {
                    label.style.color = 'var(--text-primary)';
                });
            }
        });
    }

    initFormProgress() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const requiredFields = form.querySelectorAll('[required]');
        const progressBar = this.createProgressBar();
        
        if (progressBar) {
            form.insertBefore(progressBar, form.firstChild);
            
            requiredFields.forEach(field => {
                field.addEventListener('input', () => {
                    this.updateProgress(requiredFields, progressBar);
                });
            });
        }
    }

    createProgressBar() {
        const progressContainer = document.createElement('div');
        progressContainer.className = 'form-progress';
        progressContainer.style.cssText = `
            width: 100%;
            height: 4px;
            background: var(--gray-200);
            border-radius: 2px;
            margin-bottom: 2rem;
            overflow: hidden;
        `;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress-bar';
        progressBar.style.cssText = `
            height: 100%;
            background: linear-gradient(90deg, var(--primary-color), var(--primary-dark));
            width: 0%;
            transition: width 0.3s ease;
            border-radius: 2px;
        `;
        
        progressContainer.appendChild(progressBar);
        return progressContainer;
    }

    updateProgress(requiredFields, progressContainer) {
        const progressBar = progressContainer.querySelector('.form-progress-bar');
        let filledFields = 0;
        
        requiredFields.forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });
        
        const progress = (filledFields / requiredFields.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    initAutoSave() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        const formInputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
        
        // Load saved data
        this.loadFormData(formInputs);
        
        // Save data on input
        formInputs.forEach(input => {
            input.addEventListener('input', () => {
                this.saveFormData(formInputs);
            });
        });
        
        // Clear saved data on successful submission
        form.addEventListener('submit', () => {
            setTimeout(() => {
                localStorage.removeItem('contactFormData');
            }, 3000);
        });
    }

    saveFormData(inputs) {
        const formData = {};
        inputs.forEach(input => {
            formData[input.name] = input.value;
        });
        localStorage.setItem('contactFormData', JSON.stringify(formData));
    }

    loadFormData(inputs) {
        const savedData = localStorage.getItem('contactFormData');
        if (savedData) {
            const formData = JSON.parse(savedData);
            inputs.forEach(input => {
                if (formData[input.name]) {
                    input.value = formData[input.name];
                }
            });
        }
    }
}

// Initialize Contact Us Page
let contactUsPage;
document.addEventListener('DOMContentLoaded', () => {
    contactUsPage = new ContactUsPage();
});

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ContactUsPage();
    new ContactInfoEffects();
    new MapInteractions();
    new FormEnhancements();
});

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        // Re-initialize any features that might need refreshing
        const mapIframes = document.querySelectorAll('.map-iframe, .map-iframe-large');
        mapIframes.forEach(iframe => {
            // Refresh map if needed
            if (iframe.src) {
                const currentSrc = iframe.src;
                iframe.src = '';
                setTimeout(() => {
                    iframe.src = currentSrc;
                }, 100);
            }
        });
    }
});

// Export for potential use in other scripts
window.ContactUsPage = ContactUsPage;
window.ContactInfoEffects = ContactInfoEffects;
window.MapInteractions = MapInteractions;
window.FormEnhancements = FormEnhancements;
