const optionContainer = document.getElementById("todo-options");
const options = document.querySelectorAll(".todo-option");
const form = document.getElementById("todo-form");
const tasksContainer = document.getElementById("tasks-list");
const eraseButton = document.getElementById("erase-button");

var tasks = [];
var task;
var complete = false;
var currentOption = "all";

const syncStorage = () => {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const fragment = document.createDocumentFragment();

// FUNCTIONS
const addTask = (task) => {
  const taskObj = {
    id: (Math.random() + 1).toString(5).substring(2),
    task: task,
    isCompleted: false,
  };
  tasks = [...tasks, taskObj];
  loadContents(tasks);
  syncStorage();
};

const filterActiveTasks = () => {
  complete = false;
  loadContents(tasks.filter((task) => !task.isCompleted));
};

const filterCompletedTasks = () => {
  complete = true;
  loadContents(tasks.filter((task) => task.isCompleted));
};

const loadContentsForCurrentOption = () => {
  currentOption == "all"
    ? loadContents(tasks)
    : currentOption == "active"
    ? filterActiveTasks()
    : filterCompletedTasks();
};

const loadContents = (tasks) => {
  tasksContainer.textContent = "";

  tasks.forEach((taskObj) => {
    const { id, task, isCompleted } = taskObj;

    const li = document.createElement("LI");
    li.classList.add("task");

    const div = document.createElement("DIV");
    div.classList.add("task-check");
    div.innerHTML = `
            <input class="task-input" type="checkbox" id="${id}">
            <p  class="task-label"  for="${id}">${task}</p>
        `;
    if (isCompleted) div.firstElementChild.checked = true;
    li.appendChild(div);

    const i = document.createElement("I");
    if (complete) {
      i.classList.add("task-erase", "ri-delete-bin-line");
      eraseButton.classList.add("erase-button--active");
    } else {
      i.classList.remove("task-erase", "ri-delete-bin-line");
      eraseButton.classList.remove("erase-button--active");
    }
    i.dataset.id = id;
    li.appendChild(i);

    fragment.appendChild(li);
  });
  tasksContainer.appendChild(fragment);
};

// EVENT LISTENERS
optionContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("todo-option")) {
    options.forEach((options) =>
      options.classList.remove("todo-option--active")
    );
    e.target.classList.add("todo-option--active");
    if (e.target.id == "all") {
      complete = false;
      form.classList.remove("todo-form--hidden");
      form.classList.add("todo-form");
      currentOption = "all";
    } else if (e.target.id == "active") {
      form.classList.remove("todo-form--hidden");
      form.classList.add("todo-form");
      currentOption = "active";
    } else if (e.target.id == "complete") {
      form.classList.remove("todo-form");
      form.classList.add("todo-form--hidden");
      currentOption = "complete";
    }
    loadContentsForCurrentOption();
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  task = form.task.value;

  if (task.trim().length > 0) {
    addTask(task);

    options.forEach((option) => {
      option.classList.remove("todo-option--active");
      if (
        option.id == "all" &&
        !option.classList.contains("todo-option--active")
      ) {
        option.classList.add("todo-option--active");
        complete = false;
        loadContents(tasks);
      }
    });
    form.reset();
  }
});

tasksContainer.addEventListener("click", (e) => {
  if (e.target.checked) {
    tasks.forEach((task) => {
      if (task.id == e.target.id) task.isCompleted = true;
    });
  } else {
    tasks.forEach((task) => {
      if (task.id == e.target.id) task.isCompleted = false;
    });
  }

  loadContentsForCurrentOption();

  if (e.target.classList.contains("task-erase")) {
    tasks = tasks.filter((task) => task.id !== e.target.dataset.id);
    if (tasks.filter((task) => task.is).length < 2) {
      eraseButton.classList.remove("erase-button--active");
    }
    filterCompletedTasks(tasks);
  }
  syncStorage();
});

eraseButton.addEventListener("click", () => {
  tasks = tasks.filter((task) => !task.isCompleted);
  eraseButton.classList.remove("erase-button--active");
  filterCompletedTasks(tasks);
  syncStorage();
});

document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  loadContents(tasks);
});
