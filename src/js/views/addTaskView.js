class AddTaskView {
  _parentElement = document.querySelector(".add-task-form");
  _window = document.querySelector(".add-task");
  _overlay = document.querySelector(".overlay");
  _closeBtn = document.querySelector(".add-task-closeBtn");
  _openBtns = document.querySelectorAll(".add-task-openBtn");
  _dropdowns = document.querySelectorAll(".dropdown");
  _categorySelect = document.querySelector(".category");
  _reminderSelect = document.querySelector(".reminder");
  _newCategoryBtn = document.querySelector(".create-new");
  _newCategoryInput = document.querySelector(".newCategory");
  constructor() {
    this._addHandlerOpenWindow();
    this._addHandlerCloseWindow();
    this._addHandlerToggleDropdown();
    this._addHandlerDropdownOption();
    this._addHandlerCreateNewCategory();
    this._addHandleNewCategoryInput();
    this.formValidity();
    this._setupDateAndTimePickers();
  }
  toggleWindow() {
    this._window.classList.toggle("hidden");
    this._overlay.classList.toggle("hidden");
  }
  toggleDropdown(dropdownContainer, closeAll = false) {
    if (!closeAll) {
      dropdownContainer.querySelector(".dropdown").classList.toggle("hidden");
      dropdownContainer
        .querySelector(".fa-chevron-down")
        .classList.toggle("dropdown-toggle");
    }
    this._dropdowns.forEach((dd) => {
      if (dd.closest(".dropdown-container") !== dropdownContainer || closeAll) {
        dd.classList.add("hidden");

        dd.closest(".dropdown-container")
          .querySelector(".fa-chevron-down")
          .classList.add("dropdown-toggle");
      }
    });
  }

  _addHandlerOpenWindow() {
    this._openBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this.toggleWindow();
        this._newCategoryBtn.classList.remove("hidden");
        this._newCategoryInput.classList.add("hidden");
      });
    });
  }

  _addHandlerCloseWindow() {
    this._closeBtn.addEventListener("click", () => {
      this.toggleWindow();
      this.formReset();
    });
  }
  _setupDateAndTimePickers() {
    this._taskDatePicker = flatpickr("#taskDate", {
      enableTime: false,
      dateFormat: "M d Y",
      altInput: true,
      altFormat: "M d Y",
      minDate: "today",
    });

    this._taskTimePicker = flatpickr("#taskTime", {
      enableTime: true,
      dateFormat: "H:i",
      noCalendar: true,
    });
  }
  _addHandlerToggleDropdown() {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target;
      if (btn.classList.contains("fa-chevron-down"))
        this.toggleDropdown(btn.closest(".dropdown-container"));
    });
  }
  handleSelect(btn, toggle = true) {
    btn.closest(".dropdown-container").querySelector(".content").textContent =
      btn !== this._newCategoryBtn
        ? btn.textContent
        : this._newCategoryInput.value;

    btn
      .closest(".dropdown")
      .querySelectorAll(".option")
      .forEach((i) => {
        if (!i.classList.contains("create-new")) {
          i.style.color = "#4e4b4bcd";
        }
      });
    btn.style.color = "#7b61ff";
    if (toggle) this.toggleDropdown(btn.closest(".dropdown-container"));
  }
  _addHandlerDropdownOption() {
    this._parentElement.addEventListener("click", (e) => {
      const btn = e.target;
      if (
        btn.classList.contains("option") &&
        !btn.classList.contains("create-new")
      ) {
        this.handleSelect(btn);
      }
    });
  }
  _addHandlerCreateNewCategory() {
    this._newCategoryBtn.addEventListener("click", () => {
      this._newCategoryInput.classList.remove("hidden");
    });
  }
  _addHandleNewCategoryInput() {
    this._newCategoryInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        this.handleSelect(this._newCategoryBtn);
        this._newCategoryBtn.classList.add("hidden");
      }
    });
  }
  formReset() {
    this._parentElement.reset();
    this.handleSelect(
      this._reminderSelect.querySelector(".intial-select"),
      false,
    );
    this.handleSelect(
      this._categorySelect.querySelector(".intial-select"),
      false,
    );

    document.querySelector(".saveBtn").disabled = true;
    this._taskDatePicker.clear();
    this._taskTimePicker.clear();
    this.toggleDropdown(undefined, true);
  }

  formValidity() {
    const inputs = this._parentElement.querySelectorAll("input[type=text]");
    this._parentElement.addEventListener("input", () => {
      const allFilled = [...inputs].every((inp) => {
        if (
          inp.classList.contains("newCategory") ||
          inp.classList.contains("form-control")
        )
          return true;

        return inp.value.trim() !== "";
      });

      if (allFilled) document.querySelector(".saveBtn").disabled = false;
      else document.querySelector(".saveBtn").disabled = true;
    });
  }
  _addHandlerAddTask(handler) {
    this._parentElement.addEventListener("click", (e) => {
      e.preventDefault();

      if (e.target.classList.contains("saveBtn")) {
        this._dropdowns.forEach((dd) => {
          dd.closest(".dropdown-container").querySelector("input").value = dd
            .closest(".dropdown-container")
            .querySelector(".content").textContent;
        });
        const dataArr = [...new FormData(this._parentElement)];
        const data = Object.fromEntries(dataArr);

        handler(data);
      }

      if (
        e.target.classList.contains("cancelBtn") ||
        e.target.classList.contains("saveBtn")
      ) {
        this.toggleWindow();
        this.formReset();
      }
    });
  }
}
export default new AddTaskView();
