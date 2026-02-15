class DashboardActivityView {
  constructor() {
    this.myChart = null;
  }
  updateStatesCard(stateCards) {
    const completedTasks = document.querySelector(".completedTasks");
    const upcomingTasks = document.querySelector(".upcomingTasks");
    const overdueTasks = document.querySelector(".overdueTasks");
    completedTasks.textContent = stateCards.completedTasks;
    upcomingTasks.textContent = stateCards.upcomingTasks;
    overdueTasks.textContent = stateCards.overdueTasks;
  }

  weeklyCompletedTasks(week) {
    const arr = [];
    Object.keys(week).forEach((day) => {
      const d = week[day].completedTasks;
      arr.push(d);
    });
    return arr;
  }
  renderWeeklyChart(week) {
    const ctx = document.getElementById("myChart").getContext("2d");
    if (this.myChart) {
      this.myChart.data.datasets[0].data = this.weeklyCompletedTasks(week);
      this.myChart.update();
      return;
    }
    this.myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "",
            data: this.weeklyCompletedTasks(week),
            backgroundColor: "#7b61ff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              color: "#ffffff",
              lineWidth: 1,
            },
            ticks: {
              color: "#ffffff",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: "#ffffff",
              lineWidth: 1,
            },
            ticks: {
              color: "#ffffff",
            },
          },
        },
      },
    });
  }
}
export default new DashboardActivityView();
