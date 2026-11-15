const API_URL = "https://uxwtug6d8f.execute-api.ap-south-2.amazonaws.com";

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
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";
            li.style.padding = "10px";
            li.style.marginBottom = "8px";
            li.style.background = "#f8f9fa";
            li.style.borderRadius = "4px";

            li.innerHTML = `
                <span><strong>${task.title}</strong> <span style="color: #6c757d; font-size: 14px;">[${task.status || 'Pending'}]</span></span>
                <div>
                    <button onclick="updateTask('${task.taskId}', '${task.status === 'Completed' ? 'Pending' : 'Completed'}')" style="margin-right: 5px; background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Toggle</button>
                    <button onclick="deleteTask('${task.taskId}')" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
                </div>
            `;
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

// 3. Delete a task from DynamoDB (DELETE)
async function deleteTask(taskId) {
    try {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: taskId })
        });
        if (response.ok) {
            fetchTasks();
        } else {
            alert("Failed to delete task.");
        }
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

// 4. Update task status (PUT)
async function updateTask(taskId, newStatus) {
    try {
        const response = await fetch(API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ taskId: taskId, status: newStatus })
        });
        if (response.ok) {
            fetchTasks();
        } else {
            alert("Failed to update task.");
        }
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

// Load tasks automatically when the web page opens in the browser
window.onload = fetchTasks;