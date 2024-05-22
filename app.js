// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDQXh3Ci-ZRbci9D6lAlxcedBMx642wuDU",
  authDomain: "assignment-11-3eaf5.firebaseapp.com",
  databaseURL: "https://assignment-11-3eaf5-default-rtdb.firebaseio.com",
  projectId: "assignment-11-3eaf5",
  storageBucket: "assignment-11-3eaf5.appspot.com",
  messagingSenderId: "1042769862404",
  appId: "1:1042769862404:web:49a31090fe304ad497fa51",
  measurementId: "G-6HY31C2QDV"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

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

  var newTaskRef = database.ref('tasks').push();
  newTaskRef.set({
    task: task,
    completed: false
  });

  inputBox.value = "";
}

function renderTask(id, taskData) {
  var li = document.createElement("li");
  li.setAttribute('data-id', id);
  li.innerHTML = `
    <label>
      <input type="checkbox" ${taskData.completed ? 'checked' : ''}>
      <span>${taskData.task}</span>
    </label>
    <span class="edit-btn">Edit</span>
    <span class="delete-btn">Delete</span>
  `;

  if (taskData.completed) {
    li.classList.add('completed');
  }

  listContainer.appendChild(li);

  var checkbox = li.querySelector("input");
  var editBtn = li.querySelector(".edit-btn");
  var taskSpan = li.querySelector("span");
  var deleteBtn = li.querySelector(".delete-btn");

  checkbox.addEventListener("click", function () {
    var completed = checkbox.checked;
    li.classList.toggle("completed", completed);
    database.ref('tasks/' + id).update({
      completed: completed
    });
    updateCounters();
  });

  editBtn.addEventListener("click", function () {
    var update = prompt("Enter updated task:", taskSpan.textContent);
    if (update !== null) {
      taskSpan.textContent = update;
      li.classList.remove("completed");
      checkbox.checked = false;
      database.ref('tasks/' + id).update({
        task: update,
        completed: false
      });
      updateCounters();
    }
  });

  deleteBtn.addEventListener("click", function () {
    if (confirm("Are you sure you want to delete this task?")) {
      database.ref('tasks/' + id).remove();
      li.remove();
      updateCounters();
    }
  });

  updateCounters();
}

database.ref('tasks').on('child_added', function (data) {
  renderTask(data.key, data.val());
});

database.ref('tasks').on('child_changed', function (data) {
  var taskElement = document.querySelector('li[data-id="' + data.key + '"]');
  taskElement.querySelector('span').textContent = data.val().task;
  taskElement.querySelector('input').checked = data.val().completed;
  taskElement.classList.toggle('completed', data.val().completed);
  updateCounters();
});

database.ref('tasks').on('child_removed', function (data) {
  var taskElement = document.querySelector('li[data-id="' + data.key + '"]');
  if (taskElement) {
    taskElement.remove();
    updateCounters();
  }
});

inputBox.addEventListener("keyup", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function deleteAllTasks() {
  if (confirm("Are you sure you want to delete all tasks?")) {
    database.ref('tasks').remove();
    listContainer.innerHTML = "";
    updateCounters();
  }
}

var deleteAllButton = document.getElementById("delete-all-button");
deleteAllButton.addEventListener("click", deleteAllTasks);

});


