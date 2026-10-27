/* ==========================================================================
   EduTrack — data.js
   All fictional demo data lives here. Every getter returns a Promise so
   that later, swapping the body for `fetch('/api/...')` is a one-line
   change per function — no page code should need to change.
   ========================================================================== */

const EduData = (() => {

  const wait = (v, ms=120) => new Promise(res => setTimeout(()=>res(v), ms));

  /* ---------------- STUDENT PROFILE ---------------- */
  const student = {
    name: 'Ananya Rao',
    email: 'student@edutrack.demo',
    college: 'Greenfield Institute of Technology',
    course: 'B.Tech',
    branch: 'Computer Science & Engineering',
    semester: '5th Semester',
    rollNo: 'CSE21B045',
    cgpa: 8.4,
    attendance: 78,
    careerGoal: 'Full Stack Developer',
  };

  const subjects = [
    {name:'Data Structures', code:'CS301', faculty:'Prof. Meera Sharma', attendance:74, internal:38, external:0, grade:'—', assignments:{done:3,total:4}},
    {name:'Database Management Systems', code:'CS302', faculty:'Prof. Arjun Nair', attendance:69, internal:34, external:0, grade:'—', assignments:{done:2,total:3}},
    {name:'Operating Systems', code:'CS303', faculty:'Prof. Kavita Iyer', attendance:88, internal:41, external:0, grade:'—', assignments:{done:4,total:4}},
    {name:'Computer Networks', code:'CS304', faculty:'Prof. Rohit Verma', attendance:82, internal:36, external:0, grade:'—', assignments:{done:3,total:3}},
    {name:'Web Technologies', code:'CS305', faculty:'Prof. Sneha Kulkarni', attendance:91, internal:44, external:0, grade:'—', assignments:{done:4,total:4}},
  ];

  const marksHistory = [ // semester-wise CGPA trend
    {sem:'Sem 1', cgpa:7.6}, {sem:'Sem 2', cgpa:7.9}, {sem:'Sem 3', cgpa:8.1}, {sem:'Sem 4', cgpa:8.2}, {sem:'Sem 5', cgpa:8.4},
  ];

  const assignments = [
    {title:'Linked List Visualizer', subject:'Data Structures', due:'2026-10-02', status:'pending'},
    {title:'Normalization Case Study', subject:'DBMS', due:'2026-09-29', status:'overdue'},
    {title:'Process Scheduling Report', subject:'Operating Systems', due:'2026-10-06', status:'submitted'},
    {title:'Socket Programming Demo', subject:'Computer Networks', due:'2026-09-25', status:'submitted'},
    {title:'Portfolio Landing Page', subject:'Web Technologies', due:'2026-09-20', status:'graded', grade:'A'},
  ];

  const backlogs = [
    {subject:'Discrete Mathematics', semester:'Sem 2', status:'Cleared', attempt:2},
  ];

  const classrooms = [
    {name:'Data Structures', code:'DSA-7X2K', semester:'SEM 5', faculty:'Prof. Meera Sharma', announcements:3, assignments:2,
      material:['Unit 4 Slides.pdf','Trees & Graphs Notes.pdf'], links:[{label:'Practice Problems (LeetCode set)', url:'#'}]},
    {name:'Database Management Systems', code:'DBMS-9F1A', semester:'SEM 5', faculty:'Prof. Arjun Nair', announcements:1, assignments:1,
      material:['ER Diagram Guide.pdf'], links:[{label:'SQL Practice Sheet', url:'#'}]},
    {name:'Web Technologies', code:'WT-3C7Q', semester:'SEM 5', faculty:'Prof. Sneha Kulkarni', announcements:2, assignments:0,
      material:['Flexbox & Grid Cheatsheet.pdf'], links:[{label:'MDN Web Docs', url:'#'}]},
  ];

  const announcements = [
    {classroom:'Data Structures', text:'Unit 4 test moved to next Monday. Please revise trees & graphs.', time:'Today, 9:10 AM'},
    {classroom:'Web Technologies', text:'Bring your laptops for tomorrow\'s lab — we\'re building a live project.', time:'Yesterday'},
    {classroom:'DBMS', text:'Normalization case study rubric uploaded to study material.', time:'2 days ago'},
  ];

  const skills = [
    {name:'HTML', level:100}, {name:'CSS', level:95}, {name:'JavaScript', level:70},
    {name:'Git & GitHub', level:85}, {name:'SQL', level:50}, {name:'Node.js', level:30}, {name:'React', level:10},
  ];
  const careerRoadmap = [
    {stage:'Foundations', status:'done', items:['HTML, CSS, JavaScript basics','Git & GitHub workflow']},
    {stage:'Core Development', status:'in-progress', items:['SQL & databases','Backend with Node.js']},
    {stage:'Internship Ready', status:'upcoming', items:['React fundamentals','Build 2 full-stack projects']},
    {stage:'Advanced', status:'upcoming', items:['System design basics','Open source contributions']},
  ];

  const projects = [
    {id:1, name:'EduTrack Prototype', description:'A student progress tracking dashboard concept.', tech:['HTML','CSS','JavaScript'], status:'In Progress', progress:65, github:'#', demo:'#'},
    {id:2, name:'Campus Event Finder', description:'A mobile-friendly page to browse college events.', tech:['HTML','CSS'], status:'Completed', progress:100, github:'#', demo:'#'},
    {id:3, name:'Expense Splitter', description:'A small JS app to split group expenses.', tech:['JavaScript'], status:'Planned', progress:10, github:'#', demo:''},
  ];

  const internships = {
    opportunities: [
      {company:'Nimbus Cloud Labs', role:'Frontend Intern', location:'Remote', mode:'Remote', skills:['HTML','CSS','JavaScript'], deadline:'2026-10-15', match:82},
      {company:'Vertex Analytics', role:'Data Analyst Intern', location:'Bengaluru', mode:'Hybrid', skills:['SQL','Excel','Python'], deadline:'2026-10-20', match:58},
      {company:'Skyline Softworks', role:'Full Stack Intern', location:'Pune', mode:'On-site', skills:['JavaScript','Node.js','SQL'], deadline:'2026-10-25', match:78, missing:['Node.js']},
    ],
    applied: [
      {company:'Brightpath EdTech', role:'Web Dev Intern', appliedOn:'2026-09-10', status:'Under Review'},
    ],
    shortlisted: [
      {company:'PixelForge Studio', role:'UI Intern', appliedOn:'2026-08-28', status:'Interview Scheduled'},
    ],
    history: [
      {company:'CodeNest Solutions', role:'Winter Trainee', period:'Dec 2025', outcome:'Completed'},
    ],
  };

  const documents = [
    {name:'Resume_Ananya_Rao.pdf', category:'Resume', date:'2026-09-01', type:'PDF'},
    {name:'AWS_Cloud_Practitioner.pdf', category:'Certificates', date:'2026-08-14', type:'PDF'},
    {name:'Semester4_Marksheet.pdf', category:'Mark Sheets', date:'2026-05-20', type:'PDF'},
    {name:'CodeNest_OfferLetter.pdf', category:'Internship Documents', date:'2025-12-01', type:'PDF'},
  ];

  const tasks = [
    {id:1, title:'Complete DBMS normalization assignment', category:'Academic', priority:'High', due:'Tomorrow', done:false},
    {id:2, title:'Practice JavaScript for 30 minutes', category:'Career', priority:'Medium', due:'Today', done:false},
    {id:3, title:'Apply to 2 internships', category:'Career', priority:'High', due:'This week', done:false},
    {id:4, title:'Update resume with new project', category:'Career', priority:'Medium', due:'Friday', done:false},
    {id:5, title:'Revise trees & graphs for test', category:'Academic', priority:'High', due:'Monday', done:false},
    {id:6, title:'Submit socket programming demo', category:'Academic', priority:'Low', due:'Completed', done:true},
  ];

  const achievements = [
    {title:'First Project', category:'Projects', earned:true, desc:'Created your first project in EduTrack.'},
    {title:'First GitHub Repository', category:'Projects', earned:true, desc:'Linked a public repository.'},
    {title:'First Hackathon', category:'Hackathons', earned:false, desc:'Participate in your first hackathon.'},
    {title:'5 Skills Completed', category:'Milestones', earned:false, desc:'Reach 100% in five career skills.'},
    {title:'First Internship Application', category:'Internships', earned:true, desc:'Applied to your first internship.'},
    {title:'First Internship', category:'Internships', earned:false, desc:'Get selected for an internship.'},
    {title:'AWS Certified', category:'Certifications', earned:true, desc:'Completed AWS Cloud Practitioner.'},
  ];

  const aiSuggestedPrompts = [
    'What should I focus on this week?',
    'What are my weakest subjects?',
    'What skills am I missing for cybersecurity?',
    'How can I improve my internship readiness?',
    'Which task should I prioritize?',
  ];
  const aiMockResponses = {
    'what should i focus on this week?': 'Based on your current progress, prioritize the DBMS normalization assignment (due tomorrow) and revising Trees & Graphs for Monday\'s test. Your JavaScript practice is on track — 15 more minutes a day will keep momentum.',
    'what are my weakest subjects?': 'Database Management Systems (69% attendance, 34/50 internal marks) and Data Structures (74% attendance) need the most attention right now. Operating Systems and Web Technologies are your strongest.',
    'what skills am i missing for cybersecurity?': 'For a Cybersecurity track, you\'d want to build: Networking fundamentals (you\'re already covering this in Computer Networks), Linux basics, and an intro to security tools. Your current goal is set to Full Stack Developer — want me to add a Cybersecurity roadmap alongside it?',
    'how can i improve my internship readiness?': 'Your profile is at 68% internship readiness. Closing the Node.js and SQL gaps would raise your match score on 2 of the 3 recommended internships. Adding one more completed project to your portfolio would also help.',
    'which task should i prioritize?': 'The DBMS normalization assignment is overdue-risk — it\'s due tomorrow and worth prioritizing over the resume update, which isn\'t time-boxed yet.',
  };

  /* ---------------- FACULTY PROFILE ---------------- */
  const faculty = {
    name: 'Prof. Meera Sharma',
    email: 'faculty@edutrack.demo',
    department: 'Computer Science & Engineering',
    facultyId: 'FAC-1042',
  };

  const facultyClassrooms = [
    {name:'Data Structures', code:'DSA-7X2K', semester:'SEM 5', branch:'CSE', students:42, avgAttendance:79, avgMarks:74},
    {name:'Advanced Algorithms', code:'ALGO-4M8P', semester:'SEM 7', branch:'CSE', students:36, avgAttendance:85, avgMarks:81},
  ];

  const firstNames = ['Aarav','Diya','Ishaan','Kavya','Rohan','Meera','Arjun','Sanya','Vikram','Neha','Karan','Priya','Aditya','Riya','Yash','Tanvi','Devansh','Anika','Rahul','Simran'];
  const lastNames = ['Sharma','Verma','Iyer','Nair','Rao','Gupta','Kapoor','Menon','Reddy','Joshi'];
  function makeStudentRoster(n, seed=1){
    const list = [];
    for(let i=0;i<n;i++){
      const fn = firstNames[(i*seed)%firstNames.length];
      const ln = lastNames[(i*seed+3)%lastNames.length];
      const attendance = 55 + ((i*37+seed*11) % 45);
      const avgMarks = 45 + ((i*23+seed*7) % 50);
      const assignStatus = ['On Track','On Track','On Track','Pending','Missing'][(i+seed)%5];
      list.push({
        rollNo: `CSE21B${String(10+i).padStart(3,'0')}`,
        name: `${fn} ${ln}`,
        attendance, avgMarks, assignStatus,
        status: attendance < 65 || avgMarks < 50 ? 'Needs Attention' : 'Good Standing',
      });
    }
    return list;
  }
  const facultyStudents = makeStudentRoster(42, 3);

  const facultyAssignments = [
    {title:'Linked List Visualizer', classroom:'Data Structures', due:'2026-10-02', submitted:31, total:42, maxMarks:20},
    {title:'Tree Traversal Quiz', classroom:'Data Structures', due:'2026-09-24', submitted:42, total:42, maxMarks:10},
    {title:'Divide & Conquer Problem Set', classroom:'Advanced Algorithms', due:'2026-10-05', submitted:20, total:36, maxMarks:25},
  ];

  const facultyAlerts = [
    {type:'warning', text:'6 students in Data Structures have attendance below 65%.'},
    {type:'error', text:'3 students have not submitted the Tree Traversal Quiz.'},
    {type:'info', text:'Advanced Algorithms average marks rose 4% since last assessment.'},
  ];

  const attendanceTrend = [
    {label:'Wk1', value:88},{label:'Wk2', value:84},{label:'Wk3', value:81},{label:'Wk4', value:79},{label:'Wk5', value:82},{label:'Wk6', value:79},
  ];
  const marksDistribution = [
    {label:'90-100', value:4},{label:'75-89', value:11},{label:'60-74', value:15},{label:'40-59', value:8},{label:'<40', value:4},
  ];

  /* ---------------- GETTERS (Promise-based; swap bodies for fetch() later) ---------------- */
  return {
    getStudentProfile: () => wait(student),
    getSubjects: () => wait(subjects),
    getMarksHistory: () => wait(marksHistory),
    getAssignments: () => wait(assignments),
    getBacklogs: () => wait(backlogs),
    getClassrooms: () => wait(classrooms),
    getAnnouncements: () => wait(announcements),
    getSkills: () => wait(skills),
    getCareerRoadmap: () => wait(careerRoadmap),
    getProjects: () => wait(projects),
    getInternships: () => wait(internships),
    getDocuments: () => wait(documents),
    getTasks: () => wait(tasks),
    getAchievements: () => wait(achievements),
    getAiPrompts: () => wait(aiSuggestedPrompts),
    getAiResponse: (q) => wait(aiMockResponses[q.trim().toLowerCase()] || 'Here\'s a mock response — once connected to the AI API, I\'ll give you a real, data-grounded answer to that question.'),

    getFacultyProfile: () => wait(faculty),
    getFacultyClassrooms: () => wait(facultyClassrooms),
    getFacultyStudents: () => wait(facultyStudents),
    getFacultyAssignments: () => wait(facultyAssignments),
    getFacultyAlerts: () => wait(facultyAlerts),
    getAttendanceTrend: () => wait(attendanceTrend),
    getMarksDistribution: () => wait(marksDistribution),
  };
})();
