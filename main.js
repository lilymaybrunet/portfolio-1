// ---------- Mobile nav ----------
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  document.querySelectorAll('[data-art]').forEach((el) => {
    const seed = parseInt(el.dataset.seed || '1', 10);
    const style = el.dataset.art;
    el.innerHTML = generateArt(style, seed);
  });
});

// ---------- Seeded RNG (mulberry32) ----------
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/*
  Placeholder artwork generator.
  These are stand-ins so the layout can be reviewed before real work
  is dropped in. Each <div data-art="photo|peinture|crochet" data-seed="n">
  gets a unique, deterministic abstract composition in the medium's palette.
  Swap these for <img> tags once real photos/scans are ready — see README.
*/
function generateArt(style, seed) {
  const rnd = mulberry32(seed * 977 + 13);
  const W = 400, H = 500;

  if (style === 'photo') return artPhoto(rnd, W, H);
  if (style === 'peinture') return artPeinture(rnd, W, H);
  if (style === 'crochet') return artCrochet(rnd, W, H);
  return '';
}

function artPhoto(rnd, W, H) {
  const dark = '#20302f', mid = '#4c6664', light = '#cdd6c9', paper = '#e9e2d2';
  let shapes = `<rect width="${W}" height="${H}" fill="${paper}"/>`;
  const horizon = H * (0.3 + rnd() * 0.35);
  shapes += `<rect x="0" y="${horizon}" width="${W}" height="${H - horizon}" fill="${mid}" opacity="0.55"/>`;
  const n = 3 + Math.floor(rnd() * 3);
  for (let i = 0; i < n; i++) {
    const x = rnd() * W, w = 20 + rnd() * 90, y = rnd() * horizon * 0.9, h = 30 + rnd() * (H - y - 40);
    shapes += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${dark}" opacity="${(0.25 + rnd() * 0.5).toFixed(2)}"/>`;
  }
  shapes += `<circle cx="${W * (0.15 + rnd() * 0.7)}" cy="${horizon * (0.3 + rnd() * 0.5)}" r="${18 + rnd() * 14}" fill="${light}" opacity="0.85"/>`;
  shapes += `<g stroke="${dark}" stroke-width="1" opacity="0.5">
    <line x1="16" y1="16" x2="34" y2="16"/><line x1="16" y1="16" x2="16" y2="34"/>
    <line x1="${W-16}" y1="${H-16}" x2="${W-34}" y2="${H-16}"/><line x1="${W-16}" y1="${H-16}" x2="${W-16}" y2="${H-34}"/>
  </g>`;
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Composition photographique, espace réservé">${shapes}</svg>`;
}

function artPeinture(rnd, W, H) {
  const palette = ['#7e2a46', '#c68a2e', '#2c4646', '#a85a3b', '#e2d9c2', '#3c2a33'];
  const bg = '#efe6d6';
  let shapes = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  const blobs = 5 + Math.floor(rnd() * 4);
  for (let i = 0; i < blobs; i++) {
    const color = palette[Math.floor(rnd() * palette.length)];
    const cx = rnd() * W, cy = rnd() * H;
    const rx = 40 + rnd() * 130, ry = 30 + rnd() * 110;
    const rot = Math.floor(rnd() * 180);
    shapes += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${color}" opacity="${(0.5 + rnd() * 0.4).toFixed(2)}" transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
  }
  const strokes = 4 + Math.floor(rnd() * 4);
  for (let i = 0; i < strokes; i++) {
    const y = rnd() * H, x1 = rnd() * W * 0.4, x2 = x1 + 60 + rnd() * (W * 0.5);
    const color = palette[Math.floor(rnd() * palette.length)];
    shapes += `<path d="M${x1.toFixed(1)},${y.toFixed(1)} Q${((x1+x2)/2).toFixed(1)},${(y - 20 + rnd()*40).toFixed(1)} ${x2.toFixed(1)},${(y + rnd()*30 - 15).toFixed(1)}" stroke="${color}" stroke-width="${6 + rnd()*10}" fill="none" stroke-linecap="round" opacity="0.85"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Composition picturale, espace réservé">${shapes}</svg>`;
}

function artCrochet(rnd, W, H) {
  const yarns = ['#c68a2e', '#7e2a46', '#e2a33b', '#2c4646', '#a85a3b'];
  const bg = '#f1e9dc';
  let shapes = `<rect width="${W}" height="${H}" fill="${bg}"/>`;
  const cx = W / 2, cy = H / 2;
  const rings = 4 + Math.floor(rnd() * 3);
  const baseColor = yarns[Math.floor(rnd() * yarns.length)];
  for (let r = 0; r < rings; r++) {
    const radius = 20 + r * (18 + rnd() * 8);
    const color = yarns[(Math.floor(rnd() * yarns.length) + r) % yarns.length];
    const loops = 10 + r * 4;
    let path = '';
    for (let i = 0; i <= loops; i++) {
      const a = (i / loops) * Math.PI * 2;
      const wobble = radius + Math.sin(a * 6) * 3;
      const x = cx + Math.cos(a) * wobble;
      const y = cy + Math.sin(a) * wobble;
      path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
    }
    shapes += `<path d="${path}" fill="none" stroke="${color}" stroke-width="3.4" stroke-linecap="round" opacity="0.9"/>`;
  }
  for (let i = 0; i < 3; i++) {
    const x = cx + (rnd() - 0.5) * W * 0.7;
    const y = cy + (rnd() - 0.5) * H * 0.7;
    shapes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${5 + rnd()*5}" fill="${baseColor}" opacity="0.5"/>`;
  }
  return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Composition crochet, espace réservé">${shapes}</svg>`;
}
