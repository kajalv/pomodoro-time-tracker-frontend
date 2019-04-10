import { httpClient, errorHandler } from './index';
import { Session, ReportSessions, Report } from '../models';

export function CreateNewSession(_userId: number, _projectId: number,
  _startTime: string, _endTime: string, _counter: number): Promise<Session> {
  return httpClient.post(`/users/${_userId}/projects/${_projectId}/sessions`, {
    startTime: _startTime,
    endTime: _endTime,
    counter: _counter
  })
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}

export function UpdateSessionById(_userId: number, _projectId: number, _sessionId: number): Promise<Session> {
  return httpClient.put(`/users/${_userId}/projects/${_projectId}/sessions/${_sessionId}`)
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}

export function GetReportByProjectId(_userId: number, _projectId: number, from: string, to: string, includeCompletedPomodoros: boolean, includeTotalHoursWorkedOnProject: boolean): Promise<Report> {
  return httpClient.get(`/users/${_userId}/projects/${_projectId}/report?from=${from}&to=${to}&includeCompletedPomodoros=${includeCompletedPomodoros}&includeTotalHoursWorkedOnProject=${includeTotalHoursWorkedOnProject}`)
    .then(response => {
      return response.data;
    })
    .catch(errorHandler);
}