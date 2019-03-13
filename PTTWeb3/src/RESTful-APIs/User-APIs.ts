import User from '../types/UserInterface';
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