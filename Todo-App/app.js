// ===== DATA STORAGE =====
// We store tasks in localStorage so they PERSIST between page closes/opens.
// This is the "file storage" equivalent in a browser-based app.

const STORAGE_KEY = 'zain_todos';

let tasks = loadTasks();          // Load saved tasks on startup
let currentFilter = 'all';        // Track active filter tab
let editingId = null;             // Track which task is being edited

// ===== LOAD & SAVE =====

function loadTasks() {
  // Try to read tasks from localStorage
  // EDGE CASE: If localStorage is empty or has bad data, return empty array
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Could not load tasks:', e);
    return [];
  }
}

function saveTasks() {
  // Save tasks array to localStorage as a JSON string
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Could not save tasks:', e);
    alert('Storage error! Your tasks may not be saved.');
  }
}

// ===== ADD TASK =====

function addTask() {
  const input = document.getElementById('taskInput');
  const priority = document.getElementById('prioritySelect').value;
  const text = input.value.trim();

  // EDGE CASE: Don't add empty task
  if (!text) {
    input.focus();
    input.style.borderColor = '#f87171';
    setTimeout(() => (input.style.borderColor = ''), 1200);
    return;
  }

  // EDGE CASE: Don't add duplicate task (same text, case-insensitive)
  const duplicate = tasks.find(t => t.text.toLowerCase() === text.toLowerCase());
  if (duplicate) {
    input.style.borderColor = '#fbbf24';
    setTimeout(() => (input.style.borderColor = ''), 1200);
    alert('You already have this task!');
    return;
  }

  const newTask = {
    id: Date.now(),                           // Unique ID using timestamp
    text: text,
    priority: priority,
    completed: false,
    createdAt: new Date().toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    })
  };

  tasks.unshift(newTask);   // Add to beginning of list
  saveTasks();
  input.value = '';
  renderTasks();
}

// Allow pressing Enter to add task
document.getElementById('taskInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// ===== TOGGLE COMPLETE =====

function toggleComplete(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  saveTasks();
  renderTasks();
}

// ===== DELETE TASK =====

function deleteTask(id) {
  // EDGE CASE: Confirm before deleting so user doesn't lose task by accident
  if (!confirm('Delete this task?')) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// ===== EDIT TASK =====

function openEdit(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  editingId = id;
  document.getElementById('editInput').value = task.text;
  document.getElementById('editPriority').value = task.priority;
  document.getElementById('editModal').classList.remove('hidden');
  setTimeout(() => document.getElementById('editInput').focus(), 100);
}

function saveEdit() {
  const newText = document.getElementById('editInput').value.trim();
  const newPriority = document.getElementById('editPriority').value;

  // EDGE CASE: Don't save empty text
  if (!newText) {
    document.getElementById('editInput').style.borderColor = '#f87171';
    setTimeout(() => (document.getElementById('editInput').style.borderColor = ''), 1200);
    return;
  }

  tasks = tasks.map(t =>
    t.id === editingId ? { ...t, text: newText, priority: newPriority } : t
  );
  saveTasks();
  closeModal();
  renderTasks();
}

function closeModal() {
  document.getElementById('editModal').classList.add('hidden');
  editingId = null;
}

// Close modal when clicking the dark background
document.getElementById('editModal').addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

// ===== FILTER TASKS =====

function filterTasks(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderTasks();
}

// ===== CLEAR COMPLETED =====

function clearCompleted() {
  const doneCount = tasks.filter(t => t.completed).length;
  if (doneCount === 0) { alert('No completed tasks to clear!'); return; }
  if (!confirm(`Remove ${doneCount} completed task(s)?`)) return;
  tasks = tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
}

// ===== RENDER =====

function renderTasks() {
  const list = document.getElementById('taskList');
  const emptyState = document.getElementById('emptyState');
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  // Filter by tab
  let filtered = tasks;
  if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
  if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

  // Filter by search
  if (searchTerm) {
    filtered = filtered.filter(t => t.text.toLowerCase().includes(searchTerm));
  }

  // Sort: incomplete first, then by priority (high > medium > low)
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  filtered.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  // Show/hide empty state
  if (filtered.length === 0) {
    list.innerHTML = '';
    emptyState.classList.remove('hidden');
  } else {
    emptyState.classList.add('hidden');
    list.innerHTML = filtered.map(task => createTaskHTML(task)).join('');
  }

  updateStats();
}

// ===== CREATE TASK HTML =====

function createTaskHTML(task) {
  const priorityLabels = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' };

  return `
    <div class="task-card priority-${task.priority} ${task.completed ? 'completed' : ''}">
      <div
        class="task-check ${task.completed ? 'checked' : ''}"
        onclick="toggleComplete(${task.id})"
        title="Mark as ${task.completed ? 'active' : 'done'}"
      >${task.completed ? '✓' : ''}</div>

      <div class="task-text-wrap">
        <div class="task-text">${escapeHTML(task.text)}</div>
        <div class="task-meta">${priorityLabels[task.priority]} · Added ${task.createdAt}</div>
      </div>

      <div class="task-actions">
        <button class="icon-btn" onclick="openEdit(${task.id})" title="Edit">✏️</button>
        <button class="icon-btn del" onclick="deleteTask(${task.id})" title="Delete">🗑️</button>
      </div>
    </div>
  `;
}

// ===== UPDATE STATS =====

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;
  const active = total - done;

  document.getElementById('totalCount').textContent = total;
  document.getElementById('activeCount').textContent = active;
  document.getElementById('doneCount').textContent = done;
}

// ===== SECURITY: Escape HTML to prevent XSS =====
// EDGE CASE: User might type <script> tags in task text — this makes it safe.
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ===== INIT =====
renderTasks();  // Render tasks when page loads
