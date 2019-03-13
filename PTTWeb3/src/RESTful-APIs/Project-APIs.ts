import Project from '../types/ProjectInterface';
import { httpClient, errorHandler } from './index';

export function FetchProjectsByUserId(userId: number): Promise<Project[]> {
  return httpClient.get(`/users/${userId}/projects`)
    .then(repsonse => {
      return repsonse.data;
    })
    .catch(errorHandler);
}

export function DeleteProjectById(userId: number, projectId: number): Promise<Project> {
  return httpClient.delete(`/users/${userId}/projects/${projectId}`)
    .then(reponse => {
      return reponse.data;
    })
    .catch(errorHandler)
}

export function CreateNewProject(userId: number, projectName: string): Promise<Project>{
  return httpClient.post(`/users/${userId}/projects`, {
    projectName: projectName,
    userId: userId
  })
    .then(reponse => {
      return reponse.data;
    })
    .catch(errorHandler);
}