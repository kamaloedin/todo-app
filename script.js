const todos = [];
const RENDER_EVENT = 'render_todo';
const SAVED_EVENT = 'save_todo';
const STORAGE_KEY = 'todo_web'

/**
 * makeTodo
 * submit listener
 * saveData
 * loadData
 */

function checkStorage() {
    if (typeof(Storage) === undefined) {
        alert("Your browser doesn't support storages");
        return false;
    } 
    return true;
}

function addTodo() {
    const activity = document.getElementById('inputTodoList').value;
    const deadline = document.getElementById('inputDate').value;

    const newId = generateId();
    const todoObject = generateTodoObject(newId, activity, deadline, false);

    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date(); 
}

function generateTodoObject(id, activity, deadline, isComplete) {
    return {
        id,
        activity,
        deadline,
        isComplete
    }
}

function makeTodo(todoObject) {
    const activityText = document.createElement('h3');
    activityText.innerText = todoObject.activity;

    const deadlineText = document.createElement('p');
    deadlineText.innerText = todoObject.deadline;

    const textContainer = document.createElement('div');
    textContainer.classList.add('text_container')
    textContainer.append(activityText, deadlineText);

    const completeButton = document.createElement('button');
    completeButton.innerText = 'Complete';
    completeButton.classList.add('green');
    completeButton.addEventListener('click', function() {
        addToCompleted(todoObject.id);
    })
    
    const uncompleteButton = document.createElement('button');
    uncompleteButton.innerText = 'Undo';
    uncompleteButton.classList.add('black');
    uncompleteButton.addEventListener('click', function() {
        undoTodo(todoObject.id);
    })

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove';
    removeButton.classList.add('red');
    removeButton.addEventListener('click', function() {
        removeTodo(todoObject.id);
    })

    const buttonGroup = document.createElement('div');
    buttonGroup.classList.add('button_group')
    const container = document.createElement('div');
    container.classList.add('todo_list')

    if (todoObject.isComplete) {
        buttonGroup.append(uncompleteButton, removeButton);
    } else {
        buttonGroup.append(completeButton, removeButton);
    }

    container.append(textContainer, buttonGroup);
    return container;
}

function addToCompleted(todoId) {
    const targetedTodo = findTodoById(todoId);

    if (targetedTodo === null) return;

    targetedTodo.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTodo(todoId) {
    const targetedTodo = findTodoById(todoId);

    if (targetedTodo === null) return;

    targetedTodo.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTodo(todoId) {
    const targetedTodo = findTodoByIndex(todoId);

    if (targetedTodo === -1) return;

    todos.splice(targetedTodo,1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodoById(todoId) {
    for (const todo of todos) {
        if(todo.id === todoId) {
            return todo;
        }
    }
    return null;
}

function findTodoByIndex(todoId) {
    for(const index in todos) {
        if (todos[index].id === todoId){
            return index;
        }
    }
    return -1;
}

function saveData() {
    if (checkStorage()) {
        const parsed = JSON.stringify(todos);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if (data !== null) {
        for (const todo of todos) {
            todos.push(todo);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
    const createForm = document.getElementById('inputForm');
    createForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    })

    if (checkStorage()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function() {
    const completedList = document.getElementById('completedList');
    completedList.innerHTML = '';

    const uncompletedList = document.getElementById('uncompletedList');
    uncompletedList.innerHTML = '';

    for (const todo of todos) {
        const todoList = makeTodo(todo);
        if (todo.isComplete) {
            completedList.append(todoList);
        } else {
            uncompletedList.append(todoList);
        }
    }
});

