import { Project } from '../models/ProjectInterface';
import { httpClient, errorHandler } from './index';

export function FetchProjectsByUserId(userId: number): Promise<Project[]> {
  return httpClient.get(`/users/${userId}/projects`)
    .then(response => {
      return response.data;
    })
    // .catch(errorHandler);
}

export function DeleteProjectById(userId: number, projectId: number): Promise<Project> {
  return httpClient.delete(`/users/${userId}/projects/${projectId}`)
    .then(response => {
      return response.data;
    })
    .catch(errorHandler)
}

export function CreateNewProject(userId: number, projectname: string): Promise<Project> {
  return httpClient.post(`/users/${userId}/projects`, {
    projectname: projectname,
    userId: userId
  })
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}