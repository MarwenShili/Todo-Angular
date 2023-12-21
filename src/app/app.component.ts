import { Component } from '@angular/core';
import * as dayjs from 'dayjs';
import { uid } from 'uid-ts';

interface ITask {
  id: number;
  title: string;
  isDone: boolean;
  createdAt: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  tasks: ITask[] = [];
  DateNow = dayjs(Date.now()).format('DD/MM/YYYY');
  isEditing: boolean = false;
  taskToEdit: ITask | null = null;
  indexTaskToEdit: number | null = null;

  constructor() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      this.tasks = JSON.parse(storedTasks);
    }
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
      this.isEditing = false;
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }
  };
  findTaskIndex = (id: number) => {
    return this.tasks.findIndex((task) => task.id === id);
  };

  editTask = (id: number) => {
    this.isEditing = true;
    let index = this.findTaskIndex(id);
    this.taskToEdit = this.tasks[index];
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
