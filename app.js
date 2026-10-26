const taskInput = document.getElementById('new-task'); //Add a new task.
const addButton = document.getElementsByTagName('button')[0];
const incompleteTaskHolder = document.getElementById('incompleteTasks');
const completedTasksHolder = document.getElementById('completed-tasks');

const createNewTaskElement = function (taskString) {
  const listItem = document.createElement('li');

  const checkBox = document.createElement('input');
  const label = document.createElement('label');
  const editInput = document.createElement('input');
  const editButton = document.createElement('button');
  const deleteButton = document.createElement('button');
  const deleteButtonImg = document.createElement('img');

  label.innerText = taskString;
  label.className = 'task';

  checkBox.type = 'checkbox';
  editInput.type = 'text';
  editInput.className = 'task';
  editButton.innerText = 'Edit';
  editButton.className = 'edit';
  deleteButton.className = 'delete';
  deleteButtonImg.src = './remove.svg';
  deleteButton.appendChild(deleteButtonImg);

  listItem.append(checkBox, label, editInput, editButton, deleteButton);
  return listItem;
};

const addTask = function () {
  const taskText = taskInput.value.trim();
  if (!taskText) return;
  const listItem = createNewTaskElement(taskText);

  incompleteTaskHolder.appendChild(listItem);
  bindTaskEvents(listItem, taskCompleted);

  taskInput.value = '';
};

const editTask = function () {
  const listItem = this.parentNode;
  const editInput = listItem.querySelector('input[type=text]');
  const label = listItem.querySelector('label');
  const editButton = listItem.querySelector('.edit');
  const isEditMode = listItem.classList.contains('editMode');

  if (isEditMode) {
    const editedText = editInput.value.trim();
    if (!editedText) return;

    label.innerText = editedText;
    editButton.innerText = 'Edit';
  } else {
    editInput.value = label.innerText;
    editButton.innerText = 'Save';
  }

  listItem.classList.toggle('editMode');
};

const deleteTask = function () {
  this.parentNode.remove();
};

const moveTask = function (targetList, nextHandler) {
  const listItem = this.parentNode;
  targetList.appendChild(listItem);
  bindTaskEvents(listItem, nextHandler);
};

const taskCompleted = function () {
  moveTask.call(this, completedTasksHolder, taskIncomplete);
};

const taskIncomplete = function () {
  moveTask.call(this, incompleteTaskHolder, taskCompleted);
};

addButton.addEventListener('click', addTask);

const bindTaskEvents = function (taskListItem, checkBoxEventHandler) {
  const checkBox = taskListItem.querySelector('input[type=checkbox]');
  const editButton = taskListItem.querySelector('button.edit');
  const deleteButton = taskListItem.querySelector('button.delete');

  // Reassign handlers to avoid duplicate event listeners when tasks move between lists.
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
  checkBox.onchange = checkBoxEventHandler;
};

const initializeTasks = function (taskList, checkBoxHandler) {
  const tasks = Array.from(taskList.children);

  tasks.forEach((task) => {
    bindTaskEvents(task, checkBoxHandler);
  });
};

initializeTasks(incompleteTaskHolder, taskCompleted);
initializeTasks(completedTasksHolder, taskIncomplete);
