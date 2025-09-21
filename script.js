// Elements
var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var prioritySelect = document.getElementById("prioritySelect");
var darkModeBtn = document.getElementById("darkModeBtn");

// Add task
function addTask() {
  var text = taskInput.value;
  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  var li = document.createElement("li");
  li.style.display = "flex";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";
  li.style.padding = "8px";
  li.style.borderRadius = "6px";
  li.style.cursor = "pointer";
  li.style.transition = "box-shadow 0.2s";

  // Hover shadow effect
  li.onmouseover = function() { li.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)"; }
  li.onmouseout = function() { li.style.boxShadow = "none"; }

  // Priority colors
  var priority = prioritySelect.value;
  if (priority === "High") li.style.backgroundColor = "#fee2e2";
  else if (priority === "Medium") li.style.backgroundColor = "#fef3c7";
  else li.style.backgroundColor = "#d1fae5";

  // Date & Time
  var now = new Date();
  var dateTime = now.toLocaleString();

  // Task text
  var span = document.createElement("span");
  span.innerHTML = text + " <small style='color: gray'>(" + dateTime + ")</small>";

  // Mark complete/incomplete
  span.onclick = function() {
    if (span.style.textDecoration === "line-through") {
      span.style.textDecoration = "none";
      span.style.color = "black";
    } else {
      span.style.textDecoration = "line-through";
      span.style.color = "gray";
    }
    saveTasks();
  }

  // Delete button
  var delBtn = document.createElement("button");
  delBtn.innerHTML = "Delete";
  delBtn.style.backgroundColor = "#ef4444";
  delBtn.style.color = "white";
  delBtn.style.border = "none";
  delBtn.style.padding = "4px 8px";
  delBtn.style.borderRadius = "4px";
  delBtn.style.cursor = "pointer";

  delBtn.onclick = function() {
    taskList.removeChild(li);
    saveTasks();
  }

  li.appendChild(span);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  saveTasks();
  taskInput.value = "";
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("tasks", taskList.innerHTML);
}

// Load tasks
function loadTasks() {
  var saved = localStorage.getItem("tasks");
  if (saved) {
    taskList.innerHTML = saved;

    // Reattach events
    var items = taskList.getElementsByTagName("li");
    for (var i = 0; i < items.length; i++) {
      var span = items[i].getElementsByTagName("span")[0];
      var delBtn = items[i].getElementsByTagName("button")[0];

      // Toggle complete
      span.onclick = function() {
        if (this.style.textDecoration === "line-through") {
          this.style.textDecoration = "none";
          this.style.color = "black";
        } else {
          this.style.textDecoration = "line-through";
          this.style.color = "gray";
        }
        saveTasks();
      }

      // Delete
      delBtn.onclick = function() {
        var li = this.parentElement;
        taskList.removeChild(li);
        saveTasks();
      }
    }
  }
}

// Dark mode toggle
darkModeBtn.onclick = function() {
  if (document.body.style.backgroundColor === "rgb(243, 244, 246)") {
    document.body.style.backgroundColor = "#1f2937";
    document.body.style.color = "white";
  } else {
    document.body.style.backgroundColor = "#f3f4f6";
    document.body.style.color = "black";
  }
}

// Event listener
addBtn.onclick = addTask;
window.onload = loadTasks;
