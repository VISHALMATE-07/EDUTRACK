/* ==========================================================================
   EduTrack — common.js
   Shared across every page: theme, session, icons, toasts, modals, charts,
   and the sidebar/topbar shell used by both the student and faculty portal.

   NOTE for future backend integration:
   Session handling here is a FRONTEND-ONLY DEMO using localStorage.
   It must be replaced by real Firebase Authentication + a server-verified
   session before this app stores any real user data.
   ========================================================================== */

const EduTrack = (() => {

  /* ---------------------------------------------------------------------
     THEME
  --------------------------------------------------------------------- */
  const THEME_KEY = 'edutrack-theme';

  function initTheme(){
    const saved = localStorage.getItem(THEME_KEY) || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }

  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    document.querySelectorAll('.theme-switch button').forEach(b=>{
      b.classList.toggle('active', b.dataset.theme === theme);
    });
  }

  function currentTheme(){
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function themeSwitchHTML(){
    const t = currentTheme();
    return `
      <div class="theme-switch" role="group" aria-label="Theme switch">
        <button data-theme="light" class="${t==='light'?'active':''}" aria-label="Light mode" title="Light mode">${icon('sun',15)}</button>
        <button data-theme="dark" class="${t==='dark'?'active':''}" aria-label="Dark mode" title="Dark mode">${icon('moon',15)}</button>
      </div>`;
  }

  function bindThemeSwitch(root=document){
    root.querySelectorAll('.theme-switch button').forEach(btn=>{
      btn.addEventListener('click', ()=> setTheme(btn.dataset.theme));
    });
  }

  /* ---------------------------------------------------------------------
     SESSION (demo only — see note above)
  --------------------------------------------------------------------- */
  const SESSION_KEY = 'edutrack-session';

  function login(role, profile){
    localStorage.setItem(SESSION_KEY, JSON.stringify({ role, ...profile, loggedInAt: Date.now() }));
  }
  function getSession(){
    try{ return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch(e){ return null; }
  }
  function logout(){
    localStorage.removeItem(SESSION_KEY);
    window.location.href = computeRoot() + 'index.html';
  }
  /** Redirects away if there's no session, or the session role doesn't match.
   *  This SIMULATES route protection on the frontend; the real backend
   *  must enforce this again once Firebase Auth + Express are connected. */
  function requireRole(role){
    const s = getSession();
    const root = computeRoot();
    if(!s){ window.location.href = root + 'auth/choose-login.html'; return null; }
    if(s.role !== role){ window.location.href = root + (s.role === 'student' ? 'student/dashboard.html' : 'faculty/dashboard.html'); return null; }
    return s;
  }
  // Figures out the relative path back to the project root from any page depth.
  function computeRoot(){
    const path = window.location.pathname;
    if(path.includes('/student/') || path.includes('/faculty/') || path.includes('/auth/') || path.includes('/public/')) return '../';
    return './';
  }

  /* ---------------------------------------------------------------------
     ICONS — tiny hand-drawn inline SVG set (no external icon font/CDN)
  --------------------------------------------------------------------- */
  const ICONS = {
    home: 'M3 11l9-7 9 7M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9',
    book: 'M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z M19 17H6a2 2 0 0 0-2 2',
    users: 'M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M2 21c0-4 3-6 6-6s6 2 6 6 M16 8a3 3 0 1 1 0-6 M15 15c3 .3 5 2.4 5 6',
    briefcase: 'M3 7h18v13H3V7z M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M3 12h18',
    folder: 'M3 6a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z',
    check: 'M20 6L9 17l-5-5',
    checkCircle: 'M22 11.1V12a10 10 0 1 1-6-9.2 M22 4L12 14.5l-3-3',
    bell: 'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9 M13.7 21a2 2 0 0 1-3.4 0',
    search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3',
    sun: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M1 12h2 M21 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4',
    moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
    chevronDown: 'M6 9l6 6 6-6',
    chevronRight: 'M9 6l6 6-6 6',
    chevronLeft: 'M15 18l-6-6 6-6',
    plus: 'M12 5v14 M5 12h14',
    trash: 'M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13 M10 11v6 M14 11v6',
    edit: 'M4 20h4L19 9l-4-4L4 16v4z M14 6l4 4',
    logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9',
    settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.2.5.7 1 1.6 1H21a2 2 0 1 1 0 4h-.2a1.7 1.7 0 0 0-1.6 1z',
    target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
    award: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z M8.5 13.5L7 22l5-3 5 3-1.5-8.5',
    message: 'M21 11.5a8.4 8.4 0 0 1-8.9 8.4 8.5 8.5 0 0 1-4-1L3 20l1.1-5.1a8.4 8.4 0 1 1 16.9-3.4z',
    calendar: 'M8 2v4 M16 2v4 M3 9h18 M4 5h16a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
    clipboard: 'M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1z M6 5h12v16H6z M9 11h6 M9 15h6',
    barChart: 'M4 20V10 M12 20V4 M20 20v-7',
    trendUp: 'M3 17l6-6 4 4 8-8 M15 7h6v6',
    alertTriangle: 'M12 3l10 18H2z M12 10v4 M12 17.5v.1',
    fileText: 'M6 2h9l5 5v15H6z M15 2v5h5 M9 13h6 M9 17h6',
    upload: 'M12 16V4 M7 9l5-5 5 5 M4 20h16',
    download: 'M12 4v12 M7 11l5 5 5-5 M4 20h16',
    link: 'M9 17H7a5 5 0 0 1 0-10h2 M15 7h2a5 5 0 0 1 0 10h-2 M8 12h8',
    map: 'M9 20l-6-2V4l6 2 6-2 6 2v14l-6-2-6 2z M9 6v14 M15 6v14',
    layers: 'M12 2l9 5-9 5-9-5 9-5z M3 12l9 5 9-5 M3 17l9 5 9-5',
    user: 'M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M4 22c0-5 3.5-8 8-8s8 3 8 8',
    lock: 'M6 11V7a6 6 0 0 1 12 0v4 M5 11h14v10H5z',
    mail: 'M3 5h18v14H3z M3 6l9 7 9-7',
    eye: 'M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
    x: 'M18 6L6 18 M6 6l12 12',
    menu: 'M3 6h18 M3 12h18 M3 18h18',
    arrowRight: 'M5 12h14 M13 6l6 6-6 6',
    clock: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M12 6v6l4 2',
    building: 'M4 21V4h11v17 M15 21V9h5v12 M8 7h1 M8 11h1 M8 15h1',
    zap: 'M13 2L3 14h7l-1 8 10-12h-7l1-8z',
    star: 'M12 2l3 6.5 7 .8-5.2 4.9 1.4 6.9-6.2-3.5-6.2 3.5 1.4-6.9L2 9.3l7-.8z',
    filter: 'M4 4h16l-6 8v6l-4 2v-8z',
    grad: 'M22 10L12 5 2 10l10 5 10-5z M6 12v5c0 1.5 3 3 6 3s6-1.5 6-3v-5',
    github: 'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.7.4-1.1.6-1.4-2.3-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.5-1.3.1-2.7 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .6 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7 1 .7 2v3c0 .3.2.6.7.5A10 10 0 0 0 12 2z',
    sparkle: 'M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z'
  };

  function icon(name, size=18, strokeW=1.8){
    const d = ICONS[name] || ICONS.checkCircle;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${strokeW}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
      d.split(' M').map((seg,i)=> `<path d="${i===0?seg:'M'+seg}"/>`).join('')
    }</svg>`;
  }

  /* ---------------------------------------------------------------------
     TOASTS
  --------------------------------------------------------------------- */
  function ensureToastStack(){
    let stack = document.getElementById('toast-stack');
    if(!stack){
      stack = document.createElement('div');
      stack.id = 'toast-stack';
      document.body.appendChild(stack);
    }
    return stack;
  }
  function toast(message, type='default', duration=3200){
    const stack = ensureToastStack();
    const el = document.createElement('div');
    el.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(()=>{
      el.style.transition = 'opacity 220ms, transform 220ms';
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      setTimeout(()=> el.remove(), 220);
    }, duration);
  }

  /* ---------------------------------------------------------------------
     MODAL
  --------------------------------------------------------------------- */
  function openModal(innerHTML, {onClose}={}){
    closeModal();
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'active-modal';
    overlay.innerHTML = `<div class="modal">${innerHTML}</div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(()=> overlay.classList.add('open'));
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeModal(); });
    overlay.querySelectorAll('[data-close-modal]').forEach(b=> b.addEventListener('click', closeModal));
    if(onClose) overlay._onClose = onClose;
    return overlay;
  }
  function closeModal(){
    const overlay = document.getElementById('active-modal');
    if(!overlay) return;
    overlay.classList.remove('open');
    setTimeout(()=> overlay.remove(), 180);
    if(overlay._onClose) overlay._onClose();
  }

  /* ---------------------------------------------------------------------
     NUMBER ANIMATION + PROGRESS BAR FILL
  --------------------------------------------------------------------- */
  function animateNumber(el, target, {suffix='', duration=900}={}){
    const start = 0;
    const t0 = performance.now();
    function tick(now){
      const p = Math.min(1, (now - t0)/duration);
      const eased = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(start + (target-start)*eased) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  function fillBars(root=document){
    root.querySelectorAll('.progress[data-value]').forEach(p=>{
      const v = Math.max(0, Math.min(100, parseFloat(p.dataset.value)));
      const span = p.querySelector('span');
      requestAnimationFrame(()=> span.style.width = v + '%');
    });
  }

  /* ---------------------------------------------------------------------
     SVG CHART HELPERS (dependency-free)
  --------------------------------------------------------------------- */
  function barChart(values, labels, {height=160, color='var(--primary)'}={}){
    const max = Math.max(...values, 1);
    const w = 100/values.length;
    const bars = values.map((v,i)=>{
      const h = Math.max(4,(v/max)*100);
      return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:8px;">
        <div style="width:100%;display:flex;align-items:flex-end;height:${height}px;">
          <div class="chart-bar" style="width:60%;margin:0 auto;height:${h}%;background:${color};border-radius:6px 6px 2px 2px;transition:height 900ms cubic-bezier(.22,1,.36,1);" data-h="${h}"></div>
        </div>
        <span class="text-xs text-faint">${labels[i]}</span>
      </div>`;
    }).join('');
    const html = `<div class="chart-box" style="display:flex;align-items:flex-end;gap:6px;">${bars}</div>`;
    return html;
  }
  function animateChartBars(root){
    root.querySelectorAll('.chart-bar').forEach(b=>{
      const h = b.dataset.h;
      b.style.height = '0%';
      requestAnimationFrame(()=> setTimeout(()=> b.style.height = h+'%', 30));
    });
  }
  function lineChart(values, labels, {height=160, color='var(--primary)'}={}){
    const max = Math.max(...values,1), min = Math.min(...values,0);
    const range = (max-min)||1;
    const w = 300, h = height;
    const pts = values.map((v,i)=>{
      const x = (i/(values.length-1))*w;
      const y = h - ((v-min)/range)*h;
      return `${x},${y}`;
    }).join(' ');
    const dots = values.map((v,i)=>{
      const x = (i/(values.length-1))*w;
      const y = h - ((v-min)/range)*h;
      return `<circle cx="${x}" cy="${y}" r="3.2" fill="${color}"/>`;
    }).join('');
    const areaPts = `0,${h} ${pts} ${w},${h}`;
    return `<div class="chart-box">
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}" preserveAspectRatio="none" style="overflow:visible">
        <polygon points="${areaPts}" fill="${color}" opacity="0.08"></polygon>
        <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"></polyline>
        ${dots}
      </svg>
      <div class="flex-between text-xs text-faint mt-2">${labels.map(l=>`<span>${l}</span>`).join('')}</div>
    </div>`;
  }
  function donutChart(segments, {size=140, thickness=16}={}){
    // segments: [{value, color, label}]
    const total = segments.reduce((s,x)=>s+x.value,0) || 1;
    const r = (size - thickness)/2;
    const c = size/2;
    const circumference = 2*Math.PI*r;
    let offset = 0;
    const circles = segments.map(seg=>{
      const frac = seg.value/total;
      const dash = frac*circumference;
      const el = `<circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="${seg.color}" stroke-width="${thickness}"
        stroke-dasharray="${dash} ${circumference-dash}" stroke-dashoffset="${-offset}" stroke-linecap="round" transform="rotate(-90 ${c} ${c})"/>`;
      offset += dash;
      return el;
    }).join('');
    const legend = segments.map(s=>`<span><span class="dot" style="background:${s.color}"></span>${s.label} · ${Math.round(s.value/total*100)}%</span>`).join('');
    return `<div class="chart-box flex-center gap-5" style="flex-wrap:wrap;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="var(--surface-2)" stroke-width="${thickness}"/>
        ${circles}
      </svg>
      <div class="chart-legend" style="flex-direction:column;gap:8px;">${legend}</div>
    </div>`;
  }

  /* ---------------------------------------------------------------------
     NAVIGATION CONFIG
  --------------------------------------------------------------------- */
  const STUDENT_NAV = [
    {href:'dashboard.html', label:'Dashboard', icon:'home'},
    {href:'academics.html', label:'Academics', icon:'book'},
    {href:'classrooms.html', label:'My Classrooms', icon:'users'},
    {href:'career.html', label:'Career', icon:'target'},
    {href:'projects.html', label:'Projects', icon:'layers'},
    {href:'internships.html', label:'Internships', icon:'briefcase'},
    {href:'documents.html', label:'Document Vault', icon:'folder'},
    {href:'tasks.html', label:'Tasks & Planner', icon:'clipboard'},
    {href:'achievements.html', label:'Achievements', icon:'award'},
    {href:'ai-advisor.html', label:'AI Advisor', icon:'sparkle'},
  ];
  const FACULTY_NAV = [
    {href:'dashboard.html', label:'Dashboard', icon:'home'},
    {href:'classrooms.html', label:'Classrooms', icon:'building'},
    {href:'students.html', label:'Students', icon:'users'},
    {href:'attendance.html', label:'Attendance', icon:'checkCircle'},
    {href:'marks.html', label:'Marks', icon:'fileText'},
    {href:'assignments.html', label:'Assignments', icon:'clipboard'},
    {href:'analytics.html', label:'Analytics', icon:'barChart'},
  ];

  /* ---------------------------------------------------------------------
     SHELL — sidebar + topbar, mounted around page content
  --------------------------------------------------------------------- */
  function mount({role, active, pageTitle, pageDesc, renderContent}){
    initTheme();
    const session = requireRole(role);
    if(!session) return; // redirected

    const nav = role === 'student' ? STUDENT_NAV : FACULTY_NAV;
    const initials = (session.name||'U').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase();

    const navHTML = nav.map(item=>`
      <a class="nav-item ${item.href===active?'active':''}" href="${item.href}">
        <span class="nav-ic">${icon(item.icon,18)}</span>${item.label}
      </a>`).join('');

    document.body.innerHTML = `
      <div class="app-shell">
        <div class="sidebar-scrim" id="scrim"></div>
        <aside class="sidebar" id="sidebar">
          <div class="sidebar-brand">
            <div class="brand"><span class="mark">E</span><div><span>EduTrack</span><small>${role==='student'?'Student Portal':'Faculty Portal'}</small></div></div>
          </div>
          <nav class="sidebar-nav">${navHTML}</nav>
          <div class="sidebar-foot stack gap-2">
            <a class="nav-item" href="settings.html"><span class="nav-ic">${icon('settings',18)}</span>Profile & Settings</a>
            <a class="nav-item" href="#" id="logout-btn"><span class="nav-ic">${icon('logout',18)}</span>Logout</a>
          </div>
        </aside>

        <div class="main-area">
          <header class="topbar">
            <div class="flex-center gap-3">
              <button class="icon-btn hamburger" id="hamburger" aria-label="Open menu">${icon('menu',20)}</button>
              <div class="topbar-search input-group">
                <span class="ic">${icon('search',16)}</span>
                <input class="input" placeholder="Search EduTrack..." id="global-search">
              </div>
            </div>
            <div class="topbar-actions">
              ${themeSwitchHTML()}
              <div class="dropdown">
                <button class="icon-btn" id="notif-btn" aria-label="Notifications">${icon('bell',18)}<span class="dot"></span></button>
                <div class="dropdown-menu notif-panel" id="notif-menu">
                  <div class="flex-between" style="padding:8px 10px;"><strong class="text-sm">Notifications</strong><span class="text-xs text-faint">4 new</span></div>
                  <div class="dropdown-divider"></div>
                  ${notifItemsHTML()}
                </div>
              </div>
              <div class="dropdown">
                <button class="profile-btn" id="profile-btn">
                  <span class="avatar">${initials}</span>
                  <span class="profile-meta"><span class="name">${session.name||'User'}</span><span class="role">${role==='student'?'Student':'Faculty'}</span></span>
                  ${icon('chevronDown',14)}
                </button>
                <div class="dropdown-menu" id="profile-menu">
                  <div class="dropdown-item" onclick="window.location.href='settings.html'">${icon('user',15)} My Profile</div>
                  <div class="dropdown-item" onclick="window.location.href='settings.html'">${icon('settings',15)} Settings</div>
                  <div class="dropdown-divider"></div>
                  <div class="dropdown-item" id="logout-btn-2">${icon('logout',15)} Logout</div>
                </div>
              </div>
            </div>
          </header>
          <main class="page-wrap">
            <div class="page-head animate-in">
              <div class="page-head-row">
                <div>
                  <h1 class="h1">${pageTitle}</h1>
                  <p>${pageDesc}</p>
                </div>
                <div id="page-head-actions"></div>
              </div>
            </div>
            <div id="page-content"></div>
          </main>
        </div>
      </div>`;

    bindThemeSwitch();
    bindShellEvents();
    renderContent(document.getElementById('page-content'), document.getElementById('page-head-actions'), session);
    fillBars(document);
  }

  function notifItemsHTML(){
    const items = [
      {ic:'clipboard', title:'New assignment posted in Data Structures', time:'2h ago'},
      {ic:'checkCircle', title:'Your attendance improved to 82%', time:'5h ago'},
      {ic:'alertTriangle', title:'Deadline reminder: DBMS assignment due tomorrow', time:'1d ago'},
      {ic:'message', title:'New announcement in your classroom', time:'2d ago'},
    ];
    return items.map(n=>`<div class="notif-item"><span class="notif-ic">${icon(n.ic,15)}</span><div><div class="notif-title">${n.title}</div><div class="notif-time">${n.time}</div></div></div>`).join('');
  }

  function bindShellEvents(){
    const sidebar = document.getElementById('sidebar');
    const scrim = document.getElementById('scrim');
    document.getElementById('hamburger')?.addEventListener('click', ()=>{ sidebar.classList.add('open'); scrim.classList.add('open'); });
    scrim?.addEventListener('click', ()=>{ sidebar.classList.remove('open'); scrim.classList.remove('open'); });

    ['logout-btn','logout-btn-2'].forEach(id=>{
      document.getElementById(id)?.addEventListener('click',(e)=>{ e.preventDefault(); logout(); });
    });

    setupDropdown('notif-btn','notif-menu');
    setupDropdown('profile-btn','profile-menu');

    document.getElementById('global-search')?.addEventListener('keydown', (e)=>{
      if(e.key==='Enter' && e.target.value.trim()){
        toast(`Searching for "${e.target.value.trim()}"...`);
      }
    });
  }

  function setupDropdown(btnId, menuId){
    const btn = document.getElementById(btnId), menu = document.getElementById(menuId);
    if(!btn||!menu) return;
    btn.addEventListener('click',(e)=>{
      e.stopPropagation();
      document.querySelectorAll('.dropdown-menu.open').forEach(m=> m!==menu && m.classList.remove('open'));
      menu.classList.toggle('open');
    });
    document.addEventListener('click', ()=> menu.classList.remove('open'));
  }

  /* ---------------------------------------------------------------------
     TABS helper — call after injecting HTML containing .tabs/.tab-panel
  --------------------------------------------------------------------- */
  function bindTabs(root=document){
    root.querySelectorAll('.tabs').forEach(tabs=>{
      const panelGroup = tabs.dataset.panels;
      tabs.querySelectorAll('.tab-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          tabs.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
          btn.classList.add('active');
          document.querySelectorAll(`.tab-panel[data-group="${panelGroup}"]`).forEach(p=>{
            p.classList.toggle('active', p.dataset.tab === btn.dataset.tab);
          });
        });
      });
    });
  }

  return {
    initTheme, setTheme, currentTheme, themeSwitchHTML, bindThemeSwitch,
    login, getSession, logout, requireRole, computeRoot,
    icon, toast, openModal, closeModal,
    animateNumber, fillBars, barChart, animateChartBars, lineChart, donutChart,
    mount, bindTabs, setupDropdown
  };
})();
