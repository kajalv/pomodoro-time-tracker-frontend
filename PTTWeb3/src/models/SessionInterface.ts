export interface Session {
  id: number,
  startTime: string,
  endTime: string,
  counter: number
}

export interface ReportSessions {
  startingTime: string,
  endingTime: string,
  hoursWorked: number
}

export interface Report {
  sessions: [ReportSessions],
  completedPomodoros: number,
  totalHoursWorkedOnProject: number
}