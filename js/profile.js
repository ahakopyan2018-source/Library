const userNameEl = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');
const logoutBtn = document.getElementById('logoutBtn');

// Load User Session from LocalStorage
function loadUserProfile() {
  const session = localStorage.getItem('library_logged_user');
  
  if (session) {
    try {
      const user = JSON.parse(session);
      userNameEl.textContent = user.name || 'Գրադարանավար';
      userEmailEl.textContent = user.email || 'user@mail.am';
    } catch (e) {
      // Fallback if parsing fails
      userNameEl.textContent = 'Հյուր օգտատեր';
      userEmailEl.textContent = 'guest@library.am';
    }
  } else {
    // If not logged in, redirect to auth page
    window.location.href = 'auth.html';
  }
}

// Handle Logout
logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('library_logged_user');
  window.location.href = 'auth.html';
});

// Init
loadUserProfile();
