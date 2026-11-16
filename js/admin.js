const STORAGE_KEY = 'library_app_books_v5';
const USERS_KEY = 'library_registered_users';
const SESSION_KEY = 'library_logged_user';

let currentUser = null;
let books = [];

function checkAdminAuth() {
  const session = localStorage.getItem(SESSION_KEY);
  if (session) {
    try { currentUser = JSON.parse(session); } catch(e) { currentUser = null; }
  }

  // Եթե ադմին չէ, հետ ուղղորդել գլխավոր էջ
  if (!currentUser || currentUser.email !== 'admin@example.com') {
    window.location.href = 'index.html';
  }
}

function loadBooks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { books = JSON.parse(stored); } catch(e) { books = []; }
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showAlert(message, type = 'error') {
  const banner = document.getElementById('alertBanner');
  banner.className = `alert alert-${type}`;
  banner.textContent = message;
  banner.style.display = 'block';
  setTimeout(() => { banner.style.display = 'none'; }, 4000);
}

function switchAdminTab(tabId) {
  document.querySelectorAll('.admin-section').forEach(sec => sec.classList.remove('active'));
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.currentTarget.classList.add('active');
}

function loadAdminData() {
  // Օգտատերերի ցուցակ
  const usersTable = document.getElementById('adminUsersTableBody');
  const storedUsers = localStorage.getItem(USERS_KEY);
  let users = storedUsers ? JSON.parse(storedUsers) : [
    { name: 'Admin User', email: 'admin@example.com' },
    { name: 'Test User', email: 'user@example.com' }
  ];
  usersTable.innerHTML = users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td><span style="color: var(--success);">Ակտիվ</span></td></tr>`).join('');

  // Ամրագրված գրքերի պատմություն
  const borrowsTable = document.getElementById('adminBorrowsTableBody');
  loadBooks();
  const borrowedBooks = books.filter(b => b.status === 'Borrowed');
  
  if (borrowedBooks.length === 0) {
    borrowsTable.innerHTML = `<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">Ամրագրված գրքեր չկան</td></tr>`;
  } else {
    borrowsTable.innerHTML = borrowedBooks.map(b => `
      <tr>
        <td>${b.title.hy}</td>
        <td><strong>${b.borrower}</strong></td>
        <td>${new Date(b.borrowDate).toLocaleDateString()}</td>
        <td>${new Date(b.dueDate).toLocaleDateString()}</td>
        <td><button class="btn-warning" style="padding: 6px 12px; font-size: 0.85rem;" onclick="adminReturnBook('${b.id}')">Վերադարձնել</button></td>
      </tr>
    `).join('');
  }
}

function adminReturnBook(id) {
  loadBooks();
  const book = books.find(b => b.id === id);
  if (book) {
    book.status = 'Available';
    book.borrower = '';
    book.borrowDate = '';
    book.dueDate = '';
    saveBooks();
    loadAdminData();
    showAlert('Գիրքը հաջողությամբ վերադարձվեց համակարգ:', 'success');
  }
}

// Գրքի ավելացում 3 լեզվով
document.getElementById('addBookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  loadBooks();

  const newBook = {
    id: Date.now().toString(),
    title: {
      hy: document.getElementById('title_hy').value.trim(),
      en: document.getElementById('title_en').value.trim(),
      ru: document.getElementById('title_ru').value.trim()
    },
    author: {
      hy: document.getElementById('author_hy').value.trim(),
      en: document.getElementById('author_en').value.trim(),
      ru: document.getElementById('author_ru').value.trim()
    },
    year: document.getElementById('bookYear').value ? parseInt(document.getElementById('bookYear').value) : '',
    cover: document.getElementById('bookCover').value.trim() || 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    status: 'Available',
    borrower: '',
    borrowDate: '',
    dueDate: ''
  };

  books.push(newBook);
  saveBooks();
  e.target.reset();
  loadAdminData();
  showAlert('Գիրքը հաջողությամբ ավելացվեց բոլոր լեզուներով:', 'success');
});

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = 'auth.html';
}

// Init
checkAdminAuth();
loadAdminData();
