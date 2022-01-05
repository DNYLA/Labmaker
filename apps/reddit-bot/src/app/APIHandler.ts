import { LabmakerAPI } from '@labmaker/wrapper';

console.log(process.env.API_URL);
export const Labmaker = new LabmakerAPI(process.env.API_URL, {
  debug: process.env.API_DEBUG === 'true',
  logFullErr: true,
  logObject: true,
});
