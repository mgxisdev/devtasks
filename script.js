let tasks = JSON.parse(localStorage.getItem('devTasks')) || [];

const taskInput = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const taskList = document.getElementById('taskList');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

function init() {
    renderTasks();
    updateStats();
    
    // Enter para adicionar tarefa
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    console.log('📝 DevTasks Iniciado!');
    console.log('🚀 Organize seus estudos de programação!');
}


function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    
    if (text === '') {
        alert('Por favor, digite uma tarefa!');
        return;
    }
    
    const newTask = {
        id: Date.now(),
        text: text,
        category: category,
        completed: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    };
    
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    
    // Limpar input
    taskInput.value = '';
    taskInput.focus();
}


function addSuggestedTask(text) {
    taskInput.value = text;
    categorySelect.value = 'projeto';
    addTask();
}


function renderTasks(filter = 'all') {
    let filteredTasks = tasks;
    
    if (filter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    }
    
    taskList.innerHTML = '';
    
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <div class="task-item" style="text-align: center; opacity: 0.7;">
                Nenhuma tarefa ${filter !== 'all' ? filter : 'encontrada'}
            </div>
        `;
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = `task-item ${task.completed ? 'completed' : ''}`;
        taskElement.setAttribute('data-category', task.category);
        
        taskElement.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})">
            </div>
            <div class="task-content">
                <div class="task-text">${task.text}</div>
                <div class="task-category">${task.category} • ${task.createdAt}</div>
            </div>
            <button class="task-delete" onclick="deleteTask(${task.id})">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        taskList.appendChild(taskElement);
    });
}


function toggleTask(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    saveTasks();
    renderTasks();
    updateStats();
}


function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateStats();
    }
}


function filterTasks(filter) {
    // Atualizar botões ativos
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderTasks(filter);
}


function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    
    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}


function saveTasks() {
    localStorage.setItem('devTasks', JSON.stringify(tasks));
}

// Iniciar quando a página carregar
document.addEventListener('DOMContentLoaded', init);