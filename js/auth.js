const loginTabBtn = document.getElementById('loginTabBtn');
const registerTabBtn = document.getElementById('registerTabBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const alertBanner = document.getElementById('alertBanner');

// Switch Tabs
loginTabBtn.addEventListener('click', () => {
  loginTabBtn.classList.add('active');
  registerTabBtn.classList.remove('active');
  loginForm.style.display = 'block';
  registerForm.style.display = 'none';
  hideAlert();
});

registerTabBtn.addEventListener('click', () => {
  registerTabBtn.classList.add('active');
  loginTabBtn.classList.remove('active');
  registerForm.style.display = 'block';
  loginForm.style.display = 'none';
  hideAlert();
});

function showAlert(message, type = 'error') {
  alertBanner.className = `alert alert-${type}`;
  alertBanner.textContent = message;
  alertBanner.style.display = 'block';
  setTimeout(() => { hideAlert(); }, 4000);
}

function hideAlert() {
  alertBanner.style.display = 'none';
}

// Handle Login Simulation
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();

  if (!email || !pass) {
    showAlert('Խնդրում ենք լրացնել բոլոր դաշտերը:', 'error');
    return;
  }

  // Save session mock in localStorage
  localStorage.setItem('library_logged_user', JSON.stringify({ email, name: 'Գրադարանավար' }));
  showAlert('Հաջողությամբ մուտք գործեցիք համակարգ:', 'success');
  
  setTimeout(() => {
    window.location.href = 'userprofile.html';
  }, 1500);
});

// Handle Register Simulation
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const pass = document.getElementById('regPassword').value.trim();

  if (!name || !email || !pass) {
    showAlert('Խնդրում ենք լրացնել բոլոր դաշտերը:', 'error');
    return;
  }

  // Save session mock in localStorage
  localStorage.setItem('library_logged_user', JSON.stringify({ email, name }));
  showAlert('Հաշիվը հաջողությամբ ստեղծվեց:', 'success');

  setTimeout(() => {
    window.location.href = 'userprofile.html';
  }, 1500);
});
