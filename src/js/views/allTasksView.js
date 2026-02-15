import View from "./view.js";
import emptyStateImg from "url:../../images/photo_2025-08-24_17-57-31-removebg-preview.png";
class AllTasksView extends View {
  _parentElement = document.querySelector(".allTasks");
  _dropdown = document.querySelector(".dropdownn");
  _search = document.querySelector(".search");
  _categoryRadios = document.querySelectorAll(`input[type="radio"] `);

  constructor() {
    super();
    this._initialMarkup();
    this.filterToggleHandler();
  }
  _generateMarkup() {
    if (this._data.length === 0) return;

    if (!this._data.state) this._data.state = "today";
    return `  <div class="task-card ${this._data.state
      .split(" ")
      .join("")}" data-id="${this._data.id}">
              <div class="task-title">
              <ul>
              <li class="state">  ${
                this._data.state.charAt(0).toUpperCase() +
                this._data.state.slice(1)
              }</li>
              <li><i class="fa-solid fa-circle-check complete"></i></li>
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
  filterToggleHandler() {
    document.querySelector(".filter").addEventListener("click", (e) => {
      this._dropdown.classList.toggle("hidden");
    });
  }
  categoryChangeHandler(handler) {
    this._categoryRadios.forEach((r) =>
      r.addEventListener("change", () => {
        if (r.checked) {
          handler(r.closest(".option").textContent.trim());
        }
      }),
    );
  }
  getQuery() {
    const query = this._search.querySelector("input").value;
    this.#clearInputField();
    console.log(query);
    return query;
  }

  #clearInputField() {
    this._search.querySelector("input").value = "";
  }
  handleSearch(handler) {
    this._search.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }
}
export default new AllTasksView();
