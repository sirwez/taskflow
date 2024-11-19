import renderTasks from "./renderTasks.js";

function setupTaskForm(taskController, taskFormElement, taskListElement) {
  taskFormElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = taskFormElement.querySelector("#taskTitle").value;
    const description = taskFormElement.querySelector("#taskDescription").value;
    const category = taskFormElement.querySelector("#taskCategory").value;

    await taskController.addTask({
      title,
      description,
      category,
      status: "pendente",
      createdAt: new Date(),
    });

    taskFormElement.reset();
    renderTasks(taskController, taskListElement); // Atualiza tarefas
  });
}

export default setupTaskForm;
