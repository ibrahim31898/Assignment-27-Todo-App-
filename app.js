var inputBox = document.getElementById("input-box");
var listContainer = document.getElementById("list-container");
var completedCounter = document.getElementById("completed-counter");
var uncompletedCounter = document.getElementById("uncompleted-counter");

function updateCounters() {
  var completedTasks = document.querySelectorAll(".completed").length;
  var uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}

function addTask() {
  var task = inputBox.value.trim();
  if (!task) {
    alert("Please write down a task");
    console.log("no task added");

    return;
  }

  var li = document.createElement("li");
  li.innerHTML = `
    <label>
      <input type="checkbox">
      <span>${task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
    `;

  listContainer.appendChild(li);

 
  inputBox.value = " ";

  
  var checkbox = li.querySelector("input");
  var editBtn = li.querySelector(".edit-btn");
  var taskSpan = li.querySelector("span");
  var deleteBtn = li.querySelector(".delete-btn");

 
  checkbox.addEventListener("click", function () {
    li.classList.toggle("completed", checkbox.checked);
    updateCounters();
  });

  editBtn.addEventListener("click", function () {
    var update = prompt("Edit task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      updateCounters();
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      li.remove();
      updateCounters();
    }
  });
  updateCounters();
}


inputBox.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});