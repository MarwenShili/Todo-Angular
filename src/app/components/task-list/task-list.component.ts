import { DAYS_OF_WEEK, MONTHS } from 'src/constants';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';

interface ITask {
  id: number;
  title: string;
  isDone: boolean;
  createdAt: string;
}
@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  constructor(public taskService: TaskService) {}
  tasks: ITask[] = [];
  isEditing: boolean = false;
  taskToEdit: ITask | null = null;
  ngOnInit(): void {
    this.tasks = this.taskService.tasks;
    this.taskService.isEditing.subscribe((value) => (this.isEditing = value));
    this.taskService.taskToEdit.subscribe((v) => (this.taskToEdit = v));

    console.log(this.isEditing);
  }
  getCurrentTimeAndDay() {
    const daysOfWeek = DAYS_OF_WEEK;
    const months = MONTHS;
    const now = new Date();

    const dayOfWeek = daysOfWeek[now.getDay()];
    const formattedTime = now.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const month = months[now.getMonth()];

    return {
      day: `${dayOfWeek} ${now.getDate()} ${month} `,
      time: formattedTime,
    };
  }

  searchTask(str?: string) {
    this.taskService.searchTask(str);
  }
  editTask(taskId: number) {
    console.log(this.isEditing);
    this.taskService.editTask(taskId);
  }
  //todo : make tasks as behavior subject and subscribe on it
  addTask(task: ITask) {
    this.taskService.createOrUpdateTask(task);
  }
  // deleteTask(taskId: string) {
  //   this.taskService.deleteTask(taskId);
  // }

  // searchTasks() {
  //   this.taskService.searchTask(this.strSearch);
  // }
}
