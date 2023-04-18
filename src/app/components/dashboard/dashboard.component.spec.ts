import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { TaskService } from '../../services/task.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Task } from '../../../models/task.model';
import { of } from 'rxjs';
import { ImportanceLevel } from 'src/models/importance-level.enum';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      imports: [HttpClientTestingModule],
      providers: [TaskService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tasks on init', () => {
    const tasks: Task[] = [
      { Id: 1, Title: 'Task 1', Description: 'Task 1 description', DueDate: new Date(), IsCompleted: false, Importance: ImportanceLevel.Low},
      { Id: 2, Title: 'Task 2', Description: 'Task 2 description', DueDate: new Date(), IsCompleted: true, Importance: ImportanceLevel.Low }
    ];
    
    spyOn(taskService, 'getTasks').and.returnValue(of(tasks));
    component.ngOnInit();
    expect(component.tasks).toEqual(tasks);
  });

});
