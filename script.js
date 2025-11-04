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
  // Use solid beige for cards and keep a colored left border to indicate priority
  li.style.backgroundColor = "#f5f5dc"; // beige
  if (priority === "High") {
    li.style.borderLeft = "4px solid #c92a2a";
  } else if (priority === "Medium") {
    li.style.borderLeft = "4px solid #f39c12";
  } else {
    li.style.borderLeft = "4px solid #2f9e44";
  }
  // store priority explicitly so save/load don't rely on parsing CSS
  li.setAttribute('data-priority', priority);

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
  // dark text for beige card
  textSpan.style.color = "#111827";
  textSpan.style.fontWeight = "600";
  textSpan.style.fontSize = "18px";
  textSpan.style.marginBottom = "4px";
  textSpan.textContent = text;
  
  var timeSpan = document.createElement("div");
  timeSpan.style.color = "#374151"; // gray-600 on beige
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
    // read priority from data attribute instead of parsing CSS
    var priority = items[i].getAttribute('data-priority') || "Low";
    
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
    // solid beige cards on load; keep left border for priority
    li.style.backgroundColor = "#f5f5dc";
    if (task.priority === "High") {
      li.style.borderLeft = "4px solid #c92a2a";
    } else if (task.priority === "Medium") {
      li.style.borderLeft = "4px solid #f39c12";
    } else {
      li.style.borderLeft = "4px solid #2f9e44";
    }
    li.setAttribute('data-priority', task.priority || 'Low');

    var contentDiv = document.createElement("div");
    contentDiv.style.flex = "1";
    
    var textSpan = document.createElement("div");
  textSpan.style.color = "#111827";
    textSpan.style.fontWeight = "600";
    textSpan.style.fontSize = "18px";
    textSpan.style.marginBottom = "4px";
    textSpan.textContent = task.text;
    
    if (task.completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.6";
    }
    
  var timeSpan = document.createElement("div");
  timeSpan.style.color = "#374151";
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
    document.body.style.backgroundColor = "navy";
    darkModeBtn.innerHTML = " Light Mode";
    darkModeBtn.style.backgroundColor = "#fbbf24";
    darkModeBtn.style.color = "#111827";
  } else {
    document.body.style.backgroundColor = "navy";
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