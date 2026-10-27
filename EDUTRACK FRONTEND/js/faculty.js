/* ==========================================================================
   EduTrack — faculty.js
   One render function per faculty page.
   ========================================================================== */

const { icon: fic } = EduTrack;

function fStatCard(ic, label, value, note, badgeClass){
  return `<div class="card stat-card card-hover animate-in">
    <span class="stat-icon">${fic(ic,18)}</span>
    <span class="stat-label">${label}</span>
    <span class="stat-value">${value}</span>
    <span class="badge ${badgeClass}" style="align-self:flex-start;">${note}</span>
  </div>`;
}
function fEmptyState(ic, title, desc){
  return `<div class="empty-state">${fic(ic,32)}<h3 class="h4 mt-3 mb-2">${title}</h3><p>${desc}</p></div>`;
}

/* ------------------------------------------------------------------ */
/* DASHBOARD                                                          */
/* ------------------------------------------------------------------ */
async function renderFacultyDashboard(root){
  const [classrooms, students, alerts, assignments] = await Promise.all([
    EduData.getFacultyClassrooms(), EduData.getFacultyStudents(), EduData.getFacultyAlerts(), EduData.getFacultyAssignments()
  ]);
  const totalStudents = classrooms.reduce((s,c)=>s+c.students,0);
  const avgAttendance = Math.round(classrooms.reduce((s,c)=>s+c.avgAttendance,0)/classrooms.length);
  const avgMarks = Math.round(classrooms.reduce((s,c)=>s+c.avgMarks,0)/classrooms.length);
  const needsAttention = students.filter(s=>s.status==='Needs Attention');
  const pendingAssignments = assignments.reduce((s,a)=>s+(a.total-a.submitted),0);

  root.innerHTML = `
    <div class="grid grid-4 animate-in">
      ${fStatCard('users','Total Students', totalStudents, `${classrooms.length} classrooms`, 'badge-neutral')}
      ${fStatCard('checkCircle','Avg. Attendance', avgAttendance+'%', avgAttendance>=75?'Healthy':'Needs improvement', avgAttendance>=75?'badge-success':'badge-warning')}
      ${fStatCard('fileText','Avg. Marks', avgMarks+'%', 'Across classes', 'badge-info')}
      ${fStatCard('clipboard','Pending Submissions', pendingAssignments, 'Across assignments', 'badge-warning')}
    </div>

    <div class="grid grid-2 mt-6" style="grid-template-columns:1.3fr 1fr;">
      <div class="card">
        <div class="card-title-row"><h3 class="h4">Important Alerts</h3></div>
        <div class="stack gap-3">
          ${alerts.map(a=>`<div class="alert alert-${a.type}">${fic(a.type==='error'?'alertTriangle':a.type==='warning'?'alertTriangle':'trendUp',16)}<span>${a.text}</span></div>`).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-title-row"><h3 class="h4">Quick Actions</h3></div>
        <div class="grid grid-2 gap-3">
          <button class="btn btn-secondary" onclick="window.location.href='attendance.html'">${fic('checkCircle',15)} Mark Attendance</button>
          <button class="btn btn-secondary" onclick="window.location.href='marks.html'">${fic('fileText',15)} Enter Marks</button>
          <button class="btn btn-secondary" onclick="window.location.href='assignments.html'">${fic('plus',15)} Create Assignment</button>
          <button class="btn btn-secondary" id="post-announce">${fic('message',15)} Post Announcement</button>
        </div>
      </div>
    </div>

    <div class="card mt-6">
      <div class="card-title-row"><h3 class="h4">Students Needing Attention</h3><a href="students.html" class="text-sm" style="color:var(--primary);font-weight:600;">View All ${fic('arrowRight',13)}</a></div>
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Name</th><th>Roll No.</th><th>Attendance</th><th>Avg. Marks</th><th>Reason</th></tr></thead>
        <tbody>${needsAttention.slice(0,5).map(s=>`<tr><td>${s.name}</td><td>${s.rollNo}</td>
          <td><span class="badge ${s.attendance<65?'badge-error':'badge-warning'}">${s.attendance}%</span></td>
          <td>${s.avgMarks}%</td><td class="text-sm text-soft">${s.attendance<65?'Low attendance':'Low marks / missing work'}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="grid grid-2 mt-6" style="grid-template-columns:1.3fr 1fr;">
      <div class="card">
        <h3 class="h4 mb-4">Class Performance</h3>
        ${EduTrack.barChart(classrooms.map(c=>c.avgMarks), classrooms.map(c=>c.name.split(' ')[0]))}
      </div>
      <div class="card">
        <h3 class="h4 mb-4">Recent Submissions</h3>
        <div class="stack gap-3">
          ${assignments.slice(0,3).map(a=>`<div class="flex-between"><span class="text-sm">${a.title}</span><span class="badge badge-info">${a.submitted}/${a.total}</span></div>`).join('')}
        </div>
      </div>
    </div>
  `;
  EduTrack.animateChartBars(root);
  document.getElementById('post-announce')?.addEventListener('click', ()=> openAnnouncementModal());
}

function openAnnouncementModal(){
  EduTrack.openModal(`
    <div class="modal-head"><h3 class="h3">Post Announcement</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
    <div class="field"><label>Classroom</label><select class="input"><option>Data Structures</option><option>Advanced Algorithms</option></select></div>
    <div class="field"><label>Message</label><textarea class="input" rows="4" placeholder="Write your announcement..."></textarea></div>
    <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="post-confirm">Post</button></div>`);
  document.getElementById('post-confirm').addEventListener('click', ()=>{ EduTrack.closeModal(); EduTrack.toast('Announcement posted (demo).', 'success'); });
}

/* ------------------------------------------------------------------ */
/* CLASSROOMS                                                         */
/* ------------------------------------------------------------------ */
async function renderFacultyClassrooms(root, actionsSlot){
  let classrooms = await EduData.getFacultyClassrooms();
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="create-class-btn">${fic('plus',15)} Create Classroom</button>`;

  function draw(){
    root.innerHTML = `<div class="grid grid-3" id="fclass-grid"></div>`;
    const grid = document.getElementById('fclass-grid');
    classrooms.forEach(c=>{
      const card = document.createElement('div');
      card.className = 'card card-hover';
      card.style.cursor = 'pointer';
      card.innerHTML = `
        <span class="stat-icon">${fic('building',18)}</span>
        <h3 class="h4 mb-1">${c.name}</h3>
        <p class="text-sm text-soft mb-3">${c.semester} · ${c.branch} · Code: <code>${c.code}</code></p>
        <div class="flex gap-2 mb-4"><span class="badge badge-neutral">${c.students} students</span><span class="badge badge-info">${c.avgAttendance}% attendance</span></div>
        <button class="btn btn-secondary btn-sm btn-block">Open Classroom</button>`;
      card.addEventListener('click', ()=> openFacultyClassroomDetail(c));
      grid.appendChild(card);
    });
  }
  draw();

  document.getElementById('create-class-btn').addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Create Classroom</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
      <div class="field"><label>Class Name</label><input class="input" id="c-name" placeholder="e.g. Operating Systems"></div>
      <div class="grid grid-2">
        <div class="field"><label>Semester</label><input class="input" id="c-sem" placeholder="e.g. SEM 5"></div>
        <div class="field"><label>Branch</label><input class="input" id="c-branch" placeholder="e.g. CSE"></div>
      </div>
      <div class="field"><label>Description</label><textarea class="input" rows="2" id="c-desc" placeholder="Optional description"></textarea></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="save-class">Create Classroom</button></div>`);
    document.getElementById('save-class').addEventListener('click', ()=>{
      const name = document.getElementById('c-name').value.trim();
      if(!name){ EduTrack.toast('Class name is required.', 'error'); return; }
      const code = name.slice(0,3).toUpperCase() + '-' + Math.random().toString(36).slice(2,6).toUpperCase();
      classrooms.push({name, code, semester:document.getElementById('c-sem').value||'—', branch:document.getElementById('c-branch').value||'—', students:0, avgAttendance:0, avgMarks:0});
      EduTrack.closeModal(); EduTrack.toast(`Classroom created — code ${code}`, 'success'); draw();
    });
  });
}

function openFacultyClassroomDetail(c){
  EduTrack.openModal(`
    <div class="modal-head"><h3 class="h3">${c.name}</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
    <div class="tabs" data-panels="fclassroom" style="margin-bottom:16px;">
      <button class="tab-btn active" data-tab="overview">Overview</button>
      <button class="tab-btn" data-tab="material">Study Material</button>
      <button class="tab-btn" data-tab="announce">Announcements</button>
    </div>
    <div class="tab-panel active" data-group="fclassroom" data-tab="overview">
      <p class="text-sm text-soft mb-2">${c.semester} · ${c.branch} · Class code: <code>${c.code}</code></p>
      <p class="text-sm"><strong>${c.students}</strong> students · <strong>${c.avgAttendance}%</strong> avg attendance · <strong>${c.avgMarks}%</strong> avg marks</p>
    </div>
    <div class="tab-panel" data-group="fclassroom" data-tab="material">
      <div class="field"><label>Add Study Material</label><input class="input" type="file"></div>
      <button class="btn btn-secondary btn-sm">${fic('upload',14)} Upload</button>
    </div>
    <div class="tab-panel" data-group="fclassroom" data-tab="announce">
      <div class="field"><label>New Announcement</label><textarea class="input" rows="3"></textarea></div>
      <button class="btn btn-primary btn-sm">Post</button>
    </div>`);
  EduTrack.bindTabs(document);
}

/* ------------------------------------------------------------------ */
/* STUDENTS                                                           */
/* ------------------------------------------------------------------ */
async function renderFacultyStudents(root){
  const students = await EduData.getFacultyStudents();
  root.innerHTML = `
    <div class="flex gap-3 mb-5" style="flex-wrap:wrap;">
      <div class="input-group" style="max-width:280px;flex:1;">
        <span class="ic" style="position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--ink-faint);">${fic('search',15)}</span>
        <input class="input" style="padding-left:36px;" id="student-search" placeholder="Search by name or roll no.">
      </div>
      <select class="input" id="status-filter" style="max-width:200px;"><option value="All">All Statuses</option><option>Good Standing</option><option>Needs Attention</option></select>
    </div>
    <div class="table-wrap"><table class="data-table">
      <thead><tr><th>Name</th><th>Roll No.</th><th>Attendance</th><th>Avg. Marks</th><th>Assignments</th><th>Status</th></tr></thead>
      <tbody id="student-rows"></tbody>
    </table></div>`;

  function draw(){
    const q = document.getElementById('student-search').value.toLowerCase();
    const status = document.getElementById('status-filter').value;
    const rows = document.getElementById('student-rows');
    const filtered = students.filter(s=> (s.name.toLowerCase().includes(q)||s.rollNo.toLowerCase().includes(q)) && (status==='All'||s.status===status));
    rows.innerHTML = filtered.map(s=>`<tr style="cursor:pointer;" data-roll="${s.rollNo}">
      <td>${s.name}</td><td>${s.rollNo}</td>
      <td><span class="badge ${s.attendance<65?'badge-error':s.attendance<75?'badge-warning':'badge-success'}">${s.attendance}%</span></td>
      <td>${s.avgMarks}%</td><td><span class="badge badge-neutral">${s.assignStatus}</span></td>
      <td><span class="badge ${s.status==='Needs Attention'?'badge-warning':'badge-success'}">${s.status}</span></td>
    </tr>`).join('') || `<tr><td colspan="6">${fEmptyState('users','No students found','Try a different search or filter.')}</td></tr>`;
    rows.querySelectorAll('tr[data-roll]').forEach(tr=> tr.addEventListener('click', ()=> openStudentProfile(students.find(s=>s.rollNo===tr.dataset.roll))));
  }
  draw();
  document.getElementById('student-search').addEventListener('input', draw);
  document.getElementById('status-filter').addEventListener('change', draw);
}

function openStudentProfile(s){
  EduTrack.openModal(`
    <div class="modal-head"><h3 class="h3">${s.name}</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
    <p class="text-sm text-soft mb-4">Roll No. ${s.rollNo}</p>
    <div class="grid grid-2 mb-4">
      <div class="card card-flat" style="background:var(--surface-2);"><span class="text-xs text-faint">Attendance</span><div class="h3 mt-1">${s.attendance}%</div></div>
      <div class="card card-flat" style="background:var(--surface-2);"><span class="text-xs text-faint">Avg. Marks</span><div class="h3 mt-1">${s.avgMarks}%</div></div>
    </div>
    <p class="text-sm">Assignment status: <span class="badge badge-neutral">${s.assignStatus}</span></p>
    <p class="text-sm mt-2">Overall: <span class="badge ${s.status==='Needs Attention'?'badge-warning':'badge-success'}">${s.status}</span></p>
    <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Close</button></div>`);
}

/* ------------------------------------------------------------------ */
/* ATTENDANCE                                                         */
/* ------------------------------------------------------------------ */
async function renderFacultyAttendance(root){
  const [classrooms, students, trend] = await Promise.all([EduData.getFacultyClassrooms(), EduData.getFacultyStudents(), EduData.getAttendanceTrend()]);
  root.innerHTML = `
    <div class="tabs" data-panels="attend">
      <button class="tab-btn active" data-tab="mark">Mark Attendance</button>
      <button class="tab-btn" data-tab="records">Attendance Records</button>
      <button class="tab-btn" data-tab="analytics">Analytics</button>
    </div>

    <div class="tab-panel active" data-group="attend" data-tab="mark">
      <div class="card mb-5">
        <div class="grid grid-3">
          <div class="field" style="margin:0;"><label>Class</label><select class="input" id="mark-class">${classrooms.map(c=>`<option>${c.name}</option>`).join('')}</select></div>
          <div class="field" style="margin:0;"><label>Subject</label><input class="input" value="Core Lecture"></div>
          <div class="field" style="margin:0;"><label>Date</label><input class="input" type="date"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between mb-4">
          <h3 class="h4">Mark Present / Absent</h3>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" id="mark-all">Mark All Present</button>
            <button class="btn btn-primary btn-sm" id="save-attendance">Save Attendance</button>
          </div>
        </div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Name</th><th>Roll No.</th><th>Status</th></tr></thead>
          <tbody id="attend-rows">${students.slice(0,12).map(s=>`<tr><td>${s.name}</td><td>${s.rollNo}</td><td>
            <div class="flex gap-2">
              <button class="btn btn-sm att-toggle present active" data-roll="${s.rollNo}">Present</button>
              <button class="btn btn-sm att-toggle absent" data-roll="${s.rollNo}">Absent</button>
            </div></td></tr>`).join('')}</tbody>
        </table></div>
      </div>
    </div>

    <div class="tab-panel" data-group="attend" data-tab="records">
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Classroom</th><th>Avg. Attendance</th><th>Students</th></tr></thead>
        <tbody>${classrooms.map(c=>`<tr><td>${c.name}</td><td><span class="badge ${c.avgAttendance<75?'badge-warning':'badge-success'}">${c.avgAttendance}%</span></td><td>${c.students}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="tab-panel" data-group="attend" data-tab="analytics">
      <div class="grid grid-2" style="grid-template-columns:1.2fr 1fr;">
        <div class="card"><h3 class="h4 mb-4">Attendance Trend (6 weeks)</h3>${EduTrack.lineChart(trend.map(t=>t.value), trend.map(t=>t.label))}</div>
        <div class="card">
          <h3 class="h4 mb-4">Low Attendance Students</h3>
          <div class="stack gap-3">${students.filter(s=>s.attendance<65).slice(0,5).map(s=>`<div class="flex-between"><span class="text-sm">${s.name}</span><span class="badge badge-error">${s.attendance}%</span></div>`).join('')}</div>
        </div>
      </div>
    </div>
  `;
  EduTrack.bindTabs(root);

  document.querySelectorAll('.att-toggle').forEach(btn=>{
    btn.className += btn.classList.contains('present') ? ' btn-primary' : ' btn-secondary';
    btn.addEventListener('click', ()=>{
      const roll = btn.dataset.roll;
      document.querySelectorAll(`.att-toggle[data-roll="${roll}"]`).forEach(b=>{
        const isPresent = b.classList.contains('present');
        b.className = `btn btn-sm att-toggle ${isPresent?'present':'absent'} ${b===btn?(isPresent?'btn-primary':'btn-danger'):(isPresent?'btn-secondary':'btn-ghost')}`;
      });
    });
  });
  document.getElementById('mark-all').addEventListener('click', ()=>{
    document.querySelectorAll('.att-toggle.present').forEach(b=> b.className='btn btn-sm att-toggle present btn-primary');
    document.querySelectorAll('.att-toggle.absent').forEach(b=> b.className='btn btn-sm att-toggle absent btn-ghost');
    EduTrack.toast('All students marked present.', 'success');
  });
  document.getElementById('save-attendance').addEventListener('click', ()=> EduTrack.toast('Attendance saved (demo).', 'success'));
}

/* ------------------------------------------------------------------ */
/* MARKS                                                              */
/* ------------------------------------------------------------------ */
async function renderFacultyMarks(root){
  const [classrooms, students, dist] = await Promise.all([EduData.getFacultyClassrooms(), EduData.getFacultyStudents(), EduData.getMarksDistribution()]);
  const avg = Math.round(students.reduce((s,x)=>s+x.avgMarks,0)/students.length);
  const high = Math.max(...students.map(s=>s.avgMarks));
  const low = Math.min(...students.map(s=>s.avgMarks));

  root.innerHTML = `
    <div class="tabs" data-panels="marks">
      <button class="tab-btn active" data-tab="enter">Enter Marks</button>
      <button class="tab-btn" data-tab="records">Marks Records</button>
      <button class="tab-btn" data-tab="analysis">Performance Analysis</button>
    </div>

    <div class="tab-panel active" data-group="marks" data-tab="enter">
      <div class="card mb-5">
        <div class="grid grid-3">
          <div class="field" style="margin:0;"><label>Class</label><select class="input">${classrooms.map(c=>`<option>${c.name}</option>`).join('')}</select></div>
          <div class="field" style="margin:0;"><label>Assessment Type</label><select class="input"><option>Internal 1</option><option>Internal 2</option><option>Assignment</option></select></div>
          <div class="field" style="margin:0;"><label>Max Marks</label><input class="input" type="number" value="50"></div>
        </div>
      </div>
      <div class="card">
        <div class="flex-between mb-4"><h3 class="h4">Student Marks</h3><button class="btn btn-primary btn-sm" id="save-marks">Save Marks</button></div>
        <div class="table-wrap"><table class="data-table">
          <thead><tr><th>Name</th><th>Roll No.</th><th>Marks</th></tr></thead>
          <tbody>${students.slice(0,12).map(s=>`<tr><td>${s.name}</td><td>${s.rollNo}</td><td><input class="input" style="max-width:100px;padding:8px 10px;" type="number" value="${Math.round(s.avgMarks/2)}"></td></tr>`).join('')}</tbody>
        </table></div>
      </div>
    </div>

    <div class="tab-panel" data-group="marks" data-tab="records">
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Classroom</th><th>Avg. Marks</th><th>Students</th></tr></thead>
        <tbody>${classrooms.map(c=>`<tr><td>${c.name}</td><td>${c.avgMarks}%</td><td>${c.students}</td></tr>`).join('')}</tbody>
      </table></div>
    </div>

    <div class="tab-panel" data-group="marks" data-tab="analysis">
      <div class="grid grid-3 mb-5">
        ${fStatCard('barChart','Average', avg+'%', 'Class-wide', 'badge-info')}
        ${fStatCard('trendUp','Highest', high+'%', 'Top performer', 'badge-success')}
        ${fStatCard('alertTriangle','Lowest', low+'%', 'May need support', 'badge-warning')}
      </div>
      <div class="card"><h3 class="h4 mb-4">Marks Distribution</h3>${EduTrack.donutChart(dist.map((d,i)=>({value:d.value, label:d.label, color:['#2E7D5B','#4FAE81','#F2A65A','#E0A429','#C1443B'][i]})))}</div>
    </div>
  `;
  EduTrack.bindTabs(root);
  document.getElementById('save-marks')?.addEventListener('click', ()=> EduTrack.toast('Marks saved (demo).', 'success'));
}

/* ------------------------------------------------------------------ */
/* ASSIGNMENTS                                                        */
/* ------------------------------------------------------------------ */
async function renderFacultyAssignments(root, actionsSlot){
  let assignments = await EduData.getFacultyAssignments();
  actionsSlot.innerHTML = `<button class="btn btn-primary" id="create-assign-btn">${fic('plus',15)} Create Assignment</button>`;

  function draw(){
    root.innerHTML = `<div class="table-wrap"><table class="data-table">
      <thead><tr><th>Title</th><th>Classroom</th><th>Due</th><th>Submitted</th><th>Pending</th></tr></thead>
      <tbody id="assign-rows"></tbody>
    </table></div>`;
    document.getElementById('assign-rows').innerHTML = assignments.map(a=>`<tr style="cursor:pointer;" data-t="${a.title}">
      <td>${a.title}</td><td>${a.classroom}</td><td>${a.due}</td>
      <td><span class="badge badge-success">${a.submitted}/${a.total}</span></td>
      <td><span class="badge ${a.total-a.submitted>0?'badge-warning':'badge-neutral'}">${a.total-a.submitted}</span></td>
    </tr>`).join('');
    document.querySelectorAll('#assign-rows tr').forEach(tr=> tr.addEventListener('click', ()=>{
      const a = assignments.find(x=>x.title===tr.dataset.t);
      EduTrack.openModal(`
        <div class="modal-head"><h3 class="h3">${a.title}</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
        <p class="text-sm text-soft mb-2">${a.classroom} · Due ${a.due} · Max marks ${a.maxMarks}</p>
        <div class="progress mb-3" data-value="${a.submitted/a.total*100}"><span></span></div>
        <p class="text-sm">${a.submitted} of ${a.total} students have submitted. ${a.total-a.submitted} pending.</p>
        <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Close</button></div>`);
      EduTrack.fillBars(document);
    }));
  }
  draw();

  document.getElementById('create-assign-btn').addEventListener('click', ()=>{
    EduTrack.openModal(`
      <div class="modal-head"><h3 class="h3">Create Assignment</h3><button class="modal-close" data-close-modal>${fic('x',18)}</button></div>
      <div class="field"><label>Title</label><input class="input" id="a-title" placeholder="e.g. Graph Traversal Lab"></div>
      <div class="field"><label>Description</label><textarea class="input" rows="2" id="a-desc"></textarea></div>
      <div class="grid grid-2">
        <div class="field"><label>Classroom</label><select class="input" id="a-class"><option>Data Structures</option><option>Advanced Algorithms</option></select></div>
        <div class="field"><label>Deadline</label><input class="input" type="date" id="a-due"></div>
      </div>
      <div class="field"><label>Maximum Marks</label><input class="input" type="number" id="a-max" value="20"></div>
      <div class="modal-actions"><button class="btn btn-secondary" data-close-modal>Cancel</button><button class="btn btn-primary" id="save-assign">Create</button></div>`);
    document.getElementById('save-assign').addEventListener('click', ()=>{
      const title = document.getElementById('a-title').value.trim();
      if(!title){ EduTrack.toast('Title is required.', 'error'); return; }
      assignments.push({title, classroom:document.getElementById('a-class').value, due:document.getElementById('a-due').value||'—', submitted:0, total:40, maxMarks:Number(document.getElementById('a-max').value)||20});
      EduTrack.closeModal(); EduTrack.toast('Assignment created.', 'success'); draw();
    });
  });
}

/* ------------------------------------------------------------------ */
/* ANALYTICS                                                          */
/* ------------------------------------------------------------------ */
async function renderFacultyAnalytics(root){
  const [classrooms, students, trend, dist] = await Promise.all([EduData.getFacultyClassrooms(), EduData.getFacultyStudents(), EduData.getAttendanceTrend(), EduData.getMarksDistribution()]);
  const needsAttention = students.filter(s=>s.status==='Needs Attention');

  root.innerHTML = `
    <div class="tabs" data-panels="analytics">
      <button class="tab-btn active" data-tab="class">Class Performance</button>
      <button class="tab-btn" data-tab="attendance">Attendance Trends</button>
      <button class="tab-btn" data-tab="completion">Assignment Completion</button>
      <button class="tab-btn" data-tab="attention">Students Needing Attention</button>
    </div>

    <div class="tab-panel active" data-group="analytics" data-tab="class">
      <div class="card"><h3 class="h4 mb-4">Average Marks by Classroom</h3>${EduTrack.barChart(classrooms.map(c=>c.avgMarks), classrooms.map(c=>c.name.split(' ')[0]))}</div>
    </div>
    <div class="tab-panel" data-group="analytics" data-tab="attendance">
      <div class="card"><h3 class="h4 mb-4">Attendance Over Time</h3>${EduTrack.lineChart(trend.map(t=>t.value), trend.map(t=>t.label))}</div>
    </div>
    <div class="tab-panel" data-group="analytics" data-tab="completion">
      <div class="card"><h3 class="h4 mb-4">Marks Distribution (proxy for completion quality)</h3>${EduTrack.donutChart(dist.map((d,i)=>({value:d.value, label:d.label, color:['#2E7D5B','#4FAE81','#F2A65A','#E0A429','#C1443B'][i]})))}</div>
    </div>
    <div class="tab-panel" data-group="analytics" data-tab="attention">
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Name</th><th>Roll No.</th><th>Attendance</th><th>Avg. Marks</th></tr></thead>
        <tbody>${needsAttention.map(s=>`<tr><td>${s.name}</td><td>${s.rollNo}</td><td><span class="badge badge-warning">${s.attendance}%</span></td><td>${s.avgMarks}%</td></tr>`).join('')}</tbody>
      </table></div>
    </div>
  `;
  EduTrack.bindTabs(root);
  EduTrack.animateChartBars(root);
}

/* ------------------------------------------------------------------ */
/* SETTINGS                                                           */
/* ------------------------------------------------------------------ */
async function renderFacultySettings(root){
  const profile = await EduData.getFacultyProfile();
  root.innerHTML = `
    <div class="tabs" data-panels="fsettings">
      <button class="tab-btn active" data-tab="profile">Profile</button>
      <button class="tab-btn" data-tab="notifications">Notifications</button>
      <button class="tab-btn" data-tab="theme">Theme</button>
    </div>
    <div class="tab-panel active" data-group="fsettings" data-tab="profile">
      <div class="card" style="max-width:520px;">
        <div class="flex gap-4 mb-6" style="align-items:center;">
          <span class="avatar" style="width:64px;height:64px;font-size:20px;">${profile.name.split(' ').filter(w=>w!=='Prof.').map(w=>w[0]).join('')}</span>
          <div><button class="btn btn-secondary btn-sm">Change Photo</button></div>
        </div>
        <div class="field"><label>Full Name</label><input class="input" value="${profile.name}"></div>
        <div class="field"><label>Email</label><input class="input" value="${profile.email}" disabled></div>
        <div class="field"><label>Department</label><input class="input" value="${profile.department}"></div>
        <div class="field"><label>Faculty ID</label><input class="input" value="${profile.facultyId}" disabled></div>
        <button class="btn btn-primary save-settings">Save Changes</button>
      </div>
    </div>
    <div class="tab-panel" data-group="fsettings" data-tab="notifications">
      <div class="card" style="max-width:520px;">
        ${['New submissions','Low attendance alerts','Classroom messages','Weekly performance summary'].map(n=>`
          <label class="flex-between mb-4" style="cursor:pointer;"><span class="text-sm">${n}</span><input type="checkbox" checked style="width:18px;height:18px;accent-color:var(--primary);"></label>`).join('')}
      </div>
    </div>
    <div class="tab-panel" data-group="fsettings" data-tab="theme">
      <div class="card" style="max-width:520px;"><p class="text-sm text-soft mb-4">Choose how EduTrack looks on this device.</p>${EduTrack.themeSwitchHTML()}</div>
    </div>
  `;
  EduTrack.bindTabs(root);
  EduTrack.bindThemeSwitch(root);
  root.querySelectorAll('.save-settings').forEach(b=> b.addEventListener('click', ()=> EduTrack.toast('Settings saved.', 'success')));
}
