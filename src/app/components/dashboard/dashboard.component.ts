import { Component, OnInit } from '@angular/core';
import { Task } from 'src/models/task.model';
import { TaskService } from '../../services/task.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ImportanceLevel } from 'src/models/importance-level.enum';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tasks: Task[] = [];
  newTask: Task = {
    Title: '',
    Description: '',
    DueDate: new Date(),
    IsCompleted: false,
    UserId: 1,
    Importance: ImportanceLevel.Low,
  };
  

  searchText: string = '';
  filterDate: string = '';
  filteredTasks: Task[] = [];

  editMode: boolean = false;
  editTaskId: number | undefined = undefined;
  loggedInUserId: number;

  importanceLevels = Object.values(ImportanceLevel);

  filterImportance: ImportanceLevel | '' = '';

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router
) {
    this.loggedInUserId = parseInt(localStorage.getItem('userId') || '');
    console.log('loggedInUserId:', this.loggedInUserId);
}



  ngOnInit(): void {
    this.loadTasks();
    this.filterTasks();
  }

  loadTasks(): void {
    this.authService.getIsAuthenticated().subscribe((authenticated) => {
      if (authenticated) {
        const userId = parseInt(localStorage.getItem('userId') || '1');
        this.taskService.getTasks(this.loggedInUserId).subscribe({
          next: (tasks) => {
            this.tasks = tasks;
            this.filterTasks();
          },
          error: (err) => {
            console.error(err);
          }
        });
      }
    });
  }

  
  

  addTask() {
    const taskData: Task = {
      Title: this.newTask.Title,
      Description: this.newTask.Description,
      DueDate: this.newTask.DueDate,
      IsCompleted: this.newTask.IsCompleted,
      UserId: this.loggedInUserId,
      Importance: this.newTask.Importance,
    };
    
    
  
    this.taskService.createTask(taskData).subscribe(
      (response: Task) => {
        console.log('Complete response from server:', response);
        console.log(JSON.stringify(response, null, 2));
        const createdTask = response;
  
        if (createdTask && createdTask.Id !== undefined) {
          this.tasks.push(createdTask);
          this.resetForm();
          this.loadTasks();
        } else {
          console.log('The server did not return the newly created task with a valid Id. Result:', createdTask);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
  
   
  resetForm() {
    this.newTask = {
      Title: '',
      Description: '',
      DueDate: new Date(),
      IsCompleted: false,
      UserId: this.loggedInUserId,
      Importance: ImportanceLevel.Low,
    };
  }
  

  

  editTask(task: Task): void {
    this.editMode = true;
    this.editTaskId = task.Id;
    this.newTask = { ...task, UserId: this.loggedInUserId };
  }
  
  
  
  updateTask() {
    if (this.editTaskId !== undefined) {
      const taskData: Task = {
        Id: this.editTaskId,
        Title: this.newTask.Title,
        Description: this.newTask.Description,
        DueDate: this.newTask.DueDate,
        IsCompleted: this.newTask.IsCompleted,
        UserId: this.loggedInUserId,
        Importance: ImportanceLevel.Low,
      };
  
      console.log('Updating task with id:', this.editTaskId, 'and data:', taskData);
      console.log("Task data being sent:", taskData);
      this.taskService.updateTask(this.editTaskId, taskData).subscribe(
        (response: any) => {
          const updatedTaskIndex = this.tasks.findIndex((task) => task.Id === this.editTaskId);
          if (updatedTaskIndex !== -1) {
            this.tasks[updatedTaskIndex] = response;
          }
          this.resetForm();
          this.editMode = false;
          this.editTaskId = undefined;
          this.filterTasks();
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  
  
  importanceFilter: string = 'all';
  dateRangeFilter: string = 'all';


  filterTasks() {
    this.filteredTasks = this.tasks.filter((task) => {
      const taskTitleIncludesSearchText = task.Title.toLowerCase().includes(this.searchText.toLowerCase().trim());
      const taskDescriptionIncludesSearchText = task.Description.toLowerCase().includes(this.searchText.toLowerCase().trim());
      const taskDueDateMatchesFilterDate = !this.filterDate || new Date(task.DueDate).toDateString() === new Date(this.filterDate).toDateString();
  
      const today = new Date();
      const taskDueDate = new Date(task.DueDate);
      const dateDifference = (taskDueDate.getTime() - today.getTime()) / (1000 * 3600 * 24);
      let taskDateInRange = true;
  
      switch (this.dateRangeFilter) {
        case '1':
          taskDateInRange = dateDifference >= 0 && dateDifference < 1;
          break;
        case '3':
          taskDateInRange = dateDifference >= 0 && dateDifference < 3;
          break;
        case '7':
          taskDateInRange = dateDifference >= 0 && dateDifference < 7;
          break;
        case '30':
          taskDateInRange = dateDifference >= 0 && dateDifference < 30;
          break;
        default:
          taskDateInRange = true;
      }
  
      const taskImportanceMatchesFilter = this.importanceFilter === 'all' || task.Importance.toLowerCase() === this.importanceFilter.toLowerCase();
  
      return (
        (taskTitleIncludesSearchText || taskDescriptionIncludesSearchText) &&
        taskDueDateMatchesFilterDate &&
        taskImportanceMatchesFilter &&
        taskDateInRange &&
        task.UserId === this.loggedInUserId 
      );
      
    });
    this.filteredTasks.sort((a, b) => {
      return new Date(a.DueDate).getTime() - new Date(b.DueDate).getTime();
    });
  }
  

  
  
  deleteTask(id: number): void {
    if (id !== null && id !== undefined) {
      this.taskService.deleteTask(id).subscribe(
        () => {
          this.tasks = this.tasks.filter((task) => task.Id !== id);
          this.filterTasks();
        },
        (error) => {
          console.error("Error deleting task:", error);
        }
      );
    }
  }


  onSubmit() {
    if (!this.editMode) {
      this.addTask();
    } else {
      this.updateTask();
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['']);
  }
  
  
  
}


