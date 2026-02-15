import { state } from "../modal.js";
import View from "./view.js";
class ReminderView extends View {
  _parentElement = document.querySelector(".reminder-modal-tasks");
  _overlay = document.querySelector(".overlay");
  _closeBtn = document.querySelector(".reminder-modal-closeBtn");
  _openBtn = document.querySelectorAll(".reminder-openBtn");
  constructor() {
    super();
    this._initialMarkup();
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
  }
  _initialMarkup() {
    const markup = `<div class="empty-state">
          
            <p class="">
             You have no reminders yet
            </p>
          </div>`;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  _generateMarkup() {
    return `   <div class="task-card reminder">
              <div class="task-title">
                <i class="fa-regular fa-clock"></i>${this._data.reminder}
              </div>
              <div class="task-desc">${this._data.title}</div>
            </div>`;
  }
  toggleWindow() {
    document.querySelector(".reminder-modal").classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }

  _addHandlerOpenWindow() {
    this._openBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.toggleWindow();
        btn.querySelector("i").classList.remove("active");
      });
    });
  }
  _addHandlerCloseWindow() {
    this._closeBtn.addEventListener("click", () => {
      this.toggleWindow();
    });
  }

  _addReminderHandler(handler, isNew = true) {
    const isEmpty = handler();
    if (!isEmpty && isNew) {
      this._openBtn.forEach((btn) => {
        btn.querySelector("i").classList.add("active");
      });
    }
  }
}
export default new ReminderView();
