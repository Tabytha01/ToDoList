var taskInput = document.getElementById("taskInput");
var addBtn = document.getElementById("addBtn");
var taskList = document.getElementById("taskList");
var prioritySelect = document.getElementById("prioritySelect");
var darkModeBtn = document.getElementById("darkModeBtn");
var emptyState = document.getElementById("emptyState");
var isDarkMode = false;

function updateEmptyState() {
  if (taskList.children.length === 0) {
    emptyState.style.display = "block";
  } else {
    emptyState.style.display = "none";
  }
}

function addTask() {
  var text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  var li = document.createElement("li");
  li.style.display = "flex";
  li.style.justifyContent = "space-between";
  li.style.alignItems = "center";
  li.style.padding = "20px";
  li.style.borderRadius = "16px";
  li.style.cursor = "pointer";
  li.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
  
  var priority = prioritySelect.value;
  if (priority === "High") {
    li.style.background = "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)";
    li.style.borderLeft = "4px solid #c92a2a";
  } else if (priority === "Medium") {
    li.style.background = "linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)";
    li.style.borderLeft = "4px solid #f39c12";
  } else {
    li.style.background = "linear-gradient(135deg, #6bcf7f 0%, #51cf66 100%)";
    li.style.borderLeft = "4px solid #2f9e44";
  }

  var now = new Date();
  var dateTime = now.toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  var contentDiv = document.createElement("div");
  contentDiv.style.flex = "1";
  
  var textSpan = document.createElement("div");
  textSpan.style.color = "white";
  textSpan.style.fontWeight = "600";
  textSpan.style.fontSize = "18px";
  textSpan.style.marginBottom = "4px";
  textSpan.textContent = text;
  
  var timeSpan = document.createElement("div");
  timeSpan.style.color = "white";
  timeSpan.style.fontSize = "12px";
  timeSpan.style.opacity = "0.8";
  timeSpan.innerHTML = "📅 " + dateTime + " • " + priority;
  
  contentDiv.appendChild(textSpan);
  contentDiv.appendChild(timeSpan);

  contentDiv.onclick = function() {
    if (textSpan.style.textDecoration === "line-through") {
      textSpan.style.textDecoration = "none";
      textSpan.style.opacity = "1";
    } else {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.6";
    }
    saveTasks();
  };

  var editBtn = document.createElement("button");
  editBtn.innerHTML = "✏️";
  editBtn.style.marginLeft = "16px";
  editBtn.style.width = "48px";
  editBtn.style.height = "48px";
  editBtn.style.backgroundColor = "#3b82f6";
  editBtn.style.color = "white";
  editBtn.style.border = "none";
  editBtn.style.borderRadius = "12px";
  editBtn.style.fontWeight = "bold";
  editBtn.style.fontSize = "20px";
  editBtn.style.cursor = "pointer";
  editBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  
  editBtn.onmouseover = function() {
    this.style.backgroundColor = "#2563eb";
  };
  
  editBtn.onmouseout = function() {
    this.style.backgroundColor = "#3b82f6";
  };
  
  editBtn.onclick = function(e) {
    e.stopPropagation();
    var newText = prompt("Update your task:", textSpan.textContent);
    if (newText !== null && newText.trim() !== "") {
      textSpan.textContent = newText.trim();
      saveTasks();
    }
  };

  var delBtn = document.createElement("button");
  delBtn.innerHTML = "🗑️";
  delBtn.style.marginLeft = "8px";
  delBtn.style.width = "48px";
  delBtn.style.height = "48px";
  delBtn.style.backgroundColor = "#ef4444";
  delBtn.style.color = "white";
  delBtn.style.border = "none";
  delBtn.style.borderRadius = "12px";
  delBtn.style.fontWeight = "bold";
  delBtn.style.fontSize = "20px";
  delBtn.style.cursor = "pointer";
  delBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  
  delBtn.onmouseover = function() {
    this.style.backgroundColor = "#dc2626";
  };
  
  delBtn.onmouseout = function() {
    this.style.backgroundColor = "#ef4444";
  };
  
  delBtn.onclick = function(e) {
    e.stopPropagation();
    taskList.removeChild(li);
    saveTasks();
    updateEmptyState();
  };

  li.appendChild(contentDiv);
  li.appendChild(editBtn);
  li.appendChild(delBtn);
  taskList.appendChild(li);

  saveTasks();
  taskInput.value = "";
  updateEmptyState();
}

function saveTasks() {
  var tasks = [];
  var items = taskList.getElementsByTagName("li");
  for (var i = 0; i < items.length; i++) {
    var textSpan = items[i].querySelector("div > div:first-child");
    var timeSpan = items[i].querySelector("div > div:last-child");
    var isCompleted = textSpan.style.textDecoration === "line-through";
    var bg = items[i].style.background;
    var priority = "";
    
    if (bg.includes("#ff6b6b") || bg.includes("#ee5a6f")) priority = "High";
    else if (bg.includes("#ffd93d") || bg.includes("#f9ca24")) priority = "Medium";
    else priority = "Low";
    
    tasks.push({
      text: textSpan.textContent,
      time: timeSpan.textContent,
      priority: priority,
      completed: isCompleted
    });
  }
  var data = { tasks: tasks };
  document.body.setAttribute('data-tasks', JSON.stringify(data));
}

function loadTasks() {
  var dataStr = document.body.getAttribute('data-tasks');
  if (!dataStr) {
    updateEmptyState();
    return;
  }
  
  var data = JSON.parse(dataStr);
  data.tasks.forEach(function(task) {
    var li = document.createElement("li");
    li.style.display = "flex";
    li.style.justifyContent = "space-between";
    li.style.alignItems = "center";
    li.style.padding = "20px";
    li.style.borderRadius = "16px";
    li.style.cursor = "pointer";
    li.style.boxShadow = "0 4px 15px rgba(0,0,0,0.2)";
    
    if (task.priority === "High") {
      li.style.background = "linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)";
      li.style.borderLeft = "4px solid #c92a2a";
    } else if (task.priority === "Medium") {
      li.style.background = "linear-gradient(135deg, #ffd93d 0%, #f9ca24 100%)";
      li.style.borderLeft = "4px solid #f39c12";
    } else {
      li.style.background = "linear-gradient(135deg, #6bcf7f 0%, #51cf66 100%)";
      li.style.borderLeft = "4px solid #2f9e44";
    }

    var contentDiv = document.createElement("div");
    contentDiv.style.flex = "1";
    
    var textSpan = document.createElement("div");
    textSpan.style.color = "white";
    textSpan.style.fontWeight = "600";
    textSpan.style.fontSize = "18px";
    textSpan.style.marginBottom = "4px";
    textSpan.textContent = task.text;
    
    if (task.completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.6";
    }
    
    var timeSpan = document.createElement("div");
    timeSpan.style.color = "white";
    timeSpan.style.fontSize = "12px";
    timeSpan.style.opacity = "0.8";
    timeSpan.textContent = task.time;
    
    contentDiv.appendChild(textSpan);
    contentDiv.appendChild(timeSpan);

    contentDiv.onclick = function() {
      if (textSpan.style.textDecoration === "line-through") {
        textSpan.style.textDecoration = "none";
        textSpan.style.opacity = "1";
      } else {
        textSpan.style.textDecoration = "line-through";
        textSpan.style.opacity = "0.6";
      }
      saveTasks();
    };

    var editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.style.marginLeft = "16px";
    editBtn.style.width = "48px";
    editBtn.style.height = "48px";
    editBtn.style.backgroundColor = "#3b82f6";
    editBtn.style.color = "white";
    editBtn.style.border = "none";
    editBtn.style.borderRadius = "12px";
    editBtn.style.fontWeight = "bold";
    editBtn.style.fontSize = "20px";
    editBtn.style.cursor = "pointer";
    editBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    
    editBtn.onmouseover = function() {
      this.style.backgroundColor = "#2563eb";
    };
    
    editBtn.onmouseout = function() {
      this.style.backgroundColor = "#3b82f6";
    };
    
    editBtn.onclick = function(e) {
      e.stopPropagation();
      var newText = prompt("Update your task:", textSpan.textContent);
      if (newText !== null && newText.trim() !== "") {
        textSpan.textContent = newText.trim();
        saveTasks();
      }
    };

    var delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️";
    delBtn.style.marginLeft = "8px";
    delBtn.style.width = "48px";
    delBtn.style.height = "48px";
    delBtn.style.backgroundColor = "#ef4444";
    delBtn.style.color = "white";
    delBtn.style.border = "none";
    delBtn.style.borderRadius = "12px";
    delBtn.style.fontWeight = "bold";
    delBtn.style.fontSize = "20px";
    delBtn.style.cursor = "pointer";
    delBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    
    delBtn.onmouseover = function() {
      this.style.backgroundColor = "#dc2626";
    };
    
    delBtn.onmouseout = function() {
      this.style.backgroundColor = "#ef4444";
    };
    
    delBtn.onclick = function(e) {
      e.stopPropagation();
      taskList.removeChild(li);
      saveTasks();
      updateEmptyState();
    };

    li.appendChild(contentDiv);
    li.appendChild(editBtn);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
  
  updateEmptyState();
}

darkModeBtn.onclick = function() {
  isDarkMode = !isDarkMode;
  
  if (isDarkMode) {
    document.body.style.background = "linear-gradient(to bottom right, #1a1a2e, #16213e, #0f3460)";
    darkModeBtn.innerHTML = " Light Mode";
    darkModeBtn.style.backgroundColor = "#fbbf24";
    darkModeBtn.style.color = "#111827";
  } else {
    document.body.style.background = "linear-gradient(to bottom right, #a855f7, #ec4899, #3b82f6)";
    darkModeBtn.innerHTML = " Dark Mode";
    darkModeBtn.style.backgroundColor = "#1f2937";
    darkModeBtn.style.color = "white";
  }
};

addBtn.onclick = addTask;
taskInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") addTask();
});

window.onload = loadTasks;