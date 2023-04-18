import { ImportanceLevel } from './importance-level.enum';

export interface Task {
  Id?: number;
  Title: string;
  Description: string;
  DueDate: Date;
  IsCompleted: boolean;
  UserId?: number;
  Importance: ImportanceLevel;
}
