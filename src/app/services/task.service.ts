import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Task } from '../../models/task.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://localhost:7168/api/Task';
  tasks: Task[] = [];

  constructor(private http: HttpClient) { }

  getTasks(userId: number): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/user/${userId}/tasks`);
  }
  
  

  getTask(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }
  

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/user/${task.UserId}/tasks`, task).pipe(
      map((response: any) => {
        return response.value || response;
      }),
      catchError((error) => {
        console.error(error);
        return throwError(error);
      })
    );
  }
  
  

  updateTask(id: number, task: Task): Observable<Task>  {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  
}
