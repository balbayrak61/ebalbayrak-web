// DOM elementlerini seçme
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');
const header = document.querySelector('header');

// Mobil menü için burger işlevselliği
burger.addEventListener('click', () => {
 
    nav.classList.toggle('nav-active');
    burger.classList.toggle('toggle');

   
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
});


window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

const stats = document.querySelectorAll('.stat-number');
let counted = false;

function startCounting(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
            counted = true;
            stats.forEach(stat => {
                const target = parseInt(stat.textContent);
                let count = 0;
                const duration = 2000; 
                const increment = target / (duration / 16); 

                function updateCount() {
                    if (count < target) {
                        count += increment;
                        stat.textContent = Math.ceil(count) + '+';
                        requestAnimationFrame(updateCount);
                    } else {
                        stat.textContent = target + '+';
                    }
                }

                updateCount();
            });
        }
    });
}


const observer = new IntersectionObserver(startCounting, {
    threshold: 0.5
});

if (stats.length) {
    observer.observe(document.querySelector('.hero-stats'));
}

// Form doğrulama
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isValid = true;
        const inputs = form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                showError(input, 'Bu alan zorunludur');
            } else if (input.type === 'email' && input.value) {
                if (!validateEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Geçerli bir e-posta adresi giriniz');
                }
            }
        });

        if (isValid) {
            showSuccess(form);
        }
    });
});

// Email doğrulama fonksiyonu
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Hata mesajı gösterme
function showError(input, message) {
    const formGroup = input.parentElement;
    const error = formGroup.querySelector('.error-message') || document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
    
    
    setTimeout(() => {
        error.remove();
        input.classList.remove('error');
    }, 3000);
}



// Smooth scroll
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

// Lazy loading için intersection observer
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1
});

images.forEach(img => imageObserver.observe(img));

// Bülten formu işlemleri
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Bültene başarıyla abone oldunuz', 'success');
        newsletterForm.reset();
    });
}

// Proje filtreleme işlevselliği
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

      
        const filterValue = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Blog post expand/collapse işlevselliği
const readMoreButtons = document.querySelectorAll('.read-more');

readMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const postCard = button.closest('.post-card');
        const fullContent = postCard.querySelector('.post-full-content');
        
      
        fullContent.classList.toggle('active');
        button.classList.toggle('active');
        postCard.classList.toggle('expanded');
        
        
        if (button.classList.contains('active')) {
            button.innerHTML = 'Geri Dön <i class="fas fa-arrow-right"></i>';
        } else {
            button.innerHTML = 'Devamını Oku <i class="fas fa-arrow-right"></i>';
        }
    });
});

// Notification fonksiyonu
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Contact form submit
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        
        showNotification('Mesajınız başarıyla gönderildi', 'success');
        contactForm.reset();
    });
} 