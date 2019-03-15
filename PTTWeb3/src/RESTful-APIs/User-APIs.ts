import { User } from '../models/UserInterface';
import { httpClient, errorHandler } from './index';

export function FetchUserById(userId: number): Promise<User> {
  return httpClient.get(`/users/${userId}`)
    .then(response => {
      // console.log(response.data);
      // console.log(response.status);
      // console.log(response.statusText);
      // console.log(response.headers);
      // console.log(response.config);
      return response.data;
    })
    .catch(errorHandler);
}

export function FetchAllUsers(): Promise<User[]> {
  return httpClient.get('/users')
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}

export function CreateNewUser(firstname: string, lastname: string, emailid: string): Promise<User> {
  return httpClient.post(`/users`, {
    firstName: firstname,
    lastName: lastname,
    email: emailid
  })
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}

export function DeleteUserById(userId: number): Promise<User> {
  return httpClient.delete(`/users/${userId}`)
    .then(response => {
      return response.data;
    })
    .catch(errorHandler)
}

export function UpdateUserById(userId: number, firstname: string, lastname: string, emailid: string): Promise<User> {
  return httpClient.put(`/users/${userId}`, {
    firstName: firstname,
    lastName: lastname,
    email: emailid // UI will enforce that email cannot be changed
  })
    .then(response => {
      return response.data;
    })
    .catch(errorHandler)
}