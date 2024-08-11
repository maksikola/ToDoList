"use strict";

let tasksPersonal = [];
let tasksProfessional = [];
let activeCategory = "personal";

const page = {
  header: {
    personalButton: document.getElementById("personal"),
    professionalButton: document.getElementById("professional"),
    navActivePersonal: document.querySelector(".personal__span"),
    navActiveProfessional: document.querySelector(".professional__span"),
  },
  main: {
    mainForm: document.querySelector(".main__form"),
    mainInput: document.querySelector(".main__input"),
    taskList: document.querySelector(".list__task"),
    clearCompleted: document.querySelector(".clear__complited"),
  },
};

function loadTasks() {
  const savedTasksPersonal = localStorage.getItem("tasksPersonal");
  const savedTasksProfessional = localStorage.getItem("tasksProfessional");
  if (savedTasksPersonal) {
    tasksPersonal = JSON.parse(savedTasksPersonal);
  }
  if (savedTasksProfessional) {
    tasksProfessional = JSON.parse(savedTasksProfessional);
  }
}

function saveTasks() {
  localStorage.setItem("tasksPersonal", JSON.stringify(tasksPersonal));
  localStorage.setItem("tasksProfessional", JSON.stringify(tasksProfessional));
}

function renderTasks() {
  const tasks = activeCategory === "personal" ? tasksPersonal : tasksProfessional;
  
  page.main.taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskItem = document.createElement("div");
    taskItem.classList.add("list__task");
    if (task.completed) {
      taskItem.classList.add("list__task--completed");
    }
    taskItem.innerHTML = `
      <button class="list__button" onclick="toggleTaskCompletion(${task.id})">
        <svg width="42" height="42">
          <use href="./symbol-defs.svg#${task.completed ? 'icon-completed' : 'icon-empty'}"></use>
        </svg>
      </button>
      <p class="list__text">${task.text}</p>
      <button class="list__remove" onclick="deleteTask(${task.id})">
        <svg width="20" height="24">
          <use href="./symbol-defs.svg#icon-delete"></use>
        </svg>
      </button>
    `;
    page.main.taskList.appendChild(taskItem);
  });

  if (tasks.length > 0) {
    page.main.clearCompleted.style.display = "flex";
  } else {
    page.main.clearCompleted.style.display = "none";
  }
}

function addTask() {
  const taskText = page.main.mainInput.value.trim();
  if (taskText !== "") {
    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };
    if (activeCategory === "personal") {
      tasksPersonal.push(newTask);
    } else {
      tasksProfessional.push(newTask);
    }
    saveTasks();
    renderTasks();
    page.main.mainInput.value = "";
  }
}

function deleteTask(taskId) {
  if (activeCategory === "personal") {
    tasksPersonal = tasksPersonal.filter(task => task.id !== taskId);
  } else {
    tasksProfessional = tasksProfessional.filter(task => task.id !== taskId);
  }
  saveTasks();
  renderTasks();
}

function toggleTaskCompletion(taskId) {
  const tasks = activeCategory === "personal" ? tasksPersonal : tasksProfessional;
  const task = tasks.find(task => task.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

function clearAllTasks() {
  if (activeCategory === "personal") {
    tasksPersonal = [];
  } else {
    tasksProfessional = [];
  }
  saveTasks();
  renderTasks();
}

function setActive(button) {
  if (button === page.header.personalButton) {
    page.header.navActivePersonal.classList.add("nav__active--personal");
    page.header.navActiveProfessional.classList.remove("nav__active--professional");
    activeCategory = "personal";
  } else {
    page.header.navActiveProfessional.classList.add("nav__active--professional");
    page.header.navActivePersonal.classList.remove("nav__active--personal");
    activeCategory = "professional";
  }
  renderTasks();
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  renderTasks();
  
  page.header.personalButton.addEventListener("click", () => {
    setActive(page.header.personalButton);
  });
  
  page.header.professionalButton.addEventListener("click", () => {
    setActive(page.header.professionalButton);
  });
  
  page.main.mainForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addTask();
  });
  
  page.main.clearCompleted.addEventListener("click", clearAllTasks);
});