// Carmelo Vera - Portfolio scripts

document.getElementById('year').textContent = new Date().getFullYear();

// Active tab follows the section you are reading
const links = [...document.querySelectorAll('.tabs a')];
const sections = links.map(a => document.querySelector(a.getAttribute('href')));
const header = document.querySelector('header');
function setActive() {
  const y = window.scrollY + 140;
  let current = sections[0];
  sections.forEach(s => { if (s.offsetTop <= y) current = s; });
  if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current.id));
  header.classList.toggle('scrolled', window.scrollY > 8);
}
window.addEventListener('scroll', setActive, { passive: true });
setActive();

// Fade-in sections
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Time Tracker concept (sample data, minutes per day Mon..Sun) ----------
const TODAY = 4; // Friday
const categories = [
  { id: 'all', name: 'All', color: '#fff' },
  { id: 'job', name: 'Job', color: '#4f8cff' },
  { id: 'self', name: 'Self Development', color: '#39d353' }
];
const trackers = [
  { name: 'Job Search', cat: 'job', color: '#4f8cff', week: [95, 120, 80, 110, 85, 30, 0] },
  { name: 'Networking', cat: 'job', color: '#a9c4ff', week: [20, 0, 35, 15, 20, 0, 0] },
  { name: 'Coding', cat: 'self', color: '#39d353', week: [60, 45, 90, 30, 55, 120, 90] },
  { name: 'Gym', cat: 'self', color: '#a6e3a1', week: [50, 0, 55, 0, 60, 70, 0] },
  { name: 'Reading', cat: 'self', color: '#f5c542', week: [15, 20, 0, 25, 10, 30, 40] }
];
trackers.forEach(t => t.extraSecs = 0);
let activeCat = 'all', runningIdx = -1, ticker = null;
const catTabs = document.getElementById('catTabs'), trkList = document.getElementById('trkList');
const barsEl = document.getElementById('bars');
const catName = id => categories.find(c => c.id === id).name;
const todaySecs = t => t.week[TODAY] * 60 + t.extraSecs;
const daySecs = (t, d) => d === TODAY ? todaySecs(t) : t.week[d] * 60;
const hm = s => { const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60; return h ? `${h}h ${m}m` : `${m}m`; };
const clock = s => [Math.floor(s / 3600), Math.floor(s / 60) % 60, s % 60].map(n => String(n).padStart(2, '0')).join(':');
const visible = () => trackers.map((t, i) => ({ t, i })).filter(({ t }) => activeCat === 'all' || t.cat === activeCat);

function renderTabs() {
  catTabs.innerHTML = '';
  categories.forEach(c => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = c.id === activeCat ? 'on' : '';
    b.innerHTML = (c.id === 'all' ? '' : `<i style="background:${c.color}"></i>`) + c.name;
    b.addEventListener('click', () => { activeCat = c.id; renderAll(); });
    catTabs.appendChild(b);
  });
}
function renderList() {
  trkList.innerHTML = '';
  visible().forEach(({ t, i }) => {
    const li = document.createElement('li');
    li.className = 'trk' + (i === runningIdx ? ' running' : '');
    li.innerHTML = `<span class="dot" style="background:${t.color}"></span>
      <span class="nm">${t.name}<small>${catName(t.cat)}</small></span>
      <span class="tm" data-i="${i}">${clock(todaySecs(t))}</span>
      <button class="play" type="button" aria-label="${i === runningIdx ? 'Stop' : 'Start'} ${t.name}">${i === runningIdx ? '❚❚' : '▶'}</button>`;
    li.querySelector('.play').addEventListener('click', () => toggle(i));
    trkList.appendChild(li);
  });
}
function renderChart() {
  const all = trackers;
  const max = Math.max(...[0, 1, 2, 3, 4, 5, 6].map(d => all.reduce((s, t) => s + daySecs(t, d), 0)));
  const vis = visible().map(v => v.t);
  barsEl.innerHTML = '';
  let total = 0;
  for (let d = 0; d < 7; d++) {
    const bar = document.createElement('div');
    bar.className = 'bar';
    vis.forEach(t => {
      const s = daySecs(t, d); total += s;
      if (!s) return;
      const seg = document.createElement('div');
      seg.style.height = (s / max * 100) + '%';
      seg.style.background = t.color;
      seg.title = `${t.name}: ${hm(s)}`;
      bar.appendChild(seg);
    });
    barsEl.appendChild(bar);
  }
  document.getElementById('weekLabel').textContent = 'This week · ' + catName(activeCat).toLowerCase();
  document.getElementById('weekTotal').textContent = hm(total);
}
function renderAll() { renderTabs(); renderList(); renderChart(); }
function toggle(i) {
  clearInterval(ticker); ticker = null;
  runningIdx = runningIdx === i ? -1 : i;
  if (runningIdx >= 0) {
    ticker = setInterval(() => {
      const t = trackers[runningIdx]; t.extraSecs += 1;
      const el = trkList.querySelector(`.tm[data-i="${runningIdx}"]`);
      if (el) el.textContent = clock(todaySecs(t));
      if (t.extraSecs % 5 === 0) renderChart();
    }, 1000);
  }
  renderList(); renderChart();
}
renderAll();

// ---------- Jimothy the raccoon ----------
const jim = document.getElementById('jimothy');
const stage = document.getElementById('stage');
const lid = document.getElementById('lid');
const wordsEl = document.getElementById('words');
const canBack = stage.querySelector('.can-back'), canFront = stage.querySelector('.can-front');
const h1text = document.querySelector('.h1-text');
const wrap = document.querySelector('.scene');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const greetings = ['¡Hola!', 'Bonjour!', 'Ciao!', 'Olá!', 'Hallo!', 'こんにちは!', '안녕하세요!', '你好!', 'Namaste!', 'Merhaba!', 'Hej!', 'Привет!', 'Aloha!'];
const JW = 120, CAN_W = 56, S = 0.8;
const actors = document.getElementById('actors');
let canX = 0, canCx = 0, colW = 0, busy = false, lidOn = true;
let pos = { x: 0, y: 0, r: 0 };

const T = p => `translate(${p.x}px, ${p.y}px) rotate(${p.r}deg)`;
const wait = ms => new Promise(r => setTimeout(r, ms));
const rimPos = () => ({ x: canCx - JW / 2, y: -57, r: 0 });
const divePos = () => ({ x: canCx - JW / 2 + 3, y: -27, r: 88 });
const place = p => { pos = p; jim.style.transform = T(p); };

function layout() {
  colW = wrap.clientWidth / S;
  actors.style.width = colW + 'px';
  canX = Math.max(150, Math.min(h1text.offsetWidth / S - 40, colW - CAN_W - 20));
  canCx = canX + CAN_W / 2;
  canBack.style.left = canFront.style.left = canX + 'px';
  lid.style.left = (canX - 3) + 'px';
  wordsEl.style.left = canCx + 'px';
}
// Moves Jimothy through keyframes, then keeps him at the last one
async function move(frames, duration, easing = 'linear') {
  const a = jim.animate(frames.map(f => ({ transform: T(f), offset: f.o, easing: f.e })), { duration, easing, fill: 'forwards' });
  await a.finished;
  place(frames[frames.length - 1]);
  a.cancel();
}
function flyLid() {
  lidOn = false;
  const a = lid.animate([
    { transform: 'translate(0,0) rotate(0)' },
    { transform: 'translate(-40px,-55px) rotate(-200deg)', offset: .45, easing: 'ease-in' },
    { transform: 'translate(-85px,57px) rotate(-360deg)', offset: .85 },
    { transform: 'translate(-85px,57px) rotate(-360deg)' }
  ], { duration: 900, fill: 'forwards' });
  a.finished.then(() => { lid.style.transform = 'translate(-85px,57px) rotate(-360deg)'; a.cancel(); });
}
function throwWord(text, i) {
  const el = document.createElement('span');
  el.className = 'trash-word w' + (i % 5) + (i === 0 ? ' first' : '');
  el.textContent = text;
  wordsEl.appendChild(el);
  const minX = -(canCx - 40), maxX = Math.max(10, Math.min(180, colW - canCx - 45));
  let dx = i === 0 ? -Math.min(130, canCx - 50)
    : Math.random() < .75 ? -(20 + Math.random() * (canCx - 50)) : 20 + Math.random() * (maxX - 20);
  dx = Math.max(minX, Math.min(maxX, dx));
  const peak = -(30 + Math.random() * 35), land = 50 + Math.random() * 3;
  const rot = i === 0 ? -8 : Math.random() * 50 - 25;
  const a = el.animate([
    { transform: 'translate(0,12px) rotate(0) scale(.5)', opacity: 0, easing: 'ease-out' },
    { transform: `translate(${dx * .5}px,${peak}px) rotate(${rot * .6}deg) scale(1)`, opacity: 1, offset: .3, easing: 'ease-in' },
    { transform: `translate(${dx}px,${land}px) rotate(${rot}deg)`, opacity: 1, offset: .55 },
    { transform: `translate(${dx}px,${land}px) rotate(${rot}deg)`, opacity: 1, offset: .85 },
    { transform: `translate(${dx}px,${land + 6}px) rotate(${rot}deg)`, opacity: 0 }
  ], { duration: i === 0 ? 4200 : 3000, fill: 'forwards' });
  a.finished.then(() => el.remove());
}
async function digIn() {
  jim.classList.remove('idle');
  jim.classList.add('air');
  if (lidOn) setTimeout(flyLid, 150);
  const d = divePos();
  await move([pos, { x: (pos.x + d.x) / 2 + 10, y: -80, r: 25, o: .5, e: 'ease-in' }, d], 560, 'ease-out');
  jim.classList.remove('air');
  jim.classList.add('diving');
  stage.classList.add('rummage');
  for (let i = 0; i < greetings.length; i++) {
    throwWord(greetings[i], i);
    await wait(i === 0 ? 1000 : 600);
  }
  await wait(400);
  jim.classList.remove('diving');
  stage.classList.remove('rummage');
  jim.classList.add('air');
  const r = rimPos();
  await move([pos, { x: r.x, y: -85, r: 10, o: .55, e: 'ease-in' }, r], 620, 'ease-out');
  jim.classList.remove('air');
  jim.classList.add('idle');
}
function resetLid() {
  lidOn = true;
  lid.getAnimations().forEach(a => a.cancel());
  lid.style.transform = '';
  lid.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
}
// Runs in from the left, digs through the trash, then hops off and runs away to the right
async function visit() {
  layout();
  place({ x: -JW - 10, y: 0, r: 0 });
  jim.classList.remove('idle');
  jim.classList.add('running');
  await move([pos, { x: canX - JW + 6, y: 0, r: 0 }], 1700, 'cubic-bezier(.3,.5,.5,1)');
  jim.classList.remove('running');
  await wait(300);
  await digIn();
  await wait(1600);
  // hop down from the can and keep going
  jim.classList.remove('idle');
  jim.classList.add('air');
  const r = rimPos();
  await move([pos, { x: r.x + 55, y: -80, r: -12, o: .45, e: 'ease-in' }, { x: r.x + 85, y: 0, r: 0 }], 560, 'ease-out');
  jim.classList.remove('air');
  jim.classList.add('running');
  const exitX = colW + 20;
  await move([pos, { x: exitX, y: 0, r: 0 }], Math.max(700, (exitX - pos.x) * 2.6), 'cubic-bezier(.4,0,.7,1)');
  jim.classList.remove('running');
}
async function loop() {
  while (true) {
    await visit();
    await wait(2200);
    resetLid();
    await wait(800);
  }
}
window.addEventListener('resize', layout);

if (reduceMotion) {
  layout(); place(rimPos()); jim.classList.add('idle');
  lidOn = false; lid.style.transform = 'translate(-85px,57px) rotate(-360deg)';
} else {
  setTimeout(loop, 500);
}
