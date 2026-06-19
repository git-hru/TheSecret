// ===== BUBBLE PHYSICS ENGINE =====
// Floating, colliding, reflecting wish bubbles like water spheres

let bubbles = [];
let animFrame;

function renderBubbles() {
  const list = getWishlist();
  const arena = document.getElementById('bubble-arena');
  const emptyState = document.getElementById('empty-state');
  if (!arena) return;

  if (list.length === 0) {
    if (emptyState) emptyState.style.display = 'block';
    arena.style.display = 'none';
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  arena.style.display = 'block';

  const W = arena.clientWidth || window.innerWidth;
  const H = arena.clientHeight || 600;
  bubbles = [];

  list.forEach((wish, idx) => {
    // Size based on text length
    const charLen = wish.text.length;
    const r = Math.max(70, Math.min(130, 70 + charLen * 0.6));

    // Random starting position
    const x = r + Math.random() * (W - r * 2);
    const y = r + Math.random() * (H - r * 2);

    // Random velocity (gentle drift)
    const speed = 0.4 + Math.random() * 0.7;
    const angle = Math.random() * Math.PI * 2;
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    const el = document.createElement('div');
    el.className = 'wish-bubble';
    el.style.width  = r * 2 + 'px';
    el.style.height = r * 2 + 'px';
    el.style.left   = x - r + 'px';
    el.style.top    = y - r + 'px';
    el.setAttribute('data-text', wish.text);
    el.setAttribute('data-id', wish.id);

    el.innerHTML = `
      <span class="bubble-text">${truncate(wish.text, 55)}</span>
      <button class="bubble-order-btn" onclick="triggerBubbleOrder(${wish.id}, event)">ORDER ✦</button>
    `;

    arena.appendChild(el);

    bubbles.push({ id: wish.id, x, y, r, vx, vy, el });
  });

  if (animFrame) cancelAnimationFrame(animFrame);
  animateBubbles(W, H);
}

function animateBubbles(W, H) {
  const arena = document.getElementById('bubble-arena');

  function step() {
    const w = arena.clientWidth || W;
    const h = arena.clientHeight || H;

    bubbles.forEach(b => {
      // Move
      b.x += b.vx;
      b.y += b.vy;

      // Bounce off walls
      if (b.x - b.r <= 0) { b.x = b.r; b.vx = Math.abs(b.vx); }
      if (b.x + b.r >= w) { b.x = w - b.r; b.vx = -Math.abs(b.vx); }
      if (b.y - b.r <= 0) { b.y = b.r; b.vy = Math.abs(b.vy); }
      if (b.y + b.r >= h) { b.y = h - b.r; b.vy = -Math.abs(b.vy); }
    });

    // Collision detection & elastic reflection
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const a = bubbles[i];
        const b = bubbles[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = a.r + b.r;

        if (dist < minDist && dist > 0) {
          // Normalize collision vector
          const nx = dx / dist;
          const ny = dy / dist;

          // Relative velocity along collision normal
          const dvx = a.vx - b.vx;
          const dvy = a.vy - b.vy;
          const dot = dvx * nx + dvy * ny;

          // Only resolve if approaching
          if (dot > 0) {
            // Equal mass elastic collision
            a.vx -= dot * nx;
            a.vy -= dot * ny;
            b.vx += dot * nx;
            b.vy += dot * ny;

            // Speed cap so they don't go crazy
            a.vx = clampSpeed(a.vx);
            a.vy = clampSpeed(a.vy);
            b.vx = clampSpeed(b.vx);
            b.vy = clampSpeed(b.vy);
          }

          // Push apart so they don't overlap
          const overlap = (minDist - dist) / 2;
          a.x -= overlap * nx;
          a.y -= overlap * ny;
          b.x += overlap * nx;
          b.y += overlap * ny;
        }
      }
    }

    // Apply positions to DOM
    bubbles.forEach(b => {
      b.el.style.left = (b.x - b.r) + 'px';
      b.el.style.top  = (b.y - b.r) + 'px';
    });

    animFrame = requestAnimationFrame(step);
  }

  animFrame = requestAnimationFrame(step);
}

function clampSpeed(v) {
  const MAX = 2.2;
  return Math.max(-MAX, Math.min(MAX, v));
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function triggerBubbleOrder(id, e) {
  e.stopPropagation();
  const list = getWishlist();
  const wish = list.find(w => w.id === id);
  if (!wish) return;

  sessionStorage.setItem('orderingWishId', id);
  sessionStorage.setItem('pendingOrderWish', wish.text);

  const modal = document.getElementById('order-modal');
  document.getElementById('order-modal-text').textContent = '"' + wish.text + '"';
  if (modal) modal.classList.add('open');
}

function proceedToOrder() {
  const id = sessionStorage.getItem('orderingWishId');
  // Remove from wishlist
  let list = getWishlist();
  list = list.filter(w => String(w.id) !== String(id));
  saveWishlist(list);
  window.location.href = 'order.html';
}

function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  if (modal) modal.classList.remove('open');
}
