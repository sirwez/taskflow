// Configuração Firebase
const firebaseConfig = {
    apiKey: "AIzaSyD7wJBl4hIvohHXJtWeYfeUC1z709l1F64",
    authDomain: "taslflow.firebaseapp.com",
    databaseURL: "https://taslflow-default-rtdb.firebaseio.com",
    projectId: "taslflow",
    storageBucket: "taslflow.firebasestorage.app",
    messagingSenderId: "531249183179",
    appId: "1:531249183179:web:7ffaf3e5e122c34799de4e",
  };
  
  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  
  // Modelo (Model)
  class Task {
    async create(task) {
      const taskRef = await db.collection("tasks").add(task);
      return { id: taskRef.id, ...task };
    }
  
    async getAll() {
      const querySnapshot = await db.collection("tasks").orderBy("createdAt").get();
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    }
  
    async delete(taskId) {
      await db.collection("tasks").doc(taskId).delete();
    }
  }
  
  // Controlador (Controller)
  class TaskController {
    constructor() {
      this.taskModel = new Task();
    }
  
    async addTask(taskData) {
      try {
        return await this.taskModel.create(taskData);
      } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
      }
    }
  
    async getTasks() {
      try {
        return await this.taskModel.getAll();
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      }
    }
  
    async deleteTask(taskId) {
      try {
        await this.taskModel.delete(taskId);
      } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
      }
    }
  }
  
  // Funções de Interface (View)
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
        renderTasks(taskController, taskListElement);
      });
    });
  }
  
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
      renderTasks(taskController, taskListElement);
    });
  }
  
  // Inicializar aplicação
  const taskController = new TaskController();
  const taskFormElement = document.getElementById("taskForm");
  const taskListElement = document.getElementById("taskList");
  
  setupTaskForm(taskController, taskFormElement, taskListElement);
  renderTasks(taskController, taskListElement);
  