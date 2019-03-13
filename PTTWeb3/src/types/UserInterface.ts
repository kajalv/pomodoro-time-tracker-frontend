import { Project } from './ProjectInterface';

export interface User {
  userId: number,
  userName: string,
  projects: Project[]
}