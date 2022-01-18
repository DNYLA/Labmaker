import { AXIOS } from './Axios';
import { LogDto } from '../types';

export const getLogs = (id: number, didPm: boolean) =>
  AXIOS.get<LogDto[]>(`reddit/logs/${id}?pm=${didPm}`);

export const getSubmissionIds = (id: number) =>
  AXIOS.get<LogDto[]>(`reddit/logs/submissions/${id}`);

export const createLog = (log: LogDto) => AXIOS.post(`reddit/logs`, log);
