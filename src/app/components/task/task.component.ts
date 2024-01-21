import { ITask } from 'src/types/my-types';
import { TaskService } from './../../services/task.service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss'],
})
export class TaskComponent {
  @Input() task!: ITask;
  constructor(private taskService: TaskService) {}

  markTaskAsDone(id: number) {
    this.taskService.markTaskAsDone(id);
  }
  editTask(taskId: number) {
    this.taskService.editTask(taskId);
  }
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId);
  }
}
