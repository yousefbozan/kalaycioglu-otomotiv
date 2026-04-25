
// 1. Sayfa Kaydırma Efekti (Scroll Animation)
// Elemanlar ekrana girdiğinde süzülerek gelmelerini sağlar
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
        }
    });
}, observerOptions);

// Animasyon uygulanacak sınıfları seçelim
document.querySelectorAll('.info-card, .card, .col-md-6').forEach(el => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "all 0.8s ease-out";
    observer.observe(el);
});

// 2. Dinamik Sayı Sayacı (Hakkımızda kısmındaki 25+ ve 5000+ için)
const counters = document.querySelectorAll('h4.fw-bold');
counters.forEach(counter => {
    const updateCount = () => {
        const target = +counter.innerText.replace('+', '');
        const count = +counter.getAttribute('data-current') || 0;
        const speed = target / 100;

        if (count < target) {
            const nextCount = Math.ceil(count + speed);
            counter.setAttribute('data-current', nextCount);
            counter.innerText = nextCount + "+";
            setTimeout(updateCount, 20);
        } else {
            counter.innerText = target + "+";
        }
    };

    // Sayaçların ekrana geldiğinde çalışması için observer'a ekliyoruz
    const countObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting) {
            updateCount();
            countObserver.unobserve(counter);
        }
    });
    countObserver.observe(counter);
});

// 3. Form Gönderildiğinde Şık Bir Uyarı
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button');
    const originalText = btn.innerText;
    
    btn.disabled = true;
    btn.innerText = "GÖNDERİLİYOR...";
    
    // Simüle edilmiş gönderim (Gerçekte buraya API isteği gelir)
    setTimeout(() => {
        alert("Mesajınız Kalaycıoğlu Petrol'e iletildi! En kısa sürede Batman ofisimizden size döneceğiz.");
        btn.disabled = false;
        btn.innerText = originalText;
        this.reset();
    }, 1500);
});

// 4. Navbar'ın Kaydırınca Renk Değiştirmesi
window.addEventListener('scroll', function() {
    const nav = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-lg');
        nav.style.padding = "10px 0";
    } else {
        nav.classList.remove('shadow-lg');
        nav.style.padding = "15px 0";
    }
});


// Mobilde menü linkine tıklanınca menüyü otomatik kapat
const navLinks = document.querySelectorAll('.nav-link');
const menuToggle = document.getElementById('navbarNav');
const bsCollapse = new bootstrap.Collapse(menuToggle, {toggle:false});

navLinks.forEach((l) => {
    l.addEventListener('click', () => { 
        if(window.innerWidth < 992) { // Sadece mobilde çalışır
            bsCollapse.hide(); 
        }
    });
});

const db = firebase.firestore();

// Firestore'dan araçları canlı çek
db.collection("araclar").orderBy("createdAt", "desc").onSnapshot((snapshot) => {
    const listesi = document.getElementById('arac-listesi');
    listesi.innerHTML = ""; // Mevcut listeyi temizle

    snapshot.forEach((doc) => {
        const car = doc.data();
        listesi.innerHTML += `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm overflow-hidden rounded-3">
                    <img src="${car.image}" class="card-img-top" style="height: 220px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title fw-bold text-dark-blue">${car.model}</h5>
                        <p class="card-text text-muted small">${car.year} Model - ${car.fuel}</p>
                        <h4 class="fw-bold text-primary">₺ ${Number(car.price).toLocaleString('tr-TR')}</h4>
                        <a href="https://wa.me/905XXXXXXXXX" class="btn btn-dark w-100 mt-3">WhatsApp'tan Sor</a>
                    </div>
                </div>
            </div>`;
    });
});