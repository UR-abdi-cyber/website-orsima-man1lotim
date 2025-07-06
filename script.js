// Script untuk smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Script untuk mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
        
        // Close menu when a link is clicked
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', function() {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });
        
        // Close menu when clicked outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = nav.contains(event.target);
            const isClickOnToggle = menuToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && nav.classList.contains('active')) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });
    }
});

// Script untuk form kontak
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    
    if (messageForm) {
        messageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil nilai dari input form
            const nama = this.querySelector('input[name="nama"]').value.trim();
            const email = this.querySelector('input[name="email"]').value.trim();
            const pesan = this.querySelector('textarea[name="pesan"]').value.trim();
            
            // No WhatsApp ketua ORSIMA (default jika tidak memilih kontak spesifik)
            const nomorWhatsApp = "6287810617671"; // Nomor Muji dengan format internasional
            
            // Validasi input
            if (!nama || !email || !pesan) {
                alert('Mohon isi semua kolom yang diperlukan!');
                return;
            }
            
            // Format pesan untuk WhatsApp
            const pesanWhatsApp = 
                `Halo ORSIMA MAN 1 Lombok Timur,\n\nSaya ${nama} (${email}) ingin menyampaikan pesan:\n\n${pesan}\n\nTerima kasih.`;
            
            // Buat URL untuk WhatsApp
            const whatsappURL = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesanWhatsApp)}`;
            
            // Buka WhatsApp di tab baru
            window.open(whatsappURL, '_blank');
            
            // Reset form setelah mengirim
            this.reset();
        });
    }
});

// Script untuk animasi box gallery
document.querySelectorAll('.gallery-box').forEach(box => {
    box.addEventListener('click', function() {
        this.classList.toggle('active');
    });
});

// Script untuk sticky header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    header.classList.toggle('sticky', window.scrollY > 0);
});

// Script untuk menampilkan tahun saat ini di footer
document.addEventListener('DOMContentLoaded', function() {
    const yearElement = document.querySelector('.copyright p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
    }
});

// Script untuk menganimasi struktur organisasi saat di-scroll
document.addEventListener('DOMContentLoaded', function() {
    const structureBoxes = document.querySelectorAll('.structure-box, .division-box');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.3 });
    
    structureBoxes.forEach(box => {
        box.style.opacity = '0';
        box.style.transform = 'translateY(20px)';
        box.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(box);
    });
});

// PWA INSTALLATION SCRIPT - FIXED VERSION
let deferredPrompt;
let installButton;

// Check if app is running in standalone mode
function isAppInstalled() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
}

// Create install button
function createInstallButton() {
    if (installButton) return; // Prevent duplicate buttons
    
    installButton = document.createElement('button');
    installButton.id = 'install-button';
    installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
    installButton.className = 'pwa-install-button';
    
    // Add styles
    installButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(45deg, #076652, #054d3e);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 1000;
        display: none;
        align-items: center;
        gap: 8px;
        transition: all 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    // Add hover effects
    installButton.addEventListener('mouseenter', () => {
        installButton.style.transform = 'translateY(-3px) scale(1.05)';
        installButton.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
    });
    
    installButton.addEventListener('mouseleave', () => {
        installButton.style.transform = 'translateY(0) scale(1)';
        installButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    });
    
    // Add click event
    installButton.addEventListener('click', handleInstallClick);
    
    document.body.appendChild(installButton);
}

// Handle install button click
function handleInstallClick() {
    if (!deferredPrompt) {
        showNotification('Install tidak tersedia saat ini. Pastikan Anda menggunakan browser yang mendukung PWA.', 'warning');
        return;
    }
    
    // Hide install button
    installButton.style.display = 'none';
    
    // Show install prompt
    deferredPrompt.prompt();
    
    // Wait for user response
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the install prompt');
            showNotification('Terima kasih! Aplikasi sedang diinstall...', 'success');
        } else {
            console.log('User dismissed the install prompt');
            showNotification('Install dibatalkan. Anda dapat menginstall nanti.', 'info');
            // Show button again after 10 seconds
            setTimeout(() => {
                if (installButton && !isAppInstalled()) {
                    installButton.style.display = 'flex';
                }
            }, 10000);
        }
        deferredPrompt = null;
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `pwa-notification ${type}`;
    
    const colors = {
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        warning: 'fas fa-exclamation-triangle',
        error: 'fas fa-times-circle',
        info: 'fas fa-info-circle'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        max-width: 300px;
        animation: slideInRight 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    notification.innerHTML = `
        <i class="${icons[type]}" style="margin-right: 8px;"></i>
        ${message}
    `;
    
    // Add CSS animation if not exists
    if (!document.getElementById('pwa-animations')) {
        const style = document.createElement('style');
        style.id = 'pwa-animations';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            showNotification('Update tersedia! Refresh halaman untuk mendapatkan versi terbaru.', 'info');
                        }
                    });
                });
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('beforeinstallprompt event fired');
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e;
    
    // Show install button if app is not already installed
    if (!isAppInstalled()) {
        createInstallButton();
        setTimeout(() => {
            if (installButton) {
                installButton.style.display = 'flex';
            }
        }, 2000); // Show after 2 seconds
    }
});

// Listen for app installed event
window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed');
    showNotification('Aplikasi berhasil diinstall! Selamat menggunakan ORSIMA App.', 'success');
    
    // Hide install button
    if (installButton) {
        installButton.style.display = 'none';
    }
    
    // Clear the deferredPrompt
    deferredPrompt = null;
});

// Add PWA status indicator
document.addEventListener('DOMContentLoaded', function() {
    // Don't show PWA badge if app is already installed
    if (isAppInstalled()) {
        console.log('App is running in standalone mode');
        return;
    }
    
    // Add PWA badge to header
    const header = document.querySelector('header');
    if (header) {
        const pwaBadge = document.createElement('div');
        pwaBadge.className = 'pwa-badge';
        pwaBadge.style.cssText = `
            position: absolute;
            top: 10px;
            left: 10px;
            background: linear-gradient(45deg, #076652, #054d3e);
            color: white;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1000;
            animation: pulse 2s infinite;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        pwaBadge.innerHTML = '<i class="fas fa-mobile-alt"></i> Installable App';
        
        // Add pulse animation
        if (!document.getElementById('pwa-pulse')) {
            const pulseStyle = document.createElement('style');
            pulseStyle.id = 'pwa-pulse';
            pulseStyle.textContent = `
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(7, 102, 82, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(7, 102, 82, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(7, 102, 82, 0); }
                }
            `;
            document.head.appendChild(pulseStyle);
        }
        
        // Add click event to badge
        pwaBadge.addEventListener('click', () => {
            if (deferredPrompt) {
                handleInstallClick();
            } else {
                showNotification('Install akan tersedia setelah halaman dimuat penuh.', 'info');
            }
        });
        
        header.appendChild(pwaBadge);
    }
});

// Handle online/offline status
window.addEventListener('online', () => {
    showNotification('Koneksi internet tersambung kembali!', 'success');
});

window.addEventListener('offline', () => {
    showNotification('Anda sedang offline. Beberapa fitur mungkin tidak tersedia.', 'warning');
});

// Add keyboard shortcut for install (Ctrl+I)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'i' && !isAppInstalled() && deferredPrompt) {
        e.preventDefault();
        handleInstallClick();
    }
});