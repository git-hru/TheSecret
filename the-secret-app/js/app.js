// ===== THE SECRET — CORE APP =====

// --- Storage helpers ---
function getWishlist() {
  return JSON.parse(localStorage.getItem('secret_wishlist') || '[]');
}
function saveWishlist(list) {
  localStorage.setItem('secret_wishlist', JSON.stringify(list));
}
function getOrderedWishes() {
  return JSON.parse(localStorage.getItem('secret_ordered') || '[]');
}
function saveOrderedWishes(list) {
  localStorage.setItem('secret_ordered', JSON.stringify(list));
}
function getUserEmail() {
  return localStorage.getItem('secret_email') || '';
}
function setUserEmail(email) {
  localStorage.setItem('secret_email', email);
}

// --- Particles ---
function generateParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 38;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 2.5 + 0.8;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      animation-duration: ${Math.random() * 18 + 12}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.5};
    `;
    container.appendChild(p);
  }
}

// --- Home page: handle wish submission ---
function handleWish() {
  const emailEl = document.getElementById('user-email');
  const wishEl  = document.getElementById('wish-input');
  if (!emailEl || !wishEl) return;

  const email = emailEl.value.trim();
  const wish  = wishEl.value.trim();

  if (!email || !validateEmail(email)) {
    shake(emailEl); showToast('Please enter a valid email address.'); return;
  }
  if (!wish) {
    shake(wishEl); showToast('Please share your wish with the Universe.'); return;
  }

  setUserEmail(email);
  document.getElementById('modal-wish-text').textContent = '"' + wish + '"';
  document.getElementById('decision-modal').classList.add('open');

  // store current wish in session
  sessionStorage.setItem('currentWish', wish);
}

function closeModal() {
  document.getElementById('decision-modal').classList.remove('open');
}

function orderNow() {
  closeModal();
  const wish = sessionStorage.getItem('currentWish') || '';
  sessionStorage.setItem('pendingOrderWish', wish);
  window.location.href = 'order.html';
}

function addToWishlist() {
  const wish = sessionStorage.getItem('currentWish') || '';
  if (!wish) return;
  const list = getWishlist();
  list.push({ id: Date.now(), text: wish, added: new Date().toISOString() });
  saveWishlist(list);
  closeModal();
  showToast('✦ Wish saved to your Wishlist.');
  document.getElementById('wish-input').value = '';
  sessionStorage.removeItem('currentWish');
}

// --- Order page: place order ---
function placeOrder() {
  const blank = document.getElementById('wish-blank');
  if (!blank) return;
  const wish = blank.value.trim();
  if (!wish) {
    shake(blank);
    showToast('Fill in your wish in the blank space.');
    return;
  }

  const fullAffirmation = 'I am so happy and grateful now that ' + wish;
  const email = getUserEmail();

  // Show sending overlay
  const overlay = document.getElementById('sending-overlay');
  if (overlay) overlay.classList.add('open');

  // Save to ordered wishes
  const ordered = getOrderedWishes();
  ordered.push({ id: Date.now(), text: wish, affirmation: fullAffirmation, ordered: new Date().toISOString() });
  saveOrderedWishes(ordered);

  // Also remove from wishlist if it was there
  const wl = getWishlist();
  const filtered = wl.filter(w => w.text.toLowerCase() !== wish.toLowerCase());
  saveWishlist(filtered);

  // Send email via EmailJS
  sendWishEmail(email, wish, fullAffirmation)
    .finally(() => {
      setTimeout(() => {
        window.location.href = 'ordered.html';
      }, 2800);
    });
}

// --- Ordered page: render wishes ---
function renderOrderedWishes() {
  const list = getOrderedWishes();
  const container = document.getElementById('wishes-list');
  const emptyState = document.getElementById('empty-state');
  if (!container) return;

  if (list.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = '';
  list.slice().reverse().forEach((w, i) => {
    const card = document.createElement('div');
    card.className = 'ordered-wish-card';
    card.style.animationDelay = (i * 0.1) + 's';
    const date = new Date(w.ordered).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' });
    card.innerHTML = `
      <div class="wish-star-badge">✦</div>
      <div class="wish-card-content">
        <p class="wish-card-text">"I am so happy and grateful now that ${w.text}"</p>
        <p class="wish-card-meta">Ordered · ${date} · Already yours</p>
      </div>
    `;
    container.appendChild(card);
  });
}

// --- Utilities ---
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.4s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });

  const style = document.createElement('style');
  style.textContent = `@keyframes shake {
    0%,100%{transform:translateX(0)}
    20%{transform:translateX(-8px)}
    40%{transform:translateX(8px)}
    60%{transform:translateX(-5px)}
    80%{transform:translateX(5px)}
  }`;
  if (!document.querySelector('[data-shake]')) {
    style.setAttribute('data-shake','1');
    document.head.appendChild(style);
  }
}

function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText = `
      position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);
      background:#1a1510;border:0.5px solid rgba(201,168,76,0.5);
      color:#e8c97a;font-family:'Lato',sans-serif;font-size:0.85rem;
      padding:0.8rem 1.6rem;border-radius:30px;z-index:999;
      transition:opacity 0.4s;white-space:nowrap;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
