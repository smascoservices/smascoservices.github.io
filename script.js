// ============================================
// Navigation Menu Toggle
// ============================================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// ============================================
// Booking Form Submission
// ============================================

const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            service: document.getElementById('service').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toLocaleString('ar-SD')
        };

        try {
            // Option 1: Send via Formspree (requires account setup)
            // Uncomment and replace with your Formspree endpoint
            /*
            const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                showSuccessMessage('تم استقبال حجزك بنجاح! سيتواصل معك فريقنا قريباً.');
                bookingForm.reset();
            } else {
                showErrorMessage('حدث خطأ. يرجى المحاولة مرة أخرى.');
            }
            */

            // Option 2: Send via WhatsApp (Direct Link)
            sendViaWhatsApp(formData);

            // Option 3: Send via Email (Local storage + notification)
            saveToLocalStorage(formData);
            showSuccessMessage('تم استقبال حجزك بنجاح! سيتواصل معك فريقنا قريباً عبر الواتساب أو البريد الإلكتروني.');
            bookingForm.reset();

        } catch (error) {
            console.error('Error:', error);
            showErrorMessage('حدث خطأ. يرجى المحاولة مرة أخرى.');
        }
    });
}

// ============================================
// Send via WhatsApp
// ============================================

function sendViaWhatsApp(formData) {
    const message = `
*طلب حجز خدمة نظافة*

الاسم: ${formData.name}
رقم الهاتف: ${formData.phone}
البريد الإلكتروني: ${formData.email || 'لم يتم تقديمه'}
نوع الخدمة: ${formData.service}
التاريخ المطلوب: ${formData.date}
وصف إضافي: ${formData.message || 'لا يوجد'}
الوقت: ${formData.timestamp}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/message/LEWJG5ATVX77J1?text=${encodedMessage}`;
    
    // Open WhatsApp in a new window
    window.open(whatsappUrl, '_blank');
}

// ============================================
// Save to Local Storage
// ============================================

function saveToLocalStorage(formData) {
    let bookings = JSON.parse(localStorage.getItem('smasco_bookings')) || [];
    bookings.push(formData);
    localStorage.setItem('smasco_bookings', JSON.stringify(bookings));
}

// ============================================
// Show Success Message
// ============================================

function showSuccessMessage(message) {
    formMessage.textContent = message;
    formMessage.className = 'form-message success';
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ============================================
// Show Error Message
// ============================================

function showErrorMessage(message) {
    formMessage.textContent = message;
    formMessage.className = 'form-message error';
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// ============================================
// Smooth Scroll for Navigation Links
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Scroll Animation for Elements
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe service cards and feature cards
document.querySelectorAll('.service-card, .feature, .testimonial-card, .contact-method').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

// ============================================
// Form Validation
// ============================================

function validateForm(formData) {
    if (!formData.name.trim()) {
        showErrorMessage('يرجى إدخال الاسم الكامل');
        return false;
    }

    if (!formData.phone.trim()) {
        showErrorMessage('يرجى إدخال رقم الهاتف');
        return false;
    }

    if (!/^\d{10,}$/.test(formData.phone.replace(/\D/g, ''))) {
        showErrorMessage('يرجى إدخال رقم هاتف صحيح');
        return false;
    }

    if (!formData.service) {
        showErrorMessage('يرجى اختيار نوع الخدمة');
        return false;
    }

    if (!formData.date) {
        showErrorMessage('يرجى تحديد تاريخ الخدمة');
        return false;
    }

    return true;
}

// ============================================
// Admin Panel (View Bookings)
// ============================================

// Create a simple admin panel accessible via console
window.smascoAdmin = {
    viewBookings: function() {
        const bookings = JSON.parse(localStorage.getItem('smasco_bookings')) || [];
        console.table(bookings);
        return bookings;
    },
    clearBookings: function() {
        localStorage.removeItem('smasco_bookings');
        console.log('تم حذف جميع الحجوزات');
    },
    exportBookings: function() {
        const bookings = JSON.parse(localStorage.getItem('smasco_bookings')) || [];
        const dataStr = JSON.stringify(bookings, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'smasco_bookings.json';
        link.click();
        console.log('تم تحميل الحجوزات');
    }
};

// ============================================
// Page Load Animation
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// ============================================
// Mobile Menu Close on Outside Click
// ============================================

document.addEventListener('click', (e) => {
    if (navMenu && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('active');
    }
});

// ============================================
// Add Minimum Date to Date Input
// ============================================

const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    dateInput.min = `${year}-${month}-${day}`;
}

// ============================================
// Console Welcome Message
// ============================================

console.log('%c🧹 مرحباً بك في سماسكو لخدمات النظافة', 'color: #0099FF; font-size: 20px; font-weight: bold;');
console.log('%cلأن حياتك تستحق الأفضل', 'color: #00CC66; font-size: 16px;');
console.log('%cللمزيد من المعلومات عن الحجوزات، اكتب: smascoAdmin.viewBookings()', 'color: #333; font-size: 12px;');
