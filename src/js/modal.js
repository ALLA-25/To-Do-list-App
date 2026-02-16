import { API_URL } from "./config.js";
export const state = {
  task: {},
  upcomingTasks: [],
  allTasks: [],
  todaysTask: [],
  stateCards: {
    upcomingTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
  },
  week: {
    Mon: { completedTasks: 0 },
    Tue: { completedTasks: 0 },
    Wed: { completedTasks: 0 },
    Thu: { completedTasks: 0 },
    Fri: { completedTasks: 0 },
    Sat: { completedTasks: 0 },
    Sun: { completedTasks: 0 },
  },
  remiderTasks: {
    sameDay: [],
    oneWeekBefore: [],
    oneDayBefore: [],
  },
  quote: {},
};
export const resetWeeklyProgress = function () {
  const week = state.week;
  for (const day in week) {
    week[day].completedTasks = 0;
  }
  persistState();
};

export const addTask = function (newTask) {
  state.task = {
    id: crypto.randomUUID(),
    ...newTask,
    reminderTriggerd: false,
  };
  updateTaskState(state.task);
  state.allTasks.unshift(state.task);
  const today = new Date();
  state.task.date = new Date(state.task.date);
  if (state.task.date.toDateString() === today.toDateString())
    state.todaysTask.unshift(state.task);

  persistState();
  return state.task;
};
const getTaskState = (taskDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  taskDate = new Date(taskDate);
  taskDate.setHours(0, 0, 0, 0);

  if (taskDate.toDateString() === today.toDateString()) return "due Today";
  if (taskDate > today) return "upcoming";
  if (taskDate < today) return "overdue";
  return "completed";
};
export const updateTaskState = function (task, completed = false) {
  if (completed) {
    if (task.state !== "completed") {
      ++state.stateCards.completedTasks;
    }
    if (task.state == "upcoming") --state.stateCards.upcomingTasks;
    const day = new Date().toLocaleDateString("en-US", {
      weekday: "short",
    });
    ++state.week[day].completedTasks;

    console.log(task);
    task.state = "completed";
    persistState();

    return;
  }
  const currentStete = task.state;

  if (currentStete !== "completed") {
    const newState = getTaskState(task.date);
    task.state = newState;
    if (newState === "due Today" && currentStete === "upcoming")
      --state.stateCards.upcomingTasks;
    if (newState === "upcoming" && newState !== currentStete)
      ++state.stateCards.upcomingTasks;
    if (newState === "overdue" && currentStete !== "overdue")
      ++state.stateCards.overdueTasks;
    persistState();
  }
};
export const refreshStateCards = function () {
  state.stateCards.upcomingTasks = 0;
  state.stateCards.completedTasks = 0;
  state.stateCards.overdueTasks = 0;

  state.allTasks.forEach((task) => {
    if (task.state === "upcoming") state.stateCards.upcomingTasks++;
    if (task.state === "completed") state.stateCards.completedTasks++;
    if (task.state === "overdue") state.stateCards.overdueTasks++;
  });

  persistState();
};
export const deleteTask = function (taskId) {
  const taskToDelete = state.allTasks.find((task) => task.id == taskId);
  if (!taskToDelete) return;

  if (taskToDelete.state === "upcoming") {
    --state.stateCards.upcomingTasks;
  }

  if (taskToDelete.state === "overdue") --state.stateCards.overdueTasks;
  if (taskToDelete.state === "completed") --state.stateCards.completedTasks;
  state.allTasks = state.allTasks.filter((task) => task.id != taskId);
  state.todaysTask = state.todaysTask.filter((task) => task.id != taskId);
  Object.keys(state.remiderTasks).forEach((key) => {
    state.remiderTasks[key] = state.remiderTasks[key].filter(
      (task) => task.id != taskId,
    );
  });
  persistState();
};
export const updateTaskInReminder = function () {
  state.allTasks.forEach((task) => {
    if (task.reminder === "No Reminder") return;
    const todayDate = new Date().toDateString();
    const taskDate = new Date(task.date);
    if (task.reminder == "same day" && taskDate.toDateString() === todayDate) {
      state.remiderTasks.sameDay.push(task);
    }

    if (task.reminder == "1 week before") {
      taskDate.setDate(taskDate.getDate() - 7);
      if (taskDate.toDateString() === todayDate) {
        state.remiderTasks.oneWeekBefore.push(task);
      }
    }

    if (task.reminder == "1 day before") {
      taskDate.setDate(taskDate.getDate() - 1);
      if (taskDate.toDateString() === todayDate) {
        state.remiderTasks.oneDayBefore.push(task);
      }
    }
  });

  persistState();
};
export const resetReminderTasks = function () {
  state.remiderTasks = {
    sameDay: [],
    oneWeekBefore: [],
    oneDayBefore: [],
  };
  persistState();
};
// export const fetchQuote = async function () {
//   try {
//     const res = await fetch(API_URL);

//     if (!res.ok) throw new Error("Failed to fetch quotes");

//     const data = await res.json();

//     // const randomIndex = Math.floor(Math.random() * data.length);
//     // const randomQuote = data[randomIndex];

//     // state.quote = randomQuote;
//     state.quote = {
//       text: data.slip.advice,
//       author: "Advice Slip",
//     };
//     persistState();
//     return state.quote;
//     // return randomQuote;
//   } catch (err) {
//     console.error("Error fetching quote:", err);
//     return { text: "An error occurred while fetching the quote.", author: "" };
//   }
// };
export const fetchQuote = async function () {
  try {
    const localQuotes = [
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
      },
      {
        text: "Success is not the key to happiness. Happiness is the key to success.",
        author: "Albert Schweitzer",
      },
      {
        text: "Your time is limited, so don't waste it living someone else's life.",
        author: "Steve Jobs",
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle",
      },
      {
        text: "Believe you can and you're halfway there. Stay focused and keep going.",
        author: "Theodore Roosevelt",
      },
      {
        text: "Do not go where the path may lead, go instead where there is no path.",
        author: "Ralph Waldo Emerson",
      },
    ];

    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    const randomQuote = localQuotes[randomIndex];

    state.quote = randomQuote;

    persistState();
    return randomQuote;
  } catch (err) {
    return { text: "Keep pushing forward!", author: "Admin" };
  }
};
export const resetQuoteData = function () {
  state.quote = {};
  persistState();
};
export const persistState = function () {
  localStorage.setItem("state", JSON.stringify(state));
};
const getLocalStorge = function () {
  const data = JSON.parse(localStorage.getItem("state"));
  if (!data) return;
  Object.assign(state, data);

  state.allTasks.forEach((task) => {
    task.date = new Date(task.date);
  });
};
getLocalStorge();
