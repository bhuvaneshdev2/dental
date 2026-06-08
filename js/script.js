document.addEventListener('DOMContentLoaded', () => {
    // Capsule Navbar Sliding Indicator & Scroll Section tracking
    const navCapsule = document.querySelector('.nav-capsule');
    const navLinks = document.querySelectorAll('.nav-capsule a');
    let navIndicator = null;
    
    if (navCapsule) {
        navIndicator = document.createElement('div');
        navIndicator.classList.add('nav-indicator');
        navCapsule.appendChild(navIndicator);

        const updateIndicator = (element) => {
            if (!element) return;
            gsap.to(navIndicator, {
                width: element.offsetWidth,
                left: element.offsetLeft,
                duration: 0.35,
                ease: 'power3.out',
                overwrite: 'auto'
            });
        };

        const activeLink = navCapsule.querySelector('a.active');
        if (activeLink) {
            setTimeout(() => updateIndicator(activeLink), 150);
        }

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                updateIndicator(link);
            });

            link.addEventListener('mouseenter', () => {
                updateIndicator(link);
            });
        });

        navCapsule.addEventListener('mouseleave', () => {
            const currentActive = navCapsule.querySelector('a.active');
            if (currentActive) updateIndicator(currentActive);
        });

        window.addEventListener('resize', () => {
            const currentActive = navCapsule.querySelector('a.active');
            if (currentActive) updateIndicator(currentActive);
        });

        // Highlight capsule items on scroll dynamically
        navLinks.forEach(link => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetSec = document.querySelector(targetId);
                if (targetSec) {
                    ScrollTrigger.create({
                        trigger: targetSec,
                        start: 'top 40%',
                        end: 'bottom 40%',
                        onToggle: self => {
                            if (self.isActive) {
                                navLinks.forEach(l => l.classList.remove('active'));
                                link.classList.add('active');
                                if (navIndicator) updateIndicator(link);
                            }
                        }
                    });
                }
            }
        });
    }

    // Accordion Logic (Tab image swapping and fade animation)
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Keep current item active if clicked again (exactly one must be active)
            if (item.classList.contains('active')) return;

            // Close all other items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Open current item
            item.classList.add('active');

            // Swap service image with a smooth GSAP fade transition
            const imgPath = item.getAttribute('data-image');
            const serviceImg = document.getElementById('active-service-img');
            if (serviceImg && imgPath) {
                gsap.to(serviceImg, {
                    opacity: 0,
                    duration: 0.2,
                    onComplete: () => {
                        serviceImg.setAttribute('src', imgPath);
                        gsap.to(serviceImg, { opacity: 1, duration: 0.3 });
                    }
                });
            }
        });
    });

    // Testimonial Navigation (Mock implementation and mobile sliding)
    const reviewGrid = document.querySelector('.reviews-grid');
    const reviewPrevBtn = document.querySelector('.review-nav-btn.prev');
    const reviewNextBtn = document.querySelector('.review-nav-btn.next');

    if (reviewGrid && reviewPrevBtn && reviewNextBtn) {
        reviewPrevBtn.addEventListener('click', () => {
            const cardItem = reviewGrid.querySelector('.review-card-item');
            if (cardItem) {
                const cardWidth = cardItem.offsetWidth;
                reviewGrid.scrollBy({ left: -cardWidth - 30, behavior: 'smooth' });
            }
            reviewPrevBtn.classList.add('active');
            reviewNextBtn.classList.remove('active');
        });

        reviewNextBtn.addEventListener('click', () => {
            const cardItem = reviewGrid.querySelector('.review-card-item');
            if (cardItem) {
                const cardWidth = cardItem.offsetWidth;
                reviewGrid.scrollBy({ left: cardWidth + 30, behavior: 'smooth' });
            }
            reviewNextBtn.classList.add('active');
            reviewPrevBtn.classList.remove('active');
        });

        // Listen for scroll updates on the grid (especially useful for touch/scroll events)
        reviewGrid.addEventListener('scroll', () => {
            const maxScrollLeft = reviewGrid.scrollWidth - reviewGrid.clientWidth;
            if (reviewGrid.scrollLeft <= 15) {
                reviewPrevBtn.classList.remove('active');
                reviewNextBtn.classList.add('active');
            } else if (reviewGrid.scrollLeft >= maxScrollLeft - 15) {
                reviewNextBtn.classList.remove('active');
                reviewPrevBtn.classList.add('active');
            } else {
                // In between, make both active/clickable
                reviewPrevBtn.classList.add('active');
                reviewNextBtn.classList.add('active');
            }
        });
    }

    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Page Load Animations (Snappy Entrance)
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 0.8 } });
    
    heroTl.fromTo('.hero-bg-img', 
        { scale: 1.08, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 1.0, ease: 'power2.out' }
    );
    
    heroTl.fromTo('.navbar-floating', 
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', clearProps: 'opacity,transform' },
        '-=0.8'
    );

    // Smooth staggered slide up of hero content
    heroTl.from('.hero-rating-badge', {
        y: 20,
        opacity: 0,
        duration: 0.5
    }, '-=0.5');

    heroTl.from('.hero-title-inner', {
        y: '100%',
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out'
    }, '-=0.5');

    heroTl.from('.hero-desc-new', {
        y: 15,
        opacity: 0,
        duration: 0.5
    }, '-=0.4');

    // Animate the buttons container as a whole to prevent CSS transition conflict
    heroTl.from('.hero-cta-buttons', {
        y: 15,
        opacity: 0,
        duration: 0.5
    }, '-=0.35');

    heroTl.from('.hero-call-cta', {
        y: 10,
        opacity: 0,
        duration: 0.4
    }, '-=0.3');

    // 2. Scroll-Triggered Animations for Page Sections

    // Animate Section Titles
    document.querySelectorAll('section .section-title, section .booking-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: 'top 95%',
                toggleActions: 'play none none none'
            },
            y: 25,
            opacity: 0,
            duration: 0.75,
            ease: 'power2.out'
        });
    });

    // About Us Section Grid
    if (document.querySelector('.about-new-grid')) {
        const aboutTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.about-new',
                start: 'top 75%'
            }
        });
        
        aboutTl.from('.about-img-left', { x: -40, opacity: 0, duration: 1, ease: 'power2.out' });
        aboutTl.from('.about-new-badge-wrapper', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.8');
        aboutTl.from('.about-new-desc', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');
        aboutTl.from('.btn-book-about', { y: 15, opacity: 0, duration: 0.6 }, '-=0.6');
        aboutTl.from('.about-img-bottom', { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
        aboutTl.from('.about-img-right', { x: 40, opacity: 0, duration: 1, ease: 'power2.out' }, '-=1.2');
        aboutTl.from('.about-new-stats', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');
    }

    // Dental Phobia Section Comforts Stagger
    if (document.querySelector('.phobia-comfort')) {
        gsap.from('.phobia-img', {
            scrollTrigger: {
                trigger: '.phobia-comfort',
                start: 'top 75%'
            },
            x: -50,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.phobia-desc', {
            scrollTrigger: {
                trigger: '.phobia-right',
                start: 'top 75%'
            },
            y: 20,
            opacity: 0,
            duration: 0.8
        });

        gsap.from('.comfort-item', {
            scrollTrigger: {
                trigger: '.comfort-features',
                start: 'top 80%'
            },
            x: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // Our Services Accordion Stagger
    if (document.querySelector('.services')) {
        gsap.from('.services-img', {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 70%'
            },
            x: 50,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.accordion-item', {
            scrollTrigger: {
                trigger: '.accordion',
                start: 'top 80%'
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // Doctors Cards Grid Stagger
    if (document.querySelector('.doctors-grid')) {
        gsap.from('.doctor-card', {
            scrollTrigger: {
                trigger: '.doctors-grid',
                start: 'top 80%'
            },
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: 'power3.out'
        });
    }

    // Smile Gallery Card Stagger
    if (document.querySelector('.gallery')) {
        gsap.from('.gallery-card', {
            scrollTrigger: {
                trigger: '.gallery-content',
                start: 'top 75%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out'
        });
    }

    // Consultations Section Reveal
    if (document.querySelector('.consultations')) {
        gsap.from('.consult-main-img', {
            scrollTrigger: {
                trigger: '.consultations',
                start: 'top 75%'
            },
            x: -40,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });
        
        gsap.from('.consult-card', {
            scrollTrigger: {
                trigger: '.consultations',
                start: 'top 70%'
            },
            scale: 0.9,
            opacity: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'back.out(1.7)'
        });

        gsap.from('.consult-desc-wrapper', {
            scrollTrigger: {
                trigger: '.consultations-right',
                start: 'top 75%'
            },
            y: 30,
            opacity: 0,
            duration: 1
        });
    }

    // Insurance & Financing Section Reveal
    if (document.querySelector('.insurance-finance')) {
        gsap.from('.insurance-chip', {
            scrollTrigger: {
                trigger: '.insurance-logos-grid',
                start: 'top 80%'
            },
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'back.out(1.5)'
        });

        gsap.from('.membership-plan-card', {
            scrollTrigger: {
                trigger: '.insurance-right',
                start: 'top 75%'
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }

    // Reviews Section Cards Stagger
    if (document.querySelector('.reviews-grid')) {
        gsap.from('.review-card-item', {
            scrollTrigger: {
                trigger: '.reviews-grid',
                start: 'top 80%'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: 'power2.out'
        });
    }

    // Why Choose Us Section Reveal
    if (document.querySelector('.why-choose-us')) {
        gsap.from('.wcu-main-img', {
            scrollTrigger: {
                trigger: '.why-choose-us',
                start: 'top 75%'
            },
            scale: 0.9,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.wcu-tags', {
            scrollTrigger: {
                trigger: '.wcu-tags',
                start: 'top 80%'
            },
            y: 20,
            opacity: 0,
            duration: 0.8
        });
    }

    // Contact/CTA Section Split Reveal
    if (document.querySelector('#appointment')) {
        gsap.from('.collage-img.img-1', {
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 75%'
            },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });

        gsap.from('.collage-img.img-2', {
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 70%'
            },
            x: 40,
            y: -20,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out'
        });

        gsap.from('.collage-badge', {
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 70%'
            },
            scale: 0.7,
            opacity: 0,
            duration: 0.8,
            delay: 0.4,
            ease: 'back.out(1.8)'
        });

        gsap.from('.booking-card-new', {
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 75%'
            },
            scale: 0.96,
            opacity: 0,
            duration: 1,
            ease: 'power2.out'
        });
    }

    // Chatbot Functionality
    const launcher = document.getElementById('chatbot-launcher');
    const chatWindow = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputForm = document.getElementById('chatbot-input-form');
    const chatInput = document.getElementById('chatbot-input');
    const sendBtn = document.querySelector('.chatbot-send-btn');
    const quickReplyButtons = document.querySelectorAll('.quick-reply-btn');
    const notificationBadge = document.querySelector('.chatbot-launcher .notification-badge');

    // Toggle Chat Window
    const toggleChat = () => {
        chatWindow.classList.toggle('hidden');
        if (notificationBadge) {
            notificationBadge.style.display = 'none'; // hide badge on open
        }
        
        const chatIcon = launcher.querySelector('.chat-icon');
        const closeIcon = launcher.querySelector('.close-icon');
        if (chatWindow.classList.contains('hidden')) {
            chatIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        } else {
            chatIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
            // Auto scroll to bottom when opened
            setTimeout(() => {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 100);
        }
    };

    launcher.addEventListener('click', toggleChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleChat);

    // Style send button based on input state
    chatInput.addEventListener('input', () => {
        if (chatInput.value.trim().length > 0) {
            sendBtn.classList.add('active');
        } else {
            sendBtn.classList.remove('active');
        }
    });

    // Stateful booking variables
    let chatState = 'idle';
    let bookingForm = {
        name: '',
        email: '',
        phone: '',
        datetime: ''
    };

    // Local Knowledge base
    const knowledgeBase = {
        services: `At Rakshu Dental, we offer a wide range of dental care services, including:
1. **Dental fillings** - Natural-looking restorations for decayed/damaged teeth.
2. **Teeth whitening** - Professional stain removal for a bright smile.
3. **Oral Surgery** - Safe and gentle extractions & procedures.
4. **Dental Implants** - Durable, natural tooth replacements.

Would you like more details on any of these?`,
        
        doctors: `Our clinical team consists of highly-qualified specialists:
- **Dr. Sarah Jenkins**: Pediatric Dentist & Orthodontist.
- **Dr. Sarah Rahman**: Lead Dentist & Cosmetic Specialist.
- **Dr. Mark Peterson**: Oral Surgeon & Implant Specialist.
- **Dr. M. Thompson**: Senior Dentist & Periodontist.

They are all dedicated to providing compassionate, gentle care!`,

        booking: `Booking an appointment at Rakshu Dental is easy! You can:
1. **Call us** directly at **+91 8870341570**.
2. Click the **"Book an appointment"** button anywhere on our website to launch our online booking tool.
3. Message us directly on **WhatsApp** using the green button in the bottom-left corner!

Would you like to book a session now?`,

        freeConsult: `Yes! We offer completely **Free Doctor Consultations** under our Zero Cost Care program. 
This includes comprehensive health assessments with:
- Next-generation MRI scan reviews
- Cardiovascular & neurocognitive assessments
- Early cancer screening insights
- Genetic testing analysis

You can schedule one by calling **+91 8870341570**.`,

        discount: `Register with us today to claim an exclusive **25% discount** on your first treatment! Just enter your email in the subscription form at the bottom of the page or ask our reception desk when you arrive.`,
        
        about: `Our team of skilled and experienced dental professionals strives to create a comfortable and welcoming environment for each and every patient. We offer a wide range of services and simple ways to save on dental care.`,
        
        location: `We are located in California! Our team provides modern, comfortable dental care in a spotless, welcoming environment.`,

        contacts: `You can reach Rakshu Dental at:
- **Phone**: +91 8870341570
- **WhatsApp**: Click the green button in the bottom-left corner!
- **Hours**: Monday to Friday, 9:00 AM - 6:00 PM
- **Email**: bhuvaneshkarnan@gmail.com`,

        phobia: `At Rakshu Dental, we offer a dedicated **Dental Phobia Comfort Care** system to ensure an anxiety-free visit:
1. **Conscious Sedation** - Custom laughing gas or oral sedation options.
2. **Comfort Menu** - Noise-canceling headphones, weighted blankets, herbal teas, and Netflix streams.
3. **Gentle Explanation** - Our clinic works slowly and explains everything at your own pace.`,
        
        faq: `We have listed our top Frequently Asked Questions on the page, covering:
- First-visit expectations
- Accepted PPO insurance claims
- Pain management & comfort options
- Emergency dental treatments
- Financing & 0% interest payment plans`,

        financePlan: `For payments and financing at Rakshu Dental:
1. **PPO Insurance**: Accepted from Delta Dental, Aetna, Cigna, MetLife, Blue Shield, etc.
2. **Zero Insurance Plan**: Join our **$29/mo clinic membership plan** for 2 cleanings, x-rays, exams, and **20% off** treatments.
3. **0% Interest Financing**: Simple monthly plans through CareCredit.`
    };

    // Smart Match Logic
    const getBotResponse = (query) => {
        const cleanQuery = query.toLowerCase().trim();

        // Global Cancel Command
        if (cleanQuery === 'cancel' || cleanQuery === 'exit' || cleanQuery === 'stop') {
            if (chatState !== 'idle') {
                chatState = 'idle';
                bookingForm = { name: '', email: '', phone: '', datetime: '' };
                return `No problem! I have cancelled the booking process. What else can I help you with?`;
            }
        }

        // Stateful Booking Flow
        if (chatState === 'awaiting_name') {
            bookingForm.name = query; // keep original case
            chatState = 'awaiting_email';
            return `Nice to meet you, **${bookingForm.name}**! What is your email address so we can send confirmation details?`;
        }

        if (chatState === 'awaiting_email') {
            bookingForm.email = query;
            chatState = 'awaiting_phone';
            return `Got it. What is the best phone number to reach you?`;
        }

        if (chatState === 'awaiting_phone') {
            bookingForm.phone = query;
            chatState = 'awaiting_datetime';
            return `Perfect. Lastly, what date and time would you prefer for your appointment? (e.g., Tomorrow at 10 AM, next Monday at 2 PM)`;
        }

        if (chatState === 'awaiting_datetime') {
            bookingForm.datetime = query;
            chatState = 'idle';
            
            // Log details to console (mock save)
            console.log('--- Rakshu Dental Appointment Form ---', bookingForm);
            
            // Scroll to appointment section
            setTimeout(() => {
                const apptSection = document.getElementById('appointment');
                if (apptSection) {
                    apptSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1800);

            const confirmationMsg = `Thank you! I have registered your appointment request:
- **Name**: ${bookingForm.name}
- **Email**: ${bookingForm.email}
- **Phone**: ${bookingForm.phone}
- **Preferred Time**: ${bookingForm.datetime}

Our team will contact you shortly to confirm. I am also scrolling you down to our contact form for your reference!`;
            
            // Clear form
            bookingForm = { name: '', email: '', phone: '', datetime: '' };
            return confirmationMsg;
        }

        // Idle state: normal keyword matching & commands
        
        // Chit-chat greetings
        if (cleanQuery === 'hi' || cleanQuery === 'hello' || cleanQuery === 'hey' || cleanQuery === 'greet' || cleanQuery.startsWith('hi ') || cleanQuery.startsWith('hello ')) {
            return `Hello! How can I help you today? You can ask me about our services, meet the doctors, or book an appointment!`;
        }
        
        // Chit-chat "how are you"
        if (cleanQuery.includes('how are you') || cleanQuery.includes('how\'re you') || cleanQuery.includes('how do you do') || cleanQuery.includes('how are u')) {
            return `I'm doing great, thank you for asking! I'm here and ready to help you with bookings, specialist questions, or details about Rakshu Dental. How are you doing today?`;
        }

        // Scrolling commands
        if (cleanQuery.includes('take me to') || cleanQuery.includes('scroll to') || cleanQuery.includes('go to appointment') || cleanQuery.includes('appointment page') || cleanQuery.includes('booking page')) {
            setTimeout(() => {
                const apptSection = document.getElementById('appointment');
                if (apptSection) {
                    apptSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 1000);
            return `Sure thing! Scrolling you down to our appointment booking section now...`;
        }

        // Triggering the Booking Flow
        if (cleanQuery.includes('book') || cleanQuery.includes('appointment') || cleanQuery.includes('schedule') || cleanQuery.includes('reserve')) {
            chatState = 'awaiting_name';
            return `I can help you book an appointment right here! Let's get started. 

What is your **full name**? (Type 'cancel' at any point to stop)`;
        }

        // Check for specific services
        if (cleanQuery.includes('filling')) {
            return `Our **Dental Fillings** are designed to restore decayed or damaged teeth. We use composite materials that match your natural tooth color perfectly, protecting your tooth structure without looking metallic.`;
        }
        if (cleanQuery.includes('whitening') || cleanQuery.includes('bleach')) {
            return `Our **Teeth Whitening** treatment uses safe, professional-grade formulas to lift stubborn stains and brighten your smile by several shades in just one session!`;
        }
        if (cleanQuery.includes('implant') || cleanQuery.includes('bridge') || cleanQuery.includes('replace tooth')) {
            return `Our **Dental Implants** are a permanent, premium solution for missing teeth. They look, feel, and function exactly like natural teeth, restoring your smile and confidence.`;
        }
        if (cleanQuery.includes('surgery') || cleanQuery.includes('extraction') || cleanQuery.includes('wisdom')) {
            return `Our **Oral Surgery** team provides gentle, safe, and precise care for tooth extractions (including wisdom teeth) and complex dental procedures with minimal discomfort.`;
        }

        // Check for specific doctors
        if (cleanQuery.includes('jenkins') || cleanQuery.includes('children') || cleanQuery.includes('pediatric') || cleanQuery.includes('kids')) {
            return `**Dr. Sarah Jenkins** is our pediatric dentist & orthodontist. She is fantastic with kids and specializes in children's dental care and teeth alignment (braces/aligners).`;
        }
        if (cleanQuery.includes('rahman') || cleanQuery.includes('sarah rahman') || cleanQuery.includes('cosmetic')) {
            return `**Dr. Sarah Rahman** is our Lead Dentist & Cosmetic Specialist. She has over 12 years of experience creating stunning smile transformations using veneers, crowns, and whitening.`;
        }
        if (cleanQuery.includes('peterson') || cleanQuery.includes('mark')) {
            return `**Dr. Mark Peterson** is our Specialist Oral Surgeon & Implantologist, offering top-tier, painless implant procedures.`;
        }
        if (cleanQuery.includes('thompson') || cleanQuery.includes('periodontist') || cleanQuery.includes('gum')) {
            return `**Dr. M. Thompson** is our Senior Dentist & Periodontist, specializing in gum health, gum disease treatment, and complex restorative dentistry.`;
        }
        
        // General category matching
        if (cleanQuery.includes('phobia') || cleanQuery.includes('anxious') || cleanQuery.includes('afraid') || cleanQuery.includes('fear') || cleanQuery.includes('scared') || cleanQuery.includes('pain') || cleanQuery.includes('hurt') || cleanQuery.includes('anxiety')) {
            return knowledgeBase.phobia;
        }
        if (cleanQuery.includes('faq') || cleanQuery.includes('question') || cleanQuery.includes('common query') || cleanQuery.includes('ask')) {
            return knowledgeBase.faq;
        }
        if (cleanQuery.includes('insurance') || cleanQuery.includes('billing') || cleanQuery.includes('finance') || cleanQuery.includes('payment') || cleanQuery.includes('membership') || cleanQuery.includes('accept') || cleanQuery.includes('cost') || cleanQuery.includes('price')) {
            return knowledgeBase.financePlan;
        }
        if (cleanQuery.includes('service') || cleanQuery.includes('treatment') || cleanQuery.includes('do you do') || cleanQuery.includes('offer')) {
            return knowledgeBase.services;
        }
        if (cleanQuery.includes('doctor') || cleanQuery.includes('dentist') || cleanQuery.includes('staff') || cleanQuery.includes('team') || cleanQuery.includes('specialist')) {
            return knowledgeBase.doctors;
        }
        if (cleanQuery.includes('consult') || cleanQuery.includes('free') || cleanQuery.includes('zero cost')) {
            return knowledgeBase.freeConsult;
        }
        if (cleanQuery.includes('discount') || cleanQuery.includes('offer') || cleanQuery.includes('promo') || cleanQuery.includes('deal') || cleanQuery.includes('percent') || cleanQuery.includes('off')) {
            return knowledgeBase.discount;
        }
        if (cleanQuery.includes('about') || cleanQuery.includes('who are') || cleanQuery.includes('kristin') || cleanQuery.includes('watson')) {
            return knowledgeBase.about;
        }
        if (cleanQuery.includes('location') || cleanQuery.includes('address') || cleanQuery.includes('where') || cleanQuery.includes('map') || cleanQuery.includes('city')) {
            return knowledgeBase.location;
        }
        if (cleanQuery.includes('phone') || cleanQuery.includes('contact') || cleanQuery.includes('email') || cleanQuery.includes('number') || cleanQuery.includes('hour') || cleanQuery.includes('time') || cleanQuery.includes('open')) {
            return knowledgeBase.contacts;
        }
        if (cleanQuery.includes('review') || cleanQuery.includes('testimonial') || cleanQuery.includes('rating') || cleanQuery.includes('marie') || cleanQuery.includes('kramer')) {
            return `Patients rate Rakshu Dental at **4.9/5 stars**! 
Our patient Marie Kramer says: *"I was initially nervous... but the team made me feel completely at ease. My filling was quick, painless, and looks perfectly natural."*`;
        }

        // Polite responses
        if (cleanQuery.includes('thank') || cleanQuery.includes('thanks') || cleanQuery.includes('helpful') || cleanQuery.includes('bye')) {
            return `You're very welcome! If you need anything else, feel free to ask. Have a wonderful day!`;
        }

        // Fallback response
        return `I'm sorry, I didn't quite catch that. Could you try rephrasing? 

You can ask me questions about:
- **Services** (fillings, whitening, implants, surgery)
- **Specialist Doctors** (Dr. Jenkins, Dr. Rahman, etc.)
- **Dental Phobia Comfort** (sedation, comfort menu)
- **Insurance & Payments** ($29 plan, 0% financing)
- **Booking Appointments** or our phone number
- **Free Doctor Consultations**
- **Discounts** (25% off offer)`;
    };

    // Render message bubble
    const appendMessage = (sender, text) => {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `message-${sender}`);

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');
        
        // Parse simple markdown-like bold text **text** into html bold tags
        let htmlContent = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        // Parse newlines
        htmlContent = htmlContent.replace(/\n/g, '<br>');
        bubbleDiv.innerHTML = htmlContent;

        messageDiv.appendChild(bubbleDiv);
        messagesContainer.appendChild(messageDiv);

        // Auto Scroll
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Show/Hide Typing Indicator
    let typingIndicatorElement = null;
    const showTypingIndicator = () => {
        if (typingIndicatorElement) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'message-assistant');
        messageDiv.id = 'chatbot-typing-indicator';

        const bubbleDiv = document.createElement('div');
        bubbleDiv.classList.add('message-bubble');

        const indicator = document.createElement('div');
        indicator.classList.add('typing-indicator');
        indicator.innerHTML = '<span></span><span></span><span></span>';

        bubbleDiv.appendChild(indicator);
        messageDiv.appendChild(bubbleDiv);
        messagesContainer.appendChild(messageDiv);
        
        typingIndicatorElement = messageDiv;
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    const removeTypingIndicator = () => {
        if (typingIndicatorElement) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
    };

    // Handle bot response delay
    const handleBotReply = (queryText) => {
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = getBotResponse(queryText);
            appendMessage('assistant', reply);
        }, 800 + Math.random() * 600); // realistic variance
    };

    // Submit input handler
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userText = chatInput.value.trim();
        if (!userText) return;

        appendMessage('user', userText);
        chatInput.value = '';
        sendBtn.classList.remove('active');

        handleBotReply(userText);
    });

    // Quick Reply Buttons Click Handler
    quickReplyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const queryCategory = button.getAttribute('data-query');
            let userDisplayQuery = button.textContent;
            
            // Abort active booking flow
            if (chatState !== 'idle') {
                chatState = 'idle';
                bookingForm = { name: '', email: '', phone: '', datetime: '' };
                appendMessage('assistant', `*(Booking cancelled)*`);
            }

            appendMessage('user', userDisplayQuery);

            let simulatedQuery = queryCategory;
            // Map category queries to help the match engine
            if (queryCategory === 'services') simulatedQuery = 'services';
            if (queryCategory === 'doctors') simulatedQuery = 'doctors';
            if (queryCategory === 'free consult') simulatedQuery = 'free consultation';
            if (queryCategory === 'booking') simulatedQuery = 'booking';
            if (queryCategory === 'discount') simulatedQuery = 'discount';

            handleBotReply(simulatedQuery);
        });
    });

    // Staged animation timeline to demonstrate slider interactivity automatically
    const animateSliderDemo = (slider) => {
        gsap.killTweensOf(slider);
        
        const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
        tl.to(slider, { '--clip-pct': '35%', duration: 0.6 })
          .to(slider, { '--clip-pct': '65%', duration: 0.8 })
          .to(slider, { '--clip-pct': '50%', duration: 0.6, ease: 'power2.out' });
    };

    // Before & After Gallery Tabs switching
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryPanes = document.querySelectorAll('.gallery-pane');

    if (galleryTabs.length > 0) {
        galleryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                galleryTabs.forEach(t => t.classList.remove('active'));
                galleryPanes.forEach(pane => pane.classList.remove('active'));

                tab.classList.add('active');
                
                const category = tab.getAttribute('data-category');
                const targetPane = document.getElementById(`pane-${category}`);
                if (targetPane) {
                    targetPane.classList.add('active');
                    const slider = targetPane.querySelector('.before-after-slider');
                    if (slider) animateSliderDemo(slider);
                }
            });
        });
    }

    // FAQ Accordion Toggle
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            
            header.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    // Site Appointment Form Submit Handler
    const siteApptForm = document.getElementById('site-appointment-form');
    const bookingSuccessMsg = document.getElementById('booking-success-msg');

    if (siteApptForm) {
        siteApptForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const nameVal = document.getElementById('booking-name').value;
            const emailVal = document.getElementById('booking-email').value;
            const phoneVal = document.getElementById('booking-phone').value;
            const serviceVal = document.getElementById('booking-service').value;
            const dateVal = document.getElementById('booking-date').value;

            // Log details (mock database submit)
            console.log('--- Site Appointment Request Submitted ---', {
                name: nameVal,
                email: emailVal,
                phone: phoneVal,
                service: serviceVal,
                date: dateVal
            });

            // Hide form and show success message
            siteApptForm.style.display = 'none';
            if (bookingSuccessMsg) {
                bookingSuccessMsg.classList.remove('hidden');
            }
        });
    }

    // ===========================================
    // Premium Interactive Widgets & Animations JS
    // ===========================================

    // 1. Before & After slider interactivity
    const initBeforeAfterSliders = () => {
        const sliders = document.querySelectorAll('.before-after-slider');
        sliders.forEach(slider => {
            let isDragging = false;

            const updateSlider = (clientX) => {
                const rect = slider.getBoundingClientRect();
                const x = clientX - rect.left;
                let pct = (x / rect.width) * 100;
                
                if (pct < 0) pct = 0;
                if (pct > 100) pct = 100;

                slider.style.setProperty('--clip-pct', `${pct}%`);
            };

            const onStart = (e) => {
                isDragging = true;
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                if (clientX) updateSlider(clientX);
            };

            const onMove = (e) => {
                if (!isDragging) return;
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                if (clientX) updateSlider(clientX);
            };

            const onEnd = () => {
                isDragging = false;
            };

            slider.addEventListener('mousedown', onStart);
            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);

            slider.addEventListener('touchstart', onStart, { passive: true });
            window.addEventListener('touchmove', onMove, { passive: true });
            window.addEventListener('touchend', onEnd);

            slider.addEventListener('dblclick', () => {
                gsap.to(slider, {
                    '--clip-pct': '50%',
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });
        });
    };
    initBeforeAfterSliders();

    // ScrollTrigger to trigger the auto-slide reveal animation on load
    gsap.from('.before-after-slider-container', {
        scrollTrigger: {
            trigger: '.gallery-content',
            start: 'top 75%',
            onEnter: () => {
                const activeSlider = document.querySelector('.gallery-pane.active .before-after-slider');
                if (activeSlider) animateSliderDemo(activeSlider);
            }
        }
    });

    // 2. Back to top circular progress scroll logic
    const initBackToTop = () => {
        const bttButton = document.getElementById('back-to-top');
        const progressBar = document.querySelector('.progress-circle-bar');
        if (!bttButton || !progressBar) return;

        const radius = 40;
        const circumference = 2 * Math.PI * radius; // ~251.2px

        const updateScrollProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (docHeight <= 0) return;
            
            const scrollFraction = scrollTop / docHeight;
            const offset = circumference - (scrollFraction * circumference);
            
            progressBar.style.strokeDashoffset = offset;

            if (scrollTop > 300) {
                bttButton.classList.add('visible');
            } else {
                bttButton.classList.remove('visible');
            }
        };

        window.addEventListener('scroll', updateScrollProgress);
        updateScrollProgress();

        bttButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };
    initBackToTop();

    // 3. Premium 3D Tilt Card hover effects
    const initTiltEffects = () => {
        const cards = document.querySelectorAll('.doctor-card, .membership-plan-card');
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                const dx = x - xc;
                const dy = y - yc;
                
                const tiltX = -(dy / yc) * 8;
                const tiltY = (dx / xc) * 8;
                
                gsap.to(card, {
                    rotateX: tiltX,
                    rotateY: tiltY,
                    transformPerspective: 800,
                    ease: 'power1.out',
                    duration: 0.3,
                    overwrite: 'auto'
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    ease: 'power2.out',
                    duration: 0.5,
                    overwrite: 'auto'
                });
            });
        });
    };
    initTiltEffects();

    // 4. Dynamic Number Counter Animation
    const initCounters = () => {
        const counterElements = document.querySelectorAll('.counter-num');
        counterElements.forEach(counter => {
            const targetVal = parseFloat(counter.getAttribute('data-target'));
            const isDecimal = counter.getAttribute('data-decimal') === 'true';
            
            const obj = { val: 0 };
            gsap.to(obj, {
                scrollTrigger: {
                    trigger: counter,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                val: targetVal,
                duration: 1.8,
                ease: 'power2.out',
                onUpdate: () => {
                    counter.textContent = isDecimal ? obj.val.toFixed(1) : Math.floor(obj.val);
                }
            });
        });
    };
    initCounters();

    // Sticky header scrolled state toggle
    const initStickyHeader = () => {
        const header = document.querySelector('.navbar-floating');
        if (!header) return;

        const handleScroll = () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check once initially
    };
    initStickyHeader();
});
