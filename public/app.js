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
      const querySnapshot = await db.collection("tasks").orderBy("order").get();
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    }
  
    async delete(taskId) {
      await db.collection("tasks").doc(taskId).delete();
    }
  
    async updateTask(taskId, updatedData) {
        const taskRef = db.collection("tasks").doc(taskId);
        await taskRef.update(updatedData);
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
  
    async updateTask(taskId, updatedData) {
        try {
          await this.taskModel.updateTask(taskId, updatedData);
        } catch (error) {
          console.error("Erro ao atualizar tarefa:", error);
        }
      }
      
  }
  
  // Verificação de duplicatas
  async function isDuplicateTask(title) {
    const querySnapshot = await db.collection("tasks").where("title", "==", title).get();
    return !querySnapshot.empty; // Retorna `true` se já existir uma tarefa com o mesmo título
  }
  
  // Funções de Interface (View)
  async function renderTasks(taskController, taskListElement) {
    taskListElement.innerHTML = "";
  
    const tasks = await taskController.getTasks();
  
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="task-data">
          <strong>${task.title}</strong> - ${task.category}
        </span>
        <span class="edit-fields" style="display: none;">
          <input type="text" class="edit-title" value="${task.title}">
          <select class="edit-category">
            <option value="trabalho" ${task.category === "trabalho" ? "selected" : ""}>Trabalho</option>
            <option value="pessoal" ${task.category === "pessoal" ? "selected" : ""}>Pessoal</option>
            <option value="urgente" ${task.category === "urgente" ? "selected" : ""}>Urgente</option>
          </select>
        </span>
        <button class="edit" data-id="${task.id}">Editar</button>
        <button class="save" data-id="${task.id}" style="display: none;">Salvar</button>
        <button class="delete" data-id="${task.id}">Excluir</button>
      `;
      taskListElement.appendChild(li);
    });
  
    // Botões de edição
    document.querySelectorAll(".edit").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.getAttribute("data-id");
        const li = btn.closest("li");
        li.querySelector(".task-data").style.display = "none";
        li.querySelector(".edit-fields").style.display = "inline";
        li.querySelector(".edit").style.display = "none";
        li.querySelector(".save").style.display = "inline";
      });
    });
  
    // Botões de salvar
    document.querySelectorAll(".save").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        const id = e.target.getAttribute("data-id");
        const li = btn.closest("li");
        const updatedTitle = li.querySelector(".edit-title").value.trim();
        const updatedCategory = li.querySelector(".edit-category").value;
  
        if (!updatedTitle) {
          alert("O título é obrigatório.");
          return;
        }
  
        await taskController.updateTask(id, {
          title: updatedTitle,
          category: updatedCategory,
        });
  
        renderTasks(taskController, taskListElement); // Re-renderiza a lista
      });
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
  
      const title = taskFormElement.querySelector("#taskTitle").value.trim();
      const description = taskFormElement.querySelector("#taskDescription").value.trim();
      const category = taskFormElement.querySelector("#taskCategory").value;
  
      if (!title) {
        alert("O título é obrigatório.");
        return;
      }
  
      if (await isDuplicateTask(title)) {
        alert("Já existe uma tarefa com este título. Escolha outro.");
        return;
      }
  
      await taskController.addTask({
        title,
        description,
        category,
        status: "pendente",
        createdAt: new Date(),
        order: new Date().getTime(), // Ordem baseada em timestamp
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
  