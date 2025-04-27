import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import formValidator from "../components/FormValidator.js";

const addTodoButton = document.querySelector(".button_action_add");
const addTodoPopup = document.querySelector("#add-todo-popup");
const addTodoForm = document.forms["add-todo-form"];
const addTodoCloseBtn = addTodoPopup.querySelector(".popup__close");
const todoTemplate = document.querySelector("#todo-template");
const todosList = document.querySelector(".todos__list");

const openModal = (modal) => {
  modal.classList.add("popup_visible");
};

const closeModal = (modal) => {
  modal.classList.remove("popup_visible");
};

// Handles the creation of a Todo element
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template");
  return todo.getView();
};

// Renders the todo onto the page
const renderTodo = (data) => {
  const todoElement = generateTodo(data);
  todosList.append(todoElement);
};

addTodoButton.addEventListener("click", () => {
  openModal(addTodoPopup);
});

addTodoCloseBtn.addEventListener("click", () => {
  closeModal(addTodoPopup);
});

addTodoForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const name = evt.target.name.value;
  const dateInput = evt.target.date.value;

  const date = new Date(dateInput);
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());

  const id = uuidv4();

  const values = { name, date, id };
  renderTodo(values); // using renderTodo to avoid duplication
  newTodoValidator.resetValidation();
  closeModal(addTodoPopup);
});

// Render initial todos
initialTodos.forEach((item) => {
  renderTodo(item);
});

const newTodoValidator = new formValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();
