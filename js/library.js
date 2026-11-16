const STORAGE_KEY = 'library_app_books_v1';
let books = [];
let activeFilter = 'all';
let currentSearchTerm = '';
let selectedBookId = null;

const addBookForm = document.getElementById('addBookForm');
const booksTableBody = document.getElementById('booksTableBody');
const emptyMessage = document.getElementById('emptyMessage');
const searchInput = document.getElementById('searchInput');
const alertBanner = document.getElementById('alertBanner');

const countTotal = document.getElementById('countTotal');
const countAvailable = document.getElementById('countAvailable');
const countBorrowed = document.getElementById('countBorrowed');
const countOverdue = document.getElementById('countOverdue');

const borrowModal = document.getElementById('borrowModal');
const borrowerNameInput = document.getElementById('borrowerNameInput');
const confirmBorrowBtn = document.getElementById('confirmBorrowBtn');

const editModal = document.getElementById('editModal');
const editTitleInput = document.getElementById('editTitleInput');
const editAuthorInput = document.getElementById('editAuthorInput');
const editYearInput = document.getElementById('editYearInput');
const confirmEditBtn = document.getElementById('confirmEditBtn');

function loadBooks() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try { books = JSON.parse(stored); } catch (e) { books = []; }
  } else {
    books = [];
  }
}

function saveBooks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function showAlert(message, type = 'error') {
  alertBanner.className = `alert alert-${type}`;
  alertBanner.textContent = message;
  alertBanner.style.display = 'block';
  setTimeout(() => { alertBanner.style.display = 'none'; }, 4000);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toISOString().split('T')[0];
}

function isOverdue(book) {
  if (book.status !== 'Borrowed' || !book.dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(book.dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}

addBookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('bookTitle').value.trim();
  const author = document.getElementById('bookAuthor').value.trim();
  const year = document.getElementById('bookYear').value.trim();

  if (!title || !author) {
    showAlert('Խնդրում ենք լրացնել վերնագիրը և հեղինակին:', 'error');
    return;
  }

  books.push({
    id: Date.now().toString(),
    title,
    author,
    year: year ? parseInt(year) : '',
    status: 'Available',
    borrower: '',
    borrowDate: '',
    dueDate: ''
  });

  saveBooks();
  renderApp();
  addBookForm.reset();
  showAlert('Գիրքը հաջողությամբ ավելացվեց:', 'success');
});

function openBorrowModal(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  if (book.status === 'Borrowed') {
    showAlert('Այս գիրքն արդեն վերցված է:', 'error');
    return;
  }
  selectedBookId = id;
  document.getElementById('borrowBookTitleName').textContent = `«${book.title}»`;
  borrowerNameInput.value = '';
  borrowModal.style.display = 'flex';
}

confirmBorrowBtn.addEventListener('click', () => {
  const name = borrowerNameInput.value.trim();
  if (!name) {
    showAlert('Վերցնողի անունը պարտադիր է:', 'error');
    return;
  }
  const book = books.find(b => b.id === selectedBookId);
  if (book) {
    const today = new Date();
    const due = new Date();
    due.setDate(today.getDate() + 14);

    book.status = 'Borrowed';
    book.borrower = name;
    book.borrowDate = today.toISOString();
    book.dueDate = due.toISOString();

    saveBooks();
    renderApp();
    closeModal('borrowModal');
    showAlert(`Գիրքը հաջողությամբ տրվեց ${name}-ին:`, 'success');
  }
});

function returnBook(id) {
  const book = books.find(b => b.id === id);
  if (book && book.status === 'Borrowed') {
    book.status = 'Available';
    book.borrower = '';
    book.borrowDate = '';
    book.dueDate = '';
    saveBooks();
    renderApp();
    showAlert('Գիրքը հաջողությամբ վերադարձվեց:', 'success');
  }
}

function deleteBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  if (book.status === 'Borrowed') {
    showAlert('Վերցված գիրքը հնարավոր չէ ջնջել:', 'error');
    return;
  }
  if (confirm(`Վստա՞հ եք, որ ցանկանում եք ջնջել «${book.title}» գիրքը:`)) {
    books = books.filter(b => b.id !== id);
    saveBooks();
    renderApp();
    showAlert('Գիրքը ջնջվեց:', 'success');
  }
}

function openEditModal(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  selectedBookId = id;
  editTitleInput.value = book.title;
  editAuthorInput.value = book.author;
  editYearInput.value = book.year || '';
  editModal.style.display = 'flex';
}

confirmEditBtn.addEventListener('click', () => {
  const title = editTitleInput.value.trim();
  const author = editAuthorInput.value.trim();
  const year = editYearInput.value.trim();

  if (!title || !author) {
    showAlert('Վերնագիրն ու հեղինակը չեն կարող դատարկ լինել:', 'error');
    return;
  }
  const book = books.find(b => b.id === selectedBookId);
  if (book) {
    book.title = title;
    book.author = author;
    book.year = year ? parseInt(year) : '';
    saveBooks();
    renderApp();
    closeModal('editModal');
    showAlert('Գրքի տվյալները թարմացվեցին:', 'success');
  }
});

function toggleSimulateOverdue(id) {
  const book = books.find(b => b.id === id);
  if (book && book.status === 'Borrowed') {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 15);
    book.dueDate = pastDate.toISOString();
    saveBooks();
    renderApp();
    showAlert('Գրքի ժամկետը սիմուլյացվեց որպես ժամկետանց:', 'warning');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}

function updateCounters() {
  countTotal.textContent = books.length;
  countAvailable.textContent = books.filter(b => b.status === 'Available').length;
  countBorrowed.textContent = books.filter(b => b.status === 'Borrowed').length;
  countOverdue.textContent = books.filter(b => isOverdue(b)).length;
}

function renderApp() {
  updateCounters();
  booksTableBody.innerHTML = '';

  const filteredBooks = books.filter(book => {
    const matchesFilter = 
      activeFilter === 'all' ? true :
      activeFilter === 'available' ? book.status === 'Available' :
      activeFilter === 'borrowed' ? book.status === 'Borrowed' : true;

    const term = currentSearchTerm.toLowerCase();
    const matchesSearch = book.title.toLowerCase().includes(term) || book.author.toLowerCase().includes(term);

    return matchesFilter && matchesSearch;
  });

  if (filteredBooks.length === 0) {
    emptyMessage.style.display = 'block';
    return;
  } else {
    emptyMessage.style.display = 'none';
  }

  filteredBooks.forEach(book => {
    const tr = document.createElement('tr');
    const overdue = isOverdue(book);
    if (overdue) tr.classList.add('overdue-row');

    let statusBadgeClass = 'badge-available';
    let statusText = 'Available';
    if (book.status === 'Borrowed') {
      if (overdue) {
        statusBadgeClass = 'badge-overdue';
        statusText = 'Overdue (Ժամկետանց)';
      } else {
        statusBadgeClass = 'badge-borrowed';
        statusText = 'Borrowed';
      }
    }

    let borrowerInfo = '-';
    if (book.status === 'Borrowed') {
      borrowerInfo = `
        <div><strong>${book.borrower}</strong></div>
        <div style="font-size:0.75rem; color: var(--text-muted);">
          Տրված: ${formatDate(book.borrowDate)}<br>
          Վերադարձ: ${formatDate(book.dueDate)}
        </div>
      `;
    }

    tr.innerHTML = `
      <td><strong>${book.title}</strong></td>
      <td>${book.author}</td>
      <td>${book.year || '-'}</td>
      <td><span class="status-badge ${statusBadgeClass}">${statusText}</span></td>
      <td>${borrowerInfo}</td>
      <td>
        <div class="action-group">
          ${book.status === 'Available' 
            ? `<button class="btn-success" onclick="openBorrowModal('${book.id}')">Borrow</button>` 
            : `<button class="btn-warning" onclick="returnBook('${book.id}')">Return</button>
               <button class="btn-secondary" style="font-size:0.75rem; padding:6px 10px;" onclick="toggleSimulateOverdue('${book.id}')" title="Test Overdue">Ժամկետանց</button>`
          }
          <button class="btn-primary" onclick="openEditModal('${book.id}')">Edit</button>
          <button class="btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
        </div>
      </td>
    `;
    booksTableBody.appendChild(tr);
  });
}

searchInput.addEventListener('input', (e) => {
  currentSearchTerm = e.target.value;
  renderApp();
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    activeFilter = e.target.dataset.filter;
    renderApp();
  });
});

loadBooks();
renderApp();
