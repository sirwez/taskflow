import Task from "../models/task.js";

class TaskController {
  constructor(db) {
    this.taskModel = new Task(db);
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

export default TaskController;
