/* ============================================================
   Muhammad Haris, portfolio interactions
   ============================================================ */

// ---- Lightbox (single image or gallery) ----
const lb = {
    el: document.getElementById('lightbox'),
    img: document.getElementById('lightboxImg'),
    cap: document.getElementById('lightboxCap'),
    items: [],
    i: 0,
    show() {
        const it = this.items[this.i];
        this.img.src = it.src;
        this.img.alt = it.cap || '';
        this.cap.textContent = this.items.length > 1
            ? `${this.i + 1} / ${this.items.length}  ·  ${it.cap || ''}`
            : (it.cap || '');
        const multi = this.items.length > 1;
        this.el.querySelectorAll('.lb-nav').forEach(b => b.style.display = multi ? '' : 'none');
    },
    open(items, i = 0) {
        this.items = items;
        this.i = i;
        this.trigger = document.activeElement;
        this.show();
        this.el.classList.add('open');
        document.body.style.overflow = 'hidden';
        this.el.querySelector('.lb-close').focus();
    },
    close() {
        this.el.classList.remove('open');
        document.body.style.overflow = '';
        if (this.trigger && this.trigger.focus) this.trigger.focus();
    },
    step(d) {
        if (this.items.length < 2) return;
        this.i = (this.i + d + this.items.length) % this.items.length;
        this.show();
    }
};

function openLightbox(src, caption) { lb.open([{ src, cap: caption }], 0); }

lb.el.addEventListener('click', e => { if (e.target === lb.el) lb.close(); });
lb.el.querySelector('.lb-close').addEventListener('click', () => lb.close());
lb.el.querySelector('.lb-nav.prev').addEventListener('click', () => lb.step(-1));
lb.el.querySelector('.lb-nav.next').addEventListener('click', () => lb.step(1));

document.addEventListener('keydown', e => {
    if (!lb.el.classList.contains('open')) return;
    if (e.key === 'Escape') lb.close();
    if (e.key === 'ArrowLeft') lb.step(-1);
    if (e.key === 'ArrowRight') lb.step(1);
    if (e.key === 'Tab') {
        const btns = [...lb.el.querySelectorAll('button')].filter(b => b.style.display !== 'none');
        const k = btns.indexOf(document.activeElement);
        e.preventDefault();
        btns[(k + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
    }
});

// ---- Figure carousels ----
document.querySelectorAll('.fig-carousel').forEach(car => {
    const slides = [...car.querySelectorAll('.fc-slide')];
    const count = car.querySelector('.fc-count');
    const thumbs = car.querySelector('.fc-thumbs');
    const stage = car.querySelector('.fc-stage');
    let cur = 0;

    const items = slides.map(s => ({
        src: s.querySelector('img').getAttribute('src'),
        cap: s.querySelector('figcaption').textContent.replace(/\s+/g, ' ').trim()
    }));

    slides.forEach((s, i) => {
        const b = document.createElement('button');
        b.className = 'fc-thumb' + (i === 0 ? ' is-active' : '');
        b.setAttribute('aria-label', `Show figure ${i + 1}`);
        const src = items[i].src.replace('fig/', 'fig/t/');
        b.innerHTML = `<img src="${src}" alt="" loading="lazy">`;
        b.addEventListener('click', () => go(i));
        thumbs.appendChild(b);
        s.querySelector('.fc-img').addEventListener('click', () => lb.open(items, cur));
    });

    const tb = [...thumbs.children];

    function go(i) {
        cur = (i + slides.length) % slides.length;
        slides.forEach((s, k) => s.classList.toggle('is-active', k === cur));
        tb.forEach((t, k) => t.classList.toggle('is-active', k === cur));
        count.textContent = `${cur + 1} / ${slides.length}`;
        const img = slides[cur].querySelector('img');
        if (img.loading === 'lazy') img.loading = 'eager';
        const t = tb[cur];
        thumbs.scrollTo({ left: t.offsetLeft - thumbs.clientWidth / 2 + t.clientWidth / 2, behavior: 'smooth' });
    }

    car.querySelector('.fc-btn.prev').addEventListener('click', () => go(cur - 1));
    car.querySelector('.fc-btn.next').addEventListener('click', () => go(cur + 1));

    car.tabIndex = 0;
    car.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') go(cur - 1);
        if (e.key === 'ArrowRight') go(cur + 1);
    });

    let x0 = null;
    stage.addEventListener('pointerdown', e => { x0 = e.clientX; });
    stage.addEventListener('pointerup', e => {
        if (x0 === null) return;
        const dx = e.clientX - x0;
        if (Math.abs(dx) > 45) go(cur + (dx < 0 ? 1 : -1));
        x0 = null;
    });
});

// ---- Small galleries (image strips) ----
document.querySelectorAll('[data-gallery]').forEach(g => {
    const btns = [...g.querySelectorAll('button[data-src]')];
    const items = btns.map(b => ({ src: b.dataset.src, cap: b.dataset.cap }));
    btns.forEach((b, i) => b.addEventListener('click', () => lb.open(items, i)));
});

// ---- Count-up numbers ----
function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const dec = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1300;
    const t0 = performance.now();
    const fmt = v => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suffix;
    function tick(t) {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * eased);
        if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

// ---- Reveal on scroll (also drives charts, rings, counters) ----
(function () {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('[data-reveal]');
    const counters = document.querySelectorAll('[data-count]');

    if (!('IntersectionObserver' in window) || reduce) {
        items.forEach(el => el.classList.add('in'));
        return;
    }

    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('in');
            io.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach((el, i) => {
        el.style.transitionDelay = (i % 4) * 70 + 'ms';
        io.observe(el);
    });

    const co = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            countUp(entry.target);
            co.unobserve(entry.target);
        });
    }, { threshold: 0.6 });

    counters.forEach(el => co.observe(el));
})();

// ---- Publication filter ----
document.querySelectorAll('.pf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const f = btn.dataset.filter;
        document.querySelectorAll('.pf-btn').forEach(b => b.classList.toggle('is-active', b === btn));
        document.querySelectorAll('.pub').forEach(p => {
            p.classList.toggle('hidden', f !== 'all' && p.dataset.status !== f);
        });
    });
});

// ---- Navigation: solid on scroll, mobile menu ----
(function () {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40 || links.classList.contains('open'));
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    toggle.addEventListener('click', () => {
        links.classList.toggle('open');
        onScroll();
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('open');
        onScroll();
    }));
})();

// ---- Keyboard access for clickable photos and figures ----
document.querySelectorAll('.carousel-item:not([aria-hidden="true"]), .fc-img').forEach(el => {
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    if (!el.getAttribute('aria-label')) {
        const img = el.querySelector('img');
        el.setAttribute('aria-label', 'Enlarge: ' + (img && img.alt ? img.alt : 'image'));
    }
    el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
});
