const form = document.getElementById("applicationForm");
const list = document.getElementById("applicationList");
const filter = document.getElementById("filterStatus");

let applications = [];

// Stats Elements
const totalAppsEl = document.getElementById("totalApps");
const interviewsEl = document.getElementById("interviews");
const offersEl = document.getElementById("offers");
const successRateEl = document.getElementById("successRate");

// Charts
const statusCtx = document.getElementById("statusChart").getContext("2d");
const timelineCtx = document.getElementById("timelineChart").getContext("2d");

let statusChart = new Chart(statusCtx, {
  type: "doughnut",
  data: {
    labels: ["Applied", "Interview", "Offer", "Rejected"],
    datasets: [{
      data: [0, 0, 0, 0],
      backgroundColor: ["#0077ff", "#ffb347", "#4caf50", "#f44336"]
    }]
  }
});

let timelineChart = new Chart(timelineCtx, {
  type: "line",
  data: {
    labels: [],
    datasets: [{
      label: "Applications Over Time",
      data: [],
      borderColor: "#0077ff",
      backgroundColor: "rgba(0,119,255,0.2)",
      fill: true,
      tension: 0.3
    }]
  }
});

// Add Application
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const app = {
    company: document.getElementById("company").value,
    jobTitle: document.getElementById("jobTitle").value,
    date: document.getElementById("date").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value,
  };
  applications.push(app);
  form.reset();
  renderList();
  updateStats();
});

// Render List
function renderList() {
  list.innerHTML = "";
  const filtered = applications.filter(app =>
    filter.value === "All" || app.status === filter.value
  );
  filtered.forEach((app, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${app.company}</strong> - ${app.jobTitle} 
        <br><small>${app.date} | ${app.status}</small>
        <br><em>${app.notes}</em>
      </div>
      <button onclick="deleteApp(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

filter.addEventListener("change", renderList);

// Delete App
function deleteApp(index) {
  applications.splice(index, 1);
  renderList();
  updateStats();
}

// Update Stats + Charts
function updateStats() {
  const total = applications.length;
  const interviews = applications.filter(a => a.status === "Interview").length;
  const offers = applications.filter(a => a.status === "Offer").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;

  totalAppsEl.textContent = total;
  interviewsEl.textContent = interviews;
  offersEl.textContent = offers;
  successRateEl.textContent = total > 0 ? ((offers / total) * 100).toFixed(1) + "%" : "0%";

  statusChart.data.datasets[0].data = [
    total - (interviews + offers + rejected),
    interviews,
    offers,
    rejected
  ];
  statusChart.update();

  timelineChart.data.labels = applications.map(a => a.date);
  timelineChart.data.datasets[0].data = applications.map((_, i) => i + 1);
  timelineChart.update();
}
