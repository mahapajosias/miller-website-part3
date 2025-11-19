/* Modern site script — loader, transitions, reveal, popup, ripple, countdown */

// loader element
const pageLoader = document.getElementById('page-loader');

/* Show/hide loader helpers */
function showLoader() { if (pageLoader) { pageLoader.classList.remove('hidden'); pageLoader.style.visibility = 'visible'; } }
function hideLoader() { if (pageLoader) pageLoader.classList.add('hidden'); }

/* DOM ready handlers */
window.addEventListener('DOMContentLoaded', () => {
  if (pageLoader) {
    setTimeout(() => { hideLoader(); revealHero(); }, 300);
  } else { revealHero(); }
  initSectionObserver();
  initNavToggle();
  initButtonRipples();
  initCountdown();
  initContactForm();
});

/* Navigation link interception to show loader and fade-out */
document.addEventListener('click', (e) => {
  const a = e.target.closest('a');
  if (!a) return;
  const href = a.getAttribute('href');
  if (!href) return;
  if (href.startsWith('http') && !href.includes(location.hostname)) return; // external
  if (href.startsWith('mailto:') || href.startsWith('tel:') || a.hasAttribute('target') || href.startsWith('#')) return;
  e.preventDefault();
  showLoader();
  document.documentElement.classList.add('page-fadeout');
  setTimeout(() => { location.href = href; }, 420);
});

/* Hero reveal */
function revealHero(){
  const heroTitle = document.querySelector('.hero-title') || document.querySelector('.hero h1');
  const heroSub = document.querySelector('.hero-sub') || document.querySelector('.hero p');
  const ctas = document.querySelector('.cta-row');
  const countdown = document.querySelector('.countdown');
  const elems = [heroTitle, heroSub, ctas, countdown].filter(Boolean);
  elems.forEach((el, i) => {
    el.style.transition = `opacity .5s ${(0.12 + i*0.07)}s ease-out, transform .5s ${(0.12 + i*0.07)}s ease-out`;
    el.style.opacity = 1; el.style.transform = 'translateY(0)';
  });
}

/* Section reveal via IntersectionObserver */
function initSectionObserver(){
  const sections = document.querySelectorAll('.section-animate');
  if (!sections.length) return;
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  sections.forEach(s => io.observe(s));
}

/* Gallery popup */
function openPopup(src){
  const popup = document.getElementById('popup');
  const img = document.getElementById('popup-img');
  if (!popup || !img) return;
  img.src = src; popup.style.display = 'flex';
  requestAnimationFrame(() => popup.classList.add('show'));
}
function closePopup(e){
  const popup = document.getElementById('popup');
  if (!popup) return;
  if (e && e.target !== popup) return;
  popup.classList.remove('show');
  setTimeout(()=> { popup.style.display='none'; document.getElementById('popup-img').src=''; }, 280);
}
document.addEventListener('click', (e) => { if (e.target.id === 'popup') closePopup(e); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopup(); });

/* Button ripple */
function initButtonRipples(){
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      this.appendChild(ripple);
      setTimeout(()=> ripple.remove(), 600);
    });
  });
}

/* Countdown: d hh mm ss */
function initCountdown(){
  const el = document.getElementById('days');
  if (!el) return;
  const target = new Date('2025-11-01T09:00:00');
  function update(){
    const now = new Date();
    let diff = Math.max(0, target - now);
    const d = Math.floor(diff / (1000*60*60*24)); diff -= d*(1000*60*60*24);
    const h = Math.floor(diff / (1000*60*60)); diff -= h*(1000*60*60);
    const m = Math.floor(diff / (1000*60)); diff -= m*(1000*60);
    const s = Math.floor(diff / 1000);
    el.textContent = `${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`;
  }
  update(); setInterval(update, 1000);
}

/* Navigation toggle for mobile */
function initNavToggle(){
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (!navToggle || !mainNav) return;
  navToggle.addEventListener('click', () => {
    if (mainNav.style.display === 'flex') mainNav.style.display = 'none';
    else { mainNav.style.display = 'flex'; mainNav.style.flexDirection = 'column'; mainNav.style.gap = '8px'; }
  });
}

/* Contact form handler (UI only) */
function initContactForm(){
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();
    const formMsg = document.getElementById('formMsg');
    if (!name || !email || !message) { if (formMsg) { formMsg.textContent = 'Please complete all fields.'; formMsg.style.color = '#ff6b6b'; } return; }
    if (formMsg) { formMsg.textContent = 'Thanks — your message was recorded (no backend).'; formMsg.style.color = '#ffd700'; }
    contactForm.reset();
  });
}

/* Accessibility: keyboard focus indicator (optional) */
document.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('user-is-tabbing'); });
