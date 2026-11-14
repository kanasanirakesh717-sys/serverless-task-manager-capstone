const API_URL = "https://uxwtug6d8f.execute-api.ap-south-2.amazonaws.com";

// Example fetch request to test the backend
async function getTasks() {
    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log("Success:", data);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}
// 1. Fetch and display tasks from DynamoDB (GET)
async function fetchTasks() {
    const taskList = document.getElementById("taskList");
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        
        taskList.innerHTML = "";
        if (!tasks || tasks.length === 0) {
            taskList.innerHTML = "<li>No tasks found. Add your first task above!</li>";
            return;
        }

        tasks.forEach(task => {
            const li = document.createElement("li");
            li.innerHTML = `<span><strong>${task.title}</strong></span> <span style="color: #6c757d; font-size: 14px;">[${task.status || 'Pending'}]</span>`;
            taskList.appendChild(li);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        taskList.innerHTML = "<li style='color: red;'>Failed to load tasks from AWS API. Check console for details.</li>";
    }
}

// 2. Create a new task in DynamoDB (POST)
async function createTask() {
    const taskInput = document.getElementById("taskInput");
    const title = taskInput.value.trim();

    if (!title) {
        alert("Please enter a task title!");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ title: title })
        });

        if (response.ok) {
            taskInput.value = ""; // Clear input field
            fetchTasks(); // Refresh the list automatically
        } else {
            alert("Failed to create task on AWS.");
        }
    } catch (error) {
        console.error("Error creating task:", error);
        alert("An error occurred while creating the task.");
    }
}

// Load tasks automatically when the web page opens in the browser
window.onload = fetchTasks;