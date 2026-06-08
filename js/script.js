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
    const isMobileViewport = () => window.innerWidth <= 768;

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
        
        aboutTl.from('.about-img-left', { x: isMobileViewport() ? 0 : -40, y: isMobileViewport() ? 20 : 0, opacity: 0, duration: 1, ease: 'power2.out', clearProps: 'transform' });
        aboutTl.from('.about-new-badge-wrapper', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.8');
        aboutTl.from('.about-new-desc', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');
        aboutTl.from('.btn-book-about', { y: 15, opacity: 0, duration: 0.6 }, '-=0.6');
        aboutTl.from('.about-img-bottom', { scale: 0.9, opacity: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4');
        aboutTl.from('.about-img-right', { x: isMobileViewport() ? 0 : 40, y: isMobileViewport() ? 20 : 0, opacity: 0, duration: 1, ease: 'power2.out', clearProps: 'transform' }, '-=1.2');
        aboutTl.from('.about-new-stats', { y: 20, opacity: 0, duration: 0.8 }, '-=0.6');
    }

    // Dental Phobia Section Comforts Stagger
    if (document.querySelector('.phobia-comfort')) {
        gsap.from('.phobia-img', {
            scrollTrigger: {
                trigger: '.phobia-comfort',
                start: 'top 75%'
            },
            x: isMobileViewport() ? 0 : -50,
            y: isMobileViewport() ? 20 : 0,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            clearProps: 'transform'
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
            x: isMobileViewport() ? 0 : 40,
            y: isMobileViewport() ? 20 : 0,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power2.out',
            clearProps: 'transform'
        });
    }

    // Our Services Accordion Stagger
    if (document.querySelector('.services')) {
        gsap.from('.services-img', {
            scrollTrigger: {
                trigger: '.services',
                start: 'top 70%'
            },
            x: isMobileViewport() ? 0 : 50,
            y: isMobileViewport() ? 20 : 0,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            clearProps: 'transform'
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
            x: isMobileViewport() ? 0 : -40,
            y: isMobileViewport() ? 20 : 0,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            clearProps: 'transform'
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
        const isMobile = () => window.innerWidth <= 992;
        gsap.from('.review-card-item', {
            scrollTrigger: {
                trigger: '.reviews-section',
                start: 'top 90%'
            },
            y: isMobile() ? 0 : 30,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            clearProps: 'transform,opacity'
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
            x: isMobileViewport() ? 0 : -40,
            y: isMobileViewport() ? 20 : 0,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            clearProps: 'transform'
        });

        gsap.from('.collage-img.img-2', {
            scrollTrigger: {
                trigger: '#appointment',
                start: 'top 70%'
            },
            x: isMobileViewport() ? 0 : 40,
            y: -20,
            opacity: 0,
            duration: 1.2,
            ease: 'power2.out',
            clearProps: 'transform'
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
    let userName = ''; // Conversational Memory
    let bookingForm = { name: '', email: '', phone: '', datetime: '' };

    // Massive AI Intent Dictionary
    const aiIntents = [
        {
            name: "emergency",
            keywords: ["emergency", "pain", "hurt", "bleeding", "knocked", "swollen", "toothache", "broken", "severe", "blood", "accident"],
            responses: [
                "I'm so sorry you're in pain! For dental emergencies, please call us immediately at **+91 8870341570**. If it's outside our 9 AM - 6 PM hours, our voicemail will connect you to the on-call emergency dentist.",
                "Dental pain is awful, and we want to help right away. Please call our emergency line at **+91 8870341570**. We reserve slots every day for urgent care like broken teeth or severe toothaches."
            ]
        },
        {
            name: "booking",
            keywords: ["book", "appointment", "schedule", "reserve", "see a doctor", "visit", "consultation"],
            responses: [
                "I can definitely help you set up an appointment! To get started, what is your **full name**? (Type 'cancel' anytime to stop)"
            ]
        },
        {
            name: "pricing_insurance",
            keywords: ["cost", "price", "insurance", "delta", "cigna", "aetna", "metlife", "blue", "payment", "financing", "expensive", "cheap", "carecredit", "membership", "plan"],
            responses: [
                "We believe premium dental care should be affordable! We accept most major PPOs (Delta Dental, Aetna, Cigna, MetLife). No insurance? Join our **$29/mo clinic membership** for free cleanings and 20% off all treatments. We also offer 0% interest financing through CareCredit.",
                "Financing is easy with us! We accept all major PPO insurance plans. If you are uninsured, our $29/month Rakshu Dental Plan covers your yearly cleanings and gives a 20% discount on surgeries and implants. We also have 0% monthly payment options!"
            ]
        },
        {
            name: "services_general",
            keywords: ["services", "treatments", "what do you do", "offerings", "options", "dental care"],
            responses: [
                "At Rakshu Dental, we offer a full suite of services: \n- **Fillings & Cleanings**\n- **Teeth Whitening**\n- **Oral Surgery & Extractions**\n- **Premium Dental Implants**\nWhich service would you like to know more about?",
                "We are a full-service clinic! Whether you need a simple general cleaning, cosmetic teeth whitening, root canals, or advanced dental implants, our specialists have you covered. Is there a specific treatment you're looking for?"
            ]
        },
        {
            name: "whitening",
            keywords: ["whitening", "bleach", "stains", "yellow", "bright", "white teeth", "smile makeover"],
            responses: [
                "Our professional **Teeth Whitening** treatment is fantastic! We use safe, high-grade formulas that can lift years of coffee or tea stains, brightening your smile by up to 8 shades in just a single 1-hour session.",
                "If you want a brighter smile, our in-office whitening is the best choice. It's fast, completely safe for your enamel, and delivers dramatic results instantly compared to over-the-counter strips."
            ]
        },
        {
            name: "implants",
            keywords: ["implant", "missing", "bridge", "denture", "replacement", "screw"],
            responses: [
                "Missing a tooth? **Dental Implants** are the gold standard for replacement. They function, feel, and look exactly like natural teeth. Dr. Mark Peterson, our implant specialist, uses painless, precise techniques to restore your smile permanently.",
                "Dental Implants act as an artificial root and crown, giving you a permanent, rock-solid tooth replacement. They prevent bone loss and let you eat all your favorite foods without worry!"
            ]
        },
        {
            name: "phobia",
            keywords: ["phobia", "fear", "scared", "anxious", "anxiety", "nervous", "hurt", "painful", "sedation", "sleep"],
            responses: [
                "It's completely normal to feel anxious about the dentist! Our clinic specializes in **Dental Phobia Comfort**. We offer conscious sedation (laughing gas or oral sedation) and a Comfort Menu with noise-canceling headphones, weighted blankets, and Netflix.",
                "Please don't worry! We cater specifically to nervous patients. We use ultra-gentle techniques, explain everything slowly, and provide sedation options to ensure your visit is 100% stress-free and painless."
            ]
        },
        {
            name: "doctors",
            keywords: ["doctor", "dentist", "specialist", "surgeon", "who", "team", "staff", "jenkins", "rahman", "peterson", "thompson"],
            responses: [
                "We have a brilliant team of specialists under one roof:\n- **Dr. Sarah Jenkins**: Pediatrics & Ortho\n- **Dr. Sarah Rahman**: Cosmetic Lead\n- **Dr. Mark Peterson**: Oral Surgeon (Implants)\n- **Dr. M. Thompson**: Periodontist (Gum Health)\nThey are all exceptionally gentle and skilled!",
                "Our doctors are top-tier specialists! Dr. Rahman handles stunning cosmetic makeovers, Dr. Peterson performs flawless implant surgeries, Dr. Jenkins is amazing with kids, and Dr. Thompson specializes in gum health."
            ]
        },
        {
            name: "kids",
            keywords: ["child", "kid", "pediatric", "baby", "children", "toddler"],
            responses: [
                "We love kids! **Dr. Sarah Jenkins**, our pediatric specialist, creates a fun, fear-free environment for children. We recommend bringing your child in for their first visit by age 1 or when their first tooth appears.",
                "Absolutely, we provide exceptional pediatric care! We make dental visits fun for children to build good lifelong habits. Dr. Jenkins is wonderful at keeping kids calm and happy."
            ]
        },
        {
            name: "location_hours",
            keywords: ["location", "address", "where", "city", "california", "hours", "open", "time", "weekend", "close"],
            responses: [
                "We are located in a state-of-the-art clinic in California! We are open **Monday to Friday, from 9:00 AM to 6:00 PM**. We have ample free parking right out front.",
                "You'll find our beautiful clinic in California. Our hours are 9 AM to 6 PM, Monday through Friday. We'd love to see you!"
            ]
        },
        {
            name: "discount",
            keywords: ["discount", "offer", "promo", "deal", "percent", "off", "free", "zero", "consultation"],
            responses: [
                "Great news! We currently offer a **Free Doctor Consultation** which includes a high-tech health assessment. Plus, if you join our membership plan today, you get **20% off** major procedures!",
                "We have an exclusive offer right now: **25% off your first treatment** when you register online! Also, initial consultations are completely free of charge."
            ]
        },
        {
            name: "greetings",
            keywords: ["hi", "hello", "hey", "greet", "good morning", "good afternoon", "howdy", "how are you", "what's up", "morning"],
            responses: [
                "Hello there! I'm the Rakshu Dental AI Assistant. I can help you book an appointment, answer questions about our services, or explain our pricing. How can I help you today?",
                "Hi! I'm here to answer any questions you have about our dental clinic, treatments, or doctors. What's on your mind?",
                "Hello! How are you doing today? I can help you learn about our painless treatments, check our hours, or schedule a visit!"
            ]
        },
        {
            name: "thanks",
            keywords: ["thank", "thanks", "helpful", "appreciate", "bye", "goodbye", "see you"],
            responses: [
                "You're very welcome! If you need anything else, I'm always here. Have a fantastic day and keep smiling! 😁",
                "Happy to help! Reach out anytime if you have more questions. Take care!",
                "You're welcome! Have a wonderful day!"
            ]
        },
        {
            name: "ai_persona",
            keywords: ["who are you", "are you a robot", "are you ai", "are you human", "what are you", "bot", "name"],
            responses: [
                "I'm the Rakshu Dental AI Assistant! I'm not a human, but I've been trained on everything there is to know about our clinic, doctors, and treatments. I'm here 24/7 to help you out!",
                "I am a virtual AI assistant designed specifically for Rakshu Dental. While I don't have teeth of my own, I know all about how to take care of yours! How can I help?"
            ]
        }
    ];

    const getRandomResponse = (responses) => responses[Math.floor(Math.random() * responses.length)];

    // NLP-Lite Intent Scoring Engine
    const scoreIntent = (query) => {
        const cleanQuery = query.toLowerCase().trim();
        
        if (cleanQuery === 'cancel' || cleanQuery === 'exit' || cleanQuery === 'stop') {
            return { intent: 'cancel', score: 100 };
        }

        let bestIntent = null;
        let maxScore = 0;
        const words = cleanQuery.replace(/[.,!?]/g, '').split(/\s+/);

        aiIntents.forEach(intentObj => {
            let score = 0;
            intentObj.keywords.forEach(keyword => {
                if (cleanQuery.includes(keyword.toLowerCase())) score += 5; 
            });
            words.forEach(word => {
                if (intentObj.keywords.some(kw => kw.includes(word) && word.length > 3)) score += 1;
            });

            if (score > maxScore) {
                maxScore = score;
                bestIntent = intentObj.name;
            }
        });

        if (maxScore >= 5) {
            return { intent: bestIntent, score: maxScore };
        } else {
            return { intent: 'unknown', score: maxScore };
        }
    };

    // Main Bot Response Generator
    const getBotResponse = (query) => {
        const cleanQuery = query.toLowerCase().trim();
        const analysis = scoreIntent(query);

        if (analysis.intent === 'cancel') {
            if (chatState !== 'idle') {
                chatState = 'idle';
                bookingForm = { name: '', email: '', phone: '', datetime: '' };
                return userName ? `No problem, ${userName}! I've cancelled the booking. What else can I do for you?` : `No problem! I have cancelled the booking process. What else can I help you with?`;
            }
            return `I'm here if you need anything else!`;
        }

        if (chatState === 'awaiting_name') {
            bookingForm.name = query; 
            userName = query.split(' ')[0];
            if (userName.length > 0) userName = userName.charAt(0).toUpperCase() + userName.slice(1);
            chatState = 'awaiting_email';
            return `Nice to meet you, **${userName}**! What is your email address so we can send confirmation details?`;
        }

        if (chatState === 'awaiting_email') {
            bookingForm.email = query;
            chatState = 'awaiting_phone';
            return `Got it. What is the best phone number to reach you, ${userName}?`;
        }

        if (chatState === 'awaiting_phone') {
            bookingForm.phone = query;
            chatState = 'awaiting_datetime';
            return `Perfect. Lastly, what date and time would you prefer for your appointment? (e.g., Tomorrow at 10 AM, next Monday at 2 PM)`;
        }

        if (chatState === 'awaiting_datetime') {
            bookingForm.datetime = query;
            chatState = 'idle';
            
            console.log('--- Rakshu Dental Appointment Form ---', bookingForm);
            
            setTimeout(() => {
                const apptSection = document.getElementById('appointment');
                if (apptSection) apptSection.scrollIntoView({ behavior: 'smooth' });
            }, 2500);

            const confirmationMsg = `Thank you, ${userName}! I have registered your appointment request:\n- **Name**: ${bookingForm.name}\n- **Email**: ${bookingForm.email}\n- **Phone**: ${bookingForm.phone}\n- **Preferred Time**: ${bookingForm.datetime}\n\nOur team will contact you shortly to confirm. I am also scrolling you down to our contact form for your reference!`;
            bookingForm = { name: '', email: '', phone: '', datetime: '' };
            return confirmationMsg;
        }

        if (cleanQuery.includes('take me to') || cleanQuery.includes('scroll to') || cleanQuery.includes('go to appointment')) {
            setTimeout(() => {
                const apptSection = document.getElementById('appointment');
                if (apptSection) apptSection.scrollIntoView({ behavior: 'smooth' });
            }, 1000);
            return userName ? `Sure thing, ${userName}! Scrolling you down now...` : `Sure thing! Scrolling you down to our appointment section now...`;
        }

        if (analysis.intent === 'booking') {
            chatState = 'awaiting_name';
            return getRandomResponse(aiIntents.find(i => i.name === 'booking').responses);
        }

        if (analysis.intent !== 'unknown') {
            const intentObj = aiIntents.find(i => i.name === analysis.intent);
            let response = getRandomResponse(intentObj.responses);
            if (userName && Math.random() > 0.6) {
                response = `${userName}, ` + response.charAt(0).toLowerCase() + response.slice(1);
            }
            return response;
        }

        const fallbacks = [
            `I'm sorry, I didn't quite understand that. I'm an AI assistant trained to help with booking appointments, explaining our treatments (like implants or whitening), and answering questions about insurance. Could you rephrase?`,
            `Hmm, I might not have the answer to that specific question. However, I can help you schedule a visit, tell you about our doctors, or explain our fear-free sedation options! What would you like to know?`,
            `I didn't quite catch that. Would you like me to help you book an appointment, or do you have a question about our pricing and location?`
        ];
        return userName ? `I'm sorry ${userName}, ` + fallbacks[0].substring(11) : getRandomResponse(fallbacks);
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
        
        // Generate the reply instantly in background
        const reply = getBotResponse(queryText);
        
        // Calculate realistic reading/typing delay based on string length
        // Base delay 600ms + ~25ms per character (capped at 2800ms)
        const calcDelay = Math.min(2800, 600 + (reply.length * 25));
        
        setTimeout(() => {
            removeTypingIndicator();
            appendMessage('assistant', reply);
        }, calcDelay);
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
