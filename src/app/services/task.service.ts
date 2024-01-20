import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

interface ITask {
  id: number;
  title: string;
  isDone: boolean;
  createdAt: string;
}
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  tasks: ITask[] = [];
  isEditing = new BehaviorSubject<boolean>(false);
  taskToEdit = new BehaviorSubject<ITask | null>(null);

  indexTaskToEdit: number | null = null;

  constructor() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
    console.log('service', this.isEditing);
  }

  generateTaskId = () => {
    return Math.floor(Math.random() * 100);
  };

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
    this.tasks = [...this.tasks, newTask];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  };

  private updateTask = (updatedTask: ITask) => {
    if (typeof this.indexTaskToEdit === 'number') {
      this.tasks[this.indexTaskToEdit] = updatedTask;
      this.isEditing.next(false);
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  };
  findTaskIndex = (id: number) => {
    return this.tasks.findIndex((task) => task.id === id);
  };

  editTask = (id: number) => {
    this.isEditing.next(true);
    let index = this.findTaskIndex(id);
    this.taskToEdit.next(this.tasks[index]);
    this.indexTaskToEdit = index;
  };
  deleteTask = (id: number) => {
    let newTasks = this.tasks.filter((task) => task.id !== id);
    this.tasks = [...newTasks];
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  };

  markTaskAsDone = (id: number) => {
    const index = this.findTaskIndex(id);
    this.tasks[index].isDone = !this.tasks[index].isDone;
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  };

  searchTask = (str?: string) => {
    if (!str) {
      return this.tasks;
    }
    let newTasks = this.tasks.filter((task) => task.title.includes(str));
    return newTasks;
  };
}
