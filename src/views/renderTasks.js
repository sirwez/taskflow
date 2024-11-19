async function renderTasks(taskController, taskListElement) {
    taskListElement.innerHTML = "";
  
    const tasks = await taskController.getTasks();
  
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span><strong>${task.title}</strong> - ${task.category}</span>
        <button class="delete" data-id="${task.id}">Excluir</button>
      `;
      taskListElement.appendChild(li);
    });
  
    // Botões de exclusão
    document.querySelectorAll(".delete").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        await taskController.deleteTask(id);
        renderTasks(taskController, taskListElement); // Recarrega tarefas
      });
    });
  }
  
  export default renderTasks;
  