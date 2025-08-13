const API = "http://localhost:5000/api";
let token = "";


async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  alert(data.message || "Registered successfully");
}


async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();

  if (data.token) {
    token = data.token;
    document.querySelector(".auth").style.display = "none";
    document.querySelector(".task-section").style.display = "block";
    getTasks();
  } else {
    alert(data.message || "Login failed");
  }
}


async function getTasks() {
  const res = await fetch(`${API}/tasks`, {
    headers: { "Authorization": token }
  });
  const tasks = await res.json();

  document.getElementById("taskList").innerHTML = tasks
    .map(
      (t) => `
      <li>
        ${t.title}
        <button onclick="deleteTask('${t._id}')">❌</button>
      </li>
    `
    )
    .join("");
}


async function addTask() {
  const title = document.getElementById("taskInput").value;

  await fetch(`${API}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": token },
    body: JSON.stringify({ title })
  });

  document.getElementById("taskInput").value = "";
  getTasks();
}


async function deleteTask(id) {
  await fetch(`${API}/tasks/${id}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  });
  getTasks();
}
