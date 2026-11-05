const STORAGE_KEY = 'bombadao.dashboard.v1';
const iconPaths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  dumbbell: '<path d="M6.5 6.5v11M3.5 9v6M17.5 6.5v11M20.5 9v6M6.5 12h11"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  chart: '<path d="M3 3v18h18M7 14l4-4 4 3 6-7"/>',
  measure: '<path d="M4 7v10M8 9v6M12 7v10M16 9v6M20 7v10M4 12h16"/>',
  spark: '<path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-2-5.8L4 11l6-2.2zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z"/>',
  profile: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  play: '<path d="m8 5 12 7-12 7z"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  trend: '<path d="m4 16 5-5 4 3 7-8M14 6h6v6"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  trash: '<path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6m4 4v6m6-6v6"/>',
};

const svgIcon = (name, extra = '') => `<svg viewBox="0 0 24 24" aria-hidden="true" ${extra}>${iconPaths[name] || ''}</svg>`;
document.querySelectorAll('[data-icon]').forEach((node) => { node.innerHTML = svgIcon(node.dataset.icon); });

const weekdayShort = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];
const weekdayLong = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const weekNameToIndex = { DOM: 0, SEG: 1, TER: 2, QUA: 3, QUI: 4, SEX: 5, SÁB: 6 };
const weekNames = { segunda: ['SEG', 1], 'segunda-feira': ['SEG', 1], terça: ['TER', 2], 'terça-feira': ['TER', 2], quarta: ['QUA', 3], 'quarta-feira': ['QUA', 3], quinta: ['QUI', 4], 'quinta-feira': ['QUI', 4], sexta: ['SEX', 5], 'sexta-feira': ['SEX', 5], sábado: ['SÁB', 6], domingo: ['DOM', 0] };
const localDateKey = (date) => {
  const y = date.getFullYear(); const m = String(date.getMonth() + 1).padStart(2, '0'); const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
const today = new Date();
const mondayOf = (date) => { const d = new Date(date); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d; };
const dateOffset = (days) => { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + days); return localDateKey(d); };
const dateAt = (date, days) => { const d = new Date(`${date}T12:00:00`); d.setDate(d.getDate() + days); return localDateKey(d); };
const dateForDayThisWeek = (weekday) => localDateKey(new Date(mondayOf(today).getTime() + weekday * 86400000));
const isoWeekday = (date) => (new Date(`${date}T12:00:00`).getDay() + 6) % 7;
const formatDate = (date, options = { day: 'numeric', month: 'short' }) => new Intl.DateTimeFormat('pt-BR', options).format(new Date(`${date}T12:00:00`));
const formatLongDate = (date) => new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(`${date}T12:00:00`));
const makeId = () => globalThis.crypto?.randomUUID?.() || `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const esc = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

function demoState() {
  const weeks = [-35, -28, -21, -14, -7, -3, -1];
  const supinoLoads = [45, 47.5, 50, 52.5, 55, 57.5, 60];
  const sessionDates = weeks.map((offset, index) => {
    if (index === 5) return dateForDayThisWeek(0);
    if (index === 6) return dateForDayThisWeek(2);
    const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + offset); return localDateKey(d);
  });
  const sessions = sessionDates.map((date, i) => ({
    id: `demo-session-${i}`,
    date,
    planId: 'plan-base',
    dayId: i % 2 === 0 ? 'A' : 'B',
    dayName: i % 2 === 0 ? 'Superior A' : 'Inferior A',
    startedAt: new Date(`${date}T18:15:00`).toISOString(),
    duration: 52 + (i % 3) * 6,
    demo: true,
    exercises: [
      { name: 'Supino reto', sets: [{ reps: 8, load: supinoLoads[i], done: true }, { reps: 8, load: supinoLoads[i], done: true }] },
      { name: i % 2 === 0 ? 'Remada curvada' : 'Agachamento livre', sets: [{ reps: 10, load: i % 2 === 0 ? 40 + i * 2 : 60 + i * 3, done: true }, { reps: 10, load: i % 2 === 0 ? 40 + i * 2 : 60 + i * 3, done: true }] },
    ],
  }));
  return {
    version: 1,
    user: { name: 'Atleta', goal: 'Ganhar força', gym: 'Minha academia' },
    plans: [{
      id: 'plan-base', name: 'Base de força', structure: 'sequence', active: true,
      days: [
        { id: 'A', name: 'Superior A', label: 'A', weekday: 1, exercises: [
          { id: 'ex-1', name: 'Supino reto', sets: 4, reps: 8, load: 60, rest: 120, note: '' },
          { id: 'ex-2', name: 'Remada curvada', sets: 4, reps: 10, load: 45, rest: 90, note: '' },
          { id: 'ex-3', name: 'Desenvolvimento com halteres', sets: 3, reps: 10, load: 18, rest: 75, note: '' },
          { id: 'ex-4', name: 'Tríceps na polia', sets: 3, reps: 12, load: 25, rest: 60, note: '' },
        ] },
        { id: 'B', name: 'Inferior A', label: 'B', weekday: 3, exercises: [
          { id: 'ex-5', name: 'Agachamento livre', sets: 4, reps: 8, load: 70, rest: 150, note: '' },
          { id: 'ex-6', name: 'Levantamento terra romeno', sets: 3, reps: 10, load: 55, rest: 120, note: '' },
          { id: 'ex-7', name: 'Leg press', sets: 3, reps: 12, load: 100, rest: 90, note: '' },
        ] },
        { id: 'C', name: 'Superior B', label: 'C', weekday: 5, exercises: [
          { id: 'ex-8', name: 'Supino inclinado', sets: 4, reps: 8, load: 42.5, rest: 120, note: '' },
          { id: 'ex-9', name: 'Puxada frontal', sets: 4, reps: 10, load: 45, rest: 90, note: '' },
          { id: 'ex-10', name: 'Elevação lateral', sets: 3, reps: 12, load: 8, rest: 60, note: '' },
        ] },
      ],
    }],
    sessions,
    measurements: [
      { id: 'demo-measure-1', type: 'Peso corporal', value: 78.8, unit: 'kg', date: dateOffset(-42), demo: true },
      { id: 'demo-measure-2', type: 'Peso corporal', value: 78.4, unit: 'kg', date: dateOffset(-35), demo: true },
      { id: 'demo-measure-3', type: 'Peso corporal', value: 78.1, unit: 'kg', date: dateOffset(-28), demo: true },
      { id: 'demo-measure-4', type: 'Peso corporal', value: 78.3, unit: 'kg', date: dateOffset(-21), demo: true },
      { id: 'demo-measure-5', type: 'Peso corporal', value: 77.9, unit: 'kg', date: dateOffset(-14), demo: true },
      { id: 'demo-measure-6', type: 'Peso corporal', value: 77.8, unit: 'kg', date: dateOffset(-7), demo: true },
      { id: 'demo-measure-7', type: 'Peso corporal', value: 77.7, unit: 'kg', date: dateOffset(0), demo: true },
    ],
    draft: null,
  };
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed?.version === 1 && Array.isArray(parsed.plans) && Array.isArray(parsed.sessions)) return parsed;
    }
  } catch (error) { console.warn('Não foi possível ler os dados locais do Bombadão.', error); }
  return demoState();
}

let state = loadState();
let currentView = 'inicio';
let selectedPlanId = state.plans[0]?.id || null;
let selectedDayId = state.plans[0]?.days[0]?.id || null;
let chartExercise = 'Supino reto';
let toastTimer;

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (error) { showToast('Não consegui salvar neste navegador. Verifique o espaço disponível.'); console.warn(error); }
}

function getPlan(planId = selectedPlanId) { return state.plans.find((plan) => plan.id === planId) || state.plans[0] || null; }
function getDay(plan = getPlan(), dayId = selectedDayId) { return plan?.days.find((day) => day.id === dayId) || plan?.days[0] || null; }
function allExerciseNames() {
  const names = new Set();
  state.plans.forEach((plan) => plan.days.forEach((day) => day.exercises.forEach((exercise) => names.add(exercise.name))));
  state.sessions.forEach((session) => session.exercises.forEach((exercise) => names.add(exercise.name)));
  return [...names].sort((a, b) => a.localeCompare(b, 'pt-BR'));
}
function allSetsFor(name) {
  return state.sessions.flatMap((session) => session.exercises.filter((exercise) => exercise.name === name).flatMap((exercise) => exercise.sets.filter((set) => Number(set.load) > 0).map((set) => ({ ...set, date: session.date, sessionId: session.id }))));
}
function bestFor(name) { return Math.max(0, ...allSetsFor(name).map((set) => Number(set.load) || 0)); }
function recentSessions() { return [...state.sessions].sort((a, b) => b.date.localeCompare(a.date) || (b.startedAt || '').localeCompare(a.startedAt || '')); }
function weekSessions() { const start = localDateKey(mondayOf(new Date())); const end = dateAt(start, 6); return state.sessions.filter((session) => session.date >= start && session.date <= end); }
function currentDateLabel() {
  const d = new Date();
  document.querySelector('#today-label').textContent = new Intl.DateTimeFormat('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).format(d).replace('.', '').toUpperCase();
}
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2700);
}

function headerState() {
  const titleMap = { inicio: 'Início', treinos: 'Treinos', historico: 'Histórico', evolucao: 'Evolução', medidas: 'Medidas', desafios: 'Desafios', perfil: 'Perfil', sessao: 'Seu treino' };
  document.querySelector('#breadcrumb-current').textContent = titleMap[currentView] || 'Visão geral';
  const firstName = String(state.user?.name || 'atleta').trim().split(/\s+/)[0] || 'atleta';
  document.querySelector('#hello-greeting').textContent = `Oi, ${firstName}!`;
  document.querySelectorAll('[data-view]').forEach((button) => {
    const active = button.dataset.view === currentView || (button.dataset.view === 'treinos' && currentView === 'sessao');
    button.classList.toggle('is-active', active);
  });
  const resume = document.querySelector('#resume-session');
  resume.hidden = !state.draft || currentView === 'sessao';
  currentDateLabel();
}

function metricCard(label, value, unit, foot, icon = 'trend') {
  return `<article class="metric-card"><div class="metric-top"><span class="metric-label">${label}</span><span class="metric-mark">${svgIcon(icon)}</span></div><div class="metric-value">${value}<small>${unit}</small></div><div class="metric-foot">${foot}</div></article>`;
}

function pathChart(name, height = 133) {
  const records = allSetsFor(name).sort((a, b) => a.date.localeCompare(b.date));
  if (!records.length) return `<div class="chart-empty">Ainda não há registros de ${esc(name)}.<span>Complete uma sessão para começar seu histórico.</span></div>`;
  const grouped = new Map();
  records.forEach((record) => grouped.set(record.sessionId, { date: record.date, load: Math.max(Number(grouped.get(record.sessionId)?.load) || 0, Number(record.load) || 0) }));
  const points = [...grouped.values()].sort((a, b) => a.date.localeCompare(b.date)).slice(-8);
  const min = Math.min(...points.map((point) => point.load)); const max = Math.max(...points.map((point) => point.load));
  const xStep = points.length > 1 ? 540 / (points.length - 1) : 0;
  const chartPoints = points.map((point, index) => ({ x: 34 + xStep * index, y: max === min ? 58 : 112 - ((point.load - min) / (max - min)) * 83, ...point }));
  const d = chartPoints.map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
  const area = `${d} L ${chartPoints.at(-1).x.toFixed(1)} 127 L ${chartPoints[0].x.toFixed(1)} 127 Z`;
  const grid = [30, 62, 94, 126].map((y) => `<line class="chart-grid-line" x1="30" y1="${y}" x2="580" y2="${y}"/>`).join('');
  const circles = chartPoints.map((point) => `<circle class="chart-point" cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="3.4"><title>${esc(formatDate(point.date))}: ${point.load} kg</title></circle>`).join('');
  const labels = chartPoints.map((point, index) => index === 0 || index === chartPoints.length - 1 || index === Math.floor(chartPoints.length / 2) ? `<text class="chart-label" x="${point.x.toFixed(1)}" y="145" text-anchor="middle">${esc(formatDate(point.date, { month: 'short' }).toUpperCase().replace('.', ''))}</text>` : '').join('');
  return `<div class="chart-container"><svg class="progress-chart" viewBox="0 0 610 152" preserveAspectRatio="none" role="img" aria-label="Evolução de carga em ${esc(name)}">${grid}<defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#8fa756" stop-opacity=".24"/><stop offset="1" stop-color="#8fa756" stop-opacity="0"/></linearGradient></defs><path class="chart-area" d="${area}"/><path class="chart-path" d="${d}"/>${circles}${labels}</svg></div>`;
}

function renderHome() {
  const plan = getPlan();
  const dayForToday = (plan?.structure === 'week' ? plan.days.find((day) => day.weekday === new Date().getDay()) : null) || plan?.days[0];
  if (dayForToday) { selectedPlanId = plan.id; selectedDayId = dayForToday.id; }
  const workoutsThisWeek = weekSessions().length;
  const supinoBest = bestFor('Supino reto');
  const latestWeight = [...state.measurements].filter((m) => m.type === 'Peso corporal').sort((a,b) => b.date.localeCompare(a.date))[0];
  const dayExercises = dayForToday?.exercises || [];
  const latest = recentSessions().slice(0, 3);
  const monday = mondayOf(new Date());
  const doneDays = new Set(weekSessions().map((session) => new Date(`${session.date}T12:00:00`).getDay()));
  const weekMarkup = weekdayShort.map((name, index) => {
    const date = new Date(monday); date.setDate(date.getDate() + ((index + 6) % 7) - 1);
    const dayDate = new Date(monday); dayDate.setDate(dayDate.getDate() + index);
    const dayIndex = dayDate.getDay(); const isToday = localDateKey(dayDate) === localDateKey(new Date());
    return `<div class="week-day ${doneDays.has(dayIndex) ? 'is-done' : ''} ${isToday ? 'is-today' : ''}" title="${weekdayLong[dayIndex]} ${dayDate.getDate()}"><span>${name}</span><i class="week-dot">${doneDays.has(dayIndex) ? '✓' : isToday ? '•' : ''}</i></div>`;
  }).join('');
  const recentMarkup = latest.length ? latest.map((session) => {
    const day = new Date(`${session.date}T12:00:00`);
    const setCount = session.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
    return `<div class="recent-row"><span class="date-tile"><b>${day.getDate()}</b><small>${weekdayShort[day.getDay()]}</small></span><span class="recent-name"><b>${esc(session.dayName)}</b><small>${session.exercises.length} exercícios · ${setCount} séries</small></span><span class="recent-stat">${session.duration || 0} min</span><span class="recent-status">${session.demo ? 'EXEMPLO' : 'CONCLUÍDO'}</span></div>`;
  }).join('') : '<div class="recent-empty">Seu primeiro treino concluído vai aparecer aqui.</div>';
  const preview = dayExercises.slice(0, 3).map((exercise) => `<div class="preview-exercise"><span>${esc(exercise.name)}</span><small>${exercise.sets} × ${exercise.reps}</small></div>`).join('');
  const firstName = String(state.user?.name || 'atleta').trim().split(/\s+/)[0] || 'atleta';
  const demoNote = state.sessions.some((s) => s.demo) || state.measurements.some((m) => m.demo) ? '<div class="demo-note"><span>i</span> Alguns registros são exemplos para você experimentar o painel. Pode trocar pelos seus quando quiser.</div>' : '';
  return `<div class="page-enter">
    <div class="page-head"><div><span class="page-kicker">${weekdayLong[new Date().getDay()]}, ${new Intl.DateTimeFormat('pt-BR',{day:'numeric',month:'long'}).format(new Date())}</span><h1>Oi, ${esc(firstName)}! 👋</h1><p>Bora fazer um treino que te faça bem hoje?</p></div><div class="page-date"><b>${weekSessions().length} ${weekSessions().length === 1 ? 'treino' : 'treinos'}</b><span>nesta semana</span></div></div>
    ${demoNote}
    <section class="home-hero"><div class="home-hero-copy"><span class="page-kicker">${plan?.structure === 'week' ? 'Seu treino de hoje' : 'Sua próxima sessão'}</span><h2>${esc(dayForToday?.name || 'Seu próximo treino')}<span>!</span></h2><p>${dayExercises.length ? `${dayExercises.length} exercícios em ${esc(plan?.name || 'sua divisão')}. Seu plano fica aqui, prontinho para começar.` : 'Adicione alguns exercícios e deixe seu próximo treino prontinho por aqui.'}</p><button type="button" class="button button-lime" data-start-workout data-plan="${esc(plan?.id || '')}" data-day="${esc(dayForToday?.id || '')}">${state.draft ? 'Continuar treino' : dayExercises.length ? 'Bora treinar' : 'Montar meu treino'} ${svgIcon('arrow')}</button></div><div class="hero-plan-preview"><div class="preview-top"><span class="preview-state">${plan ? 'SUA DIVISÃO' : 'COMECE POR AQUI'}</span><span>${dayForToday ? esc(dayForToday.label) : '—'}</span></div><h3 class="preview-title">${esc(dayForToday?.name || 'Novo treino')}</h3><span class="preview-subtitle">${esc(plan?.name || 'Crie sua primeira divisão')}</span><div class="preview-rule"></div>${preview || '<div class="preview-exercise"><span>Adicione seu primeiro exercício</span><small>+</small></div>'}</div></section>
    <div class="metrics-grid">${metricCard('Treinos esta semana', String(workoutsThisWeek).padStart(2,'0'), 'sessões', '<strong>Mandou bem</strong> em aparecer por você', 'calendar')}${metricCard('Recorde no supino', supinoBest ? `${supinoBest}` : '—', supinoBest ? 'kg' : 'sem registro', supinoBest ? 'Sua maior carga anotada' : 'Registre uma série para começar', 'trend')}${metricCard('Peso atual', latestWeight ? `${Number(latestWeight.value).toLocaleString('pt-BR')}` : '—', latestWeight?.unit || 'sem registro', latestWeight ? `Anotado em ${formatDate(latestWeight.date)}` : 'Adicione uma medida se quiser', 'measure')}</div>
    <div class="content-grid"><section class="panel chart-panel"><div class="panel-heading"><div><h2>Sua evolução</h2><p>Veja como sua carga muda a cada treino.</p></div></div><div class="chart-toolbar"><select class="chart-exercise-select" id="home-chart-exercise" aria-label="Escolher exercício">${allExerciseNames().map((name) => `<option value="${esc(name)}" ${name === chartExercise ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select><span class="chart-legend"><i></i> Carga anotada</span></div>${pathChart(allExerciseNames().includes(chartExercise) ? chartExercise : allExerciseNames()[0] || 'Exercício')}</section><section class="panel week-panel"><div class="panel-heading"><div><h2>Essa semana</h2><p>Um passo de cada vez.</p></div></div><div class="week-days">${weekMarkup}</div><div class="week-summary"><div><strong>${workoutsThisWeek} ${workoutsThisWeek === 1 ? 'treino' : 'treinos'}</strong><small>anotados até agora</small></div><span class="week-badge">${String(workoutsThisWeek).padStart(2,'0')}</span></div></section></div>
    <div class="section-row"><h2>Seus últimos treinos</h2><button class="link-button" data-view="historico" type="button">Ver todos ↗</button></div><section class="recent-list">${recentMarkup}</section>
  </div>`;
}

function renderPlans() {
  const plan = getPlan();
  const day = getDay(plan);
  const cards = state.plans.map((item) => {
    const activeDay = item.days[0]; const exerciseNames = activeDay?.exercises.slice(0, 3).map((x) => `<div class="plan-exercise"><span>${esc(x.name)}</span><span>${x.sets} × ${x.reps}</span></div>`).join('') || '<div class="plan-exercise"><span>Adicione o primeiro exercício</span><span>+</span></div>';
    return `<article class="plan-card"><div class="plan-card-top"><span class="plan-card-code">${esc(activeDay?.label || '—')}</span><span class="label-mono">${item.structure === 'week' ? 'POR DIA' : 'SEQUÊNCIA'}</span></div><h3>${esc(item.name)}</h3><p>${item.days.length} sessões · ${item.days.reduce((n,d) => n + d.exercises.length,0)} exercícios</p><div class="plan-exercises">${exerciseNames}</div><div class="plan-card-actions"><button class="button button-outline" data-open-plan="${esc(item.id)}" type="button">Abrir divisão ${svgIcon('arrow')}</button><button class="icon-button" data-start-workout data-plan="${esc(item.id)}" data-day="${esc(activeDay?.id || '')}" aria-label="Começar ${esc(activeDay?.name || 'treino')}" type="button">${svgIcon('play')}</button></div></article>`;
  }).join('');
  const detail = plan && day ? `<section class="plan-detail"><div class="plan-detail-head"><div><span class="page-kicker">${esc(plan.name.toUpperCase())}</span><h2 class="panel-heading" style="margin:5px 0 0"><span>${esc(day.name)}</span></h2></div><div class="plan-bottom-actions"><button class="button button-outline" data-add-day="${esc(plan.id)}" type="button">${svgIcon('plus')} Adicionar sessão</button><button class="button button-lime" data-start-workout data-plan="${esc(plan.id)}" data-day="${esc(day.id)}" type="button">Começar ${svgIcon('arrow')}</button></div></div><div class="day-tabs">${plan.days.map((item) => `<button class="day-tab ${item.id === day.id ? 'is-active' : ''}" data-select-day="${esc(item.id)}" type="button">${esc(item.label)}</button>`).join('')}</div>${day.exercises.length ? `<table class="exercise-table"><thead><tr><th>EXERCÍCIO</th><th>SÉRIES</th><th>REPETIÇÕES</th><th>DESCANSO</th><th></th></tr></thead><tbody>${day.exercises.map((exercise) => `<tr><td><strong>${esc(exercise.name)}</strong>${exercise.note ? `<br><small>${esc(exercise.note)}</small>` : ''}</td><td>${exercise.sets}</td><td>${exercise.reps}</td><td>${exercise.rest ? `${exercise.rest}s` : '—'}</td><td class="table-actions"><button class="icon-button" data-remove-exercise="${esc(exercise.id)}" aria-label="Remover ${esc(exercise.name)}" type="button">${svgIcon('trash')}</button></td></tr>`).join('')}</tbody></table>` : `<div class="empty-state"><span class="empty-state-symbol">＋</span><b>Essa sessão está esperando o primeiro exercício.</b><p>Adicione o que você planeja fazer; os registros reais ficam guardados na sessão.</p></div>`}<div class="plan-bottom-actions"><button class="button button-outline" data-add-exercise="${esc(plan.id)}" data-day="${esc(day.id)}" type="button">${svgIcon('plus')} Adicionar exercício</button></div></section>` : '';
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">Organize do seu jeito</span><h1>Meus treinos<span class="title-period">.</span></h1><p>Monte seus dias ou uma sequência que funcione pra você.</p></div><button class="button button-lime" data-create-plan type="button">${svgIcon('plus')} Novo treino</button></div><div class="plan-grid">${cards}<button class="add-plan-card" data-create-plan type="button"><span class="add-plan-symbol">+</span><b>Criar outro treino</b><small>Você pode guardar mais de uma divisão</small></button></div>${detail}</div>`;
}

function sessionExerciseMarkup(exercise, exerciseIndex) {
  const sets = exercise.sets.map((set, setIndex) => `<div class="set-entry ${set.done ? 'is-done' : ''}" data-set-row="${exerciseIndex}-${setIndex}"><span class="set-number">SÉRIE ${String(setIndex+1).padStart(2,'0')}</span><label class="sr-only" for="reps-${exerciseIndex}-${setIndex}">Repetições da série ${setIndex+1} de ${esc(exercise.name)}</label><input id="reps-${exerciseIndex}-${setIndex}" class="set-input" data-set-input="reps" data-exercise="${exerciseIndex}" data-set="${setIndex}" type="number" inputmode="numeric" min="0" value="${set.reps ?? ''}" placeholder="reps"><label class="sr-only" for="load-${exerciseIndex}-${setIndex}">Carga em quilos da série ${setIndex+1} de ${esc(exercise.name)}</label><input id="load-${exerciseIndex}-${setIndex}" class="set-input" data-set-input="load" data-exercise="${exerciseIndex}" data-set="${setIndex}" type="number" inputmode="decimal" min="0" step="0.5" value="${set.load ?? ''}" placeholder="kg"><button class="set-check ${set.done ? 'is-done' : ''}" data-toggle-set="${exerciseIndex}-${setIndex}" type="button" aria-label="${set.done ? 'Desmarcar' : 'Marcar'} série ${setIndex+1}">${svgIcon('check')}</button></div>`).join('');
  return `<article class="session-exercise"><div class="session-exercise-head"><div class="session-exercise-title"><span class="exercise-number">${String(exerciseIndex+1).padStart(2,'0')}</span><div><h2>${esc(exercise.name)}</h2><p>${exercise.sets.length} séries planejadas · ${exercise.reps} repetições alvo</p></div></div><span class="exercise-rest">DESCANSO ${exercise.rest ? `${exercise.rest}s` : '—'}</span></div><div class="set-head"><span></span><span>REPETIÇÕES</span><span>CARGA (KG)</span><span></span></div>${sets}</article>`;
}

function formatTimer(startedAt) {
  const seconds = Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
  const minutes = Math.floor(seconds / 60); const remaining = seconds % 60;
  return `${String(minutes).padStart(2,'0')}:${String(remaining).padStart(2,'0')}`;
}

function renderSession() {
  const draft = state.draft;
  if (!draft) { currentView = 'inicio'; return renderHome(); }
  const done = draft.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.done).length, 0);
  const total = draft.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  return `<div class="page-enter session-shell"><div class="session-banner"><div><span class="page-kicker">${esc(draft.planName)}</span><h1>${esc(draft.dayName)}</h1></div><div class="session-timer"><span id="session-timer">${formatTimer(draft.startedAt)}</span><small>TEMPO DE SESSÃO</small></div></div><div class="session-guide"><span>✳</span> Registre o que fez em cada série. Você pode ajustar repetições e carga sem alterar o plano.</div>${draft.exercises.map(sessionExerciseMarkup).join('') || '<div class="empty-state"><b>Este treino ainda não tem exercícios.</b><p>Volte aos seus treinos para adicionar exercícios antes de começar uma sessão.</p></div>'}<div class="session-progress-line"><span id="session-progress-label">${done} de ${total} séries registradas</span><div class="session-progress-track"><i id="session-progress-fill" style="width:${pct}%"></i></div><span>${pct}%</span></div><div class="session-footer"><button class="button button-outline" data-pause-session type="button">Salvar e sair</button><button class="button finish-button" data-finish-session type="button">Concluir sessão ${svgIcon('check')}</button></div></div>`;
}

function renderHistory() {
  const sessions = recentSessions();
  const cards = sessions.map((session) => {
    const d = new Date(`${session.date}T12:00:00`); const setCount = session.exercises.reduce((sum,e) => sum + e.sets.length,0);
    return `<article class="history-card"><div class="history-date"><b>${String(d.getDate()).padStart(2,'0')}</b><small>${weekdayShort[d.getDay()]} · ${String(d.getMonth()+1).padStart(2,'0')}</small></div><div class="history-copy"><b>${esc(session.dayName)}</b><small>${session.exercises.map((e) => esc(e.name)).slice(0,3).join(' · ')}${session.exercises.length > 3 ? ` + ${session.exercises.length-3}` : ''}</small></div><div class="history-meta"><span>${setCount} séries</span><small>${session.duration || '—'} min</small></div><button class="button button-outline" data-repeat-session="${esc(session.id)}" type="button">Repetir ↗</button></article>`;
  }).join('');
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">Tudo que você já fez</span><h1>Histórico<span class="title-period">.</span></h1><p>Seus treinos, guardados para você voltar quando quiser.</p></div></div><div class="filter-row"><select id="history-filter" class="filter-select" aria-label="Filtrar histórico por treino"><option value="all">Todos os treinos</option>${[...new Set(sessions.map((s) => s.dayName))].map((name) => `<option value="${esc(name)}">${esc(name)}</option>`).join('')}</select><span class="label-mono">${sessions.length} ${sessions.length === 1 ? 'treino' : 'treinos'}</span></div><div class="history-list" id="history-list">${cards || '<div class="empty-state"><span class="empty-state-symbol">↗</span><b>Seu histórico começa no próximo treino.</b><p>Conclua uma sessão para encontrar seus registros aqui.</p><button class="button button-lime" data-view="treinos" type="button">Ver meus treinos</button></div>'}</div></div>`;
}

function renderEvolution() {
  const names = allExerciseNames();
  if (!names.includes(chartExercise)) chartExercise = names[0] || 'Supino reto';
  const best = bestFor(chartExercise);
  const records = allSetsFor(chartExercise).sort((a,b) => b.date.localeCompare(a.date)).slice(0,4);
  const options = names.map((name) => `<option value="${esc(name)}" ${name === chartExercise ? 'selected' : ''}>${esc(name)}</option>`).join('');
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">OLHE O CAMINHO PERCORRIDO</span><h1>Evolução<span class="title-period">.</span></h1><p>Compare registros do mesmo exercício ao longo do tempo.</p></div></div><div class="evolution-layout"><section class="panel evolution-chart-panel"><div class="panel-heading"><div><h2>Progressão de carga</h2><p>Maior carga anotada em cada sessão.</p></div><span class="trend-pill">${svgIcon('trend')} POR EXERCÍCIO</span></div><div class="chart-toolbar"><select class="chart-exercise-select" id="evolution-chart-exercise" aria-label="Escolher exercício">${options}</select><span class="chart-legend"><i></i> CARGA · KG</span></div>${pathChart(chartExercise,235)}<div class="chart-foot"><span>${records.length} sessões recentes</span><b>OS DADOS SÃO SEUS</b></div></section><div><section class="record-card"><span class="record-spark">✳</span><div><span class="label-mono">SEU RECORDE · ${esc(chartExercise.toUpperCase())}</span><strong>${best ? best : '—'}<small>${best ? ' kg' : ''}</small></strong><p>${best ? 'Maior carga registrada neste exercício' : 'Registre sessões para descobrir seu recorde'}</p></div></section><section class="panel record-history"><div class="panel-heading"><div><h2>Últimos registros</h2><p>${esc(chartExercise)}</p></div></div>${records.map((record) => `<div class="record-row"><span>${formatLongDate(record.date)}</span><span>${record.reps} reps · ${record.load} kg</span></div>`).join('') || '<div class="recent-empty">Ainda não há registros para este exercício.</div>'}</section></div></div><div class="section-row"><h2>O que você acompanha</h2></div><div class="metrics-grid">${metricCard('FREQUÊNCIA', `${weekSessions().length}`, 'nesta semana', 'Sessões registradas', 'calendar')}${metricCard('EXERCÍCIOS', `${names.length}`, 'no histórico', 'Cada um tem sua própria trajetória', 'dumbbell')}${metricCard('MEDIDAS', `${state.measurements.length}`, 'registros', 'Pontos anotados por você', 'measure')}</div></div>`;
}

function renderMeasurements() {
  const measurements = [...state.measurements].sort((a,b) => b.date.localeCompare(a.date));
  const weight = measurements.filter((m) => m.type === 'Peso corporal').sort((a,b) => a.date.localeCompare(b.date));
  const maxValue = Math.max(1, ...weight.map((m) => Number(m.value)));
  const chart = weight.length ? `<div class="measure-chart">${weight.slice(-12).map((m,index) => { const height = Math.max(12, Number(m.value) / maxValue * 126); return `<div class="measure-bar-wrap" title="${esc(formatLongDate(m.date))}: ${m.value} kg"><b>${Number(m.value).toLocaleString('pt-BR')}</b><i class="measure-bar" style="height:${height}px;animation-delay:${index*45}ms"></i><small>${formatDate(m.date,{day:'2-digit',month:'short'}).replace('.','')}</small></div>`; }).join('')}</div>` : '<div class="empty-state"><span class="empty-state-symbol">↗</span><b>Sem medidas registradas ainda.</b><p>Adicione uma medida quando quiser acompanhar mudanças ao longo do tempo.</p></div>';
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">ANOTE NO SEU TEMPO</span><h1>Medidas<span class="title-period">.</span></h1><p>Registros pessoais. Você decide o que compartilhar.</p></div></div><div class="measure-layout"><section class="panel"><div class="panel-heading"><div><h2>Nova medida</h2><p>Guarde um novo ponto do seu histórico.</p></div></div><form class="measure-form" id="measure-form" style="margin-top:17px"><label class="form-label">TIPO<select class="form-control" name="type"><option>Peso corporal</option><option>Cintura</option><option>Quadril</option><option>Braço</option><option>Coxa</option><option>Peito</option></select></label><label class="form-label">VALOR<input class="form-control" name="value" type="number" step="0.1" min="0" placeholder="Ex.: 78,4" required></label><label class="form-label">DATA<input class="form-control" name="date" type="date" value="${localDateKey(new Date())}" required></label><button class="button measure-save" type="submit">Salvar medida ${svgIcon('check')}</button></form></section><section class="panel"><div class="measure-summary"><div><span class="label-mono">PESO CORPORAL</span><strong>${weight.length ? Number(weight.at(-1).value).toLocaleString('pt-BR') : '—'} <small>kg</small></strong></div><span class="trend-pill">${weight.length} REGISTROS</span></div>${chart}</section></div><div class="section-row"><h2>Todos os registros</h2><span class="label-mono">${measurements.length} MEDIDAS</span></div><section class="panel measure-log">${measurements.map((m) => `<div class="measure-log-row"><b>${esc(m.type)}</b><span>${Number(m.value).toLocaleString('pt-BR')} ${esc(m.unit || (m.type === 'Peso corporal' ? 'kg' : 'cm'))}</span><span>${formatLongDate(m.date)}</span></div>`).join('') || '<div class="recent-empty">Suas medidas vão aparecer aqui.</div>'}</section></div>`;
}

function renderProfile() {
  const user = state.user || { name: 'Atleta', goal: '', gym: '' };
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">O SEU ESPAÇO</span><h1>Meu perfil<span class="title-period">.</span></h1><p>Preferências do perfil demonstrativo.</p></div></div><div class="profile-grid"><section class="panel profile-card-main"><span class="profile-avatar-large">${esc((user.name || 'A').trim().charAt(0).toUpperCase())}</span><h2>${esc(user.name || 'Atleta')}</h2><p>${esc(user.gym || 'Sua academia não foi definida')}</p><span class="profile-chip">${esc(user.goal || 'Objetivo em aberto')}</span></section><section class="panel"><div class="panel-heading"><div><h2>Seus dados</h2><p>No sistema final, essas preferências serão salvas no seu perfil.</p></div></div><form class="profile-form" id="profile-form" style="margin-top:17px"><label class="form-label">NOME<input class="form-control" name="name" value="${esc(user.name)}" required></label><label class="form-label">OBJETIVO<input class="form-control" name="goal" value="${esc(user.goal)}" placeholder="Ex.: ganhar força"></label><label class="form-label full">ACADEMIA<input class="form-control" name="gym" value="${esc(user.gym)}" placeholder="Opcional"></label><div class="profile-actions"><button class="button button-lime" type="submit">Salvar perfil ${svgIcon('check')}</button></div></form></section></div><div class="section-row"><h2>Privacidade</h2></div><section class="panel"><div class="panel-heading"><div><h2>Você escolhe o que compartilha.</h2><p>Os controles de compartilhamento com amigos serão definidos quando os recursos sociais entrarem no produto.</p></div></div><div class="challenge-types"><span>PERFIL PRIVADO POR PADRÃO</span><span>COMPARTILHAMENTO ITEM A ITEM</span></div></section></div>`;
}

function renderChallenges() {
  return `<div class="page-enter"><div class="page-head"><div><span class="page-kicker">Treino é seu. A torcida é opcional.</span><h1>Desafios<span class="title-period">.</span></h1><p>Uma forma leve de comemorar suas conquistas com amigos.</p></div></div><section class="coming-card"><span class="coming-kicker">✳ Estamos preparando</span><h2>Seu ritmo.<br>Sua turma.</h2><p>Desafios de frequência, recordes e evolução fazem parte do que queremos construir. Cada pessoa vai poder escolher o que compartilha.</p><div class="challenge-types"><span>Frequência</span><span>Recordes pessoais</span><span>Evolução</span></div></section></div>`;
}

function render() {
  const main = document.querySelector('#main-content');
  const views = { inicio: renderHome, treinos: renderPlans, historico: renderHistory, evolucao: renderEvolution, medidas: renderMeasurements, perfil: renderProfile, desafios: renderChallenges, sessao: renderSession };
  main.innerHTML = (views[currentView] || renderHome)();
  main.focus({ preventScroll: true });
  headerState();
  if (currentView === 'sessao' && state.draft) updateTimer();
}

function updateTimer() {
  const timer = document.querySelector('#session-timer');
  if (timer && state.draft) timer.textContent = formatTimer(state.draft.startedAt);
}
window.setInterval(updateTimer, 1000);

function selectView(view) {
  if (view === 'sessao' && !state.draft) { startWorkout(); return; }
  currentView = view;
  if (window.innerWidth <= 760) closeSidebar();
  render();
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

function startWorkout(planId = selectedPlanId, dayId = selectedDayId) {
  if (state.draft) {
    currentView = 'sessao'; render(); return;
  }
  const plan = getPlan(planId); const day = getDay(plan, dayId);
  if (!plan || !day) { openCreatePlan(); return; }
  if (!day.exercises.length) { currentView = 'treinos'; selectedPlanId = plan.id; selectedDayId = day.id; render(); showToast('Adicione exercícios a esta sessão antes de começar.'); return; }
  state.draft = {
    id: makeId(), planId: plan.id, planName: plan.name, dayId: day.id, dayName: day.name,
    startedAt: new Date().toISOString(), exercises: day.exercises.map((exercise) => ({
      sourceId: exercise.id, name: exercise.name, reps: exercise.reps, load: exercise.load, rest: exercise.rest,
      sets: Array.from({ length: Math.max(1, Math.min(15, Number(exercise.sets) || 1)) }, () => ({ reps: exercise.reps, load: exercise.load, done: false })),
    })),
  };
  saveState(); currentView = 'sessao'; render();
}

function saveDraftInput(input) {
  if (!state.draft) return;
  const exercise = state.draft.exercises[Number(input.dataset.exercise)];
  const set = exercise?.sets[Number(input.dataset.set)];
  if (!set) return;
  set[input.dataset.setInput] = input.value === '' ? '' : Number(input.value);
  saveState();
}

function updateSessionProgress() {
  if (!state.draft) return;
  const done = state.draft.exercises.reduce((sum, exercise) => sum + exercise.sets.filter((set) => set.done).length, 0);
  const total = state.draft.exercises.reduce((sum, exercise) => sum + exercise.sets.length, 0);
  const pct = total ? Math.round(done / total * 100) : 0;
  const label = document.querySelector('#session-progress-label'); const fill = document.querySelector('#session-progress-fill'); const number = document.querySelector('.session-progress-line > span:last-child');
  if (label) label.textContent = `${done} de ${total} séries registradas`;
  if (fill) fill.style.width = `${pct}%`;
  if (number) number.textContent = `${pct}%`;
}

function finishSession() {
  if (!state.draft) return;
  const completedExercises = state.draft.exercises.map((exercise) => ({ name: exercise.name, sets: exercise.sets.filter((set) => set.done && Number(set.reps) >= 0 && Number(set.load) >= 0).map((set) => ({ reps: Number(set.reps) || 0, load: Number(set.load) || 0, done: true })) })).filter((exercise) => exercise.sets.length);
  if (!completedExercises.length) { showToast('Marque pelo menos uma série concluída para salvar a sessão.'); return; }
  const draft = state.draft;
  const previous = new Map(completedExercises.map((exercise) => [exercise.name, bestFor(exercise.name)]));
  const elapsed = Math.max(1, Math.round((Date.now() - new Date(draft.startedAt).getTime()) / 60000));
  state.sessions.push({ id: draft.id, date: localDateKey(new Date()), planId: draft.planId, dayId: draft.dayId, dayName: draft.dayName, startedAt: draft.startedAt, duration: elapsed, demo: false, exercises: completedExercises });
  state.draft = null; saveState(); currentView = 'historico'; render();
  const newRecord = completedExercises.some((exercise) => exercise.sets.some((set) => set.load > (previous.get(exercise.name) || 0)));
  showToast(newRecord ? 'Sessão salva. Você registrou um novo recorde pessoal! ✳' : 'Sessão salva no seu histórico. Bom trabalho!');
}

function openModal(title, kicker, body, submitLabel = 'Salvar') {
  const layer = document.querySelector('#modal-layer');
  layer.innerHTML = `<section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><div class="modal-head"><div><span class="page-kicker">${esc(kicker)}</span><h2 id="modal-title">${esc(title)}</h2></div><button class="modal-close" data-close-modal type="button" aria-label="Fechar janela">×</button></div>${body}<div class="modal-actions"><button class="button button-outline" data-close-modal type="button">Cancelar</button><button class="button button-lime" data-modal-submit type="submit" form="modal-form">${esc(submitLabel)} ${svgIcon('check')}</button></div></section>`;
  layer.hidden = false;
  layer.querySelector('.modal-card').focus();
}

document.querySelector('#modal-layer').addEventListener('click', (event) => { if (event.target.id === 'modal-layer') closeModal(); });
function closeModal() { const layer = document.querySelector('#modal-layer'); layer.hidden = true; layer.innerHTML = ''; }

function openCreatePlan() {
  openModal('Nova divisão', 'ORGANIZE DO SEU JEITO', `<form class="modal-form" id="modal-form" data-form="create-plan"><label class="form-label">NOME DA DIVISÃO<input class="form-control" name="name" placeholder="Ex.: Base de força" required maxlength="48"></label><label class="form-label">COMO QUER ORGANIZAR?<select class="form-control" name="structure"><option value="sequence">Por sequência (A, B, C)</option><option value="week">Por dia da semana</option></select></label><label class="form-label">SESSÕES, SEPARADAS POR VÍRGULA<input class="form-control" name="days" value="A, B, C" placeholder="A, B, C" required></label><p class="form-hint">Você poderá adicionar e renomear exercícios depois. A divisão fica privada no seu painel.</p></form>`);
  document.querySelector('#modal-form [name="structure"]').addEventListener('change', (event) => { document.querySelector('#modal-form [name="days"]').value = event.target.value === 'week' ? 'Segunda, Quarta, Sexta' : 'A, B, C'; });
}

function openAddExercise(planId, dayId) {
  openModal('Adicionar exercício', 'SEU PLANO, SUA ESCOLHA', `<form class="modal-form" id="modal-form" data-form="add-exercise" data-plan="${esc(planId)}" data-day="${esc(dayId)}"><label class="form-label">EXERCÍCIO<input class="form-control" name="name" placeholder="Ex.: Supino reto" required maxlength="60"></label><div class="profile-form"><label class="form-label">SÉRIES<input class="form-control" name="sets" type="number" min="1" max="15" value="3" required></label><label class="form-label">REPETIÇÕES<input class="form-control" name="reps" type="number" min="1" max="100" value="10" required></label><label class="form-label">CARGA (KG)<input class="form-control" name="load" type="number" min="0" step="0.5" value="0"></label><label class="form-label">DESCANSO (SEG.)<input class="form-control" name="rest" type="number" min="0" step="15" value="90"></label></div><label class="form-label">OBSERVAÇÃO<input class="form-control" name="note" placeholder="Opcional" maxlength="120"></label></form>`);
}

function openAddDay(planId) {
  openModal('Nova sessão', 'AMPLIE SUA DIVISÃO', `<form class="modal-form" id="modal-form" data-form="add-day" data-plan="${esc(planId)}"><label class="form-label">NOME DA SESSÃO<input class="form-control" name="name" placeholder="Ex.: Mobilidade e core" required maxlength="40"></label><label class="form-label">IDENTIFICAÇÃO CURTA<input class="form-control" name="label" placeholder="Ex.: D" required maxlength="5"></label></form>`);
}

function saveForm(form) {
  const data = new FormData(form);
  if (form.dataset.form === 'create-plan') {
    const name = String(data.get('name') || '').trim(); const structure = String(data.get('structure')); const labels = String(data.get('days') || '').split(',').map((item) => item.trim()).filter(Boolean);
    if (!labels.length) return showToast('Adicione ao menos uma sessão à divisão.');
    const plan = { id: makeId(), name, structure, active: true, days: labels.slice(0, 7).map((label, index) => {
      const normalized = label.toLocaleLowerCase('pt-BR').normalize('NFC');
      const weekData = weekNames[normalized];
      const short = structure === 'week' ? (weekData?.[0] || label.toUpperCase().slice(0, 3)) : label.toUpperCase().slice(0, 5);
      const week = structure === 'week' ? (weekData?.[1] ?? [1,3,5][index % 3]) : null;
      const id = structure === 'sequence' ? short : `${short}-${makeId().slice(-4)}`;
      const fullName = structure === 'sequence' ? `Sessão ${short}` : `Treino de ${label}`;
      return { id, label: short, name: fullName, weekday: week, exercises: [] };
    }) };
    state.plans.push(plan); selectedPlanId = plan.id; selectedDayId = plan.days[0].id; saveState(); closeModal(); currentView = 'treinos'; render(); showToast('Divisão criada. Adicione os exercícios do seu plano.');
  } else if (form.dataset.form === 'add-exercise') {
    const plan = getPlan(form.dataset.plan); const day = getDay(plan, form.dataset.day);
    if (!plan || !day) return showToast('Não encontrei essa sessão.');
    day.exercises.push({ id: makeId(), name: String(data.get('name') || '').trim(), sets: Number(data.get('sets')), reps: Number(data.get('reps')), load: Number(data.get('load')) || 0, rest: Number(data.get('rest')) || 0, note: String(data.get('note') || '').trim() });
    selectedPlanId = plan.id; selectedDayId = day.id; saveState(); closeModal(); currentView = 'treinos'; render(); showToast('Exercício adicionado à sessão.');
  } else if (form.dataset.form === 'add-day') {
    const plan = getPlan(form.dataset.plan); if (!plan) return;
    const label = String(data.get('label') || '').trim().toUpperCase(); const name = String(data.get('name') || '').trim();
    plan.days.push({ id: `${label}-${makeId().slice(-4)}`, label, name, weekday: null, exercises: [] });
    selectedPlanId = plan.id; selectedDayId = plan.days.at(-1).id; saveState(); closeModal(); currentView = 'treinos'; render(); showToast('Sessão adicionada à divisão.');
  }
}

function addMeasurement(form) {
  const data = new FormData(form); const type = String(data.get('type')); const value = Number(String(data.get('value')).replace(',', '.')); const date = String(data.get('date'));
  if (!(value > 0) || !date) return showToast('Informe uma medida e uma data válidas.');
  state.measurements.push({ id: makeId(), type, value, unit: type === 'Peso corporal' ? 'kg' : 'cm', date, demo: false });
  saveState(); render(); showToast('Medida salva no seu histórico.');
}

function saveProfile(form) {
  const data = new FormData(form);
  state.user = { name: String(data.get('name') || '').trim() || 'Atleta', goal: String(data.get('goal') || '').trim(), gym: String(data.get('gym') || '').trim() };
  saveState(); render(); showToast('Perfil atualizado neste navegador.');
}

function closeSidebar() {
  document.querySelector('#sidebar').classList.remove('is-open');
  const button = document.querySelector('#mobile-menu'); button?.setAttribute('aria-expanded', 'false'); button?.setAttribute('aria-label', 'Abrir navegação');
}

document.addEventListener('click', (event) => {
  const viewButton = event.target.closest('[data-view]');
  if (viewButton) { selectView(viewButton.dataset.view); return; }
  if (event.target.closest('#mobile-menu')) {
    const sidebar = document.querySelector('#sidebar'); const button = document.querySelector('#mobile-menu'); const open = !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', open); button.setAttribute('aria-expanded', String(open)); button.setAttribute('aria-label', open ? 'Fechar navegação' : 'Abrir navegação'); return;
  }
  if (event.target.closest('#resume-session')) { currentView = 'sessao'; render(); return; }
  if (event.target.closest('[data-create-plan]')) { openCreatePlan(); return; }
  const openPlanButton = event.target.closest('[data-open-plan]');
  if (openPlanButton) { selectedPlanId = openPlanButton.dataset.openPlan; selectedDayId = getPlan(selectedPlanId)?.days[0]?.id || null; currentView = 'treinos'; render(); return; }
  const dayTab = event.target.closest('[data-select-day]');
  if (dayTab) { selectedDayId = dayTab.dataset.selectDay; render(); return; }
  const addEx = event.target.closest('[data-add-exercise]');
  if (addEx) { openAddExercise(addEx.dataset.plan, addEx.dataset.day); return; }
  const addDay = event.target.closest('[data-add-day]');
  if (addDay) { openAddDay(addDay.dataset.addDay); return; }
  const start = event.target.closest('[data-start-workout]');
  if (start) { startWorkout(start.dataset.plan || selectedPlanId, start.dataset.day || selectedDayId); return; }
  if (event.target.closest('[data-pause-session]')) { saveState(); currentView = 'inicio'; render(); showToast('Sessão salva. Você pode continuar quando quiser.'); return; }
  if (event.target.closest('[data-finish-session]')) { finishSession(); return; }
  const toggle = event.target.closest('[data-toggle-set]');
  if (toggle && state.draft) {
    const [exIndex, setIndex] = toggle.dataset.toggleSet.split('-').map(Number); const set = state.draft.exercises[exIndex]?.sets[setIndex];
    if (set) { set.done = !set.done; toggle.classList.toggle('is-done', set.done); toggle.setAttribute('aria-label', `${set.done ? 'Desmarcar' : 'Marcar'} série ${setIndex+1}`); toggle.closest('.set-entry').classList.toggle('is-done', set.done); saveState(); updateSessionProgress(); }
    return;
  }
  const remove = event.target.closest('[data-remove-exercise]');
  if (remove) {
    const plan = getPlan(); const day = getDay(plan); const exercise = day?.exercises.find((x) => x.id === remove.dataset.removeExercise);
    if (exercise && window.confirm(`Remover ${exercise.name} desta divisão? Os registros anteriores serão mantidos.`)) { day.exercises = day.exercises.filter((x) => x.id !== exercise.id); saveState(); render(); showToast('Exercício removido do plano.'); }
    return;
  }
  const repeat = event.target.closest('[data-repeat-session]');
  if (repeat) { const session = state.sessions.find((item) => item.id === repeat.dataset.repeatSession); if (session) startWorkout(session.planId, session.dayId); return; }
  const close = event.target.closest('[data-close-modal]');
  if (close) { closeModal(); return; }
  if (event.target.closest('#reset-demo')) {
    if (window.confirm('Restaurar os dados demonstrativos? Os registros salvos neste navegador serão substituídos.')) { state = demoState(); selectedPlanId = state.plans[0].id; selectedDayId = state.plans[0].days[0].id; chartExercise = 'Supino reto'; saveState(); currentView = 'inicio'; render(); showToast('Exemplos restaurados.'); }
  }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-set-input]')) saveDraftInput(event.target);
});

document.addEventListener('change', (event) => {
  if (event.target.matches('#home-chart-exercise, #evolution-chart-exercise')) { chartExercise = event.target.value; render(); return; }
  if (event.target.matches('#history-filter')) {
    const value = event.target.value;
    document.querySelectorAll('.history-card').forEach((card) => { card.hidden = value !== 'all' && !card.querySelector('.history-copy b')?.textContent.includes(value); });
  }
});

document.addEventListener('submit', (event) => {
  const form = event.target;
  if (form.matches('#modal-form')) { event.preventDefault(); saveForm(form); }
  else if (form.matches('#measure-form')) { event.preventDefault(); addMeasurement(form); }
  else if (form.matches('#profile-form')) { event.preventDefault(); saveProfile(form); }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') { closeModal(); closeSidebar(); }
  if (event.key === 'Enter' && event.target.matches('[data-set-input]')) {
    const inputs = [...document.querySelectorAll('[data-set-input]')]; const next = inputs[inputs.indexOf(event.target) + 1]; next?.focus();
  }
});

render();
