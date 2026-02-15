class SidebarView {
  _parentElement = document.querySelector("aside");
  _sidebarMenu = document.querySelector(".sidebar-menu");
  _sidebarToggleBtn = document.querySelector(".sidebar-toggleBtn");
  _overlay = document.querySelector(".overlay");
  _main = document.querySelector("main");
  constructor() {
    this.toggleSidebar();
    this.toggleMainContainer();
  }
  toggleSidebar() {
    this._sidebarToggleBtn.addEventListener("click", () => {
      this._parentElement.classList.toggle("show");
      this._overlay.classList.toggle("hidden");
    });
  }

  toggleMainContainer() {
    this._sidebarMenu.addEventListener("click", (e) => {
      const btn = e.target.dataset.target;
      if (!btn) return;
      [...this._sidebarMenu.children].forEach((btn) => {
        btn.classList.remove("active");
      });
      e.target.classList.add("active");
      if (btn === "allTasks" || btn === "dashboard") {
        const container = document.getElementById(`${btn}`);
        [...this._main.children].forEach((cont) => {
          cont.classList.add("hidden");
        });
        container.classList.remove("hidden");
      }
    });
  }
}
export default new SidebarView();
