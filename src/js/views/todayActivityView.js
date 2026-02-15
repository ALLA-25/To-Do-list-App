import View from "./view.js";
import emptyStateImg from "url:../../images/photo_2025-08-24_17-57-31-removebg-preview.png";
class TodaysActivityView extends View {
  _parentElement = document.querySelector(".todayTasks");
  constructor() {
    super();
    this._initialMarkup();
  }

  _generateMarkup() {
    return `  <div class="task-card ${this._data.state
      .split(" ")
      .join("")}" data-id="${this._data.id}">
              <div class="task-title">
              <ul>
              <li class="state">  ${
                this._data.state.charAt(0).toUpperCase() +
                this._data.state.slice(1)
              }</li>
              <li><i class="fa-solid fa-circle-check  complete"
              ></i></li>
              <li><i class="fa-solid fa-trash delete"></i></li>
              
               </ul>
              </div>
              <div class="task-desc">${
                this._data.title
              }<br/> <span class="task-tag">#${this._data.tag}</span></div>
              
              </div>`;
  }
  _initialMarkup() {
    const markup = `<div class="empty-state">
            <img
              class="empty-state-image"
              src="${emptyStateImg}"
              alt=""
            />
            <p class="empty-state-text">
              No tasks scheduled yet.<button class="add-task-openBtn">
                Add your first one!
              </button>
            </p>
          </div>`;
    this._parentElement.innerHTML = "";
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
}
export default new TodaysActivityView();
