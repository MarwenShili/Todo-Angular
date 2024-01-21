import { DAYS_OF_WEEK, MONTHS } from 'src/constants';
import { TaskService } from './../../services/task.service';
import { Component, OnInit } from '@angular/core';
import { ITask } from 'src/types/my-types';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
})
export class TaskListComponent implements OnInit {
  strSearch: string = '';
  constructor(public taskService: TaskService) {}

  tasks: ITask[] = [];
  isEditing: boolean = false;
  taskToEdit: ITask | null = null;

  ngOnInit(): void {
    this.taskService.tasks.subscribe((el) => (this.tasks = el));
    this.taskService.isEditing.subscribe((value) => (this.isEditing = value));
    this.taskService.taskToEdit.subscribe((v) => (this.taskToEdit = v));
  }
  generateTaskId = () => {
    return Math.floor(Math.random() * 100);
  };
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
  addTask(task: ITask) {
    this.taskService.createOrUpdateTask(task);
  }
  searchTask(e?: any) {
    if (this.strSearch.length === 0) {
      this.taskService.tasks.subscribe((el) => (this.tasks = el));
    }
    if (this.strSearch.length > 0) {
      const filteredTasks = this.tasks.filter((task) =>
        task.title.includes(this.strSearch)
      );
      this.tasks = filteredTasks;
    }
  }
}
