/* ==========================================================================
   EduTrack — student.js
   One render function per student page. Each receives the #page-content
   element, the page-head-actions slot, and the current session.
   ========================================================================== */

const { icon } = EduTrack;

function statusFromAttendance(a){
  if(a >= 80) return {badge:'badge-success', label:'On track'};
  if(a >= 70) return {badge:'badge-warning', label:'Attention needed'};
  return {badge:'badge-error', label:'Critical'};
}

/* ------------------------------------------------------------------ */
/* DASHBOARD                                                          */
/* ------------------------------------------------------------------ */
async function renderStudentDashboard(root){
  const [profile, subjects, tasks, announcements, skills, assignments] = await Promise.all([
    EduData.getStudentProfile(), EduData.getSubjects(), EduData.getTasks(), EduData.getAnnouncements(), EduData.getSkills(), EduData.getAssignments()
  ]);

  const pendingWork = assignments.filter(a=>a.status==='pending'||a.status==='overdue').length;
  const overallAtt = statusFromAttendance(profile.attendance);
  const careerAvg = Math.round(skills.reduce((s,x)=>s+x.level,0)/skills.length);
  const readiness = Math.round((careerAvg*0.6) + (profile.cgpa/10*100*0.4));

  root.innerHTML = `
    <div class="grid grid-4 animate-in">
      ${statCard('checkCircle','Attendance', profile.attendance+'%', overallAtt.label, overallAtt.badge)}
      ${statCard('award','CGPA', profile.cgpa, 'Semester 5 · Trending up', 'badge-info')}
      ${statCard('clipboard','Pending Work', pendingWork, pendingWork>2?'Needs attention soon':'Manageable this week', pendingWork>2?'badge-warning':'badge-success')}
      ${statCard('briefcase','Internship Readiness', readiness+'%', 'Based on skills + academics', 'badge-info')}
    </div>

    <div class="grid grid-2 mt-6" style="grid-template-columns: 1.4fr 1fr;">
      <div class="card animate-in">
        <div class="card-title-row"><h3 class="h4">Important Alerts</h3></div>
        <div class="stack gap-3">
          <div class="alert alert-warning">${icon('alertTriangle',16)} <span>Your attendance in <strong>Database Management Systems</strong> is at 69% — below the 75% target.</span></div>
          <div class="alert alert-error">${icon('clock',16)} <span>You have <strong>${pendingWork} assignments</strong> pending, including one overdue.</span></div>
          <div class="alert alert-info">${icon('trendUp',16)} <span>Your CGPA has improved for 3 semesters in a row. Keep it up!</span></div>
        </div>
      </div>
      <div class="card animate-in">
        <div class="card-title-row"><h3 class="h4">Recommended Next Action</h3></div>
        <p class="text-soft text-sm mb-4">Finishing this will have the biggest impact on your week.</p>
        <div class="alert alert-success" style="align-items:center;">
          ${icon('zap',18)}
          <div><strong>Submit the DBMS normalization case study</strong><div class="text-xs mt-2">Due tomorrow · improves both grade and attendance-linked participation</div></div>
        </div>
        <button class="btn btn-primary btn-block mt-4" onclick="window.location.href='academics.html'">Go to Assignments</button>
      </div>
    </div>

    <div class="card mt-6 animate-in">
      <div class="card-title-row">
        <h3 class="h4">This Week's Action Plan</h3>
        <span class="badge badge-neutral">${tasks.filter(t=>!t.done).length} open</span>
      </div>
      <div class="stack gap-2" id="dash-tasks"></div>
    </div>

    <div class="grid grid-2 mt-6" style="grid-template-columns: 1.3fr 1fr;">
      <div class="card animate-in">
        <div class="card-title-row"><h3 class="h4">Academic Performance</h3><a href="academics.html" class="text-sm" style="color:var(--primary);font-weight:600;">View All ${icon('arrowRight',13)}</a></div>
        ${EduTrack.barChart(subjects.map(s=>s.internal), subjects.map(s=>s.name.split(' ')[0]))}
      </div>
      <div class="card animate-in">
        <div class="card-title-row"><h3 class="h4">Career Progress</h3><a href="career.html" class="text-sm" style="color:var(--primary);font-weight:600;">View All ${icon('arrowRight',13)}</a></div>
        <div class="stack gap-3">
          ${skills.slice(0,4).map(s=>`
            <div>
              <div class="flex-between mb-2"><span class="text-sm" style="font-weight:600;">${s.name}</span><span class="text-xs text-faint">${s.level}%</span></div>
              <div class="progress" data-value="${s.level}"><span></span></div>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="card mt-6 animate-in">
      <div class="card-title-row"><h3 class="h4">Classroom Announcements</h3><a href="classrooms.html" class="text-sm" style="color:var(--primary);font-weight:600;">View All ${icon('arrowRight',13)}</a></div>
      <div class="stack gap-4">
        ${announcements.slice(0,3).map(a=>`
          <div class="flex gap-3" style="align-items:flex-start;">
            <span class="notif-ic">${icon('message',14)}</span>
            <div><div class="text-sm" style="font-weight:600;">${a.classroom}</div><div class="text-sm text-soft">${a.text}</div><div class="text-xs text-faint mt-1">${a.time}</div></div>
          </div>`).join('')}
      </div>
    </div>
  `;

  const taskList = document.getElementById('dash-tasks');
  tasks.slice(0,5).forEach(t=>{
    const row = document.createElement('label');
    row.className = 'flex gap-3';
    row.style.cssText = 'align-items:center;padding:10px 4px;border-bottom:1px solid var(--border);';
    row.innerHTML = `<input type="checkbox" style="width:17px;height:17px;accent-color:var(--primary);" ${t.done?'checked':''}>
      <span style="flex:1;${t.done?'text-decoration:line-through;color:var(--ink-faint);':''}">${t.title}</span>
      <span class="badge ${t.priority==='High'?'badge-error':t.priority==='Medium'?'badge-warning':'badge-neutral'}">${t.priority}</span>`;
    taskList.appendChild(row);
  });

  EduTrack.fillBars(root);
  EduTrack.animateChartBars(root);
}

function statCard(ic, label, value, note, badgeClass){
  return `<div class="card stat-card card-hover animate-in">
    <span class="stat-icon">${icon(ic,18)}</span>
    <span class="stat-label">${label}</span>
    <span class="stat-value">${value}</span>
    <span class="badge ${badgeClass}" style="align-self:flex-start;">${note}</span>
  </div>`;
}

/* ------------------------------------------------------------------ */
/* ACADEMICS                                                          */
/* ------------------------------------------------------------------ */
async function renderStudentAcademics(root){
  const [profile, subjects, marksHistory, assignments, backlogs] = await Promise.all([
    EduData.getStudentProfile(), EduData.getSubjects(), EduData.getMarksHistory(), EduData.getAssignments(), EduData.getBacklogs()
  ]);

  root.innerHTML = `
    <div class="tabs" data-panels="academics">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="subjects">Subjects</button>
      <button class="tab-btn" data-tab="marks">Marks</button>
      <button class="tab-btn" data-tab="attendance">Attendance</button>
      <button class="tab-btn" data-tab="assignments">Assignments</button>
      <button class="tab-btn" data-tab="backlogs">Backlogs</button>
      <button class="tab-btn" data-tab="performance">Performance</button>
    </div>

    <div class="tab-panel active" data-group="academics" data-tab="overview">
      <div class="grid grid-4">
        ${statCard('award','CGPA', profile.cgpa, 'Semester 5', 'badge-info')}
        ${statCard('checkCircle','Attendance', profile.attendance+'%', statusFromAttendance(profile.attendance).label, statusFromAttendance(profile.attendance).badge)}
        ${statCard('clipboard','Assignments Pending', assignments.filter(a=>a.status==='pending'||a.status==='overdue').length, 'This semester', 'badge-warning')}
        ${statCard('book','Subjects', subjects.length, profile.semester, 'badge-neutral')}
      </div>
      <div class="card mt-5">
        <h3 class="h4 mb-4">Subject Snapshot</h3>
        <div class="stack gap-4">
          ${subjects.map(s=>`
            <div class="progress-row">
              <span class="text-sm" style="width:180px;font-weight:600;">${s.name}</span>
              <div class="progress ${s.attendance<70?'error':s.attendance<80?'warning':''}" data-value="${s.attendance}"><span></span></div>
              <span class="progress-val">${s.attendance}%</span>
            </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="tab-panel" data-group="academics" data-tab="subjects">
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Subject</th><th>Faculty</th><th>Attendance</th><th>Internal Marks</th><th>Assignments</th></tr></thead>
          <tbody>
            ${subjects.map(s=>`<tr><td><strong>${s.name}</strong><div class="text-xs text-faint">${s.code}</div></td><td>${s.faculty}</td>
              <td>${badgeForAttendance(s.attendance)}</td><td>${s.internal}/50</td><td>${s.assignments.done}/${s.assignments.total} done</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="tab-panel" data-group="academics" data-tab="marks">
      <div class="grid grid-2" style="grid-template-columns:1.2fr 1fr;">
        <div class="card">
          <h3 class="h4 mb-4">Internal Marks by Subject</h3>
          ${EduTrack.barChart(subjects.map(s=>s.internal), subjects.map(s=>s.name.split(' ')[0]))}
        </div>
        <div class="table-wrap" style="align-self:start;">
          <table class="data-table">
            <thead><tr><th>Subject</th><th>Internal</th><th>Grade</th></tr></thead>
            <tbody>${subjects.map(s=>`<tr><td>${s.name}</td><td>${s.internal}/50</td><td><span class="badge badge-neutral">${s.grade}</span></td></tr>`).join('')}</tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="tab-panel" data-group="academics" data-tab="attendance">
      <div class="card">
        <h3 class="h4 mb-4">Subject-wise Attendance</h3>
        <div class="stack gap-4">
          ${subjects.map(s=>{
            const st = statusFromAttendance(s.attendance);
            return `<div>
              <div class="flex-between mb-2"><span class="text-sm" style="font-weight:600;">${s.name}</span><span class="badge ${st.badge}">${s.attendance}% · ${st.label}</span></div>
              <div class="progress ${s.attendance<70?'error':s.attendance<80?'warning':''}" data-value="${s.attendance}"><span></span></div>
            </div>`;
          }).join('')}
        </div>
        <div class="alert alert-warning mt-5">${icon('alertTriangle',16)}<span>Attend <strong>3 more classes</strong> in DBMS this month to bring attendance above the 75% requirement.</span></div>
      </div>
    </div>

    <div class="tab-panel" data-group="academics" data-tab="assignments">
      <div class="grid grid-4 mb-5">
        ${statCard('clipboard','Total', assignments.length, 'This semester', 'badge-neutral')}
        ${statCard('checkCircle','Submitted', assignments.filter(a=>a.status==='submitted'||a.status==='graded').length, 'On time', 'badge-success')}
        ${statCard('clock','Pending', assignments.filter(a=>a.status==='pending').length, 'Due soon', 'badge-warning')}
        ${statCard('alertTriangle','Overdue', assignments.filter(a=>a.status==='overdue').length, 'Needs action', 'badge-error')}
      </div>
      <div class="table-wrap">
        <table class="data-table">
          <thead><tr><th>Assignment</th><th>Subject</th><th>Due</th><th>Status</th></tr></thead>
          <tbody>${assignments.map(a=>`<tr><td>${a.title}</td><td>${a.subject}</td><td>${a.due}</td><td>${assignmentBadge(a.status)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>

    <div class="tab-panel" data-group="academics" data-tab="backlogs">
      ${backlogs.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Subject</th><th>Semester</th><th>Status</th><th>Attempt</th></tr></thead>
        <tbody>${backlogs.map(b=>`<tr><td>${b.subject}</td><td>${b.semester}</td><td><span class="badge badge-success">${b.status}</span></td><td>${b.attempt}</td></tr>`).join('')}</tbody></table></div>`
        : emptyState('checkCircle','No active backlogs','You\'re fully cleared on every subject so far.')}
    </div>

    <div class="tab-panel" data-group="academics" data-tab="performance">
      <div class="card">
        <h3 class="h4 mb-4">CGPA Trend Across Semesters</h3>
        ${EduTrack.lineChart(marksHistory.map(m=>m.cgpa), marksHistory.map(m=>m.sem))}
      </div>
    </div>
  `;
  EduTrack.bindTabs(root);
  EduTrack.fillBars(root);
  EduTrack.animateChartBars(root);
}

function badgeForAttendance(a){
  const st = statusFromAttendance(a);
  return `<span class="badge ${st.badge}">${a}%</span>`;
}
function assignmentBadge(status){
  const map = {pending:['badge-warning','Pending'], overdue:['badge-error','Overdue'], submitted:['badge-info','Submitted'], graded:['badge-success','Graded']};
  const [cls,label] = map[status]||['badge-neutral',status];
  return `<span class="badge ${cls}">${label}</span>`;
}
function emptyState(ic, title, desc, actionHTML=''){
  return `<div class="empty-state"><div class="empty-icon">${icon(ic,32)}</div><h3 class="h4 mb-2">${title}</h3><p>${desc}</p>${actionHTML}</div>`;
}

/* ------------------------------------------------------------------ */
/* CLASSROOMS                                                         */
/* ------------------------------------------------------------------ */
async function renderStudentClassrooms(root, actionsSlot){
  const classrooms = await EduData.getClassrooms();
  actionsSlot.innerHTML = `<button class="btn btn-secondary" id="join-class-btn">${icon('plus',15)} Join Classroom</button>`;

  root.innerHTML = `<div class="grid grid-3" id="classroom-grid"></div>`;
  const grid = document.getElementById('classroom-grid');
  classrooms.forEach((c,idx)=>{
    const card = document.createElement('div');
    card.className = 'card card-hover animate-in';
    card.style.cursor='pointer';
    card.innerHTML = `
      <span class="stat-icon">${icon('users',18)}</span>
      <h3 class="h4 mb-1">${c.name}</h3>
      <p class="text-sm text-soft mb-3">${c.semester} · ${c.faculty}</p>
      <div class="flex gap-2 mb-4"><span class="badge badge-info">${c.announcements} announcements</span><span class="badge badge-neutral">${c.assignments} assignments</span></div>
      <button class="btn btn-secondary btn-sm btn-block">Open Classroom</button>`;
    card.addEventListener('click', ()=> openClassroomDetail(c));
    grid.appendChild(card);
  });

  document.getElementById('join-class-btn').addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Join a Classroom</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <div class="field"><label>Class Code</label><input class="input" placeholder="e.g. DSA-7X2K"></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button>
      <button class="btn btn-primary" id="join-confirm">Join Classroom</button></div>`);
    document.getElementById('join-confirm').addEventListener('click', ()=>{
      EduTrack.closeModal(); EduTrack.toast('Joined classroom (demo).', 'success');
    });
  });
}

function openClassroomDetail(c){
  EduTrack.openModal(`
    <div class="modal-head"><h3 class="h3">${c.name}</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
    <div class="tabs" data-panels="classroom" style="margin-bottom:16px;">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="material">Study Material</button>
      <button class="tab-btn" data-tab="links">Links</button>
    </div>
    <div class="tab-panel active" data-group="classroom" data-tab="overview">
      <p class="text-sm text-soft mb-3">${c.semester} · Faculty: <strong>${c.faculty}</strong> · Class code: <code>${c.code}</code></p>
      <p class="text-sm"><strong>${c.announcements}</strong> announcements · <strong>${c.assignments}</strong> open assignments</p>
    </div>
    <div class="tab-panel" data-group="classroom" data-tab="material">
      <div class="stack gap-2">${c.material.map(m=>`<div class="flex gap-3" style="align-items:center;padding:9px 0;border-bottom:1px solid var(--border);">${icon('fileText',16)}<span class="text-sm">${m}</span></div>`).join('')}</div>
    </div>
    <div class="tab-panel" data-group="classroom" data-tab="links">
      <div class="stack gap-2">${c.links.map(l=>`<div class="flex gap-3" style="align-items:center;padding:9px 0;border-bottom:1px solid var(--border);">${icon('link',16)}<span class="text-sm">${l.label}</span></div>`).join('')}</div>
    </div>
  `);
  EduTrack.bindTabs(document);
}

/* ------------------------------------------------------------------ */
/* CAREER                                                             */
/* ------------------------------------------------------------------ */
async function renderStudentCareer(root){
  const [profile, skills, roadmap] = await Promise.all([EduData.getStudentProfile(), EduData.getSkills(), EduData.getCareerRoadmap()]);
  const nextSkill = skills.find(s=>s.level < 100 && s.level > 0) || skills.find(s=>s.level===0);

  root.innerHTML = `
    <div class="tabs" data-panels="career">
      <button class="tab-btn active" data-tab="goal">Career Goal</button>
      <button class="tab-btn" data-tab="skills">Skills</button>
      <button class="tab-btn" data-tab="gap">Skill Gap</button>
      <button class="tab-btn" data-tab="roadmap">Career Roadmap</button>
    </div>

    <div class="tab-panel active" data-group="career" data-tab="goal">
      <div class="card">
        <div class="flex-between mb-4"><h3 class="h4">Current Career Goal</h3><button class="btn btn-secondary btn-sm" id="change-goal">Change Goal</button></div>
        <div class="flex gap-4" style="align-items:center;">
          <span class="stat-icon" style="width:56px;height:56px;font-size:24px;">${icon('target',26)}</span>
          <div><div class="h3">${profile.careerGoal}</div><p class="text-soft text-sm">${skills.length} tracked skills · ${Math.round(skills.reduce((s,x)=>s+x.level,0)/skills.length)}% average progress</p></div>
        </div>
      </div>
    </div>

    <div class="tab-panel" data-group="career" data-tab="skills">
      <div class="card">
        <h3 class="h4 mb-4">Skill Progress</h3>
        <div class="stack gap-4">
          ${skills.map(s=>`<div><div class="flex-between mb-2"><span class="text-sm" style="font-weight:600;">${s.name}</span><span class="text-xs text-faint">${s.level}%</span></div>
            <div class="progress" data-value="${s.level}"><span></span></div></div>`).join('')}
        </div>
      </div>
    </div>

    <div class="tab-panel" data-group="career" data-tab="gap">
      <div class="card">
        <div class="flex-between mb-4"><h3 class="h4">Target: ${profile.careerGoal}</h3></div>
        <div class="table-wrap">
          <table class="data-table"><thead><tr><th>Skill</th><th>Progress</th></tr></thead>
          <tbody>${skills.map(s=>`<tr><td>${s.name}</td><td>${s.level===100?`<span class="badge badge-success">${icon('check',12)} Complete</span>`:`<div class="progress-row" style="max-width:220px;"><div class="progress" data-value="${s.level}"><span></span></div><span class="progress-val">${s.level}%</span></div>`}</td></tr>`).join('')}</tbody></table>
        </div>
        ${nextSkill ? `<div class="alert alert-info mt-5">${icon('sparkle',16)}<span>Recommended next skill: <strong>${nextSkill.name}</strong></span></div>` : ''}
      </div>
    </div>

    <div class="tab-panel" data-group="career" data-tab="roadmap">
      <div class="stack gap-4">
        ${roadmap.map((r,i)=>`
          <div class="card flex gap-4" style="align-items:flex-start;">
            <span class="stat-icon" style="background:${r.status==='done'?'var(--primary-light)':r.status==='in-progress'?'var(--accent-light)':'var(--surface-2)'};color:${r.status==='done'?'var(--primary-dark)':r.status==='in-progress'?'var(--accent-dark)':'var(--ink-faint)'};">${icon(r.status==='done'?'check':r.status==='in-progress'?'zap':'clock',18)}</span>
            <div style="flex:1;">
              <div class="flex-between"><h4 class="h4">${r.stage}</h4><span class="badge ${r.status==='done'?'badge-success':r.status==='in-progress'?'badge-warning':'badge-neutral'}">${r.status==='done'?'Completed':r.status==='in-progress'?'In Progress':'Upcoming'}</span></div>
              <ul class="mt-2">${r.items.map(it=>`<li class="text-sm text-soft" style="margin-top:4px;">• ${it}</li>`).join('')}</ul>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `;
  EduTrack.bindTabs(root);
  EduTrack.fillBars(root);

  document.getElementById('change-goal')?.addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Change Career Goal</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <div class="field"><label>Career Goal</label>
        <select class="input" id="goal-select">
          <option>Full Stack Developer</option><option>Data Analyst</option><option>Cybersecurity</option><option>AI/ML Engineer</option><option>Software Developer</option>
        </select></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="save-goal">Save Goal</button></div>`);
    document.getElementById('save-goal').addEventListener('click', ()=>{ EduTrack.closeModal(); EduTrack.toast('Career goal updated (demo).', 'success'); });
  });
}

/* ------------------------------------------------------------------ */
/* PROJECTS                                                           */
/* ------------------------------------------------------------------ */
async function renderStudentProjects(root, actionsSlot){
  let projects = await EduData.getProjects();
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="add-project-btn">${icon('plus',15)} Add Project</button>`;

  function draw(){
    root.innerHTML = projects.length ? `<div class="grid grid-3" id="proj-grid"></div>` : emptyState('layers','No projects yet','Showcase your work by adding your first project.', `<button class="btn btn-primary" id="add-empty">${icon('plus',15)} Add Your First Project</button>`);
    if(!projects.length){ document.getElementById('add-empty').addEventListener('click', ()=> openProjectModal()); return; }
    const grid = document.getElementById('proj-grid');
    projects.forEach(p=>{
      const card = document.createElement('div');
      card.className = 'card animate-in';
      card.innerHTML = `
        <div class="flex-between mb-2"><h3 class="h4">${p.name}</h3><span class="badge ${p.status==='Completed'?'badge-success':p.status==='In Progress'?'badge-warning':'badge-neutral'}">${p.status}</span></div>
        <p class="text-sm text-soft mb-3">${p.description}</p>
        <div class="flex gap-2 mb-4" style="flex-wrap:wrap;">${p.tech.map(t=>`<span class="badge badge-info">${t}</span>`).join('')}</div>
        <div class="progress mb-4" data-value="${p.progress}"><span></span></div>
        <div class="flex gap-2">
          <a href="${p.github}" class="btn btn-secondary btn-sm" style="flex:1;">${icon('github',14)} GitHub</a>
          <button class="btn btn-ghost btn-sm" data-edit="${p.id}">${icon('edit',14)}</button>
          <button class="btn btn-ghost btn-sm" data-del="${p.id}">${icon('trash',14)}</button>
        </div>`;
      grid.appendChild(card);
    });
    root.querySelectorAll('[data-del]').forEach(b=> b.addEventListener('click', ()=>{
      projects = projects.filter(p=>p.id !== Number(b.dataset.del)); EduTrack.toast('Project removed.', 'success'); draw();
    }));
    root.querySelectorAll('[data-edit]').forEach(b=> b.addEventListener('click', ()=> openProjectModal(projects.find(p=>p.id===Number(b.dataset.edit)))));
    EduTrack.fillBars(root);
  }

  function openProjectModal(existing){
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">${existing?'Edit Project':'Add Project'}</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <div class="field"><label>Project Name</label><input class="input" id="p-name" value="${existing?existing.name:''}"></div>
      <div class="field"><label>Description</label><textarea class="input" id="p-desc" rows="3">${existing?existing.description:''}</textarea></div>
      <div class="field"><label>Technologies (comma separated)</label><input class="input" id="p-tech" value="${existing?existing.tech.join(', '):''}"></div>
      <div class="field"><label>GitHub Link</label><input class="input" id="p-github" value="${existing&&existing.github!=='#'?existing.github:''}" placeholder="https://github.com/..."></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="save-project">${existing?'Save Changes':'Add Project'}</button></div>`);
    document.getElementById('save-project').addEventListener('click', ()=>{
      const name = document.getElementById('p-name').value.trim();
      if(!name){ EduTrack.toast('Project name is required.', 'error'); return; }
      const data = {
        id: existing?existing.id:Date.now(),
        name, description: document.getElementById('p-desc').value.trim(),
        tech: document.getElementById('p-tech').value.split(',').map(t=>t.trim()).filter(Boolean),
        status: existing?existing.status:'Planned', progress: existing?existing.progress:5,
        github: document.getElementById('p-github').value.trim() || '#', demo:'#'
      };
      if(existing){ projects = projects.map(p=>p.id===existing.id?data:p); } else { projects.push(data); }
      EduTrack.closeModal(); EduTrack.toast('Project saved.', 'success'); draw();
    });
  }

  document.getElementById('add-project-btn').addEventListener('click', ()=> openProjectModal());
  draw();
}

/* ------------------------------------------------------------------ */
/* INTERNSHIPS                                                        */
/* ------------------------------------------------------------------ */
async function renderStudentInternships(root){
  const data = await EduData.getInternships();
  root.innerHTML = `
    <div class="tabs" data-panels="intern">
      <button class="tab-btn active" data-tab="opportunities">Opportunities</button>
      <button class="tab-btn" data-tab="applied">Applied</button>
      <button class="tab-btn" data-tab="shortlisted">Shortlisted</button>
      <button class="tab-btn" data-tab="history">History</button>
    </div>
    <div class="alert alert-info mb-5">${icon('sparkle',16)}<span>These are illustrative demo opportunities for prototype purposes — not live listings.</span></div>

    <div class="tab-panel active" data-group="intern" data-tab="opportunities">
      <div class="grid grid-3">
        ${data.opportunities.map(o=>`
          <div class="card card-hover">
            <div class="flex-between mb-2"><h3 class="h4">${o.role}</h3><span class="badge ${o.match>=75?'badge-success':o.match>=55?'badge-warning':'badge-neutral'}">${o.match}% match</span></div>
            <p class="text-sm text-soft mb-1">${o.company}</p>
            <p class="text-xs text-faint mb-3">${o.location} · ${o.mode} · Deadline ${o.deadline}</p>
            <div class="flex gap-2 mb-3" style="flex-wrap:wrap;">${o.skills.map(s=>`<span class="badge badge-info">${s}</span>`).join('')}</div>
            ${o.missing?`<p class="text-xs" style="color:var(--warning);margin-bottom:12px;">Missing: ${o.missing.join(', ')}</p>`:''}
            <button class="btn btn-secondary btn-sm btn-block view-opp" data-company="${o.company}">View Details</button>
          </div>`).join('')}
      </div>
    </div>

    <div class="tab-panel" data-group="intern" data-tab="applied">
      ${data.applied.length ? tableForApplications(data.applied) : emptyState('briefcase','No applications yet','Apply to a recommended internship to track it here.')}
    </div>
    <div class="tab-panel" data-group="intern" data-tab="shortlisted">
      ${data.shortlisted.length ? tableForApplications(data.shortlisted) : emptyState('briefcase','Nothing shortlisted yet','Shortlisted applications will appear here.')}
    </div>
    <div class="tab-panel" data-group="intern" data-tab="history">
      ${data.history.length ? `<div class="table-wrap"><table class="data-table"><thead><tr><th>Company</th><th>Role</th><th>Period</th><th>Outcome</th></tr></thead>
        <tbody>${data.history.map(h=>`<tr><td>${h.company}</td><td>${h.role}</td><td>${h.period}</td><td><span class="badge badge-success">${h.outcome}</span></td></tr>`).join('')}</tbody></table></div>`
        : emptyState('clock','No history yet','Past internships will show up here.')}
    </div>
  `;
  EduTrack.bindTabs(root);
  root.querySelectorAll('.view-opp').forEach(b=> b.addEventListener('click', ()=>{
    const o = data.opportunities.find(x=>x.company===b.dataset.company);
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">${o.role}</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <p class="text-sm text-soft mb-2">${o.company} · ${o.location} · ${o.mode}</p>
      <p class="text-sm mb-3">Deadline: ${o.deadline}</p>
      <div class="flex gap-2 mb-4" style="flex-wrap:wrap;">${o.skills.map(s=>`<span class="badge badge-info">${s}</span>`).join('')}</div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Close</button><button class="btn btn-primary" id="apply-btn">Apply (Demo)</button></div>`);
    document.getElementById('apply-btn').addEventListener('click', ()=>{ EduTrack.closeModal(); EduTrack.toast(`Applied to ${o.company} (demo).`, 'success'); });
  }));
}
function tableForApplications(list){
  return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Company</th><th>Role</th><th>Applied On</th><th>Status</th></tr></thead>
    <tbody>${list.map(a=>`<tr><td>${a.company}</td><td>${a.role}</td><td>${a.appliedOn}</td><td><span class="badge badge-info">${a.status}</span></td></tr>`).join('')}</tbody></table></div>`;
}

/* ------------------------------------------------------------------ */
/* DOCUMENT VAULT                                                     */
/* ------------------------------------------------------------------ */
async function renderStudentDocuments(root, actionsSlot){
  const docs = await EduData.getDocuments();
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="upload-btn">${icon('upload',15)} Upload Document</button>`;
  const categories = ['All','Resume','Certificates','Mark Sheets','Internship Documents','Other Documents'];

  root.innerHTML = `
    <div class="flex gap-3 mb-5" style="flex-wrap:wrap;">
      ${categories.map((c,i)=>`<button class="btn ${i===0?'btn-secondary':'btn-ghost'} btn-sm filter-chip" data-cat="${c}">${c}</button>`).join('')}
    </div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Document</th><th>Category</th><th>Date</th><th></th></tr></thead>
      <tbody id="doc-rows"></tbody>
    </table></div>`;

  function draw(cat='All'){
    const rows = document.getElementById('doc-rows');
    const filtered = cat==='All'?docs:docs.filter(d=>d.category===cat);
    rows.innerHTML = filtered.map(d=>`<tr>
      <td class="flex gap-2" style="align-items:center;">${icon('fileText',15)} ${d.name}</td>
      <td><span class="badge badge-neutral">${d.category}</span></td><td>${d.date}</td>
      <td><div class="flex gap-2"><button class="btn btn-ghost btn-sm" title="View">${icon('eye',14)}</button><button class="btn btn-ghost btn-sm" title="Delete">${icon('trash',14)}</button></div></td>
    </tr>`).join('') || `<tr><td colspan="4"><div class="empty-state">${icon('folder',28)}<p class="mt-3">No documents in this category yet.</p></div></td></tr>`;
  }
  draw();
  root.querySelectorAll('.filter-chip').forEach(b=> b.addEventListener('click', ()=>{
    root.querySelectorAll('.filter-chip').forEach(x=>x.className='btn btn-ghost btn-sm filter-chip');
    b.className='btn btn-secondary btn-sm filter-chip'; draw(b.dataset.cat);
  }));
  document.getElementById('upload-btn').addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Upload Document</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <div class="field"><label>Category</label><select class="input"><option>Resume</option><option>Certificates</option><option>Mark Sheets</option><option>Internship Documents</option><option>Other Documents</option></select></div>
      <div class="field"><label>File</label><input class="input" type="file"></div>
      <p class="text-xs text-faint mb-4">Demo only — files aren't actually stored yet. This will connect to secure Firebase Storage later.</p>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="upload-confirm">Upload</button></div>`);
    document.getElementById('upload-confirm').addEventListener('click', ()=>{ EduTrack.closeModal(); EduTrack.toast('Document uploaded (demo).', 'success'); });
  });
}

/* ------------------------------------------------------------------ */
/* TASKS & PLANNER                                                    */
/* ------------------------------------------------------------------ */
async function renderStudentTasks(root, actionsSlot){
  let tasks = await EduData.getTasks();
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="add-task-btn">${icon('plus',15)} Add Task</button>`;

  function draw(){
    const done = tasks.filter(t=>t.done).length;
    root.innerHTML = `
      <div class="grid grid-3 mb-5">
        ${statCard('clipboard','Total Tasks', tasks.length, 'This week', 'badge-neutral')}
        ${statCard('checkCircle','Completed', done, `${Math.round(done/tasks.length*100)}% done`, 'badge-success')}
        ${statCard('alertTriangle','High Priority', tasks.filter(t=>t.priority==='High'&&!t.done).length, 'Handle first', 'badge-warning')}
      </div>
      <div class="card">
        <div class="tabs" data-panels="tasks">
          <button class="tab-btn active" data-tab="all">All</button>
          <button class="tab-btn" data-tab="Academic">Academic</button>
          <button class="tab-btn" data-tab="Career">Career</button>
        </div>
        <div class="tab-panel active" data-group="tasks" data-tab="all"><div class="stack gap-1" id="task-list-all"></div></div>
        <div class="tab-panel" data-group="tasks" data-tab="Academic"><div class="stack gap-1" id="task-list-Academic"></div></div>
        <div class="tab-panel" data-group="tasks" data-tab="Career"><div class="stack gap-1" id="task-list-Career"></div></div>
      </div>`;
    EduTrack.bindTabs(root);
    fillTaskList('all', tasks);
    fillTaskList('Academic', tasks.filter(t=>t.category==='Academic'));
    fillTaskList('Career', tasks.filter(t=>t.category==='Career'));
  }

  function fillTaskList(key, list){
    const el = document.getElementById(`task-list-${key}`);
    if(!list.length){ el.innerHTML = emptyState('clipboard','No tasks here','Add a task to get started.'); return; }
    el.innerHTML = list.map(t=>`
      <label class="flex gap-3" style="align-items:center;padding:12px 4px;border-bottom:1px solid var(--border);">
        <input type="checkbox" data-id="${t.id}" style="width:17px;height:17px;accent-color:var(--primary);" ${t.done?'checked':''}>
        <span style="flex:1;${t.done?'text-decoration:line-through;color:var(--ink-faint);':''}">${t.title}</span>
        <span class="badge badge-neutral">${t.category}</span>
        <span class="badge ${t.priority==='High'?'badge-error':t.priority==='Medium'?'badge-warning':'badge-neutral'}">${t.priority}</span>
        <span class="text-xs text-faint" style="width:80px;text-align:right;">${t.due}</span>
      </label>`).join('');
    el.querySelectorAll('input[type=checkbox]').forEach(cb=> cb.addEventListener('change', ()=>{
      const task = tasks.find(t=>t.id===Number(cb.dataset.id)); task.done = cb.checked; draw();
    }));
  }

  document.getElementById('add-task-btn').addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Add Task</h3><button class="modal-close" data-close-modal>${icon('x',18)}</button></div>
      <div class="field"><label>Task</label><input class="input" id="t-title" placeholder="e.g. Revise Chapter 4"></div>
      <div class="field"><label>Category</label><select class="input" id="t-cat"><option>Academic</option><option>Career</option></select></div>
      <div class="field"><label>Priority</label><select class="input" id="t-pri"><option>High</option><option>Medium</option><option>Low</option></select></div>
      <div class="field"><label>Due</label><input class="input" id="t-due" placeholder="e.g. Friday"></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="save-task">Add Task</button></div>`);
    document.getElementById('save-task').addEventListener('click', ()=>{
      const title = document.getElementById('t-title').value.trim();
      if(!title){ EduTrack.toast('Task title is required.', 'error'); return; }
      tasks.push({id:Date.now(), title, category:document.getElementById('t-cat').value, priority:document.getElementById('t-pri').value, due:document.getElementById('t-due').value||'—', done:false});
      EduTrack.closeModal(); EduTrack.toast('Task added.', 'success'); draw();
    });
  });
  draw();
}

/* ------------------------------------------------------------------ */
/* ACHIEVEMENTS                                                       */
/* ------------------------------------------------------------------ */
async function renderStudentAchievements(root){
  const achievements = await EduData.getAchievements();
  const earned = achievements.filter(a=>a.earned).length;
  root.innerHTML = `
    <div class="card mb-6">
      <div class="flex-between mb-3"><h3 class="h4">Overall Progress</h3><span class="badge badge-success">${earned}/${achievements.length} unlocked</span></div>
      <div class="progress" data-value="${earned/achievements.length*100}"><span></span></div>
    </div>
    <div class="grid grid-3">
      ${achievements.map(a=>`
        <div class="card ${a.earned?'card-hover':''}" style="${a.earned?'':'opacity:0.55;'}">
          <span class="stat-icon" style="background:${a.earned?'var(--accent-light)':'var(--surface-2)'};color:${a.earned?'var(--accent-dark)':'var(--ink-faint)'};">${icon('award',20)}</span>
          <h3 class="h4 mb-1">${a.title}</h3>
          <p class="text-sm text-soft mb-3">${a.desc}</p>
          <span class="badge ${a.earned?'badge-success':'badge-neutral'}">${a.earned?'Unlocked':a.category}</span>
        </div>`).join('')}
    </div>`;
  EduTrack.fillBars(root);
}

/* ------------------------------------------------------------------ */
/* AI ADVISOR                                                         */
/* ------------------------------------------------------------------ */
async function renderStudentAI(root){
  const prompts = await EduData.getAiPrompts();
  root.innerHTML = `
    <div class="alert alert-info mb-5">${icon('sparkle',16)}<span>This is a UI preview with mock responses. It will connect to a real AI API once the backend is ready.</span></div>
    <div class="grid" style="grid-template-columns:1fr 300px;gap:24px;align-items:start;">
      <div class="card" style="min-height:460px;display:flex;flex-direction:column;">
        <div id="chat-log" class="stack gap-4" style="flex:1;overflow-y:auto;max-height:420px;padding-right:4px;"></div>
        <form id="chat-form" class="flex gap-3 mt-4">
          <input class="input" id="chat-input" placeholder="Ask about your academics or career...">
          <button class="btn btn-primary" type="submit">${icon('arrowRight',16)}</button>
        </form>
      </div>
      <div class="card">
        <h3 class="h4 mb-4">Suggested Questions</h3>
        <div class="stack gap-2" id="prompt-list"></div>
      </div>
    </div>`;

  const log = document.getElementById('chat-log');
  function addMsg(text, who){
    const bubble = document.createElement('div');
    bubble.style.cssText = `max-width:80%; padding:12px 16px; border-radius:14px; font-size:13.5px; line-height:1.5;
      ${who==='user' ? 'align-self:flex-end; background:var(--primary); color:#fff; border-bottom-right-radius:4px;' : 'align-self:flex-start; background:var(--surface-2); border-bottom-left-radius:4px;'}`;
    bubble.textContent = text;
    const wrap = document.createElement('div');
    wrap.style.display='flex';
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }
  addMsg('Hi Ananya! Ask me anything about your academics, career progress, or what to prioritize this week.', 'ai');

  document.getElementById('prompt-list').innerHTML = prompts.map(p=>`<button class="btn btn-secondary btn-sm" style="justify-content:flex-start;text-align:left;height:auto;padding:10px 14px;" data-p="${p}">${p}</button>`).join('');
  document.querySelectorAll('[data-p]').forEach(b=> b.addEventListener('click', async ()=>{
    addMsg(b.dataset.p, 'user');
    const res = await EduData.getAiResponse(b.dataset.p);
    setTimeout(()=> addMsg(res, 'ai'), 300);
  }));

  document.getElementById('chat-form').addEventListener('submit', async (e)=>{
    e.preventDefault();
    const input = document.getElementById('chat-input');
    if(!input.value.trim()) return;
    addMsg(input.value.trim(), 'user');
    const res = await EduData.getAiResponse(input.value.trim());
    input.value = '';
    setTimeout(()=> addMsg(res, 'ai'), 300);
  });
}

/* ------------------------------------------------------------------ */
/* SETTINGS                                                           */
/* ------------------------------------------------------------------ */
async function renderStudentSettings(root){
  const profile = await EduData.getStudentProfile();
  root.innerHTML = `
    <div class="tabs" data-panels="settings">
      <button class="tab-btn active" data-tab="profile">Personal Profile</button>
      <button class="tab-btn" data-tab="academic">Academic Profile</button>
      <button class="tab-btn" data-tab="career">Career Preferences</button>
      <button class="tab-btn" data-tab="notifications">Notifications</button>
      <button class="tab-btn" data-tab="theme">Theme</button>
    </div>

    <div class="tab-panel active" data-group="settings" data-tab="profile">
      <div class="card" style="max-width:520px;">
        <div class="flex gap-4 mb-6" style="align-items:center;">
          <span class="avatar" style="width:64px;height:64px;font-size:20px;">${profile.name.split(' ').map(w=>w[0]).join('')}</span>
          <div><button class="btn btn-secondary btn-sm">Change Photo</button></div>
        </div>
        <div class="field"><label>Full Name</label><input class="input" value="${profile.name}"></div>
        <div class="field"><label>Email</label><input class="input" value="${profile.email}" disabled></div>
        <button class="btn btn-primary save-settings">Save Changes</button>
      </div>
    </div>

    <div class="tab-panel" data-group="settings" data-tab="academic">
      <div class="card" style="max-width:520px;">
        <div class="field"><label>College</label><input class="input" value="${profile.college}"></div>
        <div class="grid grid-2">
          <div class="field"><label>Course</label><input class="input" value="${profile.course}"></div>
          <div class="field"><label>Branch</label><input class="input" value="${profile.branch}"></div>
        </div>
        <div class="grid grid-2">
          <div class="field"><label>Semester</label><input class="input" value="${profile.semester}"></div>
          <div class="field"><label>Roll Number</label><input class="input" value="${profile.rollNo}" disabled></div>
        </div>
        <button class="btn btn-primary save-settings">Save Changes</button>
      </div>
    </div>

    <div class="tab-panel" data-group="settings" data-tab="career">
      <div class="card" style="max-width:520px;">
        <div class="field"><label>Career Goal</label>
          <select class="input"><option ${profile.careerGoal==='Full Stack Developer'?'selected':''}>Full Stack Developer</option><option>Data Analyst</option><option>Cybersecurity</option><option>AI/ML Engineer</option></select>
        </div>
        <div class="field"><label>Preferred Internship Mode</label><select class="input"><option>Remote</option><option>Hybrid</option><option>On-site</option></select></div>
        <button class="btn btn-primary save-settings">Save Preferences</button>
      </div>
    </div>

    <div class="tab-panel" data-group="settings" data-tab="notifications">
      <div class="card" style="max-width:520px;">
        ${['Assignment deadlines','Attendance warnings','Classroom announcements','Internship matches','Weekly summary email'].map(n=>`
          <label class="flex-between mb-4" style="cursor:pointer;"><span class="text-sm">${n}</span><input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--primary);"></label>`).join('')}
      </div>
    </div>

    <div class="tab-panel" data-group="settings" data-tab="theme">
      <div class="card" style="max-width:520px;">
        <p class="text-sm text-soft mb-4">Choose how EduTrack looks on this device.</p>
        ${EduTrack.themeSwitchHTML()}
      </div>
    </div>
  `;
  EduTrack.bindTabs(root);
  EduTrack.bindThemeSwitch(root);
  root.querySelectorAll('.save-settings').forEach(b=> b.addEventListener('click', ()=> EduTrack.toast('Settings saved.', 'success')));
}
