import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITask } from 'src/types/my-types';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks = new BehaviorSubject<ITask[]>([]);
  isEditing = new BehaviorSubject<boolean>(false);
  taskToEdit = new BehaviorSubject<ITask | null>(null);
  indexTaskToEdit: number | null = null;

  constructor() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks.next(JSON.parse(storedTasks));
    }
  }

  createOrUpdateTask = (newTask: ITask) => {
    if (newTask.title.length === 0) return;
    if (
      this.isEditing &&
      this.taskToEdit &&
      typeof this.indexTaskToEdit === 'number'
    ) {
      this.updateTask(newTask);
    } else {
      this.createTask(newTask);
    }
  };

  private createTask = (newTask: ITask) => {
    const currentTasks = this.tasks.getValue();
    console.log(currentTasks);

    this.tasks.next([...currentTasks, newTask]);
    localStorage.setItem('tasks', JSON.stringify([...currentTasks, newTask]));
  };

  private updateTask = (updatedTask: ITask) => {
    const currentTasks = this.tasks.getValue();
    if (typeof this.indexTaskToEdit === 'number') {
      currentTasks[this.indexTaskToEdit] = updatedTask;
      this.tasks.next(currentTasks);
      this.isEditing.next(false);
      localStorage.setItem('tasks', JSON.stringify(currentTasks));
    }
  };
  findTaskIndex = (id: number) => {
    const currentTasks = this.tasks.getValue();
    return currentTasks.findIndex((task) => task.id === id);
  };

  editTask = (id: number) => {
    const currentTasks = this.tasks.getValue();
    this.isEditing.next(true);
    let index = this.findTaskIndex(id);
    this.taskToEdit.next(currentTasks[index]);
    this.indexTaskToEdit = index;
  };
  deleteTask = (id: number) => {
    const currentTasks = this.tasks.getValue();
    let newTasks = currentTasks.filter((task) => task.id !== id);
    this.tasks.next([...newTasks]);
    localStorage.setItem('tasks', JSON.stringify([...newTasks]));
  };

  markTaskAsDone = (id: number) => {
    const currentTasks = this.tasks.getValue();
    const index = this.findTaskIndex(id);
    currentTasks[index].isDone = !currentTasks[index].isDone;
    localStorage.setItem('tasks', JSON.stringify(currentTasks));
  };
}
