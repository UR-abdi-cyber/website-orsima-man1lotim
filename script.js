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