import { AXIOS, LogDto } from '@labmaker/wrapper';

export const getLogs = (id: number) => AXIOS.get<LogDto[]>(`reddit/logs/${id}`);

export const getSubmissionIds = (id: string) =>
  AXIOS.get<LogDto[]>(`reddit/logs/submmissions/${id}}`);

export const createLog = (log: LogDto) => AXIOS.post(`reddit/logs`, log);
