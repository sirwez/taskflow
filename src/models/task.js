class Task {
    constructor(db) {
      this.db = db;
    }
  
    async create(task) {
      const taskRef = await this.db.collection("tasks").add(task);
      return { id: taskRef.id, ...task };
    }
  
    async getAll() {
      const querySnapshot = await this.db.collection("tasks").orderBy("createdAt").get();
      const tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      return tasks;
    }
  
    async update(taskId, updatedData) {
      await this.db.collection("tasks").doc(taskId).update(updatedData);
    }
  
    async delete(taskId) {
      await this.db.collection("tasks").doc(taskId).delete();
    }
  }
  
  export default task;
  