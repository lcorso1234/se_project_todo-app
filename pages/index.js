import { v4 as uuidv4 } from "https://jspm.dev/uuid";

import { initialTodos, validationConfig } from "../utils/constants.js";
import Todo from "../components/Todo.js";
import formValidator from "../components/FormValidator.js";
import Section from "../components/Section.js";
import PopupWithForm from "../components/PopupWithForm.js";
import TodoCounter from "../components/TodoCounter.js";

const addTodoForm = document.forms["add-todo-form"];
const todosList = document.querySelector(".todos__list");

const newTodoValidator = new formValidator(validationConfig, addTodoForm);
newTodoValidator.enableValidation();

// Todo Counter
const todoCounter = new TodoCounter(initialTodos, ".counter__text");

function handleCheck(completed) {
  todoCounter.updateCompleted(completed);
}

function handleDelete(completed) {
  todoCounter.updateTotal(false);
  if (completed) {
    todoCounter.updateCompleted(false);
  }
}

// Generates a todo element from data
const generateTodo = (data) => {
  const todo = new Todo(data, "#todo-template", handleCheck, handleDelete);
  return todo.getView();
};

// Adds new todo to DOM
const todoSection = new Section({
  items: initialTodos,
  renderer: (data) => {
    const todoElement = generateTodo(data);
    todoSection.addItem(todoElement);
  },
  containerSelector: ".todos__list",
});

todoSection.renderItems();

const renderTodo = (data) => {
  const todoElement = generateTodo(data);
  todoSection.addItem(todoElement);
};

// Instantiate and set up popup with form
const addTodoPopup = new PopupWithForm({
  popupSelector: "#add-todo-popup",
  handleFormSubmit: (formValues) => {
    const { name, date } = formValues;

    const dateObj = new Date(date);
    dateObj.setMinutes(dateObj.getMinutes() + dateObj.getTimezoneOffset());

    const newTodo = {
      name,
      date: dateObj,
      completed: false, // New todos are not completed initially
      id: uuidv4(),
    };

    renderTodo(newTodo);
    todoCounter.updateTotal(true); // Update counter when adding new
    newTodoValidator.resetValidation();
  },
  close() {
    this._popupElement.classList.remove("popup_visible");
    document.removeEventListener("keydown", this._handleEscClose);
  },
});

addTodoPopup.setEventListeners();

const addTodoButton = document.querySelector(".button_action_add");
addTodoButton.addEventListener("click", () => addTodoPopup.open());
