export default class View {
  _data;
  render(data, noTasks = false) {
    this._data = data;

    if (noTasks) {
      this._parentElement.innerHTML = `<div style=" text-align: center; margin: 100px 0; color: #00000070;">No matching tasks</div>`;
      return;
    }
    const markup = this._generateMarkup();
    if (this._parentElement.querySelector(".empty-state"))
      this._parentElement.querySelector(".empty-state").remove();

    this._parentElement.insertAdjacentHTML("afterbegin", markup);
    if (this._data.state === "completed") {
      this.lockTaskActions();
    }
  }
  update(data) {
    if (data.length === 0) return;

    const parentEl = this._parentElement.querySelector(
      `[data-id="${data.id}"]`,
    );

    this._data = data;

    const newMarkup = this._generateMarkup();
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll("*"));
    const curElements = [parentEl, ...parentEl.querySelectorAll("*")];

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue?.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) => {
          curEl.setAttribute(attr.name, attr.value);
        });
      }
    });
  }
  clear() {
    this._parentElement.innerHTML = "";
  }
  renderSpinner() {
    const markup = `<div class="spinner ">
        <svg>
          
          <use href="src/images/icons.svg#icon-loader"></use>
        </svg>
      </div>`;
    this.clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }
  addCompleteHandler(handler) {
    const containers = [".todayTasks", ".allTasks"];
    containers.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container) return;

      container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("complete")) return;

        const taskCard = e.target.closest(".task-card");
        const taskId = taskCard.dataset.id;

        handler(taskId);
        taskCard.querySelector(".complete").style.opacity = "0";
        taskCard.querySelector(".complete").style.pointerEvents = "none";
        taskCard.querySelector(".delete").style.opacity = "0";
        taskCard.querySelector(".delete").style.pointerEvents = "none";
        this.lockTaskActions();
      });
    });
  }
  lockTaskActions() {
    document.querySelectorAll(".complete").forEach((btn) => {
      if (btn.closest(".completed") || btn.closest(".overdue")) {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
      }
    });
    document.querySelectorAll(".delete").forEach((btn) => {
      if (btn.closest(".completed") || btn.closest(".overdue")) {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
      }
    });
  }
  deleteTaskHandler(handler) {
    const containers = [".todayTasks", ".allTasks"];
    containers.forEach((selector) => {
      const container = document.querySelector(selector);
      if (!container) return;
      container.addEventListener("click", (e) => {
        if (!e.target.classList.contains("delete")) return;

        const taskCard = e.target.closest(".task-card");
        const taskId = taskCard.dataset.id;
        handler(taskId);
      });
    });
  }
}
