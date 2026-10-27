/* ==========================================================================
   EduTrack — auth.js
   Frontend-only DEMO authentication. Replace with Firebase Auth + Express
   session verification before handling any real user data.
   ========================================================================== */

const DEMO_CREDENTIALS = {
  student: { email: 'student@edutrack.demo', password: 'student123' },
  faculty: { email: 'faculty@edutrack.demo', password: 'faculty123' },
};

function showFieldError(fieldEl, message){
  fieldEl.classList.add('has-error');
  const msg = fieldEl.querySelector('.error-msg');
  if(msg) msg.textContent = message;
}
function clearFieldError(fieldEl){
  fieldEl.classList.remove('has-error');
}
function validateEmail(v){ return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }

function initStudentLoginForm(){
  EduTrack.initTheme();
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailField = document.getElementById('field-email');
    const passField = document.getElementById('field-password');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    clearFieldError(emailField); clearFieldError(passField);

    if(!validateEmail(email)){ showFieldError(emailField, 'Enter a valid email address.'); return; }
    if(!password){ showFieldError(passField, 'Password is required.'); return; }

    if(email === DEMO_CREDENTIALS.student.email && password === DEMO_CREDENTIALS.student.password){
      EduTrack.login('student', { name: 'Ananya Rao', email });
      EduTrack.toast('Welcome back, Ananya!', 'success');
      setTimeout(()=> window.location.href = '../student/dashboard.html', 500);
    } else {
      showFieldError(passField, 'Incorrect email or password. Try the demo credentials shown above.');
    }
  });
}

function initFacultyLoginForm(){
  EduTrack.initTheme();
  const form = document.getElementById('login-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailField = document.getElementById('field-email');
    const passField = document.getElementById('field-password');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    clearFieldError(emailField); clearFieldError(passField);

    if(!validateEmail(email)){ showFieldError(emailField, 'Enter a valid email address.'); return; }
    if(!password){ showFieldError(passField, 'Password is required.'); return; }

    if(email === DEMO_CREDENTIALS.faculty.email && password === DEMO_CREDENTIALS.faculty.password){
      EduTrack.login('faculty', { name: 'Prof. Meera Sharma', email });
      EduTrack.toast('Welcome back, Professor!', 'success');
      setTimeout(()=> window.location.href = '../faculty/dashboard.html', 500);
    } else {
      showFieldError(passField, 'Incorrect email or password. Try the demo credentials shown above.');
    }
  });
}

function initRegisterForm(role){
  EduTrack.initTheme();
  const form = document.getElementById('register-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('.field[data-required]').forEach(f=>{
      const input = f.querySelector('input, select');
      clearFieldError(f);
      if(!input.value.trim()){ showFieldError(f, 'This field is required.'); valid = false; }
    });
    const emailField = document.getElementById('field-email');
    const email = document.getElementById('email');
    if(email && email.value && !validateEmail(email.value)){ showFieldError(emailField, 'Enter a valid email address.'); valid = false; }

    const pass = document.getElementById('password');
    const confirm = document.getElementById('confirmPassword');
    const confirmField = document.getElementById('field-confirmPassword');
    if(pass && confirm && pass.value !== confirm.value){ showFieldError(confirmField, 'Passwords do not match.'); valid = false; }
    if(pass && pass.value && pass.value.length < 6){ showFieldError(document.getElementById('field-password'), 'Password must be at least 6 characters.'); valid = false; }

    if(!valid) return;

    EduTrack.toast('Demo account created — you can log in now.', 'success');
    setTimeout(()=> window.location.href = role === 'student' ? 'student-login.html' : 'faculty-login.html', 700);
  });
}

function initForgotPasswordForm(){
  EduTrack.initTheme();
  const form = document.getElementById('forgot-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const emailField = document.getElementById('field-email');
    const email = document.getElementById('email').value.trim();
    clearFieldError(emailField);
    if(!validateEmail(email)){ showFieldError(emailField, 'Enter a valid email address.'); return; }
    document.getElementById('forgot-form').classList.add('hidden-step');
    document.getElementById('forgot-success').style.display = 'block';
  });
}

function initResetPasswordForm(){
  EduTrack.initTheme();
  const form = document.getElementById('reset-form');
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const pass = document.getElementById('password');
    const confirm = document.getElementById('confirmPassword');
    const passField = document.getElementById('field-password');
    const confirmField = document.getElementById('field-confirmPassword');
    clearFieldError(passField); clearFieldError(confirmField);
    let valid = true;
    if(pass.value.length < 6){ showFieldError(passField, 'Password must be at least 6 characters.'); valid = false; }
    if(pass.value !== confirm.value){ showFieldError(confirmField, 'Passwords do not match.'); valid = false; }
    if(!valid) return;
    EduTrack.toast('Password reset — demo only.', 'success');
    setTimeout(()=> window.location.href = 'choose-login.html', 700);
  });
}
