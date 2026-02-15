import * as modal from "./modal.js";
import addTaskView from "./views/addTaskView.js";
import todaysActivityView from "./views/todayActivityView.js";
import sidebarView from "./views/sidebarView.js";
import allTasksView from "./views/allTasksView.js";
import dashboardActivityView from "./views/dashboardActivityView.js";
import reminderView from "./views/reminderView.js";
import rightsideView from "./views/rightsideView.js";

const controlAddTask = function (data) {
  const task = modal.addTask(data);

  const isTaskInToday = modal.state.todaysTask.some((t) => t.id === task.id);

  if (isTaskInToday) todaysActivityView.render(modal.state.task);

  allTasksView.render(modal.state.task);

  dashboardActivityView.updateStatesCard(modal.state.stateCards);
  if (task.reminder == "No Reminder") return;
  modal.resetReminderTasks();
  modal.updateTaskInReminder();
  reminderView._addReminderHandler(controlTaskForReminder);
};
const controlCompleteTask = function (taskId) {
  modal.state.allTasks = modal.state.allTasks.map((task) => {
    if (task.id == taskId) modal.updateTaskState(task, true);
    return task;
  });
  modal.state.todaysTask = modal.state.todaysTask.map((task) => {
    if (task.id == taskId) modal.updateTaskState(task, true);
    return task;
  });
  const selectedTask = modal.state.allTasks.filter((task) => task.id == taskId);
  allTasksView.update(selectedTask[0]);

  let selectedTodayTask;
  if (modal.state.todaysTask.length != 0) {
    selectedTodayTask = modal.state.todaysTask.filter(
      (task) => task.id == taskId,
    );
    if (selectedTodayTask[0]) todaysActivityView.update(selectedTodayTask[0]);
  }

  dashboardActivityView.updateStatesCard(modal.state.stateCards);
  dashboardActivityView.renderWeeklyChart(modal.state.week);
};
const controlDeletedTask = function (taskId) {
  reminderView.clear();
  modal.deleteTask(taskId);
  controlTaskForReminder(true);

  dashboardActivityView.updateStatesCard(modal.state.stateCards);

  allTasksView.clear();
  [...modal.state.allTasks]
    .reverse()
    .forEach((task) => allTasksView.render(task));
  todaysActivityView.clear();
  [...modal.state.todaysTask]
    .reverse()
    .forEach((task) => todaysActivityView.render(task));

  if (modal.state.allTasks.length === 0) {
    allTasksView._initialMarkup();
  }
  if (modal.state.todaysTask.length === 0) {
    todaysActivityView._initialMarkup();
  }
};

const filterTasksByCategory = function (selectedCategory) {
  if (modal.state.allTasks.length === 0) {
    return;
  }
  allTasksView.clear();
  let hasTasks = false;
  allTasksView.renderSpinner();
  setTimeout(() => {
    allTasksView.clear();
    [...modal.state.allTasks].reverse().forEach((task) => {
      if (selectedCategory == "all") {
        allTasksView.render(task);
        hasTasks = true;
        return;
      }
      if (task.category === selectedCategory) {
        allTasksView.render(task);
        hasTasks = true;
        return;
      }
      if (
        task.category !== "Work" &&
        task.category !== "Personal" &&
        task.category !== "Wishlist" &&
        task.category !== "Birthday" &&
        task.category !== "No Category" &&
        selectedCategory == "other"
      ) {
        allTasksView.render(task);
        hasTasks = true;
        return;
      }
    });
    if (!hasTasks) allTasksView.render(undefined, true);
  }, 1000);
};
const controlSearchTasks = function () {
  if (modal.state.allTasks.length === 0) {
    return;
  }

  const query = allTasksView.getQuery();

  if (!query || query === "") return;
  allTasksView.clear();
  let hasTasks = false;
  allTasksView.renderSpinner();
  setTimeout(() => {
    allTasksView.clear();
    [...modal.state.allTasks].reverse().filter((task) => {
      if (task.tag == query) {
        allTasksView.render(task);
        hasTasks = true;
        return;
      }
    });
    if (!hasTasks) allTasksView.render(undefined, true);
  }, 1000);
};
const controlTaskForReminder = function (isDeleteMode = false) {
  let isEmpty = true;
  Object.keys(modal.state.remiderTasks).forEach((key) => {
    if (modal.state.remiderTasks[key].length !== 0) isEmpty = false;
  });
  if (isEmpty) {
    reminderView._initialMarkup();
  }

  Object.entries(modal.state.remiderTasks).forEach(([key, val]) => {
    if (val.length === 0) return;
    modal.state.remiderTasks[key].forEach((task) => {
      if (!task.reminderTriggerd || isDeleteMode) {
        task.reminderTriggerd = true;
        reminderView.render(task);
      }
    });
  });
  return isEmpty;
};
const controlQuote = async function (forceRefresh = false) {
  let quoteData;
  if (forceRefresh || !modal.state.quote.text) {
    quoteData = await modal.fetchQuote();
  } else quoteData = modal.state.quote;

  rightsideView.renderQuote(quoteData);
};
const resetDailyTaskView = function (newDay = false) {
  modal.state.allTasks.forEach((task) => {
    task.date = new Date(task.date);
    modal.updateTaskState(task);
  });
  modal.refreshStateCards();
  if (newDay) {
    modal.resetQuoteData();
    controlQuote(true);
  }
  todaysActivityView.clear();
  allTasksView.clear();
  modal.state.todaysTask = [];

  if (modal.state.allTasks.length === 0) {
    allTasksView._initialMarkup();
  } else {
    [...modal.state.allTasks].reverse().forEach((task) => {
      allTasksView.render(task);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.date);
      taskDate.setHours(0, 0, 0, 0);

      if (taskDate.toDateString() === today.toDateString()) {
        modal.state.todaysTask.push(task);
      }
    });
  }
  ///////////////////////////////////
  [...modal.state.todaysTask].forEach((task) => {
    todaysActivityView.render(task);
  });
  ///////////////////////////////////////////
  if (modal.state.todaysTask.length === 0) {
    todaysActivityView._initialMarkup();
  }

  modal.state.allTasks.forEach((task) => {
    task.reminderTriggerd = false;
  });
  allTasksView.lockTaskActions();

  modal.persistState();
};
const startDailyTaskUpdater = function (TEST_MODE = false) {
  const day = TEST_MODE ? 60000 : 86400000;

  const runDailyTasks = function () {
    resetDailyTaskView(true);
    dashboardActivityView.updateStatesCard(modal.state.stateCards);
    modal.resetReminderTasks();
    reminderView.clear();
    modal.updateTaskInReminder();
    reminderView._addReminderHandler(controlTaskForReminder);

    const today = new Date();
    if (today.getDay() == 1) {
      modal.resetWeeklyProgress();
      dashboardActivityView.renderWeeklyChart(modal.state.week);
      modal.state.allTasks
        .filter(
          (task) => task.state === "completed" || task.state === "overdue",
        )
        .forEach((task) => {
          controlDeletedTask(task.id);
        });
    }

    scheduleNext();
  };

  const scheduleNext = function () {
    if (TEST_MODE) {
      setTimeout(runDailyTasks, day);
      return;
    }

    const now = new Date();
    const nextMidnight = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + 1,
      0,
      0,
      0,
      0,
    );
    const timeUntilMidnight = Math.max(nextMidnight - now, 0);
    setTimeout(runDailyTasks, timeUntilMidnight);
  };

  resetDailyTaskView();
  modal.resetReminderTasks();
  modal.updateTaskInReminder();
  reminderView._addReminderHandler(controlTaskForReminder, false);
  scheduleNext();
};

const init = function () {
  startDailyTaskUpdater();
  // startDailyTaskUpdater(true);
  addTaskView._addHandlerAddTask(controlAddTask);
  allTasksView.addCompleteHandler(controlCompleteTask);
  dashboardActivityView.updateStatesCard(modal.state.stateCards);
  dashboardActivityView.renderWeeklyChart(modal.state.week);
  allTasksView.categoryChangeHandler(filterTasksByCategory);
  allTasksView.handleSearch(controlSearchTasks);
  allTasksView.deleteTaskHandler(controlDeletedTask);
  rightsideView.addStartPauseHandler();
  rightsideView.addResetHandler();
  controlQuote();
};
init();
