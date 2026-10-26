import * as P from './plan.js';
import * as store from './store.js';

const $ = (sel, root = document) => root.querySelector(sel);
const view = () => $('#view');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Dates (always the phone's local day) ----------
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (s, n) => { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); };
const daysBetween = (a, b) => Math.round((parse(b) - parse(a)) / 86400000);
const today = () => iso(new Date());
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const fmt = (s, opts = { weekday: 'short', day: 'numeric', month: 'short' }) => parse(s).toLocaleDateString('en-GB', opts);

function weekOf(date) {
  const w = Math.floor(daysBetween(P.PLAN_START, date) / 7) + 1;
  return Math.min(Math.max(w, 1), P.WEEKS);
}
const weekStart = (w) => addDays(P.PLAN_START, (w - 1) * 7);

function dayPlan(date) {
  const week = weekOf(date);
  const dow = parse(date).getDay();
  const key = DAY_KEYS[dow];
  const run = P.RUN_WEEKS[week];
  const morning = { mon: run.easy, wed: run.easy, fri: run.easy, tue: run.intervals, thu: run.intervals, sat: run.sat, sun: run.long }[key];
  const hasJog = /jog|walk-run|RACE/.test(morning);
  const morningLabel = { mon: 'Easy walk', wed: 'Easy walk', fri: 'Easy walk', tue: hasJog ? 'Walk-run' : 'Walk', thu: hasJog ? 'Walk-run' : 'Walk', sat: hasJog ? 'Saturday walk-run' : 'Saturday walk', sun: hasJog ? 'Long walk-run' : 'Long walk' }[key];
  let evening = null, eveningNote = '';
  if (['mon', 'wed', 'fri'].includes(key)) evening = P.SESSIONS[P.eveningSession(week, key)];
  else if (key === 'sun') eveningNote = 'Meal prep for the week. Food tab has the list.';
  else if (key === 'sat') eveningNote = 'Planned family order night — eat with them.';
  else eveningNote = 'Free evening. 10 min stretching if you feel like it.';
  return { week, dow, key, run, morning, morningLabel, evening, eveningNote };
}

// ---------- State ----------
let LOGS = [];
const logFor = (date) => LOGS.find((l) => l.date === date);

async function refresh() {
  try { LOGS = await store.getLogs(); } catch (e) { toast('Could not load your logs: ' + e.message); }
}

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => { t.hidden = true; }, 2800);
}

// ---------- Today ----------
function sessionBlock(s) {
  return `
    <div class="session">
      <p class="session-name">${esc(s.name)} <span class="muted">· ${esc(s.time)}</span></p>
      <ul class="steps">${s.full.map((x) => x.startsWith('• ') ? `<li class="in">${esc(x.slice(2))}</li>` : `<li>${esc(x)}</li>`).join('')}</ul>
      <details class="minimum">
        <summary>Bad night? 10-minute minimum</summary>
        <ul class="steps">${s.minimum.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
      </details>
    </div>`;
}

function renderToday() {
  const d = today();
  const p = dayPlan(d);
  const daysLeft = daysBetween(d, P.RACE.date);
  const log = logFor(d);
  const hour = new Date().getHours();
  const nextMeal = P.FOOD_DAY.find((m) => m.time !== 'Late' && Number(m.time.slice(0, 2)) >= hour) || P.FOOD_DAY[P.FOOD_DAY.length - 1];

  const bib = daysLeft > 0
    ? `<div class="bib" aria-label="${daysLeft} days to Burj2Burj">
         <span class="pin"></span><span class="pin"></span><span class="pin"></span><span class="pin"></span>
         <p class="bib-race">Burj2Burj · 24 Jan</p>
         <p class="bib-num">${daysLeft}</p>
         <p class="bib-label">days to go</p>
       </div>`
    : daysLeft === 0
      ? `<div class="bib"><span class="pin"></span><span class="pin"></span><span class="pin"></span><span class="pin"></span><p class="bib-race">Burj2Burj</p><p class="bib-num">GO</p><p class="bib-label">race day</p></div>`
      : '';

  view().innerHTML = `
    <section class="hero">
      ${bib}
      <div class="hero-text">
        <h1>${DAY_NAMES[p.dow]}</h1>
        <p class="sub">Week ${p.week} of ${P.WEEKS} · ${esc(p.run.focus)}</p>
        <p class="logstate ${log ? 'done' : ''}">${log ? 'Logged today ✓' : 'Not logged yet'}</p>
      </div>
    </section>

    <section class="block">
      <h2>This morning</h2>
      <p class="lead">${esc(p.morningLabel)}</p>
      <p>${esc(p.morning)}</p>
    </section>

    <section class="block">
      <h2>Tonight</h2>
      ${p.evening ? sessionBlock(p.evening) : `<p>${esc(p.eveningNote)}</p>`}
    </section>

    <section class="block">
      <h2>Next meal</h2>
      <p><strong>${esc(nextMeal.time)}</strong> — ${esc(nextMeal.what)}</p>
    </section>

    <a class="cta" href="#log">${log ? 'Edit today\'s log' : 'Log today'}</a>
    <p class="small center"><a href="#rules">The rules</a> · <a href="#survival">Survival mode</a></p>`;
}

// ---------- Log ----------
const CHOICES = {
  am_session: [['full', 'Full'], ['minimum', 'Minimum'], ['skipped', 'Skipped'], ['rest', 'Rest']],
  pm_session: [['full', 'Full'], ['minimum', 'Minimum'], ['skipped', 'Skipped'], ['rest', 'No session today']],
  meals_on_plan: [[0, '0'], [1, '1'], [2, '2'], [3, '3']],
  energy: [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [5, '5']],
};

function chips(name, value) {
  return `<div class="chips" role="radiogroup">${CHOICES[name].map(([v, label]) => `
    <label class="chip"><input type="radio" name="${name}" value="${v}" ${String(value) === String(v) ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div>`;
}

function renderLog(dateArg) {
  const d = dateArg || today();
  const l = logFor(d) || {};
  const p = dayPlan(d);
  const isSunday = p.key === 'sun';
  const defaultPm = p.evening ? '' : 'rest';
  view().innerHTML = `
    <form id="logform" class="block form">
      <div class="row between">
        <h1>Log</h1>
        <input type="date" name="date" value="${d}" max="${today()}" aria-label="Day">
      </div>
      <p class="sub">${fmt(d, { weekday: 'long', day: 'numeric', month: 'long' })} · week ${p.week}</p>

      <fieldset><legend>Weight (kg) <span class="muted">— morning, before coffee</span></legend>
        <input type="number" inputmode="decimal" step="0.1" name="weight" value="${l.weight ?? ''}" placeholder="e.g. 109.6"></fieldset>

      <fieldset><legend>Morning walk-run</legend>
        ${chips('am_session', l.am_session)}
        <div class="row two">
          <label>Minutes<input type="number" inputmode="numeric" name="am_minutes" value="${l.am_minutes ?? ''}"></label>
          <label>Km<input type="number" inputmode="decimal" step="0.01" name="am_km" value="${l.am_km ?? ''}"></label>
        </div></fieldset>

      <fieldset><legend>Evening session</legend>
        ${chips('pm_session', l.pm_session ?? defaultPm)}</fieldset>

      <fieldset><legend>Meals from the plan <span class="muted">— lunch, snack, dinner</span></legend>
        ${chips('meals_on_plan', l.meals_on_plan)}</fieldset>

      <fieldset><legend>Energy today <span class="muted">— 1 flat, 5 flying</span></legend>
        ${chips('energy', l.energy)}</fieldset>

      <div class="row two">
        <label>Water (L)<input type="number" inputmode="decimal" step="0.1" name="water_l" value="${l.water_l ?? ''}"></label>
        <label>Asleep at<input type="time" name="sleep_time" value="${l.sleep_time ?? ''}"></label>
      </div>

      <fieldset><legend>Nicotine</legend>
        <div class="row two">
          <label>Cigarettes<input type="number" inputmode="numeric" name="cigarettes" value="${l.cigarettes ?? ''}"></label>
          <label>IQOS sticks<input type="number" inputmode="numeric" name="iqos" value="${l.iqos ?? ''}"></label>
        </div>
        <label class="check"><input type="checkbox" name="vape" ${l.vape ? 'checked' : ''}> Vaped today</label></fieldset>

      <fieldset><legend>Waist (cm) <span class="muted">— ${isSunday ? 'Sunday: measure today' : 'Sundays only'}</span></legend>
        <input type="number" inputmode="decimal" step="0.1" name="waist" value="${l.waist ?? ''}"></fieldset>

      <label>Notes<textarea name="notes" rows="3" placeholder="How it went, what got in the way, how the knees felt">${esc(l.notes ?? '')}</textarea></label>

      <button class="cta" type="submit">Save log</button>
    </form>`;

  const form = $('#logform');
  form.date.addEventListener('change', (e) => { location.hash = '#log/' + e.target.value; });
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(form);
    const num = (k) => { const v = f.get(k); return v === null || v === '' ? null : Number(v); };
    const row = {
      date: f.get('date'),
      weight: num('weight'), waist: num('waist'),
      am_session: f.get('am_session'), am_minutes: num('am_minutes'), am_km: num('am_km'),
      pm_session: f.get('pm_session'),
      meals_on_plan: num('meals_on_plan'), energy: num('energy'),
      water_l: num('water_l'), sleep_time: f.get('sleep_time') || null,
      cigarettes: num('cigarettes'), iqos: num('iqos'), vape: f.get('vape') === 'on',
      notes: (f.get('notes') || '').trim() || null,
    };
    const btn = form.querySelector('button[type=submit]');
    btn.disabled = true; btn.textContent = 'Saving…';
    try {
      await store.saveLog(row);
      await refresh();
      toast('Log saved');
      location.hash = '#today';
    } catch (err) {
      toast('Log not saved: ' + err.message + '. Check your connection and save again.');
      btn.disabled = false; btn.textContent = 'Save log';
    }
  });
}

// ---------- Plan ----------
function renderPlan(wArg) {
  const current = weekOf(today());
  const w = Number(wArg) || current;
  const start = weekStart(w);
  const days = [...Array(7)].map((_, i) => addDays(start, i));
  view().innerHTML = `
    <section class="block">
      <div class="row between">
        <h1>Week ${w}</h1>
        <div class="stepper">
          <a class="btn" href="#plan/${Math.max(1, w - 1)}" aria-label="Previous week" ${w === 1 ? 'aria-disabled="true"' : ''}>‹</a>
          <a class="btn" href="#plan/${Math.min(P.WEEKS, w + 1)}" aria-label="Next week" ${w === P.WEEKS ? 'aria-disabled="true"' : ''}>›</a>
        </div>
      </div>
      <p class="sub">${fmt(start)} – ${fmt(addDays(start, 6))} · ${esc(P.RUN_WEEKS[w].focus)}${w === current ? ' · this week' : ''}</p>
      <ol class="week">
        ${days.map((d) => {
          const p = dayPlan(d);
          const ev = p.evening ? `${p.evening.name} (${p.evening.time})` : p.eveningNote;
          return `<li class="${d === today() ? 'is-today' : ''}">
            <p class="wd">${fmt(d, { weekday: 'short' })}<span>${fmt(d, { day: 'numeric', month: 'short' })}</span></p>
            <div><p><strong>AM</strong> ${esc(p.morning)}</p><p><strong>PM</strong> ${esc(ev)}</p></div>
          </li>`;
        }).join('')}
      </ol>
    </section>

    <section class="block">
      <h2>Training phases</h2>
      <ol class="phases">${P.PHASES.map((ph) => `<li><p><strong>Weeks ${ph.weeks}: ${esc(ph.name)}</strong></p><p>${esc(ph.text)}</p></li>`).join('')}</ol>
    </section>

    <section class="block">
      <h2>All sessions</h2>
      ${['P1a', 'P1b', 'P2A', 'P2B', 'P3A', 'P3B', 'P3D', 'SP'].map((k) => `<details class="fold"><summary>${esc(P.SESSIONS[k].name)} <span class="muted">· ${esc(P.SESSIONS[k].time)}</span></summary>${sessionBlock(P.SESSIONS[k])}</details>`).join('')}
    </section>

    <section class="block">
      <h2>Training rules</h2>
      <ul class="plain">${P.TRAINING_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <h2>Running rules</h2>
      <ul class="plain">${P.RUN_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <p class="small">${esc(P.RACE.note)}</p>
    </section>

    <section class="block">
      <h2>Nicotine, step by step</h2>
      <ol class="phases">${P.NICOTINE.map((n) => `<li><p><strong>Weeks ${n.weeks}</strong></p><p>${esc(n.step)}</p></li>`).join('')}</ol>
    </section>`;
}

// ---------- Food ----------
function renderFood() {
  const pr = P.PREP;
  view().innerHTML = `
    <section class="block">
      <h1>Food</h1>
      <ol class="timeline">${P.FOOD_DAY.map((m) => `<li><p class="t">${esc(m.time)}</p><p>${esc(m.what)}</p></li>`).join('')}</ol>
    </section>
    <section class="block">
      <h2>Food rules</h2>
      <ul class="plain">${P.FOOD_RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </section>
    <section class="block">
      <h2>Sunday prep</h2>
      <p>${esc(pr.when)} Makes ${esc(pr.makes)}</p>
      <p class="note">${esc(pr.safety)}</p>
      <h3>Shopping list</h3>
      <ul class="checklist">${pr.shopping.map((s, i) => `<li><label><input type="checkbox" data-shop="${i}"> ${esc(s)}</label></li>`).join('')}</ul>
      <h3>Cooking order</h3>
      <ol class="steps">${pr.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
      <h3>Flavour rotation</h3>
      <ul class="plain">${pr.rotation.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="note">${esc(pr.backup)}</p>
    </section>
    <section class="block">
      <h2>Family order night</h2>
      <ul class="plain">${P.ORDER_NIGHT.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
    </section>`;
  // The shopping checklist remembers ticks on this device until next Sunday.
  const key = 'reset.shop.' + weekStart(weekOf(today()));
  let ticked = [];
  try { ticked = JSON.parse(localStorage.getItem(key) || '[]'); } catch { /* storage blocked */ }
  view().querySelectorAll('[data-shop]').forEach((box) => {
    box.checked = ticked.includes(box.dataset.shop);
    box.addEventListener('change', () => {
      ticked = box.checked ? [...ticked, box.dataset.shop] : ticked.filter((x) => x !== box.dataset.shop);
      try { localStorage.setItem(key, JSON.stringify(ticked)); } catch { /* storage blocked */ }
    });
  });
}

// ---------- Rules & survival ----------
function renderRules() {
  view().innerHTML = `
    <section class="block">
      <div class="row between"><h1>The rules</h1><a class="btn" href="print.html" target="_blank" rel="noopener">Print sheet</a></div>
      <ol class="rules">${P.RULES.map((r) => `<li><p class="rule-title">${esc(r.title)}</p><p>${esc(r.text)}</p></li>`).join('')}</ol>
    </section>
    <section class="block">
      <h2>Goals</h2>
      <ul class="plain">${P.GOALS.map((g) => `<li>${esc(g)}</li>`).join('')}</ul>
    </section>`;
}

function renderSurvival() {
  const s = P.SURVIVAL;
  view().innerHTML = `
    <section class="block survival">
      <h1>Survival mode</h1>
      <p>${esc(s.when)}</p>
      <h2>Keep only this</h2>
      <ul class="checks">${s.keep.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
      <h2>Drop for now</h2>
      <p>${esc(s.drop)}</p>
      <h2>Coming back</h2>
      <p>${esc(s.back)}</p>
    </section>`;
}

// ---------- Progress & weekly report ----------
const avg = (xs) => { const v = xs.filter((x) => x !== null && x !== undefined && !Number.isNaN(x)); return v.length ? v.reduce((a, b) => a + Number(b), 0) / v.length : null; };
const f1 = (x) => (x === null ? '—' : Number(x).toFixed(1));
const toMin = (t) => { if (!t) return null; let [h, m] = t.split(':').map(Number); if (h < 12) h += 24; return h * 60 + m; };
const fromMin = (m) => (m === null ? '—' : `${pad(Math.floor(Math.round(m) / 60) % 24)}:${pad(Math.round(m) % 60)}`);

function weekLogs(w) {
  const s = weekStart(w), e = addDays(s, 6);
  return LOGS.filter((l) => l.date >= s && l.date <= e);
}

function weekStats(w) {
  const logs = weekLogs(w);
  const count = (k, v) => logs.filter((l) => l[k] === v).length;
  const sessionsPlanned = ['mon', 'wed', 'fri'].filter((k) => P.eveningSession(w, k) !== 'REST').length;
  return {
    logs,
    weight: avg(logs.map((l) => l.weight)),
    waist: logs.filter((l) => l.waist).map((l) => l.waist).pop() ?? null,
    amFull: count('am_session', 'full'), amMin: count('am_session', 'minimum'), amSkip: count('am_session', 'skipped'),
    amMinutes: logs.reduce((a, l) => a + (l.am_minutes || 0), 0),
    amKm: logs.reduce((a, l) => a + Number(l.am_km || 0), 0),
    pmFull: count('pm_session', 'full'), pmMin: count('pm_session', 'minimum'), pmSkip: count('pm_session', 'skipped'),
    sessionsPlanned,
    meals: logs.reduce((a, l) => a + (l.meals_on_plan || 0), 0),
    water: avg(logs.map((l) => l.water_l)),
    energy: avg(logs.map((l) => l.energy)),
    sleep: avg(logs.map((l) => toMin(l.sleep_time))),
    cigs: logs.reduce((a, l) => a + (l.cigarettes || 0), 0),
    iqos: avg(logs.map((l) => l.iqos)),
    vapeDays: logs.filter((l) => l.vape).length,
  };
}

function buildReport(w) {
  const s = weekStats(w), prev = w > 1 ? weekStats(w - 1) : null;
  const start = weekStart(w);
  const change = s.weight !== null && prev && prev.weight !== null ? (s.weight - prev.weight) : null;
  const lines = [
    `RESET — weekly report, week ${w} of ${P.WEEKS} (${fmt(start)} – ${fmt(addDays(start, 6))})`,
    `Days logged: ${s.logs.length}/7`,
    `Weight avg: ${f1(s.weight)} kg${change !== null ? ` (${change > 0 ? '+' : ''}${change.toFixed(1)} vs last week)` : ''}`,
    `Waist: ${s.waist ? s.waist + ' cm' : 'not measured'}`,
    `Mornings: ${s.amFull} full, ${s.amMin} minimum, ${s.amSkip} skipped — ${s.amMinutes} min, ${s.amKm.toFixed(1)} km`,
    `Evenings: ${s.pmFull} full, ${s.pmMin} minimum, ${s.pmSkip} skipped (planned: ${s.sessionsPlanned})`,
    `Meals on plan: ${s.meals}/${s.logs.length * 3}`,
    `Water avg: ${f1(s.water)} L · Energy avg: ${f1(s.energy)}/5 · Asleep avg: ${fromMin(s.sleep)}`,
    `Nicotine: ${s.cigs} cigarettes total, IQOS avg ${f1(s.iqos)}/day, vaped on ${s.vapeDays} days`,
    '',
    'Day by day:',
    ...s.logs.map((l) => `${fmt(l.date)}: wt ${l.weight ?? '—'} · AM ${l.am_session ?? '—'}${l.am_km ? ` ${l.am_km} km` : ''} · PM ${l.pm_session ?? '—'} · meals ${l.meals_on_plan ?? '—'}/3 · energy ${l.energy ?? '—'} · sleep ${l.sleep_time ?? '—'} · cigs ${l.cigarettes ?? '—'} · iqos ${l.iqos ?? '—'}${l.notes ? `\n   note: ${l.notes}` : ''}`),
    '',
    `Next week's plan focus: ${w < P.WEEKS ? P.RUN_WEEKS[w + 1].focus : 'after the race'}`,
  ];
  return lines.join('\n');
}

function weightChart() {
  const pts = LOGS.filter((l) => l.weight).map((l) => ({ d: l.date, w: Number(l.weight) }));
  if (pts.length < 2) return '<p class="muted">The chart appears after two weigh-ins.</p>';
  const W = 600, H = 200, padX = 34, padY = 16;
  const x0 = parse(pts[0].d), x1 = parse(pts[pts.length - 1].d);
  const span = Math.max(1, (x1 - x0) / 86400000);
  const ws = pts.map((p) => p.w);
  const lo = Math.floor(Math.min(...ws, 91) - 1), hi = Math.ceil(Math.max(...ws) + 1);
  const X = (d) => padX + ((parse(d) - x0) / 86400000 / span) * (W - padX - 8);
  const Y = (w) => padY + (1 - (w - lo) / (hi - lo)) * (H - padY * 2);
  const rolling = pts.map((p) => {
    const win = pts.filter((q) => q.d <= p.d && daysBetween(q.d, p.d) < 7);
    return { d: p.d, w: avg(win.map((q) => q.w)) };
  });
  const line = rolling.map((p, i) => `${i ? 'L' : 'M'}${X(p.d).toFixed(1)},${Y(p.w).toFixed(1)}`).join(' ');
  const goalY = Y(92);
  return `
    <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Weight over time, 7-day average line">
      <line x1="${padX}" x2="${W - 8}" y1="${goalY}" y2="${goalY}" class="goal"/>
      <text x="${padX + 4}" y="${goalY - 5}" class="axis">goal 92</text>
      <text x="2" y="${Y(hi) + 4}" class="axis">${hi}</text>
      <text x="2" y="${Y(lo) + 4}" class="axis">${lo}</text>
      ${pts.map((p) => `<circle cx="${X(p.d).toFixed(1)}" cy="${Y(p.w).toFixed(1)}" r="2.5" class="dot"><title>${fmt(p.d)}: ${p.w} kg</title></circle>`).join('')}
      <path d="${line}" class="avg"/>
    </svg>
    <p class="small">Dots are daily weigh-ins. The line is the 7-day average — that's the number that matters.</p>`;
}

function streak() {
  let n = 0, d = today();
  if (!logFor(d)) d = addDays(d, -1);
  while (logFor(d)) { n++; d = addDays(d, -1); }
  return n;
}

function renderProgress(wArg) {
  const current = weekOf(today());
  const w = Number(wArg) || current;
  const first = LOGS.find((l) => l.weight), last = [...LOGS].reverse().find((l) => l.weight);
  view().innerHTML = `
    <section class="block">
      <h1>Progress</h1>
      <div class="stats">
        <div><p class="n">${first ? f1(first.weight) : '—'}</p><p class="l">Start kg</p></div>
        <div><p class="n">${last ? f1(last.weight) : '—'}</p><p class="l">Latest kg</p></div>
        <div><p class="n">${streak()}</p><p class="l">Days logged in a row</p></div>
      </div>
      ${weightChart()}
    </section>
    <section class="block">
      <div class="row between">
        <h2>Weekly report</h2>
        <div class="stepper">
          <a class="btn" href="#progress/${Math.max(1, w - 1)}" aria-label="Previous week">‹</a>
          <a class="btn" href="#progress/${Math.min(current, w + 1)}" aria-label="Next week">›</a>
        </div>
      </div>
      <pre class="report" id="report">${esc(buildReport(w))}</pre>
      <button class="cta" id="copy">Copy report for Claude</button>
      <p class="small">Paste it into your Claude chat every Sunday evening. We adjust the next week from it.</p>
    </section>`;
  $('#copy').addEventListener('click', async () => {
    const text = buildReport(w);
    try { await navigator.clipboard.writeText(text); toast('Report copied'); }
    catch {
      const r = document.createRange(); r.selectNodeContents($('#report'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
      toast('Report selected — press copy');
    }
  });
}

// ---------- Sign in ----------
function renderSignIn() {
  document.body.classList.add('signed-out');
  view().innerHTML = `
    <form id="auth" class="block form narrow">
      <h1>Reset</h1>
      <p class="sub">Sign in to see your plan and logs.</p>
      <label>Email<input type="email" name="email" autocomplete="email" required></label>
      <label>Password<input type="password" name="password" autocomplete="current-password" minlength="8" required></label>
      <button class="cta" type="submit" name="mode" value="in">Sign in</button>
      <button class="link" type="submit" name="mode" value="up">First time here? Create the account</button>
      <p class="small" id="authmsg" role="status"></p>
    </form>`;
  $('#auth').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    const mode = e.submitter?.value || 'in';
    const msg = $('#authmsg');
    msg.textContent = mode === 'in' ? 'Signing in…' : 'Creating account…';
    try {
      if (mode === 'up') {
        const r = await store.signUp(f.get('email'), f.get('password'));
        if (r === 'check-email') { msg.textContent = 'Account created. Open the confirmation email, then come back and sign in.'; return; }
      } else {
        await store.signIn(f.get('email'), f.get('password'));
      }
      document.body.classList.remove('signed-out');
      await refresh();
      location.hash = '#today';
      route();
    } catch (err) {
      msg.textContent = err.message;
    }
  });
}

// ---------- Router ----------
async function route() {
  if (store.cloud && !(await store.currentUser())) return renderSignIn();
  const [name, arg] = (location.hash.slice(1) || 'today').split('/');
  const routes = { today: renderToday, log: renderLog, plan: renderPlan, food: renderFood, progress: renderProgress, rules: renderRules, survival: renderSurvival };
  (routes[name] || renderToday)(arg);
  document.querySelectorAll('.tabs a').forEach((a) => a.setAttribute('aria-current', a.getAttribute('href') === '#' + name ? 'page' : 'false'));
  window.scrollTo(0, 0);
}

async function start() {
  try { await store.init(); } catch (e) { toast('Could not reach the database: ' + e.message); }
  $('#mode').textContent = store.cloud ? '' : 'Test mode — logs are saved in this browser only.';
  $('#signout').hidden = !store.cloud;
  $('#signout').addEventListener('click', async () => { await store.signOut(); LOGS = []; route(); });
  if (!store.cloud || (await store.currentUser())) await refresh();
  window.addEventListener('hashchange', route);
  route();
}

start();
