// === DOM ELEMENTLERİ ===
const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const clearCompletedButton = document.getElementById('clearCompletedButton');
const remainingCountSpan = document.getElementById('remaining-count');
const filterButtons = document.querySelectorAll('.filters button');
const successMessage = document.getElementById('success-message');

// === HOŞGELDİN MESAJI ===
function showWelcomeMessage() {
    const welcomeDiv = document.createElement('div');
    welcomeDiv.className = 'welcome-alert';
    welcomeDiv.textContent = 'Görev takip uygulamasına hoş geldiniz!';
    document.body.appendChild(welcomeDiv);
    setTimeout(() => {
        welcomeDiv.remove();
    }, 3000);
}

// === YARDIMCI FONKSİYONLAR ===
const getTasks = () => JSON.parse(localStorage.getItem('tasks')) || [];
const saveTasks = (tasks) => localStorage.setItem('tasks', JSON.stringify(tasks));

function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2500);
}

function updateRemainingCount() {
    const tasks = getTasks();
    const remaining = tasks.filter(task => !task.completed).length;
    remainingCountSpan.textContent = remaining;
}

// === GÖREVLERİ GÖRÜNTÜLE ===
function renderTasks(filter = 'all') {
    const allTasks = getTasks();
    let filteredTasks = allTasks;
    if (filter === 'active') {
        filteredTasks = allTasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = allTasks.filter(task => task.completed);
    }
    taskList.innerHTML = '';
    if (filteredTasks.length === 0) {
        const emptyMsg = document.createElement('li');
        emptyMsg.textContent = 'Henüz görev yok, ekleyin!';
        emptyMsg.style.textAlign = 'center';
        emptyMsg.style.color = '#888';
        emptyMsg.style.fontStyle = 'italic';
        emptyMsg.style.padding = '1.2rem 0';
        emptyMsg.style.background = 'none';
        emptyMsg.style.boxShadow = 'none';
        emptyMsg.style.listStyle = 'none';
        taskList.appendChild(emptyMsg);
        updateRemainingCount();
        return;
    }
    filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');
        li.style.display = 'flex';
        li.style.alignItems = 'center';
        li.style.justifyContent = 'space-between';
        li.style.background = '#f8f9fa';
        li.style.marginBottom = '0.7rem';
        li.style.padding = '0.8rem 1rem';
        li.style.borderRadius = '0.6rem';
        li.style.boxShadow = '0 2px 6px rgba(0,0,0,0.04)';
        li.style.transition = 'background-color 0.2s';

        const span = document.createElement('span');
        span.textContent = task.text;
        span.style.flex = '1';
        span.style.fontSize = '1.05rem';
        if (task.completed) {
            span.style.textDecoration = 'line-through';
            span.style.color = '#999';
        }

        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '0.5rem';

        const completeBtn = document.createElement('button');
        completeBtn.textContent = '✔️';
        completeBtn.title = 'Completed';
        completeBtn.style.background = 'transparent';
        completeBtn.style.border = 'none';
        completeBtn.style.fontSize = '1.2rem';
        completeBtn.style.cursor = 'pointer';
        completeBtn.addEventListener('click', () => toggleComplete(index, filter));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete';
        deleteBtn.style.background = 'transparent';
        deleteBtn.style.border = 'none';
        deleteBtn.style.fontSize = '1.2rem';
        deleteBtn.style.cursor = 'pointer';
        deleteBtn.addEventListener('click', () => removeTaskWithAnimation(li, index, filter));

        btnGroup.appendChild(completeBtn);
        btnGroup.appendChild(deleteBtn);
        li.appendChild(span);
        li.appendChild(btnGroup);
        taskList.appendChild(li);
    });
    updateRemainingCount();
}

function removeTaskWithAnimation(li, index, filter) {
    li.classList.add('removing');
    setTimeout(() => {
        deleteTask(index, filter);
    }, 400); // fadeOutTask animasyon süresiyle aynı
}

// === GÖREV EKLE ===
function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    const tasks = getTasks();
    tasks.push({ text, completed: false });
    saveTasks(tasks);
    taskInput.value = '';
    renderTasks(getActiveFilter());
    showSuccess('Görev başarıyla eklendi!');
}

// === GÖREV SİL ===
function deleteTask(index, filter) {
    const allTasks = getTasks();
    let filteredTasks = allTasks;
    if (filter === 'active') {
        filteredTasks = allTasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = allTasks.filter(task => task.completed);
    }
    const taskToDelete = filteredTasks[index];
    const realIndex = allTasks.findIndex(t => t.text === taskToDelete.text && t.completed === taskToDelete.completed);
    allTasks.splice(realIndex, 1);
    saveTasks(allTasks);
    renderTasks(getActiveFilter());
}

// === GÖREV TAMAMLANDI ===
function toggleComplete(index, filter) {
    const allTasks = getTasks();
    let filteredTasks = allTasks;
    if (filter === 'active') {
        filteredTasks = allTasks.filter(task => !task.completed);
    } else if (filter === 'completed') {
        filteredTasks = allTasks.filter(task => task.completed);
    }
    const taskToToggle = filteredTasks[index];
    const realIndex = allTasks.findIndex(t => t.text === taskToToggle.text && t.completed === taskToToggle.completed);
    allTasks[realIndex].completed = !allTasks[realIndex].completed;
    saveTasks(allTasks);
    renderTasks(getActiveFilter());
}

// === TAMAMLANANLARI TEMİZLE ===
function clearCompleted() {
    const tasks = getTasks().filter(task => !task.completed);
    saveTasks(tasks);
    renderTasks(getActiveFilter());
}

// === FİLTRELER ===
function setFilter(filter) {
    filterButtons.forEach(btn => btn.classList.remove('filter-btn-active'));
    const activeBtn = document.querySelector(`[data-filter="${filter}"]`);
    if (activeBtn) activeBtn.classList.add('filter-btn-active');
    renderTasks(filter);
}

function getActiveFilter() {
    const activeBtn = document.querySelector('.filter-btn-active');
    return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
}

// === OLAYLARI BAŞLAT ===
function setupEvents() {
    addTaskButton.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') addTask();
    });
    clearCompletedButton.addEventListener('click', clearCompleted);
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            setFilter(filter);
        });
    });
}

// === UYGULAMAYI BAŞLAT ===
document.addEventListener('DOMContentLoaded', () => {
    setupEvents();
    renderTasks();
    showWelcomeMessage();
});