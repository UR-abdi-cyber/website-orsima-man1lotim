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
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace('2025', currentYear);
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

// PWA Installation Script
// Tambahkan kode ini di bagian akhir file script.js yang sudah ada

// Register Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// PWA Install Prompt
let deferredPrompt;
let installButton;

// Create install button
function createInstallButton() {
  installButton = document.createElement('button');
  installButton.id = 'install-button';
  installButton.innerHTML = '<i class="fas fa-download"></i> Install App';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #076652;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 25px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    z-index: 1000;
    display: none;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  `;
  
  installButton.addEventListener('mouseover', () => {
    installButton.style.background = '#054d3e';
    installButton.style.transform = 'translateY(-2px)';
  });
  
  installButton.addEventListener('mouseout', () => {
    installButton.style.background = '#076652';
    installButton.style.transform = 'translateY(0)';
  });
  
  document.body.appendChild(installButton);
}

// Listen for the beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Create and show install button
  if (!installButton) {
    createInstallButton();
  }
  
  installButton.style.display = 'flex';
  
  // Add click event to install button
  installButton.addEventListener('click', () => {
    // Hide the install button
    installButton.style.display = 'none';
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
        showInstallNotification('Terima kasih! Aplikasi sedang diinstall...');
      } else {
        console.log('User dismissed the install prompt');
        // Show button again after 30 seconds
        setTimeout(() => {
          installButton.style.display = 'flex';
        }, 30000);
      }
      deferredPrompt = null;
    });
  });
});

// Listen for the app installed event
window.addEventListener('appinstalled', (evt) => {
  console.log('App was installed');
  showInstallNotification('Aplikasi berhasil diinstall! Selamat menggunakan ORSIMA App.');
  
  // Hide install button
  if (installButton) {
    installButton.style.display = 'none';
  }
});

// Function to show install notification
function showInstallNotification(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #076652;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    z-index: 1001;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    animation: slideIn 0.3s ease;
  `;
  
  notification.innerHTML = `
    <i class="fas fa-check-circle" style="margin-right: 8px;"></i>
    ${message}
  `;
  
  // Add CSS animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOut {
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
  
  document.body.appendChild(notification);
  
  // Remove notification after 5 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Check if app is already installed
function isAppInstalled() {
  return (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
         (window.navigator.standalone) ||
         document.referrer.includes('android-app://');
}

// Hide install button if app is already installed
document.addEventListener('DOMContentLoaded', function() {
  if (isAppInstalled()) {
    console.log('App is already installed');
    if (installButton) {
      installButton.style.display = 'none';
    }
  }
});

// Add PWA status indicator
document.addEventListener('DOMContentLoaded', function() {
  // Add PWA badge to header
  const header = document.querySelector('header');
  if (header && !isAppInstalled()) {
    const pwaBadge = document.createElement('div');
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
    `;
    pwaBadge.innerHTML = '<i class="fas fa-mobile-alt"></i> Installable App';
    
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(7, 102, 82, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(7, 102, 82, 0); }
        100% { box-shadow: 0 0 0 0 rgba(7, 102, 82, 0); }
      }
    `;
    document.head.appendChild(pulseStyle);
    
    header.appendChild(pwaBadge);
  }
});